var N = 1024, r = 8, p = 1;
var dkLen = 32;

var inputEmail;
var inputPassword;
var inputSalt;
var password;
var salt;

function prepareInput() {
  inputEmail = $('#inputEmail').val();
  inputPassword = $('#inputPassword').val();
  inputSalt = inputEmail + "someRandomsrzujhnfgbdf";
  password = new buffer.SlowBuffer(inputPassword.normalize('NFKC'));
  salt = new buffer.SlowBuffer(inputSalt.normalize('NFKC'));
}

function signin() {
  prepareInput();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
    if (error) {
      console.log("Error: " + error);
    } else if (key) {
      console.log("Found: " + key);
      $('#signin').hide();
      $('#main').show();
    } else {
      // update UI with progress complete
      updateInterface(progress);
    }
  });
}

function register() {
  prepareInput();
  scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
    if (error) {
      console.log("Error: " + error);
    } else if (key) {
      console.log("Found: " + key);
      $('#signin').hide();
      $('#main').show();
    } else {
      // update UI with progress complete
      updateInterface(progress);
    }
  });
}

function updateInterface(progress) {
  console.log("Progress: " + progress);
}
