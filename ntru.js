//TODO implement NTRU algorithm here
function NTRUEncrypt(text, NTRUpublickey) {
  return text;
}

function NTRUDecrypt(cipher, NTRUprivatekey) {
  return cipher;
}

function generateNTRUKeys(deckey){
  var privatekey = "privatekey";
  var publickey = "publickey";
  
  encryptedPrivatekey = AESencrypt(privatekey, deckey); //encrypt the privatekey
  return [encryptedPrivatekey, publickey];
}
