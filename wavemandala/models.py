#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import logging
from wavemandala.util import extract_jid
from wavemandala.util import ShellCommand
from wavemandala.mailing import checksum


class User(object):
    def __init__(self, user_info, token_info={}):
        data = {}
        data.update(user_info)
        data.update(token_info)

        if 'access_token' in data:
            data['jid'] = extract_jid(data['name'])
            data['password'] = data['access_token']

        self.data = data
        self.result = None

    def to_dict(self):
        return self.data.copy()

    def to_json(self):
        return json.dumps(self.to_dict())

    @classmethod
    def delete(User, jid, redis):
        key = User.get_profile_redis_key(checksum(jid))
        return bool(redis.delete(key))

    @classmethod
    def list_all(User, redis):
        query = User.get_profile_redis_key('*')
        return [redis.hgetall(key) for key in redis.keys(query)]

    @property
    def jid(self):
        return self.data.get('jid')

    @property
    def password(self):
        return self.data.get('password')

    @classmethod
    def get_tokens_redis_key(User, uuid):
        return b':'.join(['user', uuid, 'tokens'])

    @property
    def tokens_redis_key(self):
        return self.get_tokens_redis_key(checksum(self.jid))

    @classmethod
    def get_profile_redis_key(User, uuid):
        return b':'.join(['user', uuid, 'profile'])

    @property
    def profile_redis_key(self):
        return self.get_profile_redis_key(checksum(self.jid))

    def save(self, redis):
        if not self.jid:
            raise RuntimeError('cannot save to redis with an empty jid')

        self.data['on_prosody'] = self.register_on_prosody()
        token = self.data.get('access_token')
        pipe = redis.pipeline()
        pipe.hmset(self.profile_redis_key, self.data)
        pipe.rpush(self.tokens_redis_key, token)
        self.result = pipe.execute()
        logging.info("[redis] saving user: %s", self.data)
        return self

    def register_on_prosody(self):
        if not self.jid:
            raise RuntimeError('cannot register_on_prosody with an empty jid')

        cmd_template = 'prosodyctl register {jid} wavemanda.la {password}'
        command = cmd_template.format(jid=self.jid, password=self.password)
        manager = ShellCommand(command)
        process = manager.run()
        output, code = manager.stream_output(process)
        if code != 0:
            logging.error("registering %s on prosody: %s", self.jid, code)
            logging.error(output)

        logging.info("registering %s on prosody: %s", self.jid, code)
        return code == 0
