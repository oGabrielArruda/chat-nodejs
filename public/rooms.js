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
        elems[i].addEventListener('mouseover', function(){mudaCorDeFundo($(this),'#5dabff')});
        elems[i].addEventListener('mouseout', function(){mudaCorDeFundo($(this),'white')});
    }
};


socket.on('previousRooms', (rooms)=>{ // exibe as salas já existente
    rooms.forEach( room =>{
        renderRoom(room);
    });
});

socket.on('receivedRoom', (room) => { // recebe a sala
    renderRoom(room);
});

socket.on('deletedRoom', (room) => {
    let vetorDeSalas = document.getElementsByClassName('room');
    console.log(vetorDeSalas);
    for(var element of vetorDeSalas) {
        if(element.textContent.trim() == room)
            document.removeChild(element);
    }
});

function selectSala(){ // seleciona a sala
    if(anterior){
        anterior.css('background-color', 'white');
    }

    var objetoClickado = $(this);
    //desativarListeners(objetoClickado);
    mudaCorDeFundo(objetoClickado, 'black');


    room_name = objetoClickado.children('h1').text();
    $("#entrar").removeAttr('disabled');
    anterior = objetoClickado;
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
    nome = nome.replace('<', '&lt');
    nome = nome.replace('>', '&gt');

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


// style

function mudaCorDeFundo(obj, cor){
    obj.css('background-color', cor);
}

function desativarListeners(obj){
    obj.removeEventListener('mouseover', );
    obj.removeEventListener('mouseout', );
}