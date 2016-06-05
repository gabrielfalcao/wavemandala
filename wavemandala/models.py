#!/usr/bin/env python
# -*- coding: utf-8 -*-

from repocket import ActiveRecord, attributes


class User(ActiveRecord):
    username = attributes.Unicode()
    email = attributes.Bytes()
    password = attributes.Bytes()
    metadata = attributes.JSON()
