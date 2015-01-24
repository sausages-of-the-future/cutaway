# -*- coding: utf-8 -*-

# simple websockets demo application shamelessly ripped off from https://devcenter.heroku.com/articles/python-websockets - only runs on python 2. Stripped out stuff not needed for this app

import os
import logging
import redis
import gevent
from flask import Flask, render_template
from flask_sockets import Sockets

REDIS_URL = os.environ['REDISCLOUD_URL']
REDIS_CHAN = 'location'

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ

sockets = Sockets(app)
redis = redis.from_url(REDIS_URL)


class Messenger(object):

    def __init__(self):
        self.clients = list()
        self.pubsub = redis.pubsub()
        self.pubsub.subscribe(REDIS_CHAN)

    def __iter_data(self):
        for message in self.pubsub.listen():
            data = message.get('data')
            if message['type'] == 'message':
                app.logger.info(u'Sending message: {}'.format(data))
                yield data

    def register(self, client):
        """Register a WebSocket connection for Redis updates."""
        self.clients.append(client)

    def send(self, client, data):
        """Send given data to the registered client.
        Automatically discards invalid connections."""
        try:
            client.send(data)
        except Exception:
            self.clients.remove(client)

    def run(self):
        """Listens for new messages in Redis, and sends them to clients."""
        for data in self.__iter_data():
            for client in self.clients:
                gevent.spawn(self.send, client, data)

    def start(self):
        """Maintains Redis subscription in the background."""
        gevent.spawn(self.run)

messenger = Messenger()
messenger.start()

@app.route('/')
def index():
    ws_protocol = os.environ.get('WS_PROTOCOL', 'wss')
    return render_template('index.html', ws_protocol=ws_protocol)

@app.route('/city')
def city():
    ws_protocol = os.environ.get('WS_PROTOCOL', 'wss')
    return render_template('city.html', ws_protocol=ws_protocol)


@sockets.route('/subscribe')
def subscribe(ws):
    messenger.register(ws)
    while ws.socket is not None:
        # Context switch while `start` is running in the background.
        gevent.sleep()



