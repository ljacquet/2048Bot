# 2048Bot

## Python
pip install neat-python
pip install "python-socketio[asyncio_client]"

## Training
### Python
python environment with
`pip install neat-python`
`pip install "python-socketio[asyncio_client]"`

Then to run
`python neatTrainer.py`

You can configure the number of rounds with the `p.run(eval_genomes, number_of_rounds)`

The checkpoint doesn't have to be the same as the pickle file as long as they have the same config

### Headless 2048 Server -- Nodejs
In the /HeadlessWebVersion directory
`npm install`

if you are having dependency errors delete node_modules and run `npm install` again

To run
`npm run start`

## Playing
python environment with
`pip install neat-python`
`pip install "python-socketio[asyncio_client]"`
`pip install flask`

Then to run
`python server.py`

Navigate to localhost:5000 and you should be good to go