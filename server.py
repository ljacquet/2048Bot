from flask import Flask, jsonify, render_template, request
from flask.helpers import url_for
from werkzeug.utils import send_file, send_from_directory

app = Flask(__name__)

@app.route('/')
def serveIndex():
    return render_template('2048.html')

@app.route('/tick', methods=['POST'])
def ai_tick():
    data = request.get_data(as_text=True)
    print(data)
    resp = {
        'data': 'test'
    }
    return jsonify(resp)

if __name__ == '__main__':
    app.run()