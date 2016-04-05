#!/usr/bin/env python
# -*- coding: utf-8 -*-


class User(object):
    def __init__(self, data):
        self.data = data

    @property
    def username(self):
        return self.data['username']

    @property
    def profile_redis_key(self):
        return b':'.join(['user', self.username, 'profile'])

    @property
    def tokens_redis_key(self):
        return b':'.join(['user', self.username, 'tokens'])

    def save(self, redis, token):
        pipe = redis.pipeline()
        pipe.hmset(self.profile_redis_key, self.data)
        pipe.rpush(self.tokens_redis_key, token)
        return pipe.execute()
