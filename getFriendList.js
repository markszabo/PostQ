var friends;

function getFriendList() {
  //get friends - name,userId,symkey
  $.get("getFriendList.php?username=" + inputEmail + "&password=" + authenticationkey,
  function(data, status){
    console.log("getFriendList.php returned: " + data);
    friends = $.csv.toArrays(data);
    for(var i = 0; i < friends.length; i++) {
      $('#menu').append('<li><a href="javascript:showMessages(\'' + friends[i][0] + '\',\'' + friends[i][1] + '\',\'' + friends[i][2] + '\')"><span class="glyphicon glyphicon-user"></span> ' + friends[i][0] + '</a></li>');
    }
  });
}
