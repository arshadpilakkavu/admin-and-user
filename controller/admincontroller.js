
const session = require('express-session');
const { render } = require('../app')
const adminModel = require('../model/adminmodel')
const bcrypt = require("bcrypt");
const userModel = require('../model/usermodel');
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const id = new ObjectId();
const loadLogine = async (req, res) => {
    res.render('admin/login')
}

const login = async (req, res) => {
    try {
        const { name, password } = req.body


        const admin = await adminModel.findOne({ name })
        if (!admin) return res.render('admin/login', { msg: "invalid credentianls" })

        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) return res.render('admin/login', { msg: "invalid credentianls" })
        req.session.admin = true
        res.redirect('/dashboard')


    } catch (error) {
        res.send(error)
    }
}


const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin
        if (!admin) return res.redirect('/login');

        const users = await userModel.find({})
        res.render('admin/dashboard', { users })



    } catch (error) {

    }
}


const editUser = async (req, res) => {
    try {
        const { name, phone, email, id } = req.body;
        if (!name || !phone || !email) {
            return res.render('admin/dashboard', { msg: "All fields must be filled." });
        }

        // Validate the ObjectId
        if (!ObjectId.isValid(id)) {
            return res.render('admin/dashboard', { msg: "Invalid user ID" });
        }

        const updateData = { name, phone, email };
        const userId = new ObjectId(id);

        const user = await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return res.render('admin/dashboard', { msg: "User not found" });
        }

        const allUsers = await userModel.find({});
        res.render('admin/dashboard', { users: allUsers, msg: "User updated successfully!" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.render('admin/dashboard', { msg: "An error occurred while updating the user." });
    }
};




const deleteuser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ msg: "Invalid user ID." });
        }

        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ msg: "User not found." });
        }

        res.status(200).send({ msg: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ msg: "Internal server error." });
    }
};
const addUser = async (req, res) => {
    console.log(req.body);

    try {
        const { name, phone, email, password, id } = req.body;

        // Validate request body
        if (!name || !phone || !email || !password) {
            return res.status(400).send({ msg: "All fields are required." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = new userModel({
            name,
            phone,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        res.render('admin/dashboard')



    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ msg: "Internal server error." });
    }
};

const logoute = async (req, res) => {
    req.session.admin = null
    res.redirect('/login')
}

module.exports = {
    loadLogine,
    login,
    loadDashboard,
    editUser,
    deleteuser,
    addUser,
    logoute

}









