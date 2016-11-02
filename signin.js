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
  updateInterface(0);
  prepareInput();
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
            getFriendList();
          } else {
            $('#incorrect').text(data);
            $('#incorrect').show(500);
          }
      });
    } else {
      updateInterface(progress);
    }
  });
}

function register() {
  updateInterface(0);
  prepareInput();
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
      $.get("register.php?username=" + inputEmail + "&password=" + authenticationkey + "&privatekey=" + keys[0] + "&publickey=" + keys[1], function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
      });
    } else {
      updateInterface(progress);
    }
  });
}

function updateInterface(progress) {
  $('#scryptprogress').width(progress*100+"%");
  $('#scryptprogress').attr("aria-valuenow",progress);
}

function AESencrypt(text, key) {
  var textBytes = aesjs.util.convertStringToBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  return encodeURIComponent(btoa(String.fromCharCode.apply(null,encryptedBytes)));
}

function AESdecrypt(ciphertext, key) {
  var encryptedBytes = atob(ciphertext).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.util.convertBytesToString(decryptedBytes);
}
