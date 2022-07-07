local NameHeader = "?myName="
local link = "ws://localhost:34197"
local x = "none"
local y = "none" 
local z = "none"

if fs.exists("cords") == false then
    io.write('Write turtles exact coordinates \n')
    io.write('x: ')
    x = io.read("*l")
    io.write('y: ')
    y = io.read("*l")
    io.write('z: ')
    z = io.read("*l")
    fs.open("cords", "w")
end

local name = "NoName"

if fs.exists("name") == true then
    local file = fs.open("name", "r")
    name = file.readAll()
    os.setComputerLabel(name)
    file.close()
    ws = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
else 
    local file = fs.open("name", "w")
    ws = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
    name = ws.receive(999999)
    file.writeLine(name)
    file.close()
    os.setComputerLabel(name)
    print(name)
end

function TemplateForBlocks(upper, middlee, bottom, bool, IDD)
    local array = {
        boolean = bool,
        up = upper,
        middle = middlee,
        down = bottom,
        ID = IDD
    }
    do return array end
end

function inspect(bool, ID)
    local a, upp  = turtle.inspectUp()
    if a == true then
        up = upp.name
    else
        up = "Noblock"
    end
    local b, middlee = turtle.inspect()
    if b == true then
        middle = middlee.name
    else
        middle = "Noblock"
    end
    local c, bottomm = turtle.inspectDown()
    if c == true then
        bottom = bottomm.name
    else
        bottom = "Noblock"
    end
    array = TemplateForBlocks(up:gsub(":", ""), middle:gsub(":", ""), bottom:gsub(":", ""), bool, ID)
    do return array end
end

function Movement(message)
    local where = message.direction
    local ID = message.ID
    local boolean

    if where == "forward" then
        boolean = turtle.forward()
    elseif where == "back" then
        boolean = turtle.back()
    elseif where == "left" then
        boolean = turtle.turnLeft()
    elseif where == "right" then
        boolean = turtle.turnRight()
    elseif where == "up" then
        boolean = turtle.up()
    elseif where == "down" then
        boolean = turtle.down()
    end

    if boolean == true then
        local array = inspect("true", ID)
        do return array end
    else 
        local array = inspect("false", ID)
        do return array end
    end
end

while true do
    message = ws.receive()
    local request = loadstring("return "..message.."")()
    message = request.direction
    print(message)
    local array = Movement(request)
    print(array.up, array.middle, array.down, array.boolean, array.ID)
    ws.send(array)
    print(array)
end

--while true do
    --message = a.receive()
    --message = load("return "..message.."")() -- LUA TABLE STRING TO AN ACTUAL LUA TABLE 
    --print(message.message)
    --print(message.zalupa)
--end

--while true do
    --io.write('Enter your message here: ')
    --local message = io.read('*l')
    --a.send(message)
--end

--local array = {huesos = "hehehehehe", dfwefwe = "fefwefxafcdas"}
--a.send(array)
