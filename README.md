# PostQ

TODO: 
* validate for empty inputs
* add install script to create sql tables (phpmyadmin export)
* store polynomials in database more effectively
* add id to messages to prevent replay attack

* add the ELTE comment
* write proper documentation
* look for TODOs in the code
* refactor

## External libraries
* [jquery.scrollTo](https://github.com/flesler/jquery.scrollTo) to scroll down nicely for new messages	
* [scrypt-js](https://github.com/ricmoo/scrypt-js) for client side scrypt
* [aes-js](https://github.com/ricmoo/aes-js) for client side AES
* [secure-random](https://github.com/jprichardson/secure-random) secure random number generator for javascript
* [jquery-csv](https://github.com/evanplaice/jquery-csv) to parse CSV
* [Polynomial.js](https://github.com/infusion/Polynomial.js/) to handle polynomials for NTRU - slightly modified to extend from the field Zp to the truncated polynomial ring Zp/f
* [js-sha512](https://github.com/emn178/js-sha512) SHA-512 hash library
