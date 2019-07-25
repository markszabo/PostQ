// used by call.js
// send a signaling message identified by id=0 and extra date paramter
function sendSignal(msg){
  var msgWithId = "0;&" + JSON.stringify(msg)+"&"+ Date.now();
  var encMsg = AESencrypt(msgWithId,msgSymKey); //AESencrypt is not defined
    $.get("sendMsg.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id + "&msg=" + encMsg,
    function(data, status){
      if(data == 1) {
        console.log(`message sent = ${msgWithId}`);

      } else {
        console.log(`sending message failed = ${msgWithId}`);

      }
    });
}
