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
  console.log(rStr);
  Polynomial.setField(Rq);
  var hr = new Polynomial(hStr).mul(new Polynomial(rStr));
  Polynomial.setField("R");
  hr = centerPoly(hr,q);
  var c = roundToMultipleOf3(hr);
  
  var rhash = sha512(rStr);
  var keyConfirmation = rhash.substring(0,64);
  var sessionKey = rhash.substring(64);
  
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
  console.log(ebyg.toString());
  rStr = ebyg.toString();
  
  var rhash = sha512(rStr);
  var keyConfirmationCalc = rhash.substring(0,64);
  var sessionKey = rhash.substring(64);
  if(keyConfirmationCalc == keyConfirmation)
    return sessionKey;
  else {
    //console.log("Decryption error!");
    throw "Decryption error!";
    return "";
  }
}

function generateNTRUKeys(deckey) {
  var gg = genG();
  var gStr = gg[0];
  var gInvStr = gg[1];
  var fStr = genF();
  Polynomial.setField("Z"+q.toString());
  var inv3f = polyModInverse(new Polynomial(fStr).mul(new Polynomial("3")), new Polynomial(idealStr));
  Polynomial.setField(Rq);
  var h = new Polynomial(gStr).mul(inv3f);

  var publickey = h.toString();
  var privatekey = fStr + ";" + gInvStr;
  
  encryptedPrivatekey = AESencrypt(privatekey, deckey); //encrypt the privatekey
  return [encryptedPrivatekey, publickey];
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
    //console.log(r0.toString() + " divided by " + r1.toString());
    q = r0.div(r1);
    r2 = r0.sub(r1.mul(q));
    s2 = s0.sub(s1.mul(q));
    t2 = t0.sub(t1.mul(q));
    //console.log(r0.toString() + " = " + q.toString() + " * " + r1.toString() + " + " + r2.toString());
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
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 * Source: http://stackoverflow.com/a/1527820
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
