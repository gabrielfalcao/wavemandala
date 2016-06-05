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
    return render_template('index.html')


@server.route("/api/tracks")
def api_tracks():
    nodes = sorted(Node(server.config['AUDIO_PATH']).find_with_regex('.*[.](wav|mp3)'), key=lambda n: n.basename)
    tracks = [{'url': 'https://wavemanda.la/audio/{0}'.format(node.basename)} for node in nodes]
    return server.json_response(tracks)


if __name__ == '__main__':
    server.config.update(
        AUDIO_PATH=node.dir.parent.join('audio'),
        SECRET_KEY='local',
        MAIL_PATH_TEMPLATE=node.dir.parent.join('inbox/{0}'),
    )
    server.run(debug=True)
