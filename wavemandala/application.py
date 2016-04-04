#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import re
import os
import sys
import json
import logging
import redis
import email.message
from plant import Node
from flask import Flask, Response, render_template
from wavemandala.mailing import InBox, EmailMessage

app_node = Node(__file__)

server = Flask(
    __name__,
    static_folder=app_node.dir.join('static/dist'),
    template_folder=app_node.dir.join('templates'),
)
server.config.update(
    MAIL_PATH_TEMPLATE='/var/mail/{0}'
)

server.secret_key = os.environ.get('SECRET_KEY')


def get_redis_connection():
    return redis.StrictRedis()


def sanitize_mailbox_name(name):
    found = re.match(r'^[_\w]+$', name)
    if found:
        return found.group(0)


def get_handler(name):
    self = sys.modules[__name__]
    return getattr(self, name, None)


def get_description(endpoint):
    handler = get_handler(endpoint)
    if not callable(handler):
        return 'endpoint: {0}'.format(endpoint)

    return (handler.__doc__ or '').strip()


def get_routes():
    routes = []
    for rule in server.url_map.iter_rules():
        meta = {
            'route': rule.rule,
            'help': get_description(rule.endpoint),
            'methods': map(bytes, rule.methods),
            'endpoint': rule.endpoint,
        }
        routes.append(meta)

    return routes


def json_handle_weird(obj):
    if isinstance(obj, email.message.Message):
        return EmailMessage(obj).to_dict()

    logging.warning("failed to serialize %s", obj)
    return bytes(obj)


def json_response(data, code=200, headers={}):
    headers = headers.copy()
    headers['Content-Type'] = 'application/json'
    payload = json.dumps(data, indent=2, default=json_handle_weird)
    return Response(payload, status=code, headers=headers)


class User(object):
    def __init__(self, data):
        self.data = data

    @property
    def username(self):
        return self.data['username']

    @property
    def profile_redis_key(self):
        return b':'.join(['user', self.username, 'profile'])

    @property
    def tokens_redis_key(self):
        return b':'.join(['user', self.username, 'tokens'])

    def save(self, token):
        redis = get_redis_connection()
        pipe = redis.pipeline()
        pipe.hmset(self.profile_redis_key, self.data)
        pipe.rpush(self.tokens_redis_key, token)
        return pipe.execute()


@server.route("/routes")
def routes():
    "returns a json with a list of routes"
    return json_response({b'routes': get_routes()})


@server.route("/")
def index():
    "renders the UI html"
    return render_template('index.html')


@server.route("/api/mail/inbox/<name>")
def inbox(name):
    name = sanitize_mailbox_name(name)
    if not name:
        logging.warning('invalid mailbox name')
        return json_response({'error': 'invalid request'}, code=400)

    mail_path = get_mail_path(name)
    if not os.path.exists(mail_path):
        logging.warning('{0} does not exist'.format(mail_path))
        return json_response({'error': 'invalid request'}, code=400)

    mailbox = InBox(mail_path)
    emails = [e.to_dict() for e in mailbox.get_all_emails()]
    logging.info('serving inbox')
    return json_response({'inbox': emails, 'user': name})


def get_mail_path(name):
    path = server.config['MAIL_PATH_TEMPLATE'].format(name)
    return path


if __name__ == '__main__':
    server.config.update(
        MAIL_PATH_TEMPLATE=app_node.dir.parent.join('inbox/{0}')
    )
    server.run(debug=True)
