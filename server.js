// Requirements
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


// Prompt User Function (main)
const promptUser = async () => {
  const response = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
      ]
    }
  ]);

  const { action } = response;
  
  // Employee Prompts
  if (action === 'View All Employees') {
    viewEmployees();
  };

  if (action === 'Add Employee') {
    addEmployee();
  };

  if (action === 'Update Employee Role') {
   updateEmployee();
  }

  // Role Prompts
  if (action === 'View All Roles') {
    viewRoles();
  };

  if (action === 'Add Role') {
    addRole();
  }

  // Department Prompts
  if (action === 'View All Departments') {
    viewDepts();
  };

  if (action === 'Add Department') {
    addDept();
  }

  if (action === 'Quit') {
    quitDB();
  }
}

// View All Functions
function viewEmployees() {
    const sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.dept_name AS department, role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON employee.mngr_id = manager.id';
    
    connection.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    })
}

function viewRoles () {
    const sql = 'SELECT role.id, role.title, department.dept_name AS department, role.salary FROM role INNER JOIN department ON role.dept_id = department.id';

    connection.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    })
}

function viewDepts() {
    const sql = 'SELECT id, dept_name FROM department';

    connection.query(sql, (err, rows) => {
      if (err) throw err;
      console.table(rows);
      promptUser();
    })
}

// Add New Functions
async function addEmployee() {
  const response = await inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'Please enter the first name of the employee you would like to add.'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'Please enter the last name of the employee you would like to add.'
        },
        {
          type: 'input',
          name: 'role_id',
          message: 'Please enter the role ID for the employee you would like to add.'
        },
        {
          type: 'input',
          name: 'mngr_id',
          message: 'Please enter the manager ID for the employee you would like to add.'
        }
    ])
       
    const sql = 'INSERT INTO employee (first_name, last_name, mngr_id, role_id) VALUES (?, ?, ?, ?)';

    connection.query(sql, [response.first_name, response.last_name, response.mngr_id, response.role_id], (err, responses) => {
      if (err) throw err;
      console.log('New employee successfully added!');
      viewEmployees();
    })
}

async function addRole() {
  const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Please enter the title of the role you would like to add.'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter the salary of the role you would like to add.'
      },
      {
        type: 'input',
        name: 'dept_id',
        message: 'Please enter the department ID of the role you would like to add.'
      }
    ])
       
    const sql = 'INSERT INTO role (title, salary, dept_id) VALUES (?, ?, ?)';

    connection.query(sql, [response.title, response.salary, response.dept_id], (err, responses) => {
      if (err) throw err;
      console.log('New role successfully added!');
      viewRoles();
    })
}

async function addDept() {
  const response = await inquirer.prompt([
    {
      type: 'input',
      name: 'dept_name',
      message: 'Please enter the name of the department you would like to add.'
    }
  ])

  const sql = 'INSERT INTO department (dept_name) VALUES (?)';
  connection.query(sql, response.dept_name, (err, responses) => {
    if (err) throw err;
    console.log('New department successfully added!');
    viewDepts();
  })
}

// Update Existing Function
async function updateEmployee() {
  const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Please enter the employee ID for the employee you would like to update.'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Please enter the new role ID for the designated employee.'
      }
    ])
       
    const sql = 'SELECT employee.id INSERT INTO employee (role_id) VALUES (?)';

    connection.query(sql, [response.role_id], (err, response) => {
      if (err) throw err;
      console.log('Employee successfully updated!');
      viewEmployees();
    })
}

// Exit Function
function quitDB() {
  connection.end();
  console.log("Goodbye!")
}

promptUser();

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // TODO: Add MySQL password here
    password: '',
    database: 'ems_db'
  },
  console.log(`Connected to the ems_db database.`)
);

