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
