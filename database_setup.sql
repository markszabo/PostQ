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
 
-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 14, 2016 at 11:40 AM
-- Server version: 5.7.16-0ubuntu0.16.04.1
-- PHP Version: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `postq`
--
CREATE DATABASE IF NOT EXISTS `postq` DEFAULT CHARACTER SET latin2 COLLATE latin2_hungarian_ci;
USE `postq`;

-- --------------------------------------------------------

--
-- Table structure for table `friendrequests`
--

DROP TABLE IF EXISTS `friendrequests`;
CREATE TABLE `friendrequests` (
  `id` int(11) NOT NULL,
  `useridTO` int(11) NOT NULL,
  `useridFROM` int(11) NOT NULL,
  `usernameFROM` varchar(80) COLLATE latin2_hungarian_ci NOT NULL,
  `rejected` bit NOT NULL DEFAULT 0,
  `symkey` text COLLATE latin2_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  `messages` text COLLATE latin2_hungarian_ci NOT NULL,
  `nonce` binary(16) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

-- --------------------------------------------------------
--
-- Table structure for table `symkeyrequests`
--

DROP TABLE IF EXISTS `symkeyrequests`;
CREATE TABLE `symkeyrequests` (
  `id` int(11) NOT NULL,
  `useridTO` int(11) NOT NULL,
  `useridFROM` int(11) NOT NULL,
  `usernameFROM` varchar(80) COLLATE latin2_hungarian_ci NOT NULL,
  `symkey` text COLLATE latin2_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `symkeys`
--

DROP TABLE IF EXISTS `symkeys`;
CREATE TABLE `symkeys` (
  `id` int(11) NOT NULL,
  `user1` int(11) NOT NULL,
  `user2` int(11) NOT NULL,
  `symkey` text COLLATE latin2_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` text COLLATE latin2_hungarian_ci NOT NULL,
  `password` varchar(65) COLLATE latin2_hungarian_ci NOT NULL,
  `privatekey` text COLLATE latin2_hungarian_ci NOT NULL,
  `publickey` text COLLATE latin2_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

--
-- Table structure for table `unverified_users`
--

DROP TABLE IF EXISTS `unverified_users`;
CREATE TABLE `unverified_users` (
  `username` varchar(80) COLLATE latin2_hungarian_ci NOT NULL,
  `password` varchar(65) COLLATE latin2_hungarian_ci NOT NULL,
  `privatekey` text COLLATE latin2_hungarian_ci NOT NULL,
  `publickey` text COLLATE latin2_hungarian_ci NOT NULL,
  `registrationcode` varchar(65) COLLATE latin2_hungarian_ci NOT NULL,
  `expires` timestamp NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin2 COLLATE=latin2_hungarian_ci;

--
-- Indexes for table `friendrequests`
--
ALTER TABLE `friendrequests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `symkeyrequests`
--
ALTER TABLE `symkeyrequests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `symkeys`
--
ALTER TABLE `symkeys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `unverified_users`
--
ALTER TABLE `unverified_users`
  ADD PRIMARY KEY (`registrationcode`);

--
-- AUTO_INCREMENT for table `friendrequests`
--
ALTER TABLE `friendrequests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `symkeyrequests`
--
ALTER TABLE `symkeyrequests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `symkeys`
--
ALTER TABLE `symkeys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
