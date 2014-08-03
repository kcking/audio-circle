var io = require('socket.io')(80);
var uuid = require('node-uuid');
var sockets = [];

var syncingPair = [null, null]
io.on('connection', function(socket) {
    sockWrapper = Object();
    sockWrapper.sock = socket;
    socket.sWrapper = sockWrapper;
    sockWrapper.neighbors = [];
    sockWrapper.id = uuid.v4();
    sockets.push(sWrapper);
    socket.on('my_name', function(data) {
        sockWrapper.name = data.name;
    });
    socket.on('get_topology', function(data) {
        topology = [];
        for (var i = 0; i < sockets.length; i++) {
        }
    });
    socket.on('update_neighbor', function(data) {
        sockWrapper.neighbors[data['id']] = data['distance'];
    });

});

var busy = false;
var processNodes = function() {
    if (sockets.length > 1) {
        minNeighbors = 0;
        loneliestSock = null;
        // pick two loneliest nodes
        for (var i = 0; i < sockets.length; i++) {
            if (loneliestSock == null ||
                Object.keys(sockets[i].neighbors).length < minNeighbors) {
                loneliestSock = sockets[i];
                minNeighbors = Object.keys(sockets[i].neighbors).length;
            }
        }
    }
    busy = false;
}

setInterval(function() {
    if !busy {
        busy = true;
        processsNodes();
    }
}, 1000);