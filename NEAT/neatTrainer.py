"""
2-input XOR example -- this is most likely the simplest possible example.
"""

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


def run(config_file):
    # Load configuration.
    config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                         neat.DefaultSpeciesSet, neat.DefaultStagnation,
                         config_file)

    # Create the population, which is the top-level object for a NEAT run.
    p = neat.Population(config)

    # Add a stdout reporter to show progress in the terminal.
    p.add_reporter(neat.StdOutReporter(True))
    stats = neat.StatisticsReporter()
    p.add_reporter(stats)
    p.add_reporter(neat.Checkpointer(5))

    # Run for up to 300 generations.
    winner = p.run(eval_genomes, 10)
    print(p.best_genome)

    # Display the winning genome.
    # print('\nBest genome:\n{!s}'.format(winner))

    # Show output of the most fit genome against training data.
    # print('\nOutput:')
    # winner_net = neat.nn.FeedForwardNetwork.create(winner, config)
    # for xi, xo in zip(xor_inputs, xor_outputs):
    #     output = winner_net.activate(xi)
    #     print("input {!r}, expected output {!r}, got {!r}".format(xi, xo, output))

    # node_names = {-1:'A', -2: 'B', 0:'A XOR B'}
    # visualize.draw_net(config, winner, True, node_names=node_names)
    # visualize.plot_stats(stats, ylog=False, view=True)
    # visualize.plot_species(stats, view=True)

    # p = neat.Checkpointer.restore_checkpoint('neat-checkpoint-4')
    # p.run(eval_genomes, 10)


if __name__ == '__main__':
    # Determine path to configuration file. This path manipulation is
    # here so that the script will run successfully regardless of the
    # current working directory.
    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, 'config-feedforward')
    run(config_path)