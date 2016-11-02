var friends;

function generateMenu() {
  //get friends - name,userId,symkey
  $.get("getFriendList.php?username=" + inputEmail + "&password=" + authenticationkey,
  function(data, status){
    //empty the menu
    $('#menu').empty();
    //add AddFriend button to the top
    $('#menu').append('<li id="menuAddnewfriend" class="active"><a href="javascript:showAddNewFriend()"><span class="glyphicon glyphicon-plus"></span> New friend</a></li>');
    console.log("getFriendList.php returned: " + data);
    friends = $.csv.toArrays(data);
    for(var i = 0; i < friends.length; i++) {
      $('#menu').append('<li id="menuMsgs' + friends[i][1] + '"><a href="javascript:showMessages(\'' + friends[i][0] + '\',\'' + friends[i][1] + '\',\'' + friends[i][2] + '\')"><span class="glyphicon glyphicon-user"></span> ' + friends[i][0] + '</a></li>');
    }
  });
}
