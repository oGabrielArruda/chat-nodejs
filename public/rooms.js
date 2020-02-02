var socket = io(window.location.href);

let nomes_sala = [];
var room_name = "";
var anterior;

function renderRoom(room){ // renderiza a ssala
    $("#rooms").append(`<div class="room"> 
                        <h1>` + room + `</h1> 
                    </div>`);
    var elems = document.getElementsByClassName('room');
    for(var i = 0; i < elems.length; i++){
        elems[i].addEventListener('click', selectSala);
    }
};


socket.on('previousRooms', (rooms)=>{ // exibe as salas já existente
    rooms.forEach( room =>{
        renderRoom(room);
    });
});

socket.on('receivedRoom', (room) => { // recebe a sala
    renderRoom(room);
})

function selectSala(){ // seleciona a sala
    if(anterior){
        anterior.css('background-color', 'white');
    }

    $(this).css('background-color', 'black');
    room_name = $(this).children('h1').text();
    $("#entrar").removeAttr('disabled');
    anterior = $(this);
}


$("#createRoom").click(()=>{ // abre o modal para criar
    $("#modalNovaSala").modal('show');
});

$("#btnCriar").click(()=>{ // cria a sala
    var nome = $("#newRoomName").val();

    if(nome && nomes_sala.indexOf(nome) == -1) // se o nome não é vazio e ainda não existe
        criarSala(nome);
    else
        alert('Nome de sala já existente ou nulo!');

    $("#modalNovaSala").modal('hide');
    $("#newRoomName").val('');
});

function criarSala(nome)
{   
        nomes_sala.push(nome);
        socket.emit('createRoom', nome);

        socket.emit('joinRoom', room_name);
        window.location.href = window.location.href + 'sala-' + nome;
}

$("#rooms").submit(event=>{ // entra na sala
    event.preventDefault();
    socket.emit('joinRoom', room_name);
    window.location.href = window.location.href + 'sala-' + room_name;
});