DROP DATABASE IF EXISTS ems_db;
CREATE DATABASE ems_db;

USE ems_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_id INT,
    title VARCHAR(30),
    salary DECIMAL,
    FOREIGN KEY (dept_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    mngr_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role (id),
    FOREIGN KEY (mngr_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);
