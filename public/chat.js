var socket = io(window.location.href); // pega o socket de acordo com a url

        function renderMessage(message){
            $('.messages').append("<div class='message'><strong> "+
                                    message.author + ": " +
                                "</strong>" + message.message + "</div>");
        }

        socket.on('quantityOnline', quantity =>{
            $("#qtdOnline").text(quantity);
        });

        socket.on('previousMessages', messages => { // recebe o array de mensagens antigas
            messages.forEach(message => { // pra cada mensagem no array
                renderMessage(message);
            });
        });

        socket.on('receivedMessage', message =>{ // recebe os dados do servidor
            renderMessage(message);
        });

        socket.on('receivedConnection', nome =>{
            var msg = {
                author: "Servidor",
                message: nome + " entrou na sala!",
            };
            renderMessage(msg);
        });

        
        $(document).ready(()=>{
            socket.emit('newConnection', localStorage.getItem("username"));
        });
    
        socket.on('receivedDisconnect', nome => {
            var msg = {
                author: "Servidor",
                message: nome + " saiu da sala!",
            };
            renderMessage(msg);
        });

        window.onbeforeunload = function(){
            socket.emit('newDisconnect', localStorage.getItem("username"));
        }


        $('#chat').submit(function(event){
            event.preventDefault();

            var author = localStorage.getItem("username");
            var message = $('input[name=message]').val();

            if(author.length && message.length){
                var messageObject = {
                    author: author,
                    message: message,
                };

                renderMessage(messageObject);

                socket.emit('sendMessage', messageObject); // manda os dados para o servidor
                
                $('input[name=message]').val("");
            }
        });