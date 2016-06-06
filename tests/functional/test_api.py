
# -*- coding: utf-8 -*-
import io
import os
import json
import yaml
import hashlib
from plant import Node
from sure import scenario
from wavemandala import settings
from wavemandala.application import server
from wavemandala.util import get_redis_connection


def create_audio_files(audio):
    if not os.path.isdir(audio.path):
        os.makedirs(audio.path)

    for x in range(1, 5):
        path = audio.join('track{0}.track'.format(x))
        wavpath = audio.join('track{0}.wav'.format(x))
        meta = {
            'id': '{0}daefe2f-4f46-48f7-8916-3b5ad8ad783b'.format(x),
            'artist': 'Wave Mandala',
            'title': 'Track {0}'.format(x),
            'album': 'Test Suite',
            'single': 'Test Track {0}'.format(x),
            'year': 2006,
            'version': '1.0',
            'path': 'track{0}.wav'.format(x),
        }
        metadata = yaml.dump(meta, default_flow_style=False)
        io.open(path, 'wb').write(metadata)
        io.open(wavpath, 'wb').write(metadata.encode('hex'))


def prepare_server(context):
    audio = Node(__file__).dir.cd('audio')
    context.audio = audio
    settings.update(
        AUDIO_PATH=audio.path,
    )
    context.redis = get_redis_connection()
    context.redis.flushall()

    create_audio_files(audio)
    server.scan_tracks()
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
            'album': 'Test Suite',
            'artist': 'Wave Mandala',
            'url': 'http://localhost:5000/track/1daefe2f-4f46-48f7-8916-3b5ad8ad783b',
            'title': 'Track 1',
            'single': 'Test Track 1',
            'version': '1.0',
            'year': 2006,
            'path': context.audio.join('track1.wav'),
            'id': '1daefe2f-4f46-48f7-8916-3b5ad8ad783b'
        },
        {
            'album': 'Test Suite',
            'artist': 'Wave Mandala',
            'url': 'http://localhost:5000/track/2daefe2f-4f46-48f7-8916-3b5ad8ad783b',
            'title': 'Track 2',
            'single': 'Test Track 2',
            'version': '1.0',
            'year': 2006,
            'path': context.audio.join('track2.wav'),
            'id': '2daefe2f-4f46-48f7-8916-3b5ad8ad783b',
        },
        {
            'album': 'Test Suite',
            'artist': 'Wave Mandala',
            'url': 'http://localhost:5000/track/3daefe2f-4f46-48f7-8916-3b5ad8ad783b',
            'title': 'Track 3',
            'single': 'Test Track 3',
            'version': '1.0',
            'year': 2006,
            'path': context.audio.join('track3.wav'),
            'id': '3daefe2f-4f46-48f7-8916-3b5ad8ad783b',
        },
        {
            'album': 'Test Suite',
            'artist': 'Wave Mandala',
            'url': 'http://localhost:5000/track/4daefe2f-4f46-48f7-8916-3b5ad8ad783b',
            'title': 'Track 4',
            'single': 'Test Track 4',
            'version': '1.0',
            'year': 2006,
            'path': context.audio.join('track4.wav'),
            'id': '4daefe2f-4f46-48f7-8916-3b5ad8ad783b',
        }
    ])


@api_test
def test_get_track(context):
    ('/track/uuid should serve the file')

    response = context.http.get('/track/4daefe2f-4f46-48f7-8916-3b5ad8ad783b')

    response.status_code.should.equal(200)
    response.data.should.equal('616c62756d3a20546573742053756974650a6172746973743a2057617665204d616e64616c610a69643a2034646165666532662d346634362d343866372d383931362d3362356164386164373833620a706174683a20747261636b342e7761760a73696e676c653a205465737420547261636b20340a7469746c653a20547261636b20340a76657273696f6e3a2027312e30270a796561723a20323030360a')
