require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

// mongoose.connect('mongodb+srv://high5dev621:SlzhqFrfy6oigMcM@minimalist.hmylibb.mongodb.net/?retryWrites=true&w=majority&appName=minimalist')



const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log('connected to db'))

app.use(express.json());

const minimalistRouter = require('./routes/minimalist')
app.use('/minimalist', minimalistRouter)
app.use(express.static(path.join(__dirname, 'public')));
app.listen('3000', ()=> console.log('app started'+ process.env.DB_URL));
