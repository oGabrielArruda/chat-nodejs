var socket = io(window.location.href);

var nomes_sala = [];
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
    if(!nomePreenchido())
    {
        alert("Insira um nome de usuário!");
        $("#txtUsername").focus();
    }
    else
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

        entrarNaSala(nome);
}

$("#rooms").submit(event=>{ // entra na sala
    event.preventDefault();
    if(!nomePreenchido())
    {
        alert("Insira um nome de usuário!");
        $("#txtUsername").focus();
    }
    else   
        entrarNaSala(room_name);
});

function entrarNaSala(nome){
    localStorage.setItem("username", $("#txtUsername").val())
    socket.emit('joinRoom', nome);
    window.location.href = window.location.href + 'sala-' + nome;
}

function nomePreenchido(){
    var nome = $("#txtUsername").val();
    if(nome.trim() == null ||  nome.trim() == "")
        return false;
    return true;
}