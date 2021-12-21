# 2048Bot
## About
This was a project for my AI course in my junior year, this repository was created under a short time period and has portions that are not ready to be used outside of an Academic situation.

## TODO
Refactor Code Base


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
