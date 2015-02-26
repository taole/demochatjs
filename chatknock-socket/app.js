var express = require('express');
var app     = express();
var http    = require('http').Server().listen(3700);
var io      = require('socket.io')(http);
var crypto  = require('crypto');

//validator
function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function checkMessagesNull(str) {
    var patt = /[\w\d]+/m;
    var result = str.match(patt);
    if (result==null){ 
        return false;
    }else{
        return true;
    }
}

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

io.on('connection', function (socket,client) {  

    socket.on('addUser', function(result){              
        var tmp = randomValueHex(6);
        socket.textcolor = tmp
        socket.username  = result; 
    });


    socket.on('sendmessage', function (messages) {      	 
         var  messages = messages.replace(/\s+/g, " ")
            , messages = escapeHtml(messages)
            , tmp      = checkMessagesNull(messages)
            , ip       = socket.request.connection._peername.address
            , nickname = socket.username
            , textcolor= socket.textcolor; 
 
        console.log(socket.textcolor);
           
    	if (tmp == false){            
    		var   error     = 'messages not null'
                , status    = 'error'
                , messages  = null
                , result    = {"messages": messages,"error": error,"status": status,"ip":ip,'nickname':nickname,'textColor':textcolor};
    	} else{
    		var   error     = null
                , status    = 'success'
    			, result    = {"messages": messages,"error": error,"status": status,"ip":ip,'nickname':nickname,'textColor':textcolor};

    		socket.broadcast.emit('sendmessage',result);
    	} 

        socket.emit('sendmessage',result);

    }); 



});



module.exports = app;
