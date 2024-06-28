require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});

// mongoose.connect('mongodb+srv://high5dev621:SlzhqFrfy6oigMcM@minimalist.hmylibb.mongodb.net/?retryWrites=true&w=majority&appName=minimalist')

const corsOption = {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}

const db = mongoose.connection
db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log('connected to db'))

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const minimalistRouter = require('./routes/minimalist')
const hautRouter = require('./routes/haut')
const recommendationRouter = require('./routes/recommendation')
app.use('/minimalist', minimalistRouter)
app.use('/recommendation', recommendationRouter)
app.use('/haut', hautRouter)
app.use(express.static(path.join(__dirname, 'public')));
app.listen('3000', '0.0.0.0', ()=> console.log('app started'+ process.env.DB_URL));
