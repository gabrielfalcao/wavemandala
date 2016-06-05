#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
from plant import Node
from sure import scenario
from wavemandala.application import server

audio = Node(__file__).dir.cd('audio')


def prepare_server(context):
    server.config.update(
        AUDIO_PATH=audio.path,
    )
    context.http = server.test_client()


def cleanup_server(context):
    pass


api_test = scenario(prepare_server, cleanup_server)


@api_test
def test_list_files(context):
    ('/api/tracks should list all the available files')

    response = context.http.get('/api/tracks')

    response.status_code.should.equal(200)
    result = json.loads(response.data)
    result.should.equal([
        {
            'url': 'https://wavemanda.la/audio/track1.wav',
        },
        {
            'url': 'https://wavemanda.la/audio/track2.wav',
        },
        {
            'url': 'https://wavemanda.la/audio/track3.wav',
        },
        {
            'url': 'https://wavemanda.la/audio/track4.wav',
        },
    ])
