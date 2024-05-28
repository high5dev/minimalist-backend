require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});



const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log('connected to db'))

app.use(express.json());

const minimalistRouter = require('./routes/minimalist')
app.use('/minimalist', minimalistRouter)
app.listen('3000', ()=> console.log('app started'+ process.env.DB_URL));
