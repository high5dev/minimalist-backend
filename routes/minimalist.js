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