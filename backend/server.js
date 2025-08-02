const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const issueRoutes = require('./routes/issues');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/civictrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/issues', issueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log('Server running on port', process.env.PORT || 5000);
});