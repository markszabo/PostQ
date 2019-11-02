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

var requests;
var symkeyrequests;

function handleFriendRequests() {

  //get requests to change symkeys
  $.post("getSymkeyRequests.php", { username: inputEmail, password: authenticationkey } ,
    function(data, status){
      symkeyrequests = $.csv.toArrays(data);
      $('#symkeyrequestsouter').empty(); //clear previous requests
      if(symkeyrequests.length > 0){
        $('#symkeyrequestsouter').append('<span class="glyphicon glyphicon-info-sign" title="Accepting new secret code will delete all previous message you sent!"></span>&nbsp;&nbsp;Secret code changing request from:<br/>');
      }
      for(var i = 0; i < symkeyrequests.length; i++) {
        $('#symkeyrequestsouter').append('<div> \
           <a href="javascript:acceptSymkeyRequest(' + i.toString() + ')"> <span class="glyphicon glyphicon-ok" title="Delete all my messages and accept new secret code"></span></a>&nbsp;&nbsp;' +
           symkeyrequests[i][2] +  '</div>');
      }
      if(symkeyrequests.length > 0){
        $('#symkeyrequestsouter').append('<hr/>');
      }
    }
  );

  //get new requests - user1,user2,symkey
  $.post("getNewRequests.php", { username: inputEmail, password: authenticationkey } ,
  function(data, status){
    requests = $.csv.toArrays(data);
    $('#friendrequestsouter').empty(); //clear previous requests
    if (requests.length > 0 ){
      $('#friendrequestsouter').append('Friend request from:<br/>');
    }
    for(var i = 0; i < requests.length; i++) {
      $('#friendrequestsouter').append('<div> \
         <a href="javascript:acceptRequest(' + i.toString() + ')"> <span class="glyphicon glyphicon-ok"></span></a>&nbsp;&nbsp; \
         <a href="javascript:rejectRequest(' + i.toString() + ')"> <span class="glyphicon glyphicon-remove"></span></a> &nbsp;&nbsp;' +
         requests[i][2] +  '</div>');
    }
  });
}

function acceptRequest(requestID) {
  var i = parseInt(requestID);
  //NTRU decrypt
  var plainSymKey = NTRUDecapsulate(requests[i][3], privatekey);
  //AES encrypt the symkey
  var AESSymKey = AESencryptCBC_arr(plainSymKey, decryptionkey);
  //send the symkey back, delete the requests
  $.post("acceptRequest.php", { username: inputEmail, password: authenticationkey, friendId: requests[i][1], symkeyforme: AESSymKey },
  function(data, status){
      if(data == "1") { //success
        displayAlert("#alertFriendRequests","success","Friend added successfully!");
        generateMenu();
        handleFriendRequests();
      } else {
        displayAlert("#alertFriendRequests","danger",data);
      }
    }
  );
}

function rejectRequest(requestID) {
  var i = parseInt(requestID);
  //delete request
  $.post("rejectRequest.php", { username: inputEmail, password: authenticationkey, friendId: requests[i][1] },
    function(data, status){
      if(data == "1") { //success
        displayAlert("#alertFriendRequests","success","Friend request rejected!");
        generateMenu();
        handleFriendRequests();
      } else {
        displayAlert("#alertFriendRequests","danger",data);
      }
    }
  );
}

function acceptSymkeyRequest(requestID) {
  var i = parseInt(requestID);
  //NTRU decrypt
  var plainSymKey = NTRUDecapsulate(symkeyrequests[i][3], privatekey);
  //AES encrypt the symkey
  var AESSymKey = AESencryptCBC_arr(plainSymKey, decryptionkey);
  //send the symkey back, delete the requests
  $.post("acceptChangeSymkey.php", { username: inputEmail, password: authenticationkey, friendId: symkeyrequests[i][1], symkeyforme: AESSymKey },
    function(data, status){
      if(data == "1") { //success
        displayAlert("#alertFriendRequests","success","New secret shared!");
        generateMenu();
        handleFriendRequests();
      } else {
        displayAlert("#alertFriendRequests","danger",data);
      }
    }
  );
}
