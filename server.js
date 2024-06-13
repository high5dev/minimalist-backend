require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
mongoose.connect(process.env.DB_URL);

// mongoose.connect('mongodb+srv://high5dev621:SlzhqFrfy6oigMcM@minimalist.hmylibb.mongodb.net/?retryWrites=true&w=majority&appName=minimalist')

const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log('db connected to Mongodb Atlas at ' + process.env.DB_URL))

app.use(express.json());
app.use(cors());
const minimalistRouter = require('./routes/minimalist')
const hautRouter = require('./routes/haut')
app.use('/minimalist', minimalistRouter)
app.use('/haut', hautRouter)
app.use(express.static(path.join(__dirname, 'public')));
app.listen('3000', '0.0.0.0', ()=> console.log('app started'));
