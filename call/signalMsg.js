function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function getSymKey(inputEmail, authenticationkey, decryptionkey, peer) {

  var symkey
  $.get("../getFriendList.php?username=" + inputEmail + "&password=" + authenticationkey,
  function(data, status){
    friends = $.csv.toArrays(data);
    symkey=friends[peer][2]

    //decrypt symmetric key
    var encryptedBytes = atob(symkey).split("").map(function(c) { return c.charCodeAt(0); });
    var aesCtr = new aesjs.ModeOfOperation.ctr(decryptionkey, new aesjs.Counter(5)); //invalid byte, possibly shouldnt use it as string literal?
    msgSymKey = aesCtr.decrypt(encryptedBytes);
    msgSymKey = msgSymKey.slice(0,32);
    return msgSymKey
  });
return {};
}

//send SDPoffer for initiating call
function sendCallParam(peer, msg) {
  //msgId++; we dont know this
  console.log(`sending ${msg} to ${peer}`);
  //replace newmsg with sdpoffer
  //var msg = msg;
  var msgWithId = "0;" + msg;
  inputEmail=getCookie('inputEmail')
  authenticationkey=getCookie('authenticationkey')
  decryptionkey=getCookie('decryptionkey')
  //get symmetric key for peer
  console.log(`stuff ${inputEmail} and ${authenticationkey}`)
  msgSymKey = getSymKey(inputEmail,authenticationkey,decryptionkey,peer)

  var encMsg = AESencrypt(msgWithId,msgSymKey);
  //console.log(`message= ${encMsg}`);
//  $.get("sendMsg.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id + "&msg=" + encMsg,
//  function(data, status){
//    if(data == 1) { //if success, display message - >> change to display usermedia
//      $("#alertMessages").hide(); //hide the alert
//      $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
//      $('#messages').scrollTo("max",500);
//    } else {
//      displayAlert("#alertMessages","danger","Sending message failed. " + data);
//    }
//  });
}

//query msgs -> go back till last sginaling msg
//if call_end -> do ntohing
//if SDPoffer -> create ans send Answer
//and add all candidates after interval
//if call is established send message of call_end instantly or something, these shouldnt be valid for more than 1 minute
/*
function showMessages(username, userid, symkey) {
  clearTimeout(messageUpdateTimer); //otherwise problem with switching between chats

  user2Id = userid;
  msgId = 0;
  msgIduser2 = 0;

  //decrypt symmetric key
  var encryptedBytes = atob(symkey).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCtr = new aesjs.ModeOfOperation.ctr(decryptionkey, new aesjs.Counter(5));
  msgSymKey = aesCtr.decrypt(encryptedBytes);
  msgSymKey = msgSymKey.slice(0,32);

  $.get("getMessages.php?username=" + inputEmail + "&password=" + authenticationkey + "&user2Id=" + user2Id,
  function(data, status){
    $('#messages').empty(); //clear previous messages
    var messages = data.split("\n");
    for(var i=0; i<messages.length; i++) {
      if(messages[i] != "") {
        var fromTo = messages[i].substring(0,1);
        var idAndMsg = messages[i].substring(1);
        var decIdAndMsg = AESdecrypt(idAndMsg, msgSymKey);
        var decIdAndMsgA = decIdAndMsg.split(";");
        var msg = decIdAndMsgA[1];
        var msgIdi = parseInt(decIdAndMsgA[0]);
        //if last msg is signaling, and no call end after it...
        if(fromTo == '1' && msgIdi > msgId) {
          msgId = msgIdi;
          $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
        } else if(fromTo == '0' && msgIdi > msgIduser2) {
          msgIduser2 = msgIdi;
          $('#messages').append('<div class="msgToMe">' + msg + '</div>');
        }
        //else if msg is signaling
        //redirect to call UI
      }
    }
    $('#addnewfriend').hide();
    $('.msgtitle').text(username);
    $('#messagesouter').show();
    $('#messages').scrollTo("max");
    markSelected("menuMsgs"+userid);
    messageUpdateTimer = setTimeout(function(){showMessages(username, userid, symkey);}, messageTimeout*1000);
  });
}
*/
