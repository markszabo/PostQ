function showAddNewFriend() {
  $('#messagesouter').hide();
  $('#addnewfriend').show();
}

var user2Id;
var msgSymKey;

function showMessages(username, userid, symkey) {
  user2Id = userid;
  
  //decrypt symmetric key
  var encryptedBytes = atob(symkey).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCtr = new aesjs.ModeOfOperation.ctr(decryptionkey, new aesjs.Counter(5));
  msgSymKey = aesCtr.decrypt(encryptedBytes);
  
  $.get("getMessages.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id, 
  function(data, status){
    var messages = data.split("\n");
    for(var i=0; i<messages.length; i++) {
      if(messages[i] != "") {
        var fromTo = messages[i].substring(0,1);
        var msg = messages[i].substring(1);
        decMsg = AESdecrypt(msg, msgSymKey);
        if(fromTo == '1')
          $('#messages').append('<div class="msgFromMe">' + decMsg + '</div>');
        else
          $('#messages').append('<div class="msgToMe">' + decMsg + '</div>');
      }
    }
    $('#addnewfriend').hide();
    $('#messagesouter').show();
    $('#messages').scrollTo("max");
  });
}
