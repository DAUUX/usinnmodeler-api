/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/ usinnmodeler /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE usinnmodeler;

DROP TABLE IF EXISTS diagram;
CREATE TABLE `diagram` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `user_id` int(11) NOT NULL COMMENT 'Owner Id',
  `name` varchar(255) NOT NULL COMMENT 'Diagram name',
  `diagram_data` mediumtext DEFAULT NULL COMMENT 'Diagram content',
  `created_at` datetime DEFAULT NULL COMMENT 'Create Time',
  `updated_at` datetime DEFAULT NULL COMMENT 'Update Time',
  PRIMARY KEY (`id`),
  KEY `FK_user_id` (`user_id`),
  CONSTRAINT `FK_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS user;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `company` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;