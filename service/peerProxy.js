const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
    const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

    wss.on('connection', (socket) => {
        socket.isAlive = true;

        socket.on('message', (data) => {
            try {
                const parsed = JSON.parse(data);
                wss.clients.forEach((client) => {
                    if (client !== socket && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsed));
                    }
                });
            } catch (err) {
                console.error('Invalid WebSocket message', err);
            }
        });

        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    // Ping every 10 seconds to keep connections alive
    const interval = setInterval(() => {
        wss.clients.forEach((socket) => {
            if (!socket.isAlive) return socket.terminate();
            socket.isAlive = false;
            socket.ping();
        });
    }, 10000);

    wss.on('close', () => clearInterval(interval));

    return wss;
}

module.exports = { peerProxy };