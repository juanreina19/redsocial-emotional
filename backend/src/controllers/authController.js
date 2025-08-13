const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ msg: "Usuario registrado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ msg: "Credenciales inválidas" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ msg: "Credenciales inválidas" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor" });
    }

};

module.exports = { register, login };