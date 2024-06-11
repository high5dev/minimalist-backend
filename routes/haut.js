var express = require('express');
var router = express.Router();
var lodash = require('lodash');
// var request = require('request');
const axios = require('axios');
const url = 'https://saas.haut.ai/api/v1'
const hautAPIs = require("../model/haut");

router.post('/test', async (req, res) => {
    try {
        const result = req.body
        const customerEmail = result?.cutomerInfo?.email
        if (customerEmail === '') {
            res.status(400).json({ msg: 'customer Info not provided' })
        } else {
            res.json("req")
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

router.post('/image-upload', async (req, res) => {
    try {
        const reqInfo = req.body
        const customerEmail = reqInfo?.cutomerInfo?.email
        const image_src = reqInfo?.imgSrc
        if (customerEmail === '') {
            res.status(400).json({ msg: 'customer Info not provided' })
        } else {
            const response = await axios.post(`${url}/login/`,
                {
                    username: "gaurav.singh@beminimalist.co",
                    password: "Minimalist@4321"
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            const token = response?.data?.access_token;
            if (!token) {
                res.json({ is_ok: false })
            }
            const company_id = response?.data?.company_id;
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const datasets = await axios.get(`${url}/companies/${company_id}/datasets/short_list/?q=minimalist`, { headers: headers });
            const dataset = lodash.find(datasets?.data, { 'name': 'minimalist' });
            const dataset_id = dataset?.id
            if (!dataset_id) {
                res.json({ is_ok: false })
            }

            const subjects = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/`, { headers: headers })
            // const arr_subject = lodash.filter(subjects?.data, x=>x.name === email)
            const subject = lodash.find(subjects?.data?.results, { 'name': customerEmail });

            let subject_id = null
            if (subject?.id) {
                subject_id = subject?.id
            } else {
                const new_subject = await axios.post(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/`, { name: customerEmail }, { headers: headers })
                subject_id = new_subject?.data?.id
            }
            if (!subject_id) {
                res.json({ is_ok: false })
            }
            const images = await axios.post(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/images/`,
                {
                    "side_id": 1,
                    "light_id": 1,
                    "b64data": image_src,
                }, { headers: headers });
            const image_id = images?.data?.id
            console.log(images)
            const image_batch_id = images?.data?.image_batch_id

            if (!image_id && image_batch_id) {
                res.json({ is_ok: false })
            }

            const hautAPI = new hautAPIs({
                access_token: token,
                company_id: company_id,
                dataset_id: dataset_id,
                subject_id: subject_id,
                batch_id: image_batch_id,
                image_id: image_id
            })

            const newHautAPI = await hautAPI.save();
            res.status(201).json(newHautAPI)
        }


        // const results = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/batches/${image_batch_id}/images/${image_id}/results/`, {headers:headers})
        
        // console.log(eye_age_values?.main_metric?.value)
        // console.log(eyes_age_data)

        // res.json(eye_age_values?.main_metric?.value)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while making the external API call' });
    }
})

router.post('/get-score', async (req, res) => {
    try {
        const reqInfo = req.body
        console.log(reqInfo)
        res.json('sdfa')
        // const results = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/batches/${image_batch_id}/images/`, { headers: headers })

        // const data = results?.data;

        // console.log(results)
        // // res.json(results)
        // res.json(data)

        // const eyes_age = lodash.find(results, el => el.algorithm_family_tech_name === 'selfie_v2.eyes_age')
        // const eyes_age_data = eyes_age?.result?.area_results;
        // const eye_age_values = lodash.find(eyes_age_data, { 'area_name': 'face' })
        // const eye_age_value = eye_age_values?.main_metric?.value


        // const age = lodash.find(results, el => el.algorithm_family_tech_name === 'selfie_v2.age')
        // const age_data = age?.result?.area_results;
        // const age_values = lodash.find(age_data, { 'area_name': 'face' })
        // const age_value = age_values?.main_metric?.value

        // const skin_tone = lodash.find(results, el => el.algorithm_family_tech_name === 'selfie_v2.skin_tone')
        // const skin_tone_data = skin_tone?.result?.area_results;
        // const skin_tone_values = lodash.find(skin_tone_data, { 'area_name': 'face' })
        // const skin_tone_value = skin_tone_values?.main_metric?.value
    } catch (err) {
        res.status(500).json({ msg: err.message });        
    }
})

module.exports = router