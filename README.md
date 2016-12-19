# PostQ

TODO: 
* add the ELTE comment
* write proper documentation
* refactor
* remove the test usernames & password

This repository contains the code of PostQ: a web-based messenger application with end-to-end post-quantum encryption. This was created as a homework for the Applied Cryptography Project Seminar class at [ELTE](http://elte.hu/), Hungary by [Anna Dorottya Simon](https://github.com/annadorottya) and [Márk Szabó](https://github.com/markszabo/).

![Login](https://github.com/markszabo/postq/raw/master/img/login.png "Login")

This is a fully web-based messenger application written in JavaScript (Jquery) and php. For the interface we have used Bootstrap and on the backend the data is stored in a MySQL database. 

![Chat](https://github.com/markszabo/postq/raw/master/img/chat.png "Chat")

## Attack model

Our attack model is a powerful but passive attacker (eg. secret service in a democracy). The attacker can read every entry in the database and has access to the entire codebase, but can not change the code (no web-base solution can protect against those attackers).

## The protocol

Upon registration every user enters a username and a password. The password is hashed on the client side with [scrypt](https://en.wikipedia.org/wiki/Scrypt) to produce a 256 bit hash. Since this is a webbased application, no information can be stored permanently on the client side. Instead everything will be sent to the server in encrypted form. The first half of the password hash will be used for this encryption (and thus never sent to the server), the second half will be used as authentication and sent to the server.

## External libraries
* [jquery.scrollTo](https://github.com/flesler/jquery.scrollTo) to scroll down nicely for new messages	
* [scrypt-js](https://github.com/ricmoo/scrypt-js) for client side scrypt
* [aes-js](https://github.com/ricmoo/aes-js) for client side AES
* [secure-random](https://github.com/jprichardson/secure-random) secure random number generator for javascript
* [jquery-csv](https://github.com/evanplaice/jquery-csv) to parse CSV
* [Polynomial.js](https://github.com/infusion/Polynomial.js/) to handle polynomials for NTRU - slightly modified to extend from the field Zp to the truncated polynomial ring Zp/f
* [js-sha512](https://github.com/emn178/js-sha512) SHA-512 hash library
