var friend;

function addFriend() {
  friend = $('#inputFriendEmail').val();
  //get the public key of the given friend
  $.get("getPublicKey.php?user=" + friend, function(data, status){
    if(data.startsWith("Error")) {
      displayAlert("#alertNewFriend","danger",data);
    } else { //no error
      var publicKeyOfFriend = data;      
      var encaps = NTRUEncapsulate(publicKeyOfFriend);
      var plainkey = encaps[0];
      var symkeyforfriend = encaps[1];
      var symkeyforme = AESencrypt(plainkey, decryptionkey);

      $.get("addFriend.php?username=" + inputEmail + "&password=" + authenticationkey + "&friend=" + friend + "&symkeyforme=" + symkeyforme + "&symkeyforfriend=" + symkeyforfriend,
        function(data, status){
          if(data == "1") { //success
            displayAlert("#alertNewFriend","success","Friend added successfully!");
          } else {
            displayAlert("#alertNewFriend","danger",data);
          }
          console.log("addFriend.php returned: " + data);
          generateMenu();
        });
    }
  });      
}
