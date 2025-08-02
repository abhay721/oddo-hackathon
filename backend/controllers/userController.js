const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "Registered!" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: "Invalid credentials" });
    if (user.banned) return res.status(403).json({ error: "Banned user" });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
};