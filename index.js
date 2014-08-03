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
    socket.on('complete_pairing', function(data) {
        sockWrapper.neighbors[data['id']] = data['distance'];
        if (syncingPair[0] == sockWrapper) {
            syncingPair[0] = null;
        } else if (syncingPair[1] == sockWrapper) {
            syncingPair[1] = null;
        }
    });
});

var initiate_pairing = function(A, B) {
    if (syncingPair[0] || syncingPair[1]) {
        return;
    }
    syncingPair[0] = A;
    syncingPair[1] = B;
    // Send partners eachother's ID
    A.sock.emit('init_pairing', {'id': B.id, 'role': 'A'});
    B.sock.emit('init_pairing', {'id': A.id, 'role': 'B'});

}

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
        secondMinNeighbors = 0;
        secondLoneliestSock = null;
        for (var i = 0; i < sockets.length; i++) {
            if ((secondLoneliestSock == null ||
                Object.keys(sockets[i].neighbors).length < secondMinNeighbors)
                && sockets[i] != loneliestSock) {
                secondLoneliestSock = sockets[i];
                secondMinNeightbors = Object.keys(sockets[i].neighbors).length;
            }
        }
        if !(loneliestSock.neighbors[secondLoneliestSock.id]) {
            initiate_pairing(loneliestSock, secondLoneliestSock);
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