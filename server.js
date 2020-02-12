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

let rooms = [];
let rooms_names = [];


io.on('connection', socket => { // toda vez que um usuário se conectar
    console.log(`Socket connected: ${socket.id}`);

    socket.emit('previousRooms',  rooms_names); // manda as salas pra quem logou na parte das rooms

    socket.on('createRoom', (name) =>{ // criando a sala
        rooms_names.push(name); // insere a o nome da sala no vetor de nomes

        socket.emit('receivedRoom', name); // exibe a nova sala para os usuarios logados
        socket.broadcast.emit('receivedRoom', name);        

        while(name.indexOf(' ') != -1)
            name = name.replace(' ', '%20');
        name.replace('<', '&lt');
        name.replace('>', '&gt');

       var sala = io.of('/sala-' + name); // cria-se um name-space específico para a sala
        rooms[name] = sala;

        let messages = []; // array de mensagens
        let qtdOnline = 0;
        rooms[name].on('connection', (socket) => {
            qtdOnline++;
            socket.broadcast.emit('quantityOnline', qtdOnline);
            socket.emit('quantityOnline', qtdOnline);
        
            socket.emit('previousMessages', messages); // manda os dados para todos clientes
        
            socket.on('newConnection', name => {
                socket.emit('receivedConnection', name);
                socket.broadcast.emit('receivedConnection', name);
            });

            socket.on('sendMessage', data => {
                messages.push(data); // armazena o objeto no array de mensagens
                socket.broadcast.emit('receivedMessage', data); 
            });
            
            socket.on('disconnect', ()=>{
                qtdOnline--;
                socket.broadcast.emit('quantityOnline', qtdOnline);
                if(qtdOnline == 0)
                    closeRoom(name);
            });
        });
    });

    socket.on('joinRoom', (name)=>{
        console.log("joinou");
        socket.disconnect();
    });

    function closeRoom(name){
        delete io.nsps[name];
        rooms.splice(name, 1);
        rooms_names = rooms_names.filter(room => {
            return room !== name
        })

        console.log(rooms_names);
    }
});
