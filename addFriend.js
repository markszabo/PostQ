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
var friend;

function addFriend() {
  friend = $('#inputFriendEmail').val();
  //get the public key of the given friend
  $.post("getPublicKey.php", { user: friend }, function(data, status){
    if(data.startsWith("Error")) {
      displayAlert("#alertNewFriend","danger",data);
    } else { //no error
      var publicKeyOfFriend = data;      
      var encaps = NTRUEncapsulate(publicKeyOfFriend);
      var plainkey = encaps[0];
      var symkeyforfriend = encaps[1];
      var symkeyforme = AESencrypt(plainkey, decryptionkey);

      $.post("addFriend.php", {
        username: inputEmail, 
        password: decodeURIComponent(authenticationkey),
        friend: friend,
        symkeyforme: symkeyforme, 
        symkeyforfriend: symkeyforfriend
        },
        function(data, status){
          if(data == "1") { //success
            displayAlert("#alertNewFriend","success","Friend added successfully!");
          } else {
            displayAlert("#alertNewFriend","danger",data);
          }
          generateMenu();
        });
    }
  });      
}
