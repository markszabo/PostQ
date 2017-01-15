###TODO: 
* finish the documentation
* refactor (?)
* remove the test usernames & password

# PostQ

This repository contains the code of PostQ: a web-based messenger application with end-to-end post-quantum encryption. This was created as a homework for the Applied Cryptography Project Seminar class at [ELTE](http://elte.hu/), Hungary by [Anna Dorottya Simon](https://github.com/annadorottya) and [Márk Szabó](https://github.com/markszabo/).

![Login](https://github.com/markszabo/postq/raw/master/img/login.png "Login")

This is a fully web-based messenger application written in JavaScript (Jquery) and php. For the interface we have used Bootstrap and on the backend the data is stored in a MySQL database. 

![Chat](https://github.com/markszabo/postq/raw/master/img/chat.png "Chat")

## Installation

A webserver with php and an SQL server is needed to run PostQ.

1. Download the code from [here](https://github.com/markszabo/PostQ/archive/master.zip) (or clone the git repository).
2. Fill in `sqlconfig.php_example` with the database properties.
3. Rename `sqlconfig.php_example` to `sqlconfig.php`.
4. Open `/install.php` in browser. This will create the necessary database tables.
5. Open `index.html` and use the application.

## Attack model

Our attack model is a powerful but passive attacker (eg. secret service in a democracy). The attacker can read every entry in the database and has access to the entire codebase, but cannot change the code (no web-base solution can protect against those attackers).

## The protocol

Upon registration every user enters a username and a password. The password is hashed on the client side with [scrypt](https://en.wikipedia.org/wiki/Scrypt) to produce a 256 bit hash. Since this is a webbased application, no information can be stored permanently on the client side. Instead everything will be sent to the server in encrypted form. The first half of the password hash will be used for this encryption (and thus never sent to the server), the second half will be used as authentication and sent to the server. To prevent pass-the-hash attacks this authentication key is hashed again on the server side and only the hash of it is stored.

During registration the client will also generate its public and private key for the public key cryptography (NTRU) used to exchange session keys. The public key is sent to the server, while the private key is first encrypted with the encryption key and then sent to the server.

![Registration](https://github.com/markszabo/postq/raw/master/img/fg_registration.png "Registration")

Login works similarly: user enters the username and the password, password is hashed, the hash is splitted into two halves: encryption key and authentication key. The username and the authentication key are sent to the server, checked and the encrypted private key is returned. The client decrypts it with the encryption key.

![Login](https://github.com/markszabo/postq/raw/master/img/fg_login.png "Login")

As in most applications public key cryptography is only used to established a shared key, and then that key is used for communication with symmetric encryption. This happens when someone adds a new friend: a shared key is generated, encrypted with the other's public key, and sent to the server. Since nothing is stored on the client side, the shared key is also encrypted with the user's encryption key, and sent to the server.

![Add friend](https://github.com/markszabo/postq/raw/master/img/fg_add_friend.png "Add friend")

When the other user accepts the friend request, he will decrypt the shared key with his private key, then encrypt it with his encryption key and send it to the server.

![Accept friend request](https://github.com/markszabo/postq/raw/master/img/fg_accept.png "Accept friend request")

To send messages a user will request the encrypted shared key, decrypt it with his encryption key and then use the shared key to encrypt messages to send, and decrypt messages he received.

![Chat](https://github.com/markszabo/postq/raw/master/img/fg_chat.png "Chat")

## Details

Counter in messages to prevent replay

### The post-quantum algorithms

#### AES for symmetric key

#### NTRU Prime for public key

## Future development

The following features could be implemented in the future:
* Generate new shared secrets after some time / given number of messages
* Implement session management with cookies to be able to stay logged in
* Change the GET requests to POST - to prevent sensitive data appearing in logs
* Implement 'Forgot my password' functionality and e-mail verification
* Mix NTRU with a pre-quantum algorithm (eg. ECDH, RSA) to provide secrecy even in case NTRU turns out to be insecure

## External libraries

The following external libraries were used in the project. All but the Polynomial.js are unchanged and simply downloaded to the `external` directory. Polynomial.js was extended from the field Zp to the truncated polynomial ring Zp/f and thus placed in the root directory of the project.
* [jquery.scrollTo](https://github.com/flesler/jquery.scrollTo) to scroll down nicely for new messages	
* [scrypt-js](https://github.com/ricmoo/scrypt-js) for client side scrypt hash generation
* [aes-js](https://github.com/ricmoo/aes-js) for client side AES encryption
* [secure-random](https://github.com/jprichardson/secure-random) for secure random number generation
* [jquery-csv](https://github.com/evanplaice/jquery-csv) to parse CSV
* [Polynomial.js](https://github.com/infusion/Polynomial.js/) to handle polynomials for NTRU - slightly modified to extend from the field Zp to the truncated polynomial ring Zp/f
* [js-sha512](https://github.com/emn178/js-sha512) for SHA-512 hash generation
