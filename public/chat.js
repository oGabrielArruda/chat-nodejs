var socket = io(window.location.href); // pega o socket de acordo com a url

const author = localStorage.getItem("username");
var msgSuasBoasVindas;

        function renderMessage(message){
            $('.messages').append("<div class='message'<span style='color:"+ message.color+";'><strong>"+
                                    message.author + ": " +
                                "</strong>" +
                                message.message + "</span></div>");
        }

        socket.on('quantityOnline', quantity =>{
            $("#qtdOnline").text(quantity);
        });

        socket.on('previousMessages', messages => { // recebe o array de mensagens antigas
            messages.forEach(message => { // pra cada mensagem no array
                renderMessage(message);
            });
            renderMessage(msgSuasBoasVindas); 
        });

        socket.on('receivedMessage', message =>{ // recebe os dados do servidor
            renderMessage(message);
        });

        
        window.onload = function(){ // função chamada ao carregar a página
            msgSuasBoasVindas = {
                author: 'SERVIDOR',
                message: author + ' entrou na sala!',
                color: 'green',
            };

            socket.emit('sendMessage', msgSuasBoasVindas);      
        };
    
        window.onbeforeunload = function(){ // função chamada antes da tela fechar
            var objetoDaMensagem = {
                author: 'SERVIDOR',
                message: author + ' saiu da sala!',
                color: 'red',
            };

            socket.emit('sendMessage', objetoDaMensagem);
        }


        $('#chat').submit(function(event){
            event.preventDefault();

           
            var message = $('input[name=message]').val();

            if(author.length && message.length){
                var messageObject = {
                    author: author,
                    message: message,
                    color: 'black',
                };

                renderMessage(messageObject);

                socket.emit('sendMessage', messageObject); // manda os dados para o servidor
                
                $('input[name=message]').val("");
            }
        });