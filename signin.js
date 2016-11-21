var N = 1024, r = 80, p = 1;
var dkLen = 32;

var inputEmail;
var inputPassword;
var inputSalt;
var password;
var salt;
var authenticationkey
var decryptionkey;
var privatekey;

function prepareInput() {
  inputEmail = $('#inputEmail').val();
  inputPassword = $('#inputPassword').val();
  inputSalt = inputEmail + "someRandomsrzujhnfgbdf";
  password = new buffer.SlowBuffer(inputPassword.normalize('NFKC'));
  salt = new buffer.SlowBuffer(inputSalt.normalize('NFKC'));
}

function signin() {
  hideLoginAlert();
  prepareInput();
  if(inputEmail == "" || inputPassword == "") {
    displayLoginAlert("danger","Username and password must be set.");
    return;
  }
  $('.progress').show();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, hash) {
    if (error) {
      console.log("Error: " + error);
    } else if (hash) {
      console.log("Found: " + hash);
      decryptionkey = hash.slice(0,16);
      authenticationkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(16,32))));
      console.log(decryptionkey);
      console.log(authenticationkey);
      $.get("login.php?username=" + inputEmail + "&password=" + authenticationkey, 
        function(data, status){
          console.log("Data: " + data + "\nStatus: " + status);
          if(data.substring(0,1) == '1') { //successfull login
            $('#signin').hide();
            $('#main').show();
            privatekey = AESdecrypt(data.substr(1), decryptionkey); //login.php returns '1'.privatekey_aes
            console.log("Privatekey: ");
            console.log(privatekey);
            
            handleFriendRequests();
            generateMenu();
          } else {
            displayLoginAlert("danger",data);
          }
      });
    } else {
      updateInterface(progress);
    }
  });
}

function register() {
  hideLoginAlert();
  prepareInput();
  if(inputEmail == "" || inputPassword == "") {
    displayLoginAlert("danger","Username and password must be set.");
    return;
  }
  $('.progress').show();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, hash) {
    if (error) {
      console.log("Error: " + error);
    } else if (hash) {
      console.log("Found: " + hash);
      decryptionkey = hash.slice(0,16);
      var authenticationkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(16,32))));
      console.log(decryptionkey);
      console.log(authenticationkey);
      keys = generateNTRUKeys(decryptionkey);
      $.get("register.php?username=" + inputEmail + "&password=" + authenticationkey + "&privatekey=" + keys[0] + "&publickey=" + keys[1],
      function(data, status){
        if(data == "1") { //success
          displayLoginAlert("success","Registration successfull, you can login now.");
        } else {
          displayLoginAlert("danger",data);
        }
      });
    } else {
      updateInterface(progress);
    }
  });
}

function displayLoginAlert(type, text) {
  displayAlert('#loginalert', type, text);
}
function hideLoginAlert() {
  $('#loginalert').hide(500);
}
function displayAlert(divid, type, text) {
  $(divid).hide();
  $(divid).empty();
  $(divid).html('<div class="alert alert-' + type + '"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> ' + text + '</div>');
  $(divid).show(500);
}

function updateInterface(progress) {
  $('#scryptprogress').width(progress*100+"%");
  $('#scryptprogress').attr("aria-valuenow",progress);
  if(progress == 1) {
    $('.progress').hide();
    $('#scryptprogress').width(0);
    $('#scryptprogress').attr("aria-valuenow",0);
  }
}

function AESencrypt(text, key) {
  var textBytes = aesjs.util.convertStringToBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  return encodeURIComponent(btoa(String.fromCharCode.apply(null,encryptedBytes)));
}

function AESdecrypt(ciphertext, key) {
  var encryptedBytes = atob(decodeURIComponent(ciphertext)).split("").map(function(c) { return c.charCodeAt(0); }); //decodeURIComponent was added later. Remove if causes problems
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.util.convertBytesToString(decryptedBytes);
}
