-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 17, 2025 at 12:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `staffscroll`
--

-- --------------------------------------------------------

--
-- Table structure for table `staff_schedule`
--

CREATE TABLE `staff_schedule` (
  `id` int(11) NOT NULL,
  `staff_name` varchar(100) NOT NULL,
  `work_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_schedule`
--

INSERT INTO `staff_schedule` (`id`, `staff_name`, `work_date`) VALUES
(1, 'Alice', '2025-06-15'),
(2, 'Bob', '2025-06-15'),
(3, 'Charlie', '2025-06-15'),
(4, 'David', '2025-06-16'),
(5, 'Eve', '2025-06-16'),
(6, 'Frank', '2025-06-17'),
(7, 'Grace', '2025-06-17'),
(8, 'Heidi', '2025-06-17'),
(9, 'Ivan', '2025-06-18'),
(10, 'Judy', '2025-06-19'),
(11, 'Ken', '2025-06-19'),
(12, 'Laura', '2025-06-20');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_company`
--

CREATE TABLE `tbl_company` (
  `userId` int(11) NOT NULL,
  `fullname` varchar(500) DEFAULT NULL,
  `company_name` varchar(500) DEFAULT NULL,
  `licence` varchar(500) DEFAULT NULL,
  `licence_status` varchar(500) NOT NULL,
  `company_email` varchar(500) DEFAULT NULL,
  `company_domain` varchar(500) DEFAULT NULL,
  `authorization` varchar(500) DEFAULT NULL,
  `version` varchar(500) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `btn_status` varchar(500) NOT NULL,
  `uzi8n` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_company`
--

INSERT INTO `tbl_company` (`userId`, `fullname`, `company_name`, `licence`, `licence_status`, `company_email`, `company_domain`, `authorization`, `version`, `slug`, `btn_status`, `uzi8n`, `created_at`) VALUES
(1, 'Samson Gift', 'Ese Sphere', 'LICENCE-ExB177-684591c77faba-CD31E16E', 'Trial', 'osaretin4samson@gmail.com', 'esesphere.com', '2025-06-08', 'Starter', 'https://buy.stripe.com/bJe5kC2Wz5KReEoc5OaVa02', 'Buy licence', 'SSvT43-GYN208-6844c81f2adfc-3439CAE6', '2025-06-08 15:05:02'),
(2, 'Samson Gift', 'Ese Sphere', 'LICENCE-ExB177-684591c77faba-CD31E16E', 'Trial', 'osaretin4samson@gmail.com', 'localhost', '2025-12-22', 'Pro', 'https://buy.stripe.com/bJe5kC2Wz5KReEoc5OaVa02', 'Buy licence', 'SSvT43-GYN208-6844c81f2adfc-3439CAE6', '2025-06-10 14:47:02');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_events`
--

CREATE TABLE `tbl_events` (
  `userId` int(11) NOT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `run_name` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `care_calls` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `event_date` varchar(500) DEFAULT NULL,
  `start_time` varchar(500) DEFAULT NULL,
  `end_time` varchar(500) DEFAULT NULL,
  `timeline_color` varchar(20) DEFAULT NULL,
  `uniqueId` varchar(100) DEFAULT NULL,
  `staff_uniqueId` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_events`
--

INSERT INTO `tbl_events` (`userId`, `client_name`, `run_name`, `city`, `care_calls`, `status`, `event_date`, `start_time`, `end_time`, `timeline_color`, `uniqueId`, `staff_uniqueId`, `created_at`) VALUES
(1, 'Client B', 'Wolverhampton double run', 'Wolverhampton', 'morning', 'Completed', '2025-06-11', '06:00', '06:45', '#130f40', 'EVT001', 'UID001', '2025-06-11 12:03:47'),
(2, 'Client C', 'Wolverhampton double run', 'Wolverhampton', 'morning', 'Scheduled', '2025-06-11', '07:00', '07:15', '#130f40', 'EVT002', 'UID001', '2025-06-11 12:03:47'),
(3, 'Client D', 'Wolverhampton double run', 'Wolverhampton', 'lunch', 'Completed', '2025-06-11', '07:30', '08:30', '#130f40', 'EVT003', 'UID001', '2025-06-11 12:03:47'),
(4, 'Client E', 'Wolverhampton double run', 'Wolverhampton', 'lunch', 'Completed', '2025-06-11', '09:00', '10:00', '#130f40', 'EVT004', 'UID001', '2025-06-11 12:03:47'),
(5, 'Client F', 'Wolverhampton double run', 'Wolverhampton', 'tea', 'Scheduled', '2025-06-11', '10:30', '11:00', '#130f40', 'EVT005', 'UID001', '2025-06-11 12:03:47'),
(6, 'Client G', 'Wolverhampton double run', 'Wolverhampton', 'tea', 'Scheduled', '2025-06-11', '12:00', '12:30', '#130f40', 'EVT006', 'UID001', '2025-06-11 12:03:47'),
(7, 'Client H', 'Wolverhampton double run', 'Wolverhampton', 'bed', 'Scheduled', '2025-06-11', '11:56', '12:56', '#130f40', 'EVT007', 'UID002', '2025-06-11 12:03:47'),
(8, 'Client I', 'Wolverhampton double run', 'Wolverhampton', 'bed', 'Scheduled', '2025-06-11', '14:00', '15:00', '#130f40', 'EVT008', 'UID001', '2025-06-11 12:03:47'),
(9, 'Client J', 'Birmingham double run', 'Birmingham', 'morning', 'Scheduled', '2025-06-11', '16:00', '17:30', '#130f40', 'EVT009', 'UID001', '2025-06-11 12:03:47'),
(10, 'Client K', 'Birmingham double run', 'Birmingham', 'morning', 'Scheduled', '2025-06-11', '18:00', '19:30', '#130f40', 'EVT010', 'UID001', '2025-06-11 12:03:47'),
(11, 'Client L', 'Birmingham double run', 'Birmingham', 'lunch', 'Scheduled', '2025-06-11', '20:00', '20:30', '#130f40', 'EVT011', 'UID001', '2025-06-11 12:03:47'),
(12, 'Client M', 'Birmingham double run', 'Birmingham', 'lunch', 'Scheduled', '2025-06-11', '20:45', '21:00', '#130f40', 'EVT012', 'UID001', '2025-06-11 12:03:47'),
(13, 'Client N', 'Birmingham double run', 'Birmingham', 'tea', 'Scheduled', '2025-06-11', '21:00', '21:30', '#192a56', 'EVT013', 'UID001', '2025-06-11 12:03:47'),
(14, 'Client O', 'Birmingham double run', 'Birmingham', 'tea', 'Scheduled', '2025-06-11', '18:00', '18:30', '#192a56', 'EVT014', 'UID001', '2025-06-11 12:03:47'),
(15, 'Client P', 'Birmingham double run', 'Birmingham', 'bed', 'Scheduled', '2025-06-11', '22:00', '22:30', '#192a56', 'EVT015', 'UID001', '2025-06-11 12:03:47'),
(16, 'Client Q', 'Birmingham double run', 'Birmingham', 'bed', 'Scheduled', '2025-06-11', '22:30', '23:00', '#33FF57', 'EVT016', 'UID001', '2025-06-11 12:03:47'),
(17, 'Client R', 'Coventry double run', 'Coventry', 'morning', 'Completed', '2025-06-11', '06:10', '12:00', '#3357FF', 'EVT017', 'UID003', '2025-06-11 12:03:47'),
(23, 'Client X', 'Coventry double run', 'Coventry', 'Tea', 'Scheduled', '2025-06-11', '12:30', '16:00', '#3357FF', 'EVT023', 'UID003', '2025-06-11 12:03:47'),
(24, 'Client Y', 'Coventry double run', 'Coventry', 'bed', 'Scheduled', '2025-06-11', '18:00', '21:00', '#3357FF', 'EVT024', 'UID003', '2025-06-11 12:03:47'),
(25, 'Client Z', 'Dudley one merge both male and female', 'Dudley', 'morning', 'Completed', '2025-06-11', '06:05:00', '07:05:00', '#FF33A6', 'EVT025', 'UID004', '2025-06-11 12:03:47'),
(26, 'Client A', 'Dudley one merge both male and female', 'Dudley', 'morning', 'Scheduled', '2025-06-11', '07:20:00', '08:20:00', '#FF33A6', 'EVT026', 'UID004', '2025-06-11 12:03:47'),
(27, 'Client B', 'Dudley one merge both male and female', 'Dudley', 'lunch', 'Scheduled', '2025-06-11', '12:10:00', '13:10:00', '#FF33A6', 'EVT027', 'UID004', '2025-06-11 12:03:47'),
(28, 'Client C', 'Dudley one merge both male and female', 'Dudley', 'lunch', 'Scheduled', '2025-06-11', '13:25:00', '14:25:00', '#FF33A6', 'EVT028', 'UID004', '2025-06-11 12:03:47'),
(29, 'Client D', 'Dudley one merge both male and female', 'Dudley', 'tea', 'Scheduled', '2025-06-11', '15:40:00', '16:40:00', '#FF33A6', 'EVT029', 'UID004', '2025-06-11 12:03:47'),
(30, 'Client E', 'Dudley one merge both male and female', 'Dudley', 'tea', 'Scheduled', '2025-06-11', '16:55:00', '17:55:00', '#FF33A6', 'EVT030', 'UID004', '2025-06-11 12:03:47'),
(31, 'Client F', 'Dudley one merge both male and female', 'Dudley', 'bed', 'Scheduled', '2025-06-11', '21:40:00', '22:40:00', '#FF33A6', 'EVT031', 'UID004', '2025-06-11 12:03:47'),
(32, 'Client G', 'Dudley one merge both male and female', 'Dudley', 'bed', 'Scheduled', '2025-06-11', '22:55:00', '23:55:00', '#FF33A6', 'EVT032', 'UID004', '2025-06-11 12:03:47'),
(33, 'Client H', 'Sandwell Female Run', 'Sandwell', 'morning', 'Scheduled', '2025-06-11', '06:20:00', '07:20:00', '#FFC300', 'EVT033', 'UID005', '2025-06-11 12:03:47'),
(34, 'Client I', 'Sandwell Female Run', 'Sandwell', 'morning', 'Scheduled', '2025-06-11', '07:35:00', '08:35:00', '#FFC300', 'EVT034', 'UID005', '2025-06-11 12:03:47'),
(35, 'Client J', 'Sandwell Female Run', 'Sandwell', 'lunch', 'Scheduled', '2025-06-11', '12:20:00', '13:20:00', '#FFC300', 'EVT035', 'UID005', '2025-06-11 12:03:47'),
(36, 'Client K', 'Sandwell Female Run', 'Sandwell', 'lunch', 'Scheduled', '2025-06-11', '13:35:00', '14:35:00', '#FFC300', 'EVT036', 'UID005', '2025-06-11 12:03:47'),
(37, 'Client L', 'Sandwell Female Run', 'Sandwell', 'tea', 'Scheduled', '2025-06-11', '15:50:00', '16:50:00', '#FFC300', 'EVT037', 'UID005', '2025-06-11 12:03:47'),
(38, 'Client M', 'Sandwell Female Run', 'Sandwell', 'tea', 'Scheduled', '2025-06-11', '17:05:00', '18:05:00', '#FFC300', 'EVT038', 'UID005', '2025-06-11 12:03:47'),
(39, 'Client N', 'Sandwell Female Run', 'Sandwell', 'bed', 'Scheduled', '2025-06-11', '21:50:00', '22:50:00', '#FFC300', 'EVT039', 'UID005', '2025-06-11 12:03:47'),
(40, 'Client O', 'Sandwell Female Run', 'Sandwell', 'bed', 'Scheduled', '2025-06-11', '23:05', '23:35', '#FFC300', 'EVT040', 'UID005', '2025-06-11 12:03:47'),
(41, 'Client P', 'Solihull 2 double female run only', 'Solihull', 'morning', 'Scheduled', '2025-06-11', '06:40:00', '07:40:00', '#DAF7A6', 'EVT041', 'UID006', '2025-06-11 12:03:47'),
(42, 'Client Q', 'Solihull 2 double female run only', 'Solihull', 'morning', 'Scheduled', '2025-06-11', '07:55:00', '08:55:00', '#DAF7A6', 'EVT042', 'UID006', '2025-06-11 12:03:47'),
(43, 'Client R', 'Solihull 2 double female run only', 'Solihull', 'lunch', 'Scheduled', '2025-06-11', '12:40:00', '13:40:00', '#DAF7A6', 'EVT043', 'UID006', '2025-06-11 12:03:47'),
(44, 'Client S', 'Solihull 2 double female run only', 'Solihull', 'lunch', 'Scheduled', '2025-06-11', '13:55:00', '14:55:00', '#DAF7A6', 'EVT044', 'UID006', '2025-06-11 12:03:47'),
(45, 'Client T', 'Solihull 2 double female run only', 'Solihull', 'tea', 'Scheduled', '2025-06-11', '16:10:00', '17:10:00', '#DAF7A6', 'EVT045', 'UID006', '2025-06-11 12:03:47'),
(46, 'Client U', 'Solihull 2 double female run only', 'Solihull', 'tea', 'Scheduled', '2025-06-11', '17:25:00', '18:25:00', '#DAF7A6', 'EVT046', 'UID006', '2025-06-11 12:03:47'),
(47, 'Client V', 'Solihull 2 double female run only', 'Solihull', 'bed', 'Scheduled', '2025-06-11', '22:10:00', '23:10:00', '#DAF7A6', 'EVT047', 'UID006', '2025-06-11 12:03:47'),
(48, 'Client W', 'Solihull 2 double female run only', 'Solihull', 'bed', 'Scheduled', '2025-06-11', '23:00', '23:45', '#DAF7A6', 'EVT048', 'UID006', '2025-06-11 12:03:47'),
(49, 'Client X', 'Walsall 1 double female run only', 'Walsall', 'morning', 'Scheduled', '2025-06-11', '06:50:00', '07:50:00', '#FF5733', 'EVT049', 'UID007', '2025-06-11 12:03:47'),
(50, 'Client Y', 'Walsall 1 double female run only', 'Walsall', 'morning', 'Scheduled', '2025-06-11', '08:05:00', '09:05:00', '#FF5733', 'EVT050', 'UID007', '2025-06-11 12:03:47'),
(51, 'Client Z', 'Walsall 1 double female run only', 'Walsall', 'lunch', 'Scheduled', '2025-06-11', '12:50:00', '13:50:00', '#FF5733', 'EVT051', 'UID007', '2025-06-11 12:03:47'),
(52, 'Client A', 'Walsall 1 double female run only', 'Walsall', 'lunch', 'Scheduled', '2025-06-11', '14:05:00', '15:05:00', '#FF5733', 'EVT052', 'UID007', '2025-06-11 12:03:47'),
(53, 'Client B', 'Walsall 1 double female run only', 'Walsall', 'tea', 'Scheduled', '2025-06-11', '16:20:00', '17:20:00', '#FF5733', 'EVT053', 'UID007', '2025-06-11 12:03:47'),
(54, 'Client C', 'Walsall 1 double female run only', 'Walsall', 'tea', 'Scheduled', '2025-06-11', '17:35:00', '18:35:00', '#FF5733', 'EVT054', 'UID007', '2025-06-11 12:03:47'),
(55, 'Client D', 'Walsall 1 double female run only', 'Walsall', 'bed', 'Scheduled', '2025-06-11', '22:20:00', '23:20:00', '#FF5733', 'EVT055', 'UID007', '2025-06-11 12:03:47'),
(56, 'Client E', 'Walsall 1 double female run only', 'Walsall', 'bed', 'Scheduled', '2025-06-11', '23:00', '23:35', '#FF5733', 'EVT056', 'UID007', '2025-06-11 12:03:47'),
(57, 'Client F', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'morning', 'Scheduled', '2025-06-11', '06:00', '07:00', '#33FF57', 'EVT057', 'UID009', '2025-06-11 12:03:47'),
(58, 'Client G', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'morning', 'Scheduled', '2025-06-11', '07:00', '07:45', '#33FF57', 'EVT058', 'UID009', '2025-06-11 12:03:47'),
(59, 'Client H', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'lunch', 'Scheduled', '2025-06-11', '09:00', '13:00', '#33FF57', 'EVT059', 'UID009', '2025-06-11 12:03:47'),
(60, 'Client I', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'lunch', 'Scheduled', '2025-06-11', '13:02', '15:00', '#33FF57', 'EVT060', 'UID009', '2025-06-11 12:03:47'),
(61, 'Client J', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'tea', 'Scheduled', '2025-06-11', '16:30', '17:30', '#33FF57', 'EVT061', 'UID009', '2025-06-11 12:03:47'),
(62, 'Client K', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'tea', 'Scheduled', '2025-06-11', '17:45', '18:45', '#33FF57', 'EVT062', 'UID009', '2025-06-11 12:03:47'),
(63, 'Client L', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'bed', 'Scheduled', '2025-06-11', '20:22', '22:00', '#33FF57', 'EVT063', 'UID009', '2025-06-11 12:03:47'),
(64, 'Client M', 'Manchester 2, Double Female Run Only', 'Wolverhampton', 'bed', 'Scheduled', '2025-06-11', '22:00', '23:00', '#33FF57', 'EVT064', 'UID009', '2025-06-11 12:03:47'),
(66, 'Client bn', 'Single make run only', 'Wolverhampton', 'morning', 'Scheduled', '2025-06-11', '07:00', '21:00', '#33FF57', 'EVT065', 'UID010', '2025-06-11 12:03:47');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_staff`
--

CREATE TABLE `tbl_staff` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `group` varchar(50) DEFAULT NULL,
  `transportation` varchar(100) DEFAULT NULL,
  `timeline_colour` varchar(20) DEFAULT NULL,
  `uniqueId` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_staff`
--

INSERT INTO `tbl_staff` (`userId`, `firstName`, `lastName`, `group`, `transportation`, `timeline_colour`, `uniqueId`, `created_at`) VALUES
(1, 'Alice', 'Smith', 'Logistics', 'Car', '#FF5733', 'UID001', '2025-06-05 10:21:33'),
(2, 'Bob', 'Johnson', 'Support', 'Bike', '#33FF57', 'UID002', '2025-06-05 10:21:33'),
(3, 'Charlie', 'Brown', 'Operations', 'Public Transport', '#3357FF', 'UID003', '2025-06-05 10:21:33'),
(4, 'Diana', 'White', 'Logistics', 'Carpool', '#FF33A6', 'UID004', '2025-06-05 10:21:33'),
(5, 'Ethan', 'Miller', 'Maintenance', 'Scooter', '#FFC300', 'UID005', '2025-06-05 10:21:33'),
(6, 'Fiona', 'Davis', 'Admin', 'Car', '#DAF7A6', 'UID006', '2025-06-05 10:21:33'),
(7, 'George', 'Moore', 'IT', 'Bike', '#C70039', 'UID007', '2025-06-05 10:21:33'),
(8, 'Hannah', 'Wilson', 'Support', 'Walking', '#900C3F', 'UID008', '2025-06-05 10:21:33'),
(9, 'Ian', 'Taylor', 'Logistics', 'Car', '#581845', 'UID009', '2025-06-05 10:21:33'),
(10, 'Julia', 'Anderson', 'Operations', 'Public Transport', '#1ABC9C', 'UID010', '2025-06-05 10:21:33');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `userId` int(11) NOT NULL,
  `col_fullname` varchar(500) DEFAULT NULL,
  `col_email` varchar(500) DEFAULT NULL,
  `col_password` varchar(500) DEFAULT NULL,
  `company_name` varchar(500) DEFAULT NULL,
  `company_domain` varchar(500) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `country` varchar(500) DEFAULT NULL,
  `state` varchar(500) DEFAULT NULL,
  `city` varchar(500) DEFAULT NULL,
  `post_code` varchar(500) DEFAULT NULL,
  `specialId` varchar(500) DEFAULT NULL,
  `dateTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`userId`, `col_fullname`, `col_email`, `col_password`, `company_name`, `company_domain`, `address`, `country`, `state`, `city`, `post_code`, `specialId`, `dateTime`) VALUES
(1, 'Samson Gift', 'osaretin4samson@gmail.com', '$2y$10$pqVXAceyX14iT8vBcQ1VTOvpEctEGyXR8JptEQDkJ.LFe/Du2xiBa', 'Ese Sphere', 'esesphere.com', '1 Culwell Street', 'United Kingdom', 'West Midlands', 'Wolverhampton', 'WV10 0JT', 'SSvT43-GYN208-6844c81f2adfc-3439CAE6', '2025-06-08 00:02:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `staff_schedule`
--
ALTER TABLE `staff_schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_company`
--
ALTER TABLE `tbl_company`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `tbl_events`
--
ALTER TABLE `tbl_events`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `uniqueId` (`uniqueId`);

--
-- Indexes for table `tbl_staff`
--
ALTER TABLE `tbl_staff`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `uniqueId` (`uniqueId`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `staff_schedule`
--
ALTER TABLE `staff_schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_company`
--
ALTER TABLE `tbl_company`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_events`
--
ALTER TABLE `tbl_events`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `tbl_staff`
--
ALTER TABLE `tbl_staff`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
