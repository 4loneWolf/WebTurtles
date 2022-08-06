local NameHeader = "?myName="
local link = "wss://abobys.website:443"
local x = "none"
local y = "none" 
local z = "none"
local direction = "none"

if fs.exists("cords") == false then
    io.write('Write turtles exact coordinates (You can check in F3) \n')
    io.write('ROUND UP LIKE THAT\n 5.234 => 6 || -0.343 => -1 \n')
    io.write('x: ')
    x = io.read("*l")
    io.write('y: ')
    y = io.read("*l")
    io.write('z: ')
    z = io.read("*l")
    io.write('Write the direction turtle is facing (north, south, east, west) \n')
    direction = io.read("*l")
    fs.open("cords", "w")
end

local name = "NoName"

if fs.exists("name") == true then
    local file = fs.open("name", "r")
    name = file.readAll()
    os.setComputerLabel(name)
    file.close()
    repeat
        ws = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z .. "&" .. "direction=" .. direction)
    until ws ~= false    
else 
    local file = fs.open("name", "w")
    repeat
        ws = http.websocket(link .. NameHeader .. name .. "&" .. "x=" .. x .. "&" .. "y=" .. y .. "&" .. "z=" .. z .. "&" .. "direction=" .. direction)
    until ws ~= false 
    name = ws.receive()
    file.writeLine(name)
    file.close()
    os.setComputerLabel(name)
    print(name)
end

function TemplateForBlocks(upper, middlee, bottom, bool, IDD, whereToGo)
    local array = {
        boolean = bool,
        up = upper,
        middle = middlee,
        down = bottom,
        ID = IDD,
        whereToGo = whereToGo
    }
    do return array end
end

function TemplateForInventory(block1, block2, block3, block4, block5, block6, block7, block8, block9, block10, block11, block12, block13, block14, block15, block16, slot)
    local array = {
        Firstblock = block1,
        Secondblock = block2,
        Thirdblock = block3,
        Fourthblock = block4,
        Fifthblock = block5,
        Sixthblock = block6,
        Seventhblock = block7,
        Eigthblock = block8,
        Ninethblock = block9,
        Tenthblock = block10,
        Eleventhblock = block11,
        Twelfthblock = block12,
        Thirteenthblock = block13,
        Fourteenfthblock = block14,
        Fifteenthblock = block15,
        Sixteenthblock = block16,
        selectedSlot = slot
    }
    return array
end

function inspect(bool, ID, whereToGo)
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
    array = TemplateForBlocks(up:gsub(":", ""), middle:gsub(":", ""), bottom:gsub(":", ""), bool, ID, whereToGo)
    do return array end
end

function Movement(request)
    local where = request.whereToGo
    local ID = request.ID
    local SiteID = request.SiteID
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
    elseif where == "dig" then
        boolean = turtle.dig()
    elseif where == "digUp" then
        boolean = turtle.digUp()
    end
    if boolean == true then
        local array = inspect("true", ID, message.whereToGo)
        do return array end
    else
        local array = inspect("false", ID, message.whereToGo)
        do return array end
    end
end

function Transfer(toSlot, howMuch)
    local boolean = turtle.transferTo(toSlot, howMuch)
    return true
end

function digging(message)
    local where = message.whereToGo
    local ID = message.ID
    local boolean
    if where == "dig" then
        boolean = turtle.dig()
    elseif where == "digUp" then
        boolean = turtle.digUp()
    elseif where == "digDown" then
        boolean = turtle.digDown()
    end
    if boolean == true then
        local array = inspect("true", ID, message.whereToGo)
        do return array end
    else
        local array = inspect("false", ID, message.whereToGo)
        do return array end
    end
end

function dropping(message, howMany)
    local where = message
    local ID = message.ID
    local boolean
    if where == "dropUp" then
        boolean = turtle.dropUp(howMany)
    elseif where == "drop" then
        boolean = turtle.drop(howMany)
    elseif where == "dropDown" then
        boolean = turtle.dropDown(howMany)
    end
    if boolean == true then
        local array = inspect("true", ID, message.whereToGo)
        do return array end
    else
        local array = inspect("false", ID, message.whereToGo)
        do return array end
    end
end

function placing(message)
    local where = message.whereToGo
    local ID = message.ID
    local boolean
    if where == "placeUp" then
        boolean = turtle.placeUp()
    elseif where == "place" then
        boolean = turtle.place()
    elseif where == "placeDown" then
        boolean = turtle.placeDown()
    end
    local array = inspect(boolean, ID, message.whereToGo)
    do return array end
end

function sucking(message, howMany)
    local where = message
    local boolean
    print(where)
    if where == "suckUp" then
        boolean = turtle.suckUp(howMany)
    elseif where == "suck" then
        boolean = turtle.suck(howMany)
    elseif where == "suckDown" then
        boolean = turtle.suckDown(howMany)
    end
    print(boolean)
    if boolean == true then
        local array = inspect("true", ID, message.whereToGo)
        do return array end
    else
        local array = inspect("false", ID, message.whereToGo)
        do return array end
    end
end

function GetInventory() 
    local slot = turtle.getSelectedSlot()
    local block1 = turtle.getItemDetail(1)
    if block1 ~= nil then
        block1.name = block1.name:gsub(":", "")
    end
    local block2 = turtle.getItemDetail(2)
    if block2 ~= nil then
        block2.name = block2.name:gsub(":", "")
    end
    local block3 = turtle.getItemDetail(3)
    if block3 ~= nil then
        block3.name = block3.name:gsub(":", "")
    end
    local block4 = turtle.getItemDetail(4)
    if block4 ~= nil then
        block4.name = block4.name:gsub(":", "")
    end
    local block5 = turtle.getItemDetail(5)
    if block5 ~= nil then
        block5.name = block5.name:gsub(":", "")
    end
    local block6 = turtle.getItemDetail(6)
    if block6 ~= nil then
        block6.name = block6.name:gsub(":", "")
    end
    local block7 = turtle.getItemDetail(7)
    if block7 ~= nil then
        block7.name = block7.name:gsub(":", "")
    end
    local block8 = turtle.getItemDetail(8)
    if block8 ~= nil then
        block8.name = block8.name:gsub(":", "")
    end
    local block9 = turtle.getItemDetail(9)
    if block9 ~= nil then
        block9.name = block9.name:gsub(":", "")
    end
    local block10 = turtle.getItemDetail(10)
    if block10 ~= nil then
        block10.name = block10.name:gsub(":", "")
    end
    local block11 = turtle.getItemDetail(11)
    if block11 ~= nil then
        block11.name = block11.name:gsub(":", "")
    end
    local block12 = turtle.getItemDetail(12)
    if block12 ~= nil then
        block12.name = block12.name:gsub(":", "")
    end
    local block13 = turtle.getItemDetail(13)
    if block13 ~= nil then
        block13.name = block13.name:gsub(":", "")
    end
    local block14 = turtle.getItemDetail(14)
    if block14 ~= nil then
        block14.name = block14.name:gsub(":", "")
    end
    local block15 = turtle.getItemDetail(15)
    if block15 ~= nil then
        block15.name = block15.name:gsub(":", "")
    end
    local block16 = turtle.getItemDetail(16)
    if block16 ~= nil then
        block16.name = block16.name:gsub(":", "")
    end
    local array = TemplateForInventory(block1, block2, block3, block4, block5, block6, block7, block8, block9, block10, block11, block12, block13, block14, block15, block16, slot)
    do return array end
end

function SelectSlot(number)
    local boolean = turtle.select(number)
    local array = {message = boolean}
    return array
end

while true do
    print("receiving")
    message = ws.receive(1200)
    if message == nil then
        print("CRASHED")
        print("CRASHED")
        print("CRASHED")
        os.reboot()
    else
        if string.sub(message, 0, 4) == 'exec' then
            local request = string.sub(message, 6)
            loadstring(request)()
            ws.send("true")
        else
            local request = loadstring("return "..message.."")()
            if request.whereToGo == nil then
                message = request.message
            else
                message = request.whereToGo
            end
            print(string.sub(message, 0, 4))
            if string.sub(message, 0, 3) == "dig" then
                print(message)
                local arrray = digging(request)
                ws.send(array)
            elseif message == "inventory" then
                print(message)
                local array = GetInventory()
                ws.send(array)
            elseif string.sub(message, 0, 6) == "select" then
                print("SELECT")
                local array = SelectSlot(tonumber(string.sub(message, 7)))
                ws.send(array)
            elseif string.sub(message, 0, 4) == "drop" then
                print(message)
                local boolean = dropping(message, tonumber(request.howMany))
                ws.send({boolean = boolean})
            elseif string.sub(message, 0, 5) == "place" then
                print(message)
                local array = placing(request)
                ws.send(array)
            elseif string.sub(message, 0, 4) == "suck" then
                print(message)
                local array = sucking(message, tonumber(request.howMany))
                ws.send({boolean = boolean})
            elseif message == "transfer" then
                print(message)
                local bool = Transfer(tonumber(request.toSlot), tonumber(request.howMany))
                ws.send({boolean = bool})
            else
                print(message)
                local array = Movement(request)
                ws.send(array)
            end
        end
    end
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
