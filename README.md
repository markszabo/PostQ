# PostQ

This repository contains the code of PostQ: a web-based messenger application with end-to-end post-quantum encryption. This was created as a homework for the Applied Cryptography Project Seminar class at [ELTE](http://elte.hu/), Hungary by [Anna Dorottya Simon](https://github.com/annadorottya) and [Márk Szabó](https://github.com/markszabo/).

## Warning

The messaging protocol and the implementation was developed during a university course in 2016 by university students. Neither the protocol nor the implementation went through proper security testing, so using this in production is __highly__ discouraged. Also doing cryptography in JavaScript securely is very hard, and the libraries used here are not meant to be used for secure operations, very likely opening up the entire implementation to all sorts of attacks.

## Quick peak

![Login](https://github.com/markszabo/postq/raw/master/img/login.png "Login")

This is a fully web-based messenger application written in JavaScript (Jquery) and php. For the interface we have used Bootstrap and on the backend the data is stored in a MySQL database.

![Chat](https://github.com/markszabo/postq/raw/master/img/chat.png "Chat")

## Future development

The following features could be implemented in the future:
* Generate new shared secrets after some time / given number of messages
* Implement 'Forgot my password' functionality
* Mix NTRU with a pre-quantum algorithm (eg. ECDH, RSA) to provide secrecy even in case NTRU turns out to be insecure
* Dockerize the project to help new contributors
* Add end2end tests
* Setup some CI (e.g. [Travis](https://travis-ci.org/)) to run the tests on every PR 

Feel free to take any of them (or any other feature/bug fix) and send a PR.

## Installation

A webserver with php and an SQL server is needed to run PostQ.

1. Download the code from [here](https://github.com/markszabo/PostQ/archive/master.zip) (or clone the git repository).
2. Fill in `sqlconfig.php_example` with the database properties.
3. Rename `sqlconfig.php_example` to `sqlconfig.php`.
4. Open `/install.php` in browser. This will create the necessary database tables.
5. Open `index.html` and use the application.
6. E-mail verification can be enabled editing file `mail_config.php`. Remeber to configure PHP mail() function to be able to send e-mails from your server.

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

There is also a possibility for WebRTC based peer-to-peer audio+video calls. The signaling process is identical to the chat process, and uses the same backend with slightly modified messages. The video and audio is sent over DTLS+SRTP as per WebRTC standard.

## Details

Public key encryption (NTRUPrime) is used to exchange a shared secret and afterwards parties use that shared secret with symmetric encryption (AES) to encrypt messages. Given the deterministic nature of AES and to prevent replay attacks a counter is perpended to every message before encryption. This makes the encryption of similar messages (like 'Hello Bob' and 'Hello Bobek') different and since it's checked by the clients, it prevents replay attacks.

### The post-quantum algorithms

Our application is post-quantum, meaning that it is unbreakable even with quantum computers. It is important to start to change to post-quantum algorithms now, before the appearance of working quantum computers to prevent attacks that aim today's encrypted messages in the future.

There are certain quantum algorithms that can be used to break currently used cryptographical algorithms. The most important one is [Shor's algorithm](https://en.wikipedia.org/wiki/Shor's_algorithm), which can factorize numbers composed of two primes in polynomial time. Thus, it breaks RSA, Diffie-Hellman, and any other algorithm that relies on the factorization problem.

The other one is [Grover’s algorithm](https://en.wikipedia.org/wiki/Grover%27s_algorithm), which finds a black box's input in O(N^(1/2)). Effectively, it can be used to brute force keys in symmetric key cryptography algorithms, so it practically halves the security offered by the key length.

#### AES for symmetric key

As stated above, using quantum computers, the key length of symmetric crypography keys is halved, thus we need to use a key which is twice the length of what is considered secure in non-quantum cryptography. Other than that, AES is not broken even using quantum computers, so we decided to use AES for symmetric key cryptographic algorithm.

#### NTRU Prime for public key

RSA is not a post-quantum algorithm, so we had to find an other algorithm. Our first suggestion was the classic [NTRU](https://en.wikipedia.org/wiki/NTRU), which is a lattice-based public key cryptographic algorithm, developed in 1996, relying on the [Closest Vector Problem](https://en.wikipedia.org/wiki/Lattice_problem#Closest_vector_problem_.28CVP.29). However since NTRU uses rings which are not fields, there are some potential attacks against it. In May 2016, Daniel Bernstein, Tanja Lange et al released [NTRU Prime](https://ntruprime.cr.yp.to/ntruprime-20160511.pdf), which uses fields, eliminating these attacks. We decided to implement this latter version of NTRU.

## External libraries

The following external libraries were used in the project. All but the Polynomial.js are unchanged and simply downloaded to the `external` directory. Polynomial.js was extended from the field Zp to the truncated polynomial ring Zp/f and thus placed in the root directory of the project.
* [jquery.scrollTo](https://github.com/flesler/jquery.scrollTo) to scroll down nicely for new messages
* [scrypt-js](https://github.com/ricmoo/scrypt-js) for client side scrypt hash generation
* [aes-js](https://github.com/ricmoo/aes-js) for client side AES encryption
* [secure-random](https://github.com/jprichardson/secure-random) for secure random number generation
* [jquery-csv](https://github.com/evanplaice/jquery-csv) to parse CSV
* [Polynomial.js](https://github.com/infusion/Polynomial.js/) to handle polynomials for NTRU - slightly modified to extend from the field Zp to the truncated polynomial ring Zp/f
* [js-sha512](https://github.com/emn178/js-sha512) for SHA-512 hash generation
* [adapter-js](https://webrtc.github.io/adapter/adapter-latest.js) for WebRTC compatibility
