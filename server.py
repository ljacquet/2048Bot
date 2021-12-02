import math
from flask import Flask, json, jsonify, render_template, request
from flask.helpers import url_for
from werkzeug.utils import send_file, send_from_directory

import numpy as np

import sarsa

import random

import neat

import pickle

app = Flask(__name__)
p = neat.Checkpointer.restore_checkpoint('./NEAT/neat-checkpoint-106')

with open('./NEAT/real_winner.pkl', 'rb') as f:
    genome = pickle.load(f)

net = neat.nn.RecurrentNetwork.create(genome, p.config)

@app.route('/')
def serveIndex():
    return render_template('2048.html')

@app.route('/tick', methods=['POST'])
def ai_tick():
    data = request.get_data(as_text=True)
    data = json.loads(data)

    action = net.activate(data['state'])

    # direction = np.where(action == np.amax(action)) #random.randint(0, 3)

    # resp = {
    #     'direction': ['Up', 'Right', 'Down', 'Left'][direction]
    # }
    return jsonify(action)

if __name__ == '__main__':
    app.run()