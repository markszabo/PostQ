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
 
function pageLoaded() {
  if($('#messages').length) $('#messages').scrollTo("max"); //if messages, scroll to bottom

  //Check for localStorage and login user
  if (localStorage.getItem("local_username") !== null) {
	  signin_from_localStorage();
  }
}

function send(text) {
  msgId++;
  var msg = $('#newmsg').val();
  if(typeof text === 'string')
    msg=text;

  var msgWithId = msgId.toString() + ";" + msg;
  $('#newmsg').val(''); //cleare the message box
  
  var nonce = secureRandom(8);
  var encMsg = AESencryptCTR(msgWithId,msgSymKey,nonce);
  var hexNonce = ByteArray_2_HexString(nonce);
  $.post("sendMsg.php", { username: inputEmail, password: authenticationkey,  user2Id: user2Id, msg: encMsg, nonce: hexNonce}, 
  function(data, status){
    if(data == 1) { //if success, display message
      $("#alertMessages").hide(); //hide the alert
      $('#messages').append('<div class="msgFromMe">' + msg + '</div>');
      $('#messages').scrollTo("max",500);
    } else {
      displayAlert("#alertMessages","danger","Sending message failed. " + data);
    }
  });
}
