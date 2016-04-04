#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import mailbox


class InBox(object):
    def __init__(self, path):
        self.path = path
        self.box = mailbox.MaildirMessage(open(self.path, 'rb'))

    def get_all_emails(self):
        return map(EmailMessage, self.box.get_payload())


class EmailMessage(object):
    def __init__(self, msg):
        self.msg = msg

    def to_dict(self):
        children = self.msg.get_payload()
        if isinstance(children, basestring):
            return {
                'timestamp': self.msg.get_unixfrom(),
                'params': dict(self.msg.get_params()),
                'body': children,
                'plain': self.msg.as_string(),
            }
        elif isinstance(children, list):
            return [EmailMessage(x).to_dict() for x in children]

    def to_json(self, indent=2):
        return json.dumps(self.to_dict(), indent=indent)


def main():
    inbox = InBox('mail')
    for message in inbox.get_all_emails():
        print message.to_dict()


if __name__ == '__main__':
    main()
