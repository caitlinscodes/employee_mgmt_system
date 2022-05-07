INSERT INTO department (dept_name)
VALUES ("Accounting"),
       ("Administration"),
       ("Information Technology"),
       ("Operations"),
       ("Human Resources");

INSERT INTO role (dept_id, title, salary)
VALUES (1, "Sr. Accountant", "$80,000"),
       (2, "Executive Assistant", "$50,000"),
       (1, "Jr. Accountant", "$60,000"),
       (3, "Help Desk Associate", "$55,000"),
       (4, "Operations Analyst", "$45,000"),
       (1, "Accounts Payable", "$65,000"),
       (5, "HR Generalist", "$45,000");

INSERT INTO employee (role_id, first_name, last_name, mngr_id)
VALUES (1, "Michael", "Scott", null),
       (2, "Dwight", "Schrute", 1),
       (3, "Pam", "Beesly", 1),
       (4, "Jim", "Halpert", null),
       (5, "Ryan", "Howard", null),
       (1, "Angela", "Martin", 1),
       (5, "Toby", "Flenderson", null);
       
