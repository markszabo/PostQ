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
      displayLoginAlert("danger","Calculating the scrypt hash of the password failed. Try again. Detailed error: " + error.toString());
    } else if (hash) {
      decryptionkey = hash.slice(0,16);
      authenticationkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(16,32))));
      $.get("login.php?username=" + inputEmail + "&password=" + authenticationkey, 
        function(data, status){
          if(data.substring(0,1) == '1') { //successfull login
            $('#signin').hide();
            $('#main').show();
            privatekey = AESdecrypt(data.substr(1), decryptionkey); //login.php returns '1'.privatekey_aes
            
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
      displayLoginAlert("danger","Calculating the scrypt hash of the password failed. Try again. Detailed error: " + error.toString());
    } else if (hash) {
      decryptionkey = hash.slice(0,16);
      var authenticationkey = btoa(String.fromCharCode.apply(null,hash.slice(16,32)));
      keys = generateNTRUKeys(decryptionkey, function(keys){
        updateInterface(0.9);
        $.post("register.php", {
          username: inputEmail,
          password: authenticationkey,
          privatekey: keys[0],
          publickey: btoa(keys[1])
        },
        function(data, status){
          updateInterface(1);
          if(data == "1") { //success
            displayLoginAlert("success","Registration successful, you can login now.");
          } else {
            displayLoginAlert("danger",data);
          }
        });
      });
    } else {
      updateInterface(0.8*progress); //creating the hash is the progress up to 80%, then NTRU keygen (90%) and call register.php (100%)
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
  if(typeof text === 'string')
    text = aesjs.util.convertStringToBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(text);
  return encodeURIComponent(btoa(String.fromCharCode.apply(null,encryptedBytes)));
}

function AESdecrypt(ciphertext, key) {
  var encryptedBytes = atob(decodeURIComponent(ciphertext)).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.util.convertBytesToString(decryptedBytes);
}
