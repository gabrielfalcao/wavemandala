#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import re
import os
import json
import logging

import redis
import functools

from plant import Node
from flask import render_template, request

from wavemandala.http import Application

from wavemandala.mailing import InBox, checksum


node = Node(__file__)
server = Application(node)

server.secret_key = os.environ.get('SECRET_KEY')


def get_redis_connection():
    return redis.StrictRedis()


def sanitize_mailbox_name(name):
    found = re.match(r'^[_\w]+$', name)
    if found:
        return found.group(0)


def get_routes():
    routes = []
    for rule in server.url_map.iter_rules():
        meta = {
            'route': rule.rule,
            'methods': map(bytes, rule.methods),
            'endpoint': rule.endpoint,
        }
        routes.append(meta)

    return routes


@server.route("/routes")
def routes():
    "returns a json with a list of routes"
    return server.json_response({b'routes': get_routes()})


def authenticated(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        return func(*args, **kw)

    return wrapper


@server.route("/")
@authenticated
def index():
    "renders the UI html"
    return render_template('index.html')


@server.route("/api/user", methods=["POST"])
def create_user():
    data = server.get_json_request()
    print json.dumps(dict(request.headers), indent=4)
    jid = data['jid']
    password = data['password']
    output, code = server.register_user(jid, password)
    return server.json_response({
        'id': checksum(jid),
        'jid': jid,
        'password': password,
        'output': output,
        'code': code,
    })


@server.route("/api/mail/inbox/<name>")
@authenticated
def inbox(name):
    name = sanitize_mailbox_name(name)
    if not name:
        logging.warning('invalid mailbox name')
        return server.json_response({'error': 'invalid request'}, code=400)

    mail_path = server.get_mail_path(name)
    if not os.path.exists(mail_path):
        logging.warning('{0} does not exist'.format(mail_path))
        return server.json_response({'error': 'invalid request'}, code=400)

    mailbox = InBox(mail_path)
    emails = [e.to_dict() for e in mailbox.get_all_emails()]
    logging.info('serving inbox')
    return server.json_response({'inbox': emails, 'user': name})


def get_mail_path(name):
    path = server.config['MAIL_PATH_TEMPLATE'].format(name)
    return path


if __name__ == '__main__':
    server.config.update(
        MAIL_PATH_TEMPLATE=node.dir.parent.join('inbox/{0}'),
        REGISTER_USER_CMD_TEMPLATE='echo "register {jid} wavemanda.la {password}"',
    )
    server.run(debug=True)
