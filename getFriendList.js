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

var friends;

function generateMenu() {
  //get friends - name,userId,symkey
  $.post("getFriendList.php", {username: inputEmail, password: authenticationkey},
  function(data, status){
    //empty the menu
    $('#menu').empty();
    //add AddFriend button to the top
    $('#menu').append('<li id="menuAddnewfriend" class="active"><a href="javascript:showAddNewFriend()"><span class="glyphicon glyphicon-plus"></span> New friend</a></li>');
    friends = $.csv.toArrays(data);
    for(var i = 0; i < friends.length; i++) {
      $('#menu').append('<li id="menuMsgs' + friends[i][1] + '"><a href="javascript:showMessages(\'' + friends[i][0] + '\',\'' + friends[i][1] + '\',\'' + friends[i][2] + '\')"><span class="glyphicon glyphicon-user"></span> ' + friends[i][0] + '</a></li>');
    }
    $('#menu').append('<li><a href="javascript:signout()"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
  });
}
