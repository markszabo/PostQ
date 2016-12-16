function pageLoaded() {
  if($('#messages').length) $('#messages').scrollTo("max"); //if messages, scroll to bottom
}

function send() {
  msgId++;
  var msg = $('#newmsg').val();
  var msgWithId = msgId.toString() + ";" + msg;
  $('#newmsg').val(''); //cleare the message box
  
  var encMsg = AESencrypt(msgWithId,msgSymKey);
  $.get("sendMsg.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id + "&msg=" + encMsg, 
  function(data, status){
    if(data == 1) { //if success, display message
      $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
      $('#messages').scrollTo("max",500);
    } else {
      //TODO display error
    }
  });
}
