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
