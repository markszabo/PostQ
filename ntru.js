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

//Parameters of NTRU
var p = 739; // /x^p-x-1
var q = 9829; //mod q
var n = p-1; //degree of polynomials
var t = 204;
var idealStr = "x^"+p.toString()+"-x-1";
var R3 = "Z3/"+idealStr;
var Rq = "Z"+q.toString()+"/"+idealStr;

function NTRUEncapsulate(NTRUpublickey) {
  var hStr = NTRUpublickey;
  Polynomial.setField("R");
  var rStr = genTSmallPoly(n, t);
  Polynomial.setField(Rq);
  var hr = new Polynomial(hStr).mul(new Polynomial(rStr));
  Polynomial.setField("R");
  hr = centerPoly(hr,q);
  var c = roundToMultipleOf3(hr);
  
  var rhash = sha512(rStr);
  var keyConfirmation = rhash.substring(0,64);
  var sessionKeyStr = rhash.substring(64);
  var sessionKey = hexStr2byteArray(sessionKeyStr);
  
  cipher = keyConfirmation + ";" + c.toString();
  return [sessionKey, cipher];
}

function NTRUDecapsulate(cipher, NTRUprivatekey) {
  var Cc = cipher.split(";");
  var keyConfirmation = Cc[0];
  var cStr = Cc[1];
  
  var priv = NTRUprivatekey.split(";");
  var fStr = priv[0];
  var gInvStr = priv[1];
  
  Polynomial.setField(Rq);
  var poly3fc = new Polynomial(cStr).mul(new Polynomial(fStr).mul(new Polynomial("3")));
  Polynomial.setField("R");
  poly3fc = centerPoly(poly3fc,q);
  Polynomial.setField(R3);
  var e = poly3fc.clone().add("0");
  var ebyg = e.mul(new Polynomial(gInvStr));
  ebyg = centerPoly(ebyg,3);
  rStr = ebyg.toString();
  
  var rhash = sha512(rStr);
  var keyConfirmationCalc = rhash.substring(0,64);
  var sessionKeyStr = rhash.substring(64);
  var sessionKey = hexStr2byteArray(sessionKeyStr);
  if(keyConfirmationCalc == keyConfirmation)
    return sessionKey;
  else {
    throw "Decryption error!";
    return "";
  }
}

var w; //the background thread - worker is based on http://www.w3schools.com/html/html5_webworkers.asp

function generateNTRUKeys(deckey, callback) {
  w = new Worker("NTRUkeygenWorker.js");
  w.onmessage = function(event) {
    w.terminate();
    var privatekey = event.data[0];
    var publickey = event.data[1];
    callback([privatekey, publickey]);
  };
}

function genG() {
  //Generate a random small element g. Repeat until g is invertible in R/3
  Polynomial.setField("Z3");
  var gStr;
  var gInv;
  var gFound = false;
  var iii=0;
  while(!gFound){
    gStr = genSmallPoly(n);
    try {
      gInv = polyModInverse(new Polynomial(gStr), new Polynomial(idealStr));
      gFound = true;
    } catch(err) {
      gFound = false; //g is not invertible, try again
    }
  }
  //move gInv from [0,1,2] to [-1,0,1]
  Polynomial.setField("R");
  gInv = centerPoly(gInv, 3);
  return [gStr, gInv.toString()];
}

function genF() {
  return genTSmallPoly(n, t);
}

function centerPoly(poly, size) {
  var result = poly.clone();
  var degr = result.degree();
  for(var i=0; i <= degr; i++) {
    if(result['coeff'][i]) {//if the coefficient exists and is non-zero
      if(result['coeff'][i] > (size-1)/2) {
        result['coeff'][i] = result['coeff'][i] - size;
      }
    }
  }
  return result;
}

function roundToMultipleOf3(poly) {
  var result = poly.clone();
  var degr = result.degree();
  for(var i=0; i <= degr; i++) {
    if(result['coeff'][i]) {//if the coefficient exists and is non-zero
      var remai = result['coeff'][i] % 3;
      if(remai == 1 || remai == -2)
        result['coeff'][i] = result['coeff'][i] - 1;
      else if(remai == 2 || remai == -1)
        result['coeff'][i] = result['coeff'][i] + 1;
    }
  }
  return result;
}

function genSmallPoly(pn) { //all coeffs in [-1,0,1], degree is n
  var resultStr = getRandomInt(-1,1).toString(); //generate the constant term
  for(var i=1; i<=pn; i++) {
    var actualCoeff = getRandomInt(-1,1);
    if(actualCoeff != 0) {
      resultStr += "+"+actualCoeff.toString()+"x^"+i.toString();
    }
  }
  return resultStr; 
}

function genTSmallPoly(pn, pt) { //all coeffs in [-1,0,1], degree is n, number of non-zero coeffs is t
  Polynomial.setField("R");
  var resultA = new Array(pn+1).fill(0); //all zero array
  var i=0;
  while(i<pt) { //fill t element with -1 or 1
    var index = getRandomInt(0,pn);
    if(resultA[index] == 0) {
      resultA[index] = getRandomInt(0,1)*2-1; // ({0,1}*2 -1) = {0,2}-1 = {-1,1}
      i++;
    }
  }
  return new Polynomial(resultA).toString();
}

function polyModInverse(poly, modulo) { //polyModInverse(new Polynomial("3+2x^2-3x^4+x^6"), new Polynomial("x^7-1"))
  //Do the Extended Euclidean Algorithm 
  //Based mostly on https://math.stackexchange.com/questions/124300/finding-inverse-of-polynomial-in-a-field
  var r0 = modulo.add("0");
  var r1 = poly.add("0");
  var t0 = new Polynomial("0");
  var t1 = new Polynomial("1");
  var s0 = new Polynomial("1");
  var s1 = new Polynomial("0");
  var q, r2, s2, t2;
  do{ // r0 = q * r1 + r2
    q = r0.div(r1);
    r2 = r0.sub(r1.mul(q));
    s2 = s0.sub(s1.mul(q));
    t2 = t0.sub(t1.mul(q));
    if(r2.toString() != "0") {
      r0 = r1;
      r1 = r2;
      s0 = s1;
      s1 = s2;
      t0 = t1;
      t1 = t2;
    }
  }while(r2.toString() != "0");
  return t1.div(r1);
}

/**
 * Returns a secure random integer between min (inclusive) and max 
 * (inclusive) using crypto object (uniform distribution). If it is not 
 * available, uses Math.random (non-uniform distribution)
 */
function getRandomInt(min, max) {
  // Error check not needed in this algorithm
  var n_bytes,
      randomInt,
      randomBytes,
      i;
  var diff = max - min + 1;
  if(diff<=256) //just to speed up code for small int
    n_bytes = 1;
  else
    n_bytes = Math.ceil(Math.log10(diff)/Math.log10(256)); //solves for any number of bytes
  var randomBytes = new Uint8Array(n_bytes);
  var crypto = self.crypto || self.msCrypto;
  if (crypto === undefined) { //crypto not available. Fallback to Math.random()
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  var max_permitted = Math.floor(Math.pow(256, n_bytes) / diff) * diff - 1;
  do{
    crypto.getRandomValues(randomBytes);
    for (i=0, randomInt=0; i<randomBytes.length; i++) {
      randomInt += randomBytes[i] * Math.pow(256, i);
    }
  }while(randomInt >= max_permitted);
  return (randomInt % diff) + min;
}

/**
 * Converts a hexadecimal string to a byte (int) array.
 * Eg. "12a0ff" => [0x12, 0xa0, 0xff]
 * Based on: http://stackoverflow.com/a/10121740
 */
function hexStr2byteArray(str) {
  var a = [];
  for(var i = 0; i < str.length; i += 2) {
    a.push(parseInt("0x" + str.substr(i, 2),16));
  }
  return a;
}
