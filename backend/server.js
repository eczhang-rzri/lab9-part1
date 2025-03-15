const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 5000;

// Enable CORS / Express
app.use(cors());
app.use(express.json());

// Database connection
const sequelize = new Sequelize('mydb', 'admin', 'Timndbpw10!', {
    host: 'database-1.cnqe00p5d1ax.us-east-1.rds.amazonaws.com',
    dialect: 'mysql'
});

// Define model for puppy table
const Puppy = sequelize.define('puppy', {
    pet_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    breed: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    age_est: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    current_kennel_number: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'puppy',
    timestamps: false
});

// GET all puppies
app.get('/puppies', async (req, res) => {
    try {
        const puppies = await Puppy.findAll();
        res.write(JSON.stringify(puppies, null, 4));
        res.end();
    } catch (error) {
        console.error('Error fetching puppies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//GET puppy by id
app.get('/puppy/:id', async (req, res) => {
    try {
        const puppy = await Puppy.findByPk(req.params.id);
        if (puppy) {
            res.json(puppy);
        } else {
            res.status(404).json({ error: 'Puppy not found' });
        }
    } catch (error) {
        console.error('Error fetching puppy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//PUT update puppy by id
app.put('/puppy/:id', async (req, res) => {
    try {
        const puppy = await Puppy.findByPk(req.params.id);
        if (puppy) {
            await puppy.update(req.body);
            res.json(puppy);
        } else {
            res.status(404).json({ error: 'Puppy not found' });
        }
    } catch (error) {
        console.error('Error updating puppy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//POST create puppy
app.post('/puppy', async (req, res) => {
    try {
        const puppy = await Puppy.create(req.body);
        res.status(201).json(puppy);
    } catch (error) {
        console.error('Error creating puppy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//DELETE puppy by id
app.delete('/puppy/:id', async (req, res) => {
    try {
        const puppy = await Puppy.findByPk(req.params.id);
        if (puppy) {
            await puppy.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Puppy not found' });
        }
    } catch (error) {
        console.error('Error deleting puppy:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});