const express = require('express')
const router = express.Router();
const Minimalist = require("../model/minimalist");
const minimalist = require('../model/minimalist');

//Getting all
router.get('/', async (req, res)=> {
    try{
        const minimalist = await Minimalist.find()
        res.json(minimalist)
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

//Retriving by ID
router.get('/:id', getMinimalist, (req, res)=>{
    res.send(res.minimalist)
})

// Getting within a date range
router.post('/date-range', async (req, res)=> {
    try{
        let afterDate = new Date(req.body.afterDate)
        let beforeDate = new Date(req.body.beforeDate)
        let responseArray = []
        const minimalist = await Minimalist.find()

        for (let i = 0; i < minimalist.length; i++) {

            let tempTimeStamp = minimalist[i].id.toString().substring(0,8)
            let tempDate = new Date( parseInt( tempTimeStamp, 16 ) * 1000 )

            if (tempDate > afterDate && tempDate < beforeDate) {
                responseArray.push(minimalist[i])
            }
        }

        res.json(responseArray)

    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

//Retriving by email
router.post('/email', async (req, res)=>{
    let emailAddress = req.body.email
    let responseArray = []
    try{
        const minimalist = await Minimalist.find()
        for (let i = 0; i < minimalist.length; i++) {
            let tempEmail = `${minimalist[i].email}`
            if (tempEmail === emailAddress) {
                responseArray.push(minimalist[i])
            }
        }
        res.json(responseArray)
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

// Getting by email and date range
router.post('/email-date-range', async (req, res)=>{
    let afterDate = new Date(req.body.afterDate)
    let beforeDate = new Date(req.body.beforeDate)
    let emailAddress = req.body.email
    let responseArray = []
    try{
        const minimalist = await Minimalist.find()
        for (let i = 0; i < minimalist.length; i++) {
            let tempEmail = `${minimalist[i].email}`
            if (tempEmail === emailAddress) {
                let tempTimeStamp = minimalist[i].id.toString().substring(0,8)
                let tempDate = new Date( parseInt( tempTimeStamp, 16 ) * 1000 )
    
                if (tempDate > afterDate && tempDate < beforeDate) {
                    responseArray.push(minimalist[i])
                }
            }
        }
        res.json(responseArray)
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

//Creating a collection
router.post('/', async (req, res)=>{
    const minimalist = new Minimalist({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
        pregnancy: req.body.pregnancy,
        skinType: req.body.skinType,
        skinSensitivity: req.body.skinSensitivity,
        imageUri: req.body.imageUri,
        haut: req.body.haut
    });

    try {
        const newMinimalist = await minimalist.save()
        res.status(201).json(newMinimalist)
    } catch (err) {
        res.status(400).json({msg: err.message})
        
    }

})

//Updating by ID
router.patch('/:id', getMinimalist, async (req, res)=>{
    if(req.body.name != null) {
        res.minimalist.name = req.body.name
    }
    if(req.body.email != null) {
        res.minimalist.email = req.body.email
    }
    if(req.body.gender != null) {
        res.minimalist.gender = req.body.gender
    }
    if(req.body.pregnancy != null) {
        res.minimalist.pregnancy = req.body.pregnancy
    }
    if(req.body.name != null) {
        res.minimalist.skinType = req.body.skinType
    }
    if(req.body.name != null) {
        res.minimalist.skinSensitivity = req.body.skinSensitivity
    }

    try {
        const updatedMinimalist = await res.minimalist.save()
        res.json(updatedMinimalist)
    } catch (err) {
        res.status(400).json({msg: err.message})
    }
})

//Deleting by ID
router.delete('/:id', getMinimalist, async (req, res)=>{
    try {
        await res.minimalist.deleteOne()
        res.json({msg: 'Deleted!'})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
})

async function getMinimalist(req, res, next) {
    let minimalist
    try {
        minimalist = await Minimalist.findById(req.params.id)
        if (minimalist == null) {
            return res.status(404).json({msg: 'Cannot retrive result'})
        }
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

    res.minimalist = minimalist
    next()
}

module.exports = router