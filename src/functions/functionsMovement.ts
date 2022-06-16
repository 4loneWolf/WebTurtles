function forward(direction: string, newX: number, newZ: number) {
    if (direction == 'north') {
        newZ = --newZ
    } else if (direction == 'south') {
        newZ = ++newZ
    } else if (direction == 'west') {
        newX = --newX
    } else if (direction == 'east') {
        newX = ++newX
    } else {
        console.error('Not a direction');
    }
    return [newX, newZ];
}

function back(direction: string, newX: number, newZ: number) {
    if (direction == 'north') {
        newZ = ++newZ
    } else if (direction == 'south') {
        newZ = --newZ
    } else if (direction == 'west') {
        newX = ++newX
    } else if (direction == 'east') {
        newX = --newX
    } else {
        console.error('Not a direction');
    }
    return [newX, newZ];
}

function left(direction: string) {  
    let newDirection 
    if (direction == 'north') {
        newDirection = 'west'
    } else if (direction == 'west') {
        newDirection = 'south'
    } else if (direction == 'south') {
        newDirection = 'east'
    } else if (direction == 'east') {
        newDirection = 'north'
    } else {
        console.error('not a direction');
    }
    return newDirection;
}

function right(direction: string) {  
    let newDirection 
    if (direction == 'north') {
        newDirection = 'east'
    } else if (direction == 'east') {
        newDirection = 'south'
    } else if (direction == 'south') {
        newDirection = 'west'
    } else if (direction == 'west') {
        newDirection = 'north'
    } else {
        console.error('not a direction');
    }
    return newDirection;
}

export { forward, left, right, back }