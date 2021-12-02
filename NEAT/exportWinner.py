from __future__ import print_function
import os
from time import sleep
import neat
from neat import genome
import visualize

import requests

import socketio

import asyncio

import math

from threading import Lock

import pickle


def getValue(args, data):
    print(args)
    data = args

def normalizeData(n):
    if (n == 0):
        return 0
    
    return math.log2(n) / 11

socketLock = Lock()
async def runGameSim(genome, config, sio: socketio.AsyncClient):
    # Get initial State
    initialState = await sio.call("resetGame", {}, "/")

    state = initialState['state']

    net = neat.nn.FeedForwardNetwork.create(genome, config)

    shouldContinue = True

    reward = 0

    while (shouldContinue):
        nnAction = net.activate(list(map(normalizeData, state)))
        gameStep = await sio.call("tick", { 'action': nnAction, 'state': state }, '/')

        state = gameStep['newState']
        largestTile = gameStep['largestTile']
        reward += gameStep['reward']

        if (largestTile == 2048):
            shouldContinue = False
        
        if (gameStep['gameOver']):
            shouldContinue = False

    # print(reward)
    return (normalizeData(largestTile) + (reward / 10000)) / 2 # largest tile and reward split evenly

async def eval_genomes_async(genomes, config):
    sio = socketio.AsyncClient()
    await sio.connect("http://localhost:3000")

    for genome_id, genome in genomes:
        genome.fitness = await runGameSim(genome, config, sio)

    await sio.disconnect()

def eval_genomes(genomes, config):
    asyncio.run(eval_genomes_async(genomes, config))

p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-99')
winner = p.run(eval_genomes, 1)

pickle.dump(winner, open('winner.pkl', 'wb'))
pickle.dump(p.best_genome, open('real_winner.pkl', 'wb'))