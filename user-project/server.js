const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const userSchema = require('./validation/userValidation');

dotenv.config();

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create a new user
app.post('/users', async (req, res) => {
    try {
        let result;
        const { error } = userSchema.validate(req.body);
        if (error?.message) {
            result = {
                message: error.message,
            }
            return res.status(500).json(result);
        }
        const { name, email, age } = req.body;

        //check for email already exist
        // const user = await db.query('SELECT id FROM users WHERE email LIKE ?', {
        //     replacements: [email],
        //     type: db.QueryTypes.SELECT,
        // });
        // console.log(user)
        // if (user?.length) {
        //     return res.status(500).json({ message: 'email already exists' });
        // }

        //insert into table if all validation completed
        db.query(
            'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
            [name, email, age],
            (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send('Error inserting user');
                }
                res.status(201).send(`User created with ID: ${result.insertId}`);
            }
        );
    } catch (err) {
        console.error('Validation error:', err);
        res.status(500).send('Internal server error');
    }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
