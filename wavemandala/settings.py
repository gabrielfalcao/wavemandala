# -*- coding: utf-8 -*-
import os
import sys
from datetime import timedelta
from plant import Node

node = Node(__file__).dir
self = sys.modules[__name__]


BASE_URL = os.environ.get('BASE_URL') or 'http://localhost:5000'
AUDIO_PATH = os.environ.get('AUDIO_PATH') or '/srv/uploads/audio'
SECRET_KEY = os.environ.get('SECRET_KEY') or 'local'
SESSION_TYPE = 'redis'
SESSION_COOKIE_SECURE = True
PERMANENT_SESSION_LIFETIME = timedelta(hours=6)
SESSION_KEY_PREFIX = 'wavemandala:session:'


def update(**kw):
    for key, value in kw.items():
        setattr(self, key, value)
