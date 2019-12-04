const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) =>{
    res.render('index.html');
});

let messages = []; // array de mensagens

server.listen(3000, () => {
    console.log("Running!");
})

io.on('connection', socket => { // toda vez que um usuário se conectar
    console.log(`Socket connected: ${socket.id}`);

    socket.on('sendMessage', data => {
        console.log(data);
        messages.push(data); // armazena o objeto no array de mensagens
        socket.broadcast.emit('receivedMessage', data);
    });
});