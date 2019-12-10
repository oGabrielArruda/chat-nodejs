const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) =>{
    res.sendFile('rooms.html', { root: path.join(__dirname, './views')});
});

app.get('/:id?', (req, res) =>{
    res.sendFile('chat.html', { root: path.join(__dirname, './views')});
});



server.listen(3000, () => {
    console.log("Running!");
});

let messages = []; // array de mensagens
let rooms = [];
let sockets_rooms = [];


io.on('connection', socket => { // toda vez que um usuário se conectar
    console.log(`Socket connected: ${socket.id}`);

    sockets_rooms.push(socket);
    socket.emit('previousRooms', rooms);

    socket.on('createRoom', (name) =>{
        socket.emit('receivedRoom', name);
        socket.broadcast.emit('receivedRoom', name);        

        
        var sala = io.of('/sala-' + name);
        rooms[name] = sala;

        rooms[name].on('connection', (socket) => {
            socket.broadcast.emit('quantityOnline', io.engine.clientsCount);
            socket.emit('quantityOnline', io.engine.clientsCount);
        
            socket.emit('previousMessages', messages); // manda os dados para todos clientes
        
            socket.on('sendMessage', data => {
               // messages.push(data); // armazena o objeto no array de mensagens
                socket.broadcast.emit('receivedMessage', data); 
            });
        });
    });

    socket.on('joinRoom', (name)=>{
        console.log("joinou");
        var i = sockets_rooms.indexOf(socket);
        sockets_rooms.splice(i , 1);
    });
});
