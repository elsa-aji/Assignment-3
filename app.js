// ==========================================
// Employee App Backend - app.js
// ==========================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ==========================================
// MongoDB Atlas Connection
// ==========================================
// TODO: Replace the placeholder below with your actual MongoDB Atlas connection string
const MONGO_URI = 'mongodb+srv://elsa10aji_db_user:elsa10@cluster0.vncfvrm.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
})
.catch((error) => {
    console.error('Database connection error:', error);
});

// ==========================================
// Employee Mongoose Schema & Model
// ==========================================
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// ==========================================
// REST API Endpoints
// ==========================================

// 1. GET API: Retrieve all employees
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
});

// 2. GET API: Retrieve a single employee by ID
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
    }
});

// 3. POST API: Add a new employee to the database
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, position, location, salary } = req.body;
        const newEmployee = new Employee({ name, position, location, salary });
        await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
    } catch (error) {
        res.status(400).json({ message: 'Failed to add employee', error: error.message });
    }
});

// 4. PUT API: Update employee information by ID
app.put('/api/employeelist/:id', async (req, res) => {
    try {
        const { name, position, location, salary } = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, position, location, salary },
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found for update' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update employee', error: error.message });
    }
});

// 5. DELETE API: Delete a single employee by ID
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found for deletion' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
});

// ==========================================
// Server Initialization
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running live on port ${PORT}`);
});