var N = 1024, r = 80, p = 1;
var dkLen = 32;

var inputEmail;
var inputPassword;
var inputSalt;
var password;
var salt;
var decryptionkey;

function prepareInput() {
  inputEmail = $('#inputEmail').val();
  inputPassword = $('#inputPassword').val();
  inputSalt = inputEmail + "someRandomsrzujhnfgbdf";
  password = new buffer.SlowBuffer(inputPassword.normalize('NFKC'));
  salt = new buffer.SlowBuffer(inputSalt.normalize('NFKC'));
}

function signin() {
  prepareInput();
  $('.progress').show();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, hash) {
    if (error) {
      console.log("Error: " + error);
    } else if (hash) {
      console.log("Found: " + hash);
      decryptionkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(0,16))));
      var authenticationkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(16,32))));
      console.log(decryptionkey);
      console.log(authenticationkey);
      $.get("login.php?username=" + inputEmail + "&password=" + authenticationkey, 
        function(data, status){
          console.log("Data: " + data + "\nStatus: " + status);
          if(data.substring(0,1) == '1') { //successfull login
            $('#signin').hide();
            $('#main').show();
          } else {
            $('#incorrect').text(data);
            $('#incorrect').show(500);
          }
      });
    } else {
      // update UI with progress complete
      updateInterface(progress);
    }
  });
}

function register() {
  prepareInput();
  $('.progress').show();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, hash) {
    if (error) {
      console.log("Error: " + error);
    } else if (hash) {
      console.log("Found: " + hash);
      decryptionkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(0,16))));
      var authenticationkey = encodeURIComponent(btoa(String.fromCharCode.apply(null,hash.slice(16,32))));
      console.log(decryptionkey);
      console.log(authenticationkey);
      keys = generateKeys(decryptionkey);
      $.get("register.php?username=" + inputEmail + "&password=" + authenticationkey + "&privatekey=" + keys[0] + "&publickey=" + keys[1], function(data, status){
          alert("Data: " + data + "\nStatus: " + status);
      });
    } else {
      // update UI with progress complete
      updateInterface(progress);
    }
  });
}

function generateKeys(deckey){
  var privatekey = "privatekey";
  var publickey = "publickey";
  privatekey = privatekey + deckey; //encrypt the privatekey
  return [privatekey, publickey];
}

function updateInterface(progress) {
  console.log("Progress: " + progress);
  $('#scryptprogress').width(progress*100+"%");
  $('#scryptprogress').attr("aria-valuenow",progress);
}
