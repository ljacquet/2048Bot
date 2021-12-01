from flask import Flask, jsonify, render_template, request
from flask.helpers import url_for
from werkzeug.utils import send_file, send_from_directory

import numpy as np

import sarsa

import random

app = Flask(__name__)

@app.route('/')
def serveIndex():
    return render_template('2048.html')

@app.route('/tick', methods=['POST'])
def ai_tick():
    data = request.get_data(as_text=True)
    
    action = sarsa.AITick(data.state, data.reward, data.training)

    direction = np.where(action == np.amax(action)) #random.randint(0, 3)

    resp = {
        'direction': ['Up', 'Right', 'Down', 'Left'][direction]
    }
    return jsonify(resp)

if __name__ == '__main__':
    app.run()