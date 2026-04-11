const express = require('express');

const profilesRouter = require('./routes/profiles');
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/profiles', profilesRouter);
app.use('/profile', profileRouter);
app.use('/auth', authRouter);

module.exports = app;
