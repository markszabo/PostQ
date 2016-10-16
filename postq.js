function pageLoaded() {
  if($('#messages').length) $('#messages').scrollTo("max"); //if messages, scroll to bottom
}

function send() {
  var msg = $('#newmsg').val();
  $('#newmsg').val(''); //cleare the message box
  $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
  $('#messages').scrollTo("max",500);
}
