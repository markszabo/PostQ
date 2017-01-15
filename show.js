/*
 * Anna Dorottya Simon, Márk Szabó
 * Neptun-ID: R48G73, EMX74N
 * Applied cryptography project - a postquantum messenger application
 * January 2017
 * This solution was submitted and prepared by Anna Dorottya Simon(R48G73), Márk Szabó(EMX74N) for the project assignment of the Applied cryptography project seminar course.
 * We declare that this solution is our own work.
 * We have put the necessary references wherever we have used bigger and/or complicated external codes in our project. For shorter code snippets (usually from Stack Overflow) we have put the reference there in most cases.
 * Given the uniqueness of the project (no other student had, have or will have the same project) we have published our code on GitHub with the permission of our professors.
 * Students’ regulation of Eötvös Loránd University (ELTE Regulations Vol. II. 74/C. § ) states that as long as a student presents another student’s work - or at least the significant part of it - as his/her own performance, it will count as a disciplinary fault. The most serious consequence of a disciplinary fault can be dismissal of the student from the University.
 */

function showAddNewFriend() {
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('.msgtitle').text('Add new friend');
  $('#addnewfriend').show();
  markSelected("menuAddnewfriend");
}

var user2Id;
var msgSymKey;
var messageUpdateTimer;
var messageTimeout = 5; //in second
var msgId;
var msgIduser2;

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
        if(fromTo == '1' && msgIdi > msgId) {
          msgId = msgIdi;
          $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
        } else if(fromTo == '0' && msgIdi > msgIduser2) {
          msgIduser2 = msgIdi;
          $('#messages').append('<div class="msgToMe">' + msg + '</div>');
        }
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

function markSelected(id) {
  $("li").removeClass("active");
  $("#"+id).addClass("active");
}

//solve the navbar remaining open on mobile after click https://github.com/twbs/bootstrap/issues/12852#issuecomment-39746001
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});
