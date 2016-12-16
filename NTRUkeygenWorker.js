importScripts("ntru.js", "polynomial.js");

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

postMessage([privatekey, publickey]); //if done, send the keys back to main thread
