# -*- coding: utf-8 -*-

import time
import logging
from subprocess import Popen, PIPE, STDOUT


def force_unicode(string):
    if not isinstance(string, unicode):
        return unicode(string, errors='ignore')

    return string


class ShellCommand(object):
    def __init__(self, command, timeout_in_seconds=2):
        self.command = command
        self.timeout_in_seconds = timeout_in_seconds

    def run(self, chdir=None, environment={}):
        try:
            return Popen(self.command, stdout=PIPE, stderr=STDOUT, shell=True, cwd=chdir, env=environment)
        except Exception:
            logging.exception("Failed to run {0}".format(self.command))

    def stream_output(self, process, stdout_chunk_size=1024, timeout_in_seconds=None, callback=None):
        current_transfered_bytes = 0
        started_time = time.time()
        difference = time.time() - started_time

        timeout_in_seconds = int(self.timeout_in_seconds)
        output = []

        def do_callback(*args, **kw):
            if callable(callback):
                try:
                    callback(*args, **kw)
                except Exception:
                    logging.exception('failed to execute callback for %s', process)

        while difference < timeout_in_seconds:
            difference = (time.time() - started_time)
            raw = process.stdout.readline()
            if not raw:
                break

            out = force_unicode(raw)
            current_transfered_bytes += len(out)
            output.append(out)
            do_callback(out, current_transfered_bytes)
            if current_transfered_bytes >= stdout_chunk_size:
                current_transfered_bytes = 0

        timed_out = difference > timeout_in_seconds
        if timed_out:
            out = "timed out by {0} seconds".format(timed_out)
            output.append(out)
            do_callback(out, current_transfered_bytes)
            process.terminate()
            exit_code = 420
        else:
            exit_code = process.wait()

        return ''.join(output), exit_code
