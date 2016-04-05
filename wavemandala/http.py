#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

import json
import logging
import traceback
import email.message

from flask import Flask, Response, request

from wavemandala.mailing import EmailMessage
from wavemandala.util import ShellCommand


class Application(Flask):
    def __init__(self, app_node):
        super(Application, self).__init__(
            __name__,
            static_folder=app_node.dir.join('static/dist'),
            template_folder=app_node.dir.join('templates')
        )
        self.config.update(
            MAIL_PATH_TEMPLATE='/var/mail/{0}',
            SECRET_KEY=os.environ.get('SECRET_KEY'),
            REGISTER_USER_CMD_TEMPLATE='prosodyctl register {jid} wavemanda.la {password}',
        )
        self.app_node = app_node
        self.secret_key = os.environ.get('SECRET_KEY')

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

    def register_user(self, jid, password):
        cmd_template = self.config['REGISTER_USER_CMD_TEMPLATE']
        jid = jid.split("@")[0]
        command = cmd_template.format(jid=jid, password=password)
        manager = ShellCommand(command)
        process = manager.run(self.app_node.dir.parent.path)
        output, code = manager.stream_output(process)
        return output, code

    def handle_exception(self, e):
        tb = traceback.format_exc(e)
        logging.error(tb)
        return self.json_response({'error': 'bad-request'}, code=400)

    def get_mail_path(self, name):
        path = self.config['MAIL_PATH_TEMPLATE'].format(name)
        return path
