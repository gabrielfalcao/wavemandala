#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

import json
import logging
import traceback

from flask import Flask, Response, request
from flask.ext.session import Session

# from wavemandala.util import ShellCommand
from wavemandala.util import get_redis_connection
from wavemandala.util import scan_audio_nodes
from wavemandala.models import Track


class Application(Flask):
    def __init__(self, app_node):
        super(Application, self).__init__(
            __name__,
            static_folder=app_node.dir.join('static/dist'),
            template_folder=app_node.dir.join('templates')
        )
        self.redis = get_redis_connection()
        self.config.from_object('wavemandala.settings')
        self.app_node = app_node
        self.sesh = Session(self)
        self.secret_key = os.environ.get('SECRET_KEY')

    def json_handle_weird(self, obj):
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

    def handle_exception(self, e):
        tb = traceback.format_exc(e)
        logging.error(tb)
        return self.json_response({'error': 'bad-request', 'traceback': tb}, code=400)

    def scan_tracks(self):
        tracks = []
        for node in scan_audio_nodes():
            track = Track.from_node(node)
            track.save()
            tracks.append(track)

        return tracks
