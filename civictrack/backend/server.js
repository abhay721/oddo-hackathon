const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const issueRoutes = require('./routes/issues');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/civictrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api/issues', issueRoutes);

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});