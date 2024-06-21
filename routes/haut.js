const express = require('express');
const router = express.Router();
const lodash = require('lodash');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Minimalist = require('../model/minimalist');
const hautScores = require('../model/scores');

const url = 'https://saas.haut.ai/api/v1';
const credentials = {
    username: "gaurav.singh@beminimalist.co",
    password: "Minimalist@4321"
};

router.get('/test', async (req, res) => {
    try {
        res.json('test works');
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

router.post('/image-upload', async (req, res) => {
    try {
        const reqInfo = req.body;
        const customerEmail = reqInfo?.cutomerInfo?.email;
        const image_src = reqInfo?.imgSrc;

        if (!customerEmail) {
            return res.status(400).json({ msg: 'customer Info not provided' });
        }

        const response = await axios.post(`${url}/login/`, credentials, { headers: { 'Content-Type': 'application/json' } });
        const token = response?.data?.access_token;
        const company_id = response?.data?.company_id;

        if (!token) return res.json({ is_ok: false });

        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const datasets = await axios.get(`${url}/companies/${company_id}/datasets/short_list/?q=minimalist`, { headers });
        const dataset = lodash.find(datasets?.data, { 'name': 'minimalist' });
        const dataset_id = dataset?.id;

        if (!dataset_id) return res.json({ is_ok: false });

        const subjects = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/`, { headers });
        let subject = lodash.find(subjects?.data?.results, { 'name': customerEmail });

        if (!subject) {
            const new_subject = await axios.post(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/`, { name: customerEmail }, { headers });
            subject = new_subject?.data;
        }

        const subject_id = subject?.id;

        if (!subject_id) return res.json({ is_ok: false });

        const images = await axios.post(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/images/`, { "side_id": 1, "light_id": 1, "b64data": image_src }, { headers });
        const image_id = images?.data?.id;
        const image_batch_id = images?.data?.image_batch_id;

        if (!image_id && image_batch_id) return res.json({ is_ok: false });

        setTimeout(async () => {
            const scoresRes = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/batches/${image_batch_id}/images/${image_id}/results/`, { headers });

            if (!scoresRes?.data || scoresRes.data.length === 0) {
                return res.status(404).json({ msg: 'No results found' });
            }

            const noFaceError = lodash.find(scoresRes.data, el => el.result?.error === 'No face detected');
            if (noFaceError) {
                return res.status(400).json({ msg: 'No face detected' });
            }

            const notFullFaceError = lodash.find(scoresRes.data, el => el.result?.error === 'Not full face');
            if (notFullFaceError) {
                return res.status(400).json({ msg: 'Not full face' });
            }

            const saveImage = (base64Data, filePath) => {
                const buffer = Buffer.from(base64Data.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
                fs.writeFileSync(filePath, buffer);
            };

            const filePath = path.join(__dirname, '..', 'public', 'images', `${image_id}.jpg`);
            saveImage(image_src, filePath);

            const imageUrl = `${req.protocol}://${req.get('host')}/images/${image_id}.jpg`;

            const extractMetric = (data, techName, areaName) => {
                const item = lodash.find(data, el => el.algorithm_family_tech_name === techName);
                const area = lodash.find(item?.result?.area_results, { 'area_name': areaName });
                return area?.main_metric?.value;
            };

            const metrics = {
                perceivedAge: extractMetric(scoresRes.data, 'selfie_v2.age', 'face'),
                acne: extractMetric(scoresRes.data, 'selfie_v2.acne', 'face'),
                hydration: extractMetric(scoresRes.data, 'selfie_v2.hydration', 'face'),
                pigmentation: extractMetric(scoresRes.data, 'selfie_v2.pigmentation', 'face'),
                redness: extractMetric(scoresRes.data, 'selfie_v2.redness', 'face'),
                uniformness: extractMetric(scoresRes.data, 'selfie_v2.uniformness', 'face'),
                eyeBags: extractMetric(scoresRes.data, 'selfie_v2.eye_bags', 'face'),
                eyeAge: extractMetric(scoresRes.data, 'selfie_v2.eyes_age', 'face'),
                skinTone: extractMetric(scoresRes.data, 'selfie_v2.skin_tone', 'face'),
                lines: extractMetric(scoresRes.data, 'selfie_v2.lines', 'face'),
                pores: extractMetric(scoresRes.data, 'selfie_v2.pores', 'face'),
                translucency: extractMetric(scoresRes.data, 'selfie_v2.translucency', 'face')
            };

            // Get the 2 lowest values in metrics
            const metricEntries = Object.entries(metrics);
            metricEntries.sort((a, b) => a[1] - b[1]);
            const [lowestMetric, secondLowestMetric] = metricEntries.slice(0, 2);
            metrics.lowestMetric = { [lowestMetric[0]]: lowestMetric[1] };
            metrics.secondLowestMetric = { [secondLowestMetric[0]]: secondLowestMetric[1] };

            console.log(metrics)

            const minimalist = new Minimalist({
                name: reqInfo?.cutomerInfo?.name,
                email: customerEmail,
                gender: reqInfo?.cutomerInfo?.gender,
                age: reqInfo?.cutomerInfo?.age,
                skinType: reqInfo?.cutomerInfo?.skinType,
                skinSensitivity: reqInfo?.cutomerInfo?.skinSensitivity,
                pregnancy: reqInfo?.cutomerInfo?.skinSensitivity,
                imageUri: imageUrl,
                haut: [metrics]
            });

            const newMinimalist = await minimalist.save();
            res.status(201).json(newMinimalist);
        }, 5000);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
