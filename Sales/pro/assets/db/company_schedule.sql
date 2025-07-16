-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2025 at 05:55 PM
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
-- Database: `company_schedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` varchar(50) NOT NULL,
  `staff_id` varchar(50) DEFAULT NULL,
  `start` varchar(500) DEFAULT NULL,
  `end` varchar(500) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `date` varchar(500) DEFAULT NULL,
  `run` varchar(500) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `staff_id`, `start`, `end`, `type`, `title`, `date`, `run`, `description`) VALUES
('event-1', 'staff-1', '01:00', '05:00', 'Meeting', 'Ops Planning', '2025-05-19', 'Wolverhampton', 'Planning session for upcoming quarter.'),
('event-10', 'staff-5', '11:00', '13:00', 'Meeting', 'Stakeholder Sync', '2025-05-19', 'Wolverhampton', 'Aligning with stakeholders.'),
('event-11', 'staff-6', '05:00', '09:00', 'Deployment', 'Release Deployment', '2025-05-19', 'Wolverhampton', 'Deploying new service updates.'),
('event-12', 'staff-6', '15:00', '17:00', 'Maintenance', 'System Maintenance', '2025-05-19', 'Wolverhampton', 'Scheduled server maintenance.'),
('event-13', 'staff-7', '03:00', '05:00', 'Campaign', 'Email Campaign', '2025-05-19', 'Wolverhampton', 'Preparing email marketing campaign.'),
('event-14', 'staff-7', '12:00', '14:00', 'Event', 'Product Launch', '2025-05-19', 'Wolverhampton', 'Marketing for product launch event.'),
('event-15', 'staff-8', '07:00', '10:00', 'Analysis', 'User Data Analysis', '2025-05-19', 'Wolverhampton', 'Analyzing user behavior metrics.'),
('event-16', 'staff-8', '18:00', '20:00', 'Reporting', 'Monthly Report', '2025-05-19', 'Wolverhampton', 'Compiling monthly performance report.'),
('event-20', 'staff-1', '10:00', '15:00', 'Training', 'Leadership Training', '2025-05-19', 'Wolverhampton', 'Online leadership development course.'),
('event-21', 'staff-1', '16:00', '18:00', 'Review', 'Quarterly Review', '2025-05-19', 'Walsall', 'Review of quarterly goals.'),
('event-22', 'staff-1', '19:00', '21:00', 'Meeting', 'Team Sync', '2025-05-19', 'Walsall', 'Daily team synchronization meeting.'),
('event-23', 'staff-2', '18:00', '20:00', 'Code Review', 'Review Pull Requests', '2025-05-19', 'Wolverhampton', 'Reviewing code changes from team.'),
('event-24', 'staff-2', '21:00', '23:00', 'Meeting', 'Sprint Retrospective', '2025-05-20', 'Stoke on trent', 'Sprint retrospective meeting.'),
('event-25', 'staff-3', '20:00', '22:00', 'Workshop', 'Creative Workshop', '2025-05-20', 'Stoke on trent', 'Team design thinking workshop.'),
('event-26', 'staff-3', '22:00', '24:00', 'Meeting', 'Client Presentation', '2025-05-20', 'Stoke on trent', 'Presenting design ideas to client.'),
('event-27', 'staff-4', '19:00', '21:00', 'Automation', 'Test Automation', '2025-05-20', 'Stoke on trent', 'Writing automated test scripts.'),
('event-28', 'staff-4', '21:00', '23:00', 'Review', 'QA Review', '2025-05-20', 'Stoke on trent', 'Review of test coverage and results.'),
('event-29', 'staff-5', '13:00', '15:00', 'Roadmap', 'Product Roadmap', '2025-05-20', 'Stoke on trent', 'Updating product roadmap.'),
('event-3', 'staff-2', '08:00', '09:00', 'Development', 'Feature Build', '2025-05-20', 'Stoke on trent', 'Working on new payment feature.'),
('event-30', 'staff-5', '15:00', '17:00', 'Review', 'Release Review', '2025-05-20', 'Stoke on trent', 'Reviewing release notes and feedback.'),
('event-31', 'staff-6', '17:00', '19:00', 'Monitoring', 'System Monitoring', '2025-05-20', 'Stoke on trent', 'Monitoring system health and logs.'),
('event-32', 'staff-6', '20:00', '22:00', 'Meeting', 'Incident Review', '2025-05-20', 'Stoke on trent', 'Post-incident review meeting.'),
('event-33', 'staff-7', '14:00', '16:00', 'Strategy', 'Marketing Strategy', '2025-05-20', 'Stoke on trent', 'Developing new marketing strategies.'),
('event-34', 'staff-3', '08:00', '10:00', 'Workshop', 'Agile Workshop', '2025-05-19', 'Wolverhampton', 'Workshop on agile methodologies.'),
('event-35', 'staff-4', '10:30', '12:00', 'Meeting', 'Product Sync', '2025-05-19', 'Wolverhampton', 'Synchronize product development goals.'),
('event-36', 'staff-5', '14:00', '16:00', 'Training', 'Security Training', '2025-05-19', 'Wolverhampton', 'Cybersecurity awareness training.'),
('event-37', 'staff-6', '17:00', '19:00', 'Maintenance', 'Database Maintenance', '2025-05-19', 'Wolverhampton', 'Routine database cleanup.'),
('event-38', 'staff-7', '20:00', '22:00', 'Review', 'Code Audit', '2025-05-19', 'Wolverhampton', 'Audit of legacy codebase.'),
('event-39', 'staff-8', '09:00', '11:00', 'Development', 'API Integration', '2025-05-20', 'Stoke on trent', 'Integrating new payment API.'),
('event-40', 'staff-1', '11:30', '13:00', 'Meeting', 'Budget Review', '2025-05-20', 'Stoke on trent', 'Reviewing Q2 budget allocations.'),
('event-41', 'staff-2', '13:30', '15:30', 'Training', 'DevOps Training', '2025-05-20', 'Stoke on trent', 'Training on CI/CD pipelines.'),
('event-42', 'staff-3', '16:00', '18:00', 'Workshop', 'UX Workshop', '2025-05-20', 'Stoke on trent', 'Improving user experience designs.'),
('event-43', 'staff-4', '18:30', '20:30', 'Meeting', 'Vendor Meeting', '2025-05-20', 'Stoke on trent', 'Negotiating with new vendors.');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `photoUrl` varchar(255) DEFAULT NULL,
  `color` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `name`, `role`, `department`, `photoUrl`, `color`) VALUES
('staff-1', 'Ava Martinez', 'Operations Manager', 'Operations', 'https://randomuser.me/api/portraits/women/68.jpg', '#3b82f6'),
('staff-10', 'Ethan Wright', 'Support Lead', 'Customer Support', 'https://randomuser.me/api/portraits/men/50.jpg', '#f97316'),
('staff-11', 'Charlotte Green', 'Content Writer', 'Marketing', 'https://randomuser.me/api/portraits/women/22.jpg', '#6366f1'),
('staff-12', 'Mason Scott', 'Security Analyst', 'Security', 'https://randomuser.me/api/portraits/men/29.jpg', '#14b8a6'),
('staff-13', 'Amelia Harris', 'UX Researcher', 'Product', 'https://randomuser.me/api/portraits/women/15.jpg', '#eab308'),
('staff-2', 'Liam Johnson', 'Developer', 'Engineering', 'https://randomuser.me/api/portraits/men/22.jpg', '#ef4444'),
('staff-3', 'Mia Chen', 'Designer', 'Product', 'https://randomuser.me/api/portraits/women/45.jpg', '#10b981'),
('staff-4', 'Noah Smith', 'QA Engineer', 'Quality Assurance', 'https://randomuser.me/api/portraits/men/34.jpg', '#8b5cf6'),
('staff-5', 'Emma Davis', 'Product Manager', 'Product', 'https://randomuser.me/api/portraits/women/55.jpg', '#f59e0b'),
('staff-6', 'Oliver Brown', 'DevOps Engineer', 'Engineering', 'https://randomuser.me/api/portraits/men/40.jpg', '#22c55e'),
('staff-7', 'Sophia Wilson', 'Marketing Specialist', 'Marketing', 'https://randomuser.me/api/portraits/women/70.jpg', '#ec4899'),
('staff-8', 'James Lee', 'Data Analyst', 'Data Science', 'https://randomuser.me/api/portraits/men/75.jpg', '#2563eb'),
('staff-9', 'Isabella King', 'HR Manager', 'Human Resources', 'https://randomuser.me/api/portraits/women/65.jpg', '#db2777');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
