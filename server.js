const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
    res.render('rooms.html');
});

app.use('/rooms/:id', (req, res) => {
    res.render('chat.html');
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
        rooms.push(name);
        sockets_rooms.forEach((socket)=>{
            socket.emit('receivedRoom', name);
        });
    });

    socket.on('joinRoom', (name)=>{
        var i = sockets_rooms.indexOf(socket);
        sockets_rooms.splice(i , 1);
    });



   /* socket.broadcast.emit('quantityOnline', io.engine.clientsCount);
    socket.emit('quantityOnline', io.engine.clientsCount);

    socket.emit('previousMessages', messages); // manda os dados para todos clientes

    socket.on('sendMessage', data => {
        messages.push(data); // armazena o objeto no array de mensagens
        socket.broadcast.emit('receivedMessage', data); 
    });*/
});
