// used by call.js
// send a signaling message identified by id=0 and extra date paramter
function sendSignal(msg){
  var msgWithId = "0;&" + JSON.stringify(msg)+"&"+ Date.now();
  var nonce = secureRandom(8);
  var encMsg = AESencryptCTR(msgWithId,msgSymKey,nonce);
  var hexNonce = ByteArray_2_HexString(nonce);

  $.post("sendMsg.php", { username: inputEmail, password: authenticationkey,  user2Id: user2Id, msg: encMsg, nonce: hexNonce},
    function(data, status){
      if(data == 1) {
        //console.log(`message sent = ${msgWithId}`);

      } else {
        console.log(`sending message failed = ${msgWithId}`);

      }
    });
}
