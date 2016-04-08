#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
import os
import logging

import functools
import json
from plant import Node
from flask import render_template, redirect, session

from wavemandala.http import Application

from wavemandala.mailing import InBox
from wavemandala.util import sanitize_mailbox_name
from wavemandala.models import User

node = Node(__file__)
server = Application(node)


def authenticated(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        if not session.get('user'):
            return redirect('/')

        return func(*args, **kw)

    return wrapper


@server.route("/")
def index():
    "renders the UI html"
    user = json.dumps(session.get('user', None) or {
        "jid": None,
        "password": None,
    })
    user_list = User.list_all(server.redis)
    return render_template('index.html', user=user, user_list=user_list)


@server.route('/login')
def login():
    if session.get('user'):
        return redirect('/')

    url = server.google.login_url(redirect_uri=server.config['GOOGLE_LOGIN_REDIRECT_URI'], hd='nacaolivre.org')
    return redirect(url)


@server.route('/api/users', methods=['GET'])
def api_list_users():
    users = User.list_all(server.redis)
    return server.json_response(users)


@server.route('/api/user', methods=['POST'])
def api_create_user():
    data = server.get_json_request()
    jid = data['jid']
    password = data['password']
    user = User({
        'jid': jid,
        'password': password,
    }).save(server.redis)
    return server.json_response(User.list_all())


@server.route('/api/user', methods=['DELETE'])
def api_delete_user():
    data = server.get_json_request()
    jid = data['jid']

    ok = User.delete(jid, server.redis)
    logging.info("deleting user %s: %s", jid, ok)

    # return new list of users
    return server.json_response(User.list_all(server.redis))


@server.route('/oauth/callback', methods=['POST', 'GET'])
@server.google.oauth2callback
def oauth_callback(token, userinfo):
    user = server.register_user(userinfo, token)
    session['user'] = user.to_json()
    return redirect('/')


@server.route("/api/mail/inbox/<name>")
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
        GOOGLE_LOGIN_REDIRECT_URI='http://localhost:5000/oauth/callback',
        GOOGLE_LOGIN_CLIENT_ID="660201149701-nf35ri04q6cctmr39kjsh2onc6l8t1u9.apps.googleusercontent.com",
        GOOGLE_LOGIN_CLIENT_SECRET="sBMYG1ckEE9aluDTyexFETgs",
        SECRET_KEY='local',
        MAIL_PATH_TEMPLATE=node.dir.parent.join('inbox/{0}'),
    )
    server.run(debug=True)
