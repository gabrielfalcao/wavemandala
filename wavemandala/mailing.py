#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import mailbox


class InBox(object):
    def __init__(self, path):
        self.path = path
        self.box = mailbox.mbox(self.path)

    def get_all_emails(self):
        return map(EmailMessage, self.box.items())


class EmailMessage(object):
    def __init__(self, id_and_msg):
        self.id, self.msg = id_and_msg

    def extract_relevant_metadata(self, metadata):
        data = {}
        data['id'] = metadata.pop('Message-ID')
        data['to'] = metadata.pop('To')
        data['from'] = metadata.pop('From')
        data['received'] = metadata.pop('Received')
        data['return-path'] = metadata.pop('Return-Path')
        data['subject'] = metadata.pop('Subject')
        data['content-type'] = metadata.pop('Content-Type')
        data['meta'] = metadata
        return data

    def extract_message(self, message):
        content_type = dict(message.get_params())
        body = message.get_payload()
        return {
            'content_type': content_type,
            'body': body,
        }

    def to_dict(self):
        metadata = dict(self.msg.items())

        data = self.extract_relevant_metadata(metadata)
        data['original'] = self.msg.as_string()
        data['messages'] = [self.extract_message(m) for m in self.msg.get_payload()]
        return data

    def to_json(self, indent=2):
        return json.dumps(self.to_dict(), indent=indent)


def main():
    inbox = InBox('mail')
    for message in inbox.get_all_emails():
        print message.to_json()


if __name__ == '__main__':
    main()
