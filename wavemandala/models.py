#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
import io
import yaml

from repocket import ActiveRecord, attributes
from wavemandala.util import get_audio_node, full_url


class Track(ActiveRecord):
    title = attributes.Unicode()
    version = attributes.Bytes()
    artist = attributes.Unicode()
    single = attributes.Unicode()
    album = attributes.Unicode()
    year = attributes.Integer()
    path = attributes.Bytes()

    @classmethod
    def from_node(cls, node):
        raw = io.open(node.path).read()
        data = yaml.load(raw)

        path = data.pop('path', None)
        if path:
            data['path'] = get_audio_node().join(path)

        model = cls(**data)

        return model

    @property
    def url(self):
        return full_url('/track/{0}'.format(self.id))

    @property
    def metadata_path(self):
        audio = get_audio_node()
        basename, _ = os.path.splitext(self.path)
        return audio.join("{0}.track".format(basename))

    def save(self):
        result = super(Track, self).save()

        # replaces the old metadata file with a new one containing the
        # id and the redis keys affected
        data = self.to_json()
        data['redis'] = result
        io.open(self.metadata_path, 'wb').write(yaml.dump(data, default_flow_style=False))
        return result

    def to_json(self):
        data = self.to_dict(simple=True)
        data['url'] = self.url
        return data


class User(ActiveRecord):
    username = attributes.Unicode()
    email = attributes.Bytes()
    password = attributes.Bytes()
    metadata = attributes.JSON()
