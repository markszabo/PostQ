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

function polyModInverse(poly, modulo) { //polyModInverse(new Polynomial("3+2x^2-3x^4+x^6"), new Polynomial("x^7-1"))
  //Do the Extended Euclidean Algorithm 
  //Based mostly on https://math.stackexchange.com/questions/124300/finding-inverse-of-polynomial-in-a-field
  var r0 = modulo.add("0");
  var r1 = poly.add("0");
  var t0 = new Polynomial("0");;
  var t1 = new Polynomial("1");
  var s0 = new Polynomial("1");
  var s1 = new Polynomial("0");
  var q, r2, s2, t2;
  do{ // r0 = q * r1 + r2
    console.log(r0.toString() + " divided by " + r1.toString());
    q = r0.div(r1);
    r2 = r0.sub(r1.mul(q));
    s2 = s0.sub(s1.mul(q));
    t2 = t0.sub(t1.mul(q));
    console.log(r0.toString() + " = " + q.toString() + " * " + r1.toString() + " + " + r2.toString());
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
