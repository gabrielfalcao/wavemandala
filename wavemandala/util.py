# -*- coding: utf-8 -*-

import re
import redis
from plant import Node
from wavemandala import settings


def get_audio_node():
    return Node(settings.AUDIO_PATH).dir


def scan_audio_nodes():
    audio = get_audio_node()
    nodes = sorted(audio.find_with_regex('[.]track'), key=lambda n: n.basename)
    return nodes


def slugify(string):
    return re.sub(r'\W+', '_', string.strip()).lower()


def get_redis_connection():
    return redis.StrictRedis()


def full_url(path):
    return "/".join([settings.BASE_URL.rstrip('/'), path.lstrip('/')])
