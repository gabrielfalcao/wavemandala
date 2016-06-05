#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

import json
import logging
import traceback
import email.message

from datetime import timedelta
from flask import Flask, Response, request
from flask.ext.session import Session
from flask_googlelogin import GoogleLogin
from wavemandala.mailing import EmailMessage
# from wavemandala.util import ShellCommand
from wavemandala.util import get_redis_connection
from wavemandala.models import User


class Application(Flask):
    def __init__(self, app_node):
        super(Application, self).__init__(
            __name__,
            static_folder=app_node.dir.join('static/dist'),
            template_folder=app_node.dir.join('templates')
        )
        self.redis = get_redis_connection()
        self.config.update(
            AUDIO_PATH=os.environ.get('AUDIO_PATH') or '/srv/uploads/audio',
            SECRET_KEY=os.environ.get('SECRET_KEY') or 'local',
            SESSION_TYPE='redis',
            SESSION_COOKIE_SECURE=True,
            PERMANENT_SESSION_LIFETIME=timedelta(hours=6),
            SESSION_KEY_PREFIX='wavemandala:session:',
            SESSION_REDIS=self.redis,
        )
        self.app_node = app_node
        self.sesh = Session(self)
        self.secret_key = os.environ.get('SECRET_KEY')
        self.google = GoogleLogin(self)

    def json_handle_weird(self, obj):
        if isinstance(obj, email.message.Message):
            return EmailMessage(obj).to_dict()

        logging.warning("failed to serialize %s", obj)
        return bytes(obj)

    def json_response(self, data, code=200, headers={}):
        headers = headers.copy()
        headers['Content-Type'] = 'application/json'
        payload = json.dumps(data, indent=2, default=self.json_handle_weird)
        return Response(payload, status=code, headers=headers)

    def get_json_request(self):
        try:
            data = json.loads(request.data)
        except ValueError:
            logging.exception(
                "Trying to parse json body in the %s to %s",
                request.method, request.url,
            )
            data = {}

        return data

    def register_user(self, data, token):
        """
        :returns: a :py:class:`~wavemandala.models.User`
        """
        return User(data, token).save(self.redis)

    def handle_exception(self, e):
        tb = traceback.format_exc(e)
        logging.error(tb)
        return self.json_response({'error': 'bad-request', 'traceback': tb}, code=400)

    def get_mail_path(self, name):
        path = self.config['MAIL_PATH_TEMPLATE'].format(name)
        return path
