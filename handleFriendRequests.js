function handleFriendRequests() {
  //get new requests - user1,user2,symkey
  $.get("getNewRequests.php?username=" + inputEmail + "&password=" + authenticationkey,
  function(data, status){
    console.log("getNewRequests.php returned: " + data);
    var requests = $.csv.toArrays(data);
    for(var i = 0; i < requests.length; i++) {
      //NTRU decrypt
      var plainSymKey = NTRUDecapsulate(requests[i][2], privatekey);
      //AES encrypt the symkey
      var AESSymKey = AESencrypt(plainSymKey, decryptionkey);
      //send the symkey back, delete the requests
      $.get("acceptRequest.php?username=" + inputEmail + "&password=" + authenticationkey + "&friendId=" + requests[i][1] + "&symkeyforme=" + AESSymKey,
      function(data, status){
        console.log("acceptRequest.php returns: " + data);
        generateMenu();
      });
    }
  });
}
