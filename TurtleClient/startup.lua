local NameHeader = "?myName="
local CordsHeader = ""
local link = "ws://localhost:34197"
local x = "none"
local y = "none" 
local z = "none"
if fs.exists("cords") == true then    
else
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
    file.close()
    a = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
else 
    local file = fs.open("name", "w")
    a = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z)
    local name = a.receive(999999)
    file.writeLine(name)
    if name == nil then
        fs.delete('name')
    end
    print(name)
end 


