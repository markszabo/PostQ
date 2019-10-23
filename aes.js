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

function AESencryptCTR(text, key, arrNonce) {
  if(typeof text === 'string')
    text = aesjs.util.convertStringToBytes(text);
  var shiftedNonce = [0, 0, 0, 0, 0, 0, 0, 0 ].concat(arrNonce);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(shiftedNonce));
  var encryptedBytes = aesCtr.encrypt(text);
  return btoa(String.fromCharCode.apply(null,encryptedBytes));
}

function AESdecryptCTR(ciphertext, key, hexNonce) {
  var encryptedBytes = atob(ciphertext).split("").map(function(c) { return c.charCodeAt(0); });
  var shiftedNonce = [0, 0, 0, 0, 0, 0, 0, 0 ].concat(HexString_2_ByteArray(hexNonce));
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(shiftedNonce));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  return aesjs.util.convertBytesToString(decryptedBytes);
}

function AESencryptCBC_txt(text, key, iniVector) {
  text = aesjs.util.convertStringToBytes(text);
  while (text.length % 16 !== 0) //insert null padding
    text.push(0);
  var aesCBC = new aesjs.ModeOfOperation.cbc(key, iniVector);
  var encryptedBytes = aesCBC.encrypt(text);
  return btoa(String.fromCharCode.apply(null,encryptedBytes));
}

function AESdecryptCBC_txt(ciphertext, key, iniVector) {
  var encryptedBytes = atob(ciphertext).split("").map(function(c) { return c.charCodeAt(0); });
  var aesCBC = new aesjs.ModeOfOperation.cbc(key, iniVector);
  var decryptedBytes = aesCBC.decrypt(encryptedBytes);
  while (decryptedBytes[decryptedBytes.length-1] == 0) //remove null padding
    decryptedBytes.pop();
  return aesjs.util.convertBytesToString(decryptedBytes);
}

/* ------- utils ------- */
function HexString_2_ByteArray(hexString) {
  var result = [];
  for (var i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }
  return result;
}

function ByteArray_2_HexString(arr) {
  var result = "";
  for (i in arr) {
    var str = arr[i].toString(16);
    str = str.length == 0 ? "00" :
    str.length == 1 ? "0" + str :
    str.length == 2 ? str :
    str.substring(str.length-2, str.length);
    result += str;
  }
  return result;
}
