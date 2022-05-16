const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    // TODO: Add MySQL password here
    password: 'P@ssw0rd123',
    database: 'ems_db'
  },
  console.log(`Connected to the ems_db database.`)
);

const actionMenu = async () => {
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
}

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
    console.table(await dbInfo.employee.get());
    actionMenu();
  };

  if (action === 'Add Employee') {
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
        name: 'mngr_id',
        message: 'Please enter the manager ID of the employee you would like to add.'
      },
      {
        type: 'input',
        name: 'role_id',
        message: 'Please enter the role ID of the employee you would like to add.'
      },
    ]);
     
    const { first_name, last_name, mngr_id, role_id } = response;
    dbInfo.employee.add(first_name, last_name, mngr_id, role_id);
    actionMenu();
  }

  if (action === 'Update Employee Role') {
    console.table(await dbInfo.employee.get());
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
    ]);

    const { id, role_id } = response;
    dbInfo.employee.update(id, role_id);
    actionMenu();
  }

  // Role Prompts
  if (action === 'View All Roles') {
    console.table(await dbInfo.role.get());
    actionMenu();
  };

  if (action === 'Add Role') {
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
    ]);
     
    const { title, salary, dept_id } = response;
    dbInfo.role.add(title, salary, dept_id);
    actionMenu();
  }

  // Department Prompts
  if (action === 'View All Departments') {
    console.table(await dbInfo.department.get());
    actionMenu();
  };

  if (action === 'Add Department') {
    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'dept_name',
        message: 'Please enter the name of the department you would like to add.'
      }
    ]);
     
    const { dept_name } = response;
    dbInfo.department.add(dept_name);
    actionMenu();
  }
}

promptUser();


//Borrowed from unit 12 mini-project

// Create a movie
app.post('/api/new-movie', ({ body }, res) => {
  const sql = `INSERT INTO movies (movie_name)
    VALUES (?)`;
  const params = [body.movie_name];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

// Read all movies
app.get('/api/movies', (req, res) => {
  const sql = `SELECT id, movie_name AS title FROM movies`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
       return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a movie
app.delete('/api/movie/:id', (req, res) => {
  const sql = `DELETE FROM movies WHERE id = ?`;
  const params = [req.params.id];
  
  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
      message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Read list of all reviews and associated movie name using LEFT JOIN
app.get('/api/movie-reviews', (req, res) => {
  const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// BONUS: Update review name
app.put('/api/review/:id', (req, res) => {
  const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
  const params = [req.body.review, req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Movie not found'
      });
    } else {
      res.json({
        message: 'success',
        data: req.body,
        changes: result.affectedRows
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
