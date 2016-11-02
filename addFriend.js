var friend;

function addFriend() {
  friend = $('#inputFriendEmail').val();
  //get the public key of the given friend
  $.get("getPublicKey.php?user=" + friend, function(data, status){
    if(data.startsWith("Error")) {
      displayAlert("#alertNewFriend","danger",data);
    } else { //no error
      var publicKeyOfFriend = data;
      var plainkey = secureRandom(16);
      var plainkeyBase64 = btoa(String.fromCharCode.apply(null,plainkey));
      var symkeyforme = AESencrypt(plainkeyBase64, decryptionkey);
      var symkeyforfriend = NTRUEncrypt(plainkeyBase64, publicKeyOfFriend);

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
