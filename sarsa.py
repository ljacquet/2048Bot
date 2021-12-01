import numpy as np

#Defining the different parameters
epsilon = 0.9
total_episodes = 10000
max_steps = 100
alpha = 0.85 # Learning Rate, to what extent does new info overwrite old info
gamma = 0.95 # Discount Factor, weighed importance of future reward

observation_space = 4 * 4 * 12 # len(x) * len(y) * 12 possible tiles
action_space = 4 # 4 possible actions

#Initializing the Q-matrix
Q = np.zeros((observation_space, action_space))

def get_random_action():
    a = np.zeros(action_space)
    a[np.random.randint(0, 4)] = 1
    return a

def choose_action(state):
    action = 0

    # 1 - epsilon chance of random
    if np.random.uniform(0, 1) < epsilon:
        action = get_random_action()
    else:
        action = np.argmax(Q[state, :])

    return action

# Function to learn q value
def update(state1, state2, reward, action1, action2):
    predict = Q[state1, action1]
    target = reward + gamma * Q[state2, action2]
    Q[state1, action1] = Q[state1, action1] + alpha * (target - predict)

previousState=[]
previousAction=[]
def AITick(state2, reward, learning):
    action2 = choose_action(state2)
    # If we have previous state we can train
    if (len(previousState) > 0 and learning and reward != -1):
        # Update Q Values
        update(previousState, state2, reward, previousAction, action2)

    previousState = state2
    previousAction = action2

def getAIQ():
    return Q