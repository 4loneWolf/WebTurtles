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
    local name = file.readAll()
    os.setComputerLabel(name)
    file.close()
    a = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
else 
    local file = fs.open("name", "w")
    a = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
    local name = a.receive(999999)
    file.writeLine(name)
    if name == nil then
        fs.delete('name')
        fs.delete('cords')
    end
    os.setComputerLabel(name)
    print(name)
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




