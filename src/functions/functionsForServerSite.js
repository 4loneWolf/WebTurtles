"use strict";
exports.__esModule = true;
exports.encode = exports.back = exports.right = exports.left = exports.forward = void 0;
function forward(direction, newX, newZ) {
    if (direction == 'north') {
        newZ = ++newZ;
    }
    else if (direction == 'south') {
        newZ = --newZ;
    }
    else if (direction == 'west') {
        newX = ++newX;
    }
    else if (direction == 'east') {
        newX = --newX;
    }
    else {
        console.error('Not a direction');
    }
    return [newX, newZ];
}
exports.forward = forward;
function back(direction, newX, newZ) {
    if (direction == 'north') {
        newZ = --newZ
    } 
    else if (direction == 'south') {
        newZ = ++newZ
    } 
    else if (direction == 'west') {
        newX = --newX
    } 
    else if (direction == 'east') {
        newX = ++newX
    } 
    else {
        console.error('Not a direction');
    }
    return [newX, newZ];
}
exports.back = back;
function left(direction) {
    var newDirection;
    if (direction == 'north') {
        newDirection = 'west';
    }
    else if (direction == 'west') {
        newDirection = 'south';
    }
    else if (direction == 'south') {
        newDirection = 'east';
    }
    else if (direction == 'east') {
        newDirection = 'north';
    }
    else {
        console.error('not a direction');
    }
    return newDirection;
}
exports.left = left;
function right(direction) {
    var newDirection;
    if (direction == 'north') {
        newDirection = 'east';
    }
    else if (direction == 'east') {
        newDirection = 'south';
    }
    else if (direction == 'south') {
        newDirection = 'west';
    }
    else if (direction == 'west') {
        newDirection = 'north';
    }
    else {
        console.error('not a direction');
    }
    return newDirection;
}
exports.right = right;
function encode(id) {
    var Idlength = id.length;
    var result = "";
    var newID = id;
    for (var i = Idlength; i > 0; i--) {
        var newerId = newID.substring(0, 1);
        console.log(newerId);
        if (newerId == '0') {
            result = result + "a";
        }
        else if (newerId == '1') {
            result = result + "b";
        }
        else if (newerId == '2') {
            result = result + "c";
        }
        else if (newerId == '3') {
            result = result + "d";
        }
        else if (newerId == '4') {
            result = result + "e";
        }
        else if (newerId == '5') {
            result = result + "f";
        }
        else if (newerId == '6') {
            result = result + "g";
        }
        else if (newerId == '7') {
            result = result + "h";
        }
        else if (newerId == '8') {
            result = result + "i";
        }
        else if (newerId == '9') {
            result = result + "j";
        }
        newID = newID.slice(0 + 1, newID.length);
    }
    console.log(result);
    return result;
}
exports.encode = encode;
