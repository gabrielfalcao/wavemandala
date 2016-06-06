#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import unicode_literals

import functools

from plant import Node
from flask import render_template, redirect, session, send_from_directory

from wavemandala import settings
from wavemandala.controllers import Application
from wavemandala.models import Track

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
    tracks = sorted(Track.objects.all(), key=lambda track: track.id)
    return server.json_response([t.to_json() for t in tracks])


@server.route("/track/<track_id>")
def api_get_track(track_id):
    track = Track.objects.get(track_id)
    node = Node(track.path)
    return send_from_directory(node.dir.path, node.basename)


@server.route("/api/scan", methods=['POST'])
def api_scan():
    tracks = sorted(server.scan_tracks(), key=lambda track: track.id)
    return server.json_response([t.to_json() for t in tracks])


if __name__ == '__main__':
    settings.update(
        AUDIO_PATH=node.dir.parent.join('audio'),
        SECRET_KEY='local',
        MAIL_PATH_TEMPLATE=node.dir.parent.join('inbox/{0}'),
    )
    server.run(debug=True)
