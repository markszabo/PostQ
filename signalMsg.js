function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

//send SDPoffer for initiating call
function sendCallParam(peer, msg) {
  //get paramters
  inputEmail=getCookie('inputEmail')
  authenticationkey=getCookie('authenticationkey')
  decryptionkey=getCookie('decryptionkey')
  decryptionkey=$.csv.toArrays(decryptionkey)[0].map(Number);;

  //add msgid to msg, 0 is placeholder
  var msgWithId = "0;&" + JSON.stringify(msg)+"&"+ Date.now();


  //get the symmetric key for encryption
  getSymKey(msgWithId, inputEmail,authenticationkey,decryptionkey,peer)
}


function getSymKey(msgWithId,inputEmail, authenticationkey, decryptionkey, peer) {

  var symkey
  var msgSymKey
  $.get("getFriendList.php?username=" + inputEmail + "&password=" + authenticationkey,
  function(data, status){
    friends = $.csv.toArrays(data);
    symkey=friends[peer][2];
    peer=friends[peer][1]
    symkey=decodeURIComponent(symkey)
    //decrypt symmetric key
    var encryptedBytes = atob(symkey).split("").map(function(c) { return c.charCodeAt(0); });
    var aesCtr = new aesjs.ModeOfOperation.ctr(decryptionkey, new aesjs.Counter(5));
    msgSymKey = aesCtr.decrypt(encryptedBytes);
    msgSymKey = msgSymKey.slice(0,32);
    encryptAndSend(msgWithId,msgSymKey,peer,authenticationkey,inputEmail)
  });
}

function encryptAndSend(msgWithId, msgSymKey,user2Id,authenticationkey,inputEmail){
  var encMsg = AESencrypt(msgWithId,msgSymKey); //AESencrypt is not defined
    $.get("sendMsg.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id + "&msg=" + encMsg,
    function(data, status){
      if(data == 1) { //if success, display message - >> change to display usermedia
        console.log(`message sent = ${msgWithId}`);

      } else {
        console.log(`sending message failed = ${msgWithId}`);

      }
    });

}
