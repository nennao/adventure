from data import *

directions = {
    'west': (-1, 0),
    'east': (1, 0),
    'north': (0, -1),
    'south': (0, 1),
}


def game_map():
    pos = ['H', 'P', 'L', 'M']
    for i in range(4):
        map_loc = ['market', 'lake', 'park', 'house']
        if location == map_loc[i]:
            pos[i] = ' '
    return '\n ----- \n| %s %s |\n| %s %s |\n ----- ' % (pos[0], pos[1], pos[2], pos[3])


position = (0, 0)

while True:
    location = locations[position]
    print 'you are at the %s' % location
    print describe[location]

    print game_map()

    valid_directions = {}
    for k, v in directions.iteritems():
        possible_position = (position[0] + v[0], position[1] + v[1])
        possible_location = locations.get(possible_position)
        if possible_location:
            print 'to the %s is a %s' % (k, possible_location)
            valid_directions[k] = possible_position

    direction = raw_input('which direction do you want to go?\n')

    while direction not in valid_directions:
        if direction in directions:
            print 'out of area!'
            direction = raw_input('choose another direction:\n')
        else:
            print 'invalid direction!'
            direction = raw_input('choose a valid direction:\n')
    print 'going %s...\n' % direction
    position = valid_directions[direction]
