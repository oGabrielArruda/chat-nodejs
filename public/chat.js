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

        $('#chat').submit(function(event){
            event.preventDefault();

            var author = $('input[name=username]').val();
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