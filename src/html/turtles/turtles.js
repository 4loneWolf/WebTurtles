async function sendData(data, where, options = {}) {
    data = {message: data}

    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        return await fetch(where, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        })
        .then((response)=>response.json())
          .then((responseJson)=>{clearTimeout(id); return responseJson});
    } catch (error) {
        alert("No turtles connected, try refreshing the page later(>_<)")
    }
    clearTimeout(id);
};

var data = await sendData({message:"give me turtles"}, '/utility');
var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
var header = 'https://abobys.website:80/main.html'

//header = header.substring(0, 40) + "/main.html"
//console.log(header)
var parent = document.getElementById('body')

for (var i in data) {
  var TurtleName = data[i].name
  let x = data[i].coords.x, y = data[i].coords.y, z = data[i].coords.z
  let NewHeader = header + "?name=" + TurtleName
  console.log(NewHeader)
  
  let a = parent.appendChild(document.createElement('a'))
  var link = document.createTextNode(TurtleName + " (" + x + ", " + y + ", " + z + ")");
  a.appendChild(link)
  a.href = NewHeader
  a.style = "font-size: 35px;"
  parent.appendChild(document.createElement('br'))
}