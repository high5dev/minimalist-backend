var express = require('express');
var router = express.Router();
var lodash = require('lodash');
// var request = require('request');
const axios = require('axios');
const url = 'https://saas.haut.ai/api/v1'
const hautAPIs = require("../model/haut");
const hautScores = require("../model/scores")

router.get('/test', async (req, res) => {
    try {
        res.json('test works')
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
            const image_batch_id = images?.data?.image_batch_id
            const image_url = images?.data?.urls?.original

            if (!image_id && image_batch_id) {
                res.json({ is_ok: false })
            }

            setTimeout(async () => {
                const scoresRes = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/batches/${image_batch_id}/images/${image_id}/results/`, { headers })

                const eyes_age = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.eyes_age')
                const eyes_age_data = eyes_age?.result?.area_results;
                const eye_age_values = lodash.find(eyes_age_data, { 'area_name': 'face' })
                const eye_age_value = eye_age_values?.main_metric?.value


                const age = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.age')
                const age_data = age?.result?.area_results;
                const age_values = lodash.find(age_data, { 'area_name': 'face' })
                const age_value = age_values?.main_metric?.value

                const skin_tone = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.skin_tone')
                const skin_tone_data = skin_tone?.result?.area_results;
                const skin_tone_values = lodash.find(skin_tone_data, { 'area_name': 'face' })
                const skin_tone_value = skin_tone_values?.main_metric?.value

                const acne = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.acne')
                const acne_data = acne?.result?.area_results;
                const acne_values = lodash.find(acne_data, { 'area_name': 'face' })
                const acne_value = acne_values?.main_metric?.value

                const pigmentation = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.pigmentation')
                const pigmentation_data = pigmentation?.result?.area_results;
                const pigmentation_values = lodash.find(pigmentation_data, { 'area_name': 'face' })
                const pigmentation_value = pigmentation_values?.main_metric?.value

                const hydration = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.hydration')
                const hydration_data = hydration?.result?.area_results;
                const hydration_values = lodash.find(hydration_data, { 'area_name': 'face' })
                const hydration_value = hydration_values?.main_metric?.value

                const redness = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.redness')
                const redness_data = redness?.result?.area_results;
                const redness_values = lodash.find(redness_data, { 'area_name': 'face' })
                const redness_value = redness_values?.main_metric?.value

                const uniformness = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.uniformness')
                const uniformness_data = uniformness?.result?.area_results;
                const uniformness_values = lodash.find(uniformness_data, { 'area_name': 'face' })
                const uniformness_value = uniformness_values?.main_metric?.value

                const lines = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.lines')
                const lines_data = lines?.result?.area_results;
                const lines_values = lodash.find(lines_data, { 'area_name': 'face' })
                const lines_value = lines_values?.main_metric?.value

                const pores = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.pores')
                const pores_data = pores?.result?.area_results;
                const pores_values = lodash.find(pores_data, { 'area_name': 'face' })
                const pores_value = pores_values?.main_metric?.value

                const eye_bags = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.eye_bags')
                const eye_bags_data = eye_bags?.result?.area_results;
                const eye_bags_values = lodash.find(eye_bags_data, { 'area_name': 'face' })
                const eye_bags_value = eye_bags_values?.main_metric?.value

                const translucency = lodash.find(scoresRes?.data, el => el.algorithm_family_tech_name === 'selfie_v2.translucency')
                const translucency_data = translucency?.result?.area_results;
                const translucency_values = lodash.find(translucency_data, { 'area_name': 'face' })
                const translucency_value = translucency_values?.main_metric?.value

                const hautScore = new hautScores({
                    age: age_value,
                    acne: acne_value,
                    hydration: hydration_value,
                    pigmentation: pigmentation_value,
                    redness: redness_value,
                    uniformness: uniformness_value,
                    eyeBags: eye_bags_value,
                    eyeAge: eye_age_value,
                    skinTone: skin_tone_value,
                    lines: lines_value,
                    pores: pores_value,
                    translucency: translucency_value
                })

                const newHautScore = await hautScore.save();
                res.status(201).json(newHautScore)
            }, 5000)
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while making the external API call' });
    }
})

router.post('/get-score', async (req, res) => {
    try {
        const reqInfo = req.body
        const access_token = reqInfo?.apiData?.access_token
        const company_id = reqInfo?.apiData?.company_id
        const dataset_id = reqInfo?.apiData?.dataset_id
        const subject_id = reqInfo?.apiData?.subject_id
        const batch_id = reqInfo?.apiData?.batch_id
        const image_id = reqInfo?.apiData?.image_id
        const headers = {
            'Authorization': `Bearer ${access_token}`,
            'Accept': 'application/json'
        }

        const response = await axios.get(`${url}/companies/${company_id}/datasets/${dataset_id}/subjects/${subject_id}/batches/${batch_id}/images/${image_id}/results/`, { headers })

        const eyes_age = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.eyes_age')
        const eyes_age_data = eyes_age?.result?.area_results;
        const eye_age_values = lodash.find(eyes_age_data, { 'area_name': 'face' })
        const eye_age_value = eye_age_values?.main_metric?.value


        const age = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.age')
        const age_data = age?.result?.area_results;
        const age_values = lodash.find(age_data, { 'area_name': 'face' })
        const age_value = age_values?.main_metric?.value

        const skin_tone = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.skin_tone')
        const skin_tone_data = skin_tone?.result?.area_results;
        const skin_tone_values = lodash.find(skin_tone_data, { 'area_name': 'face' })
        const skin_tone_value = skin_tone_values?.main_metric?.value

        const acne = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.acne')
        const acne_data = acne?.result?.area_results;
        const acne_values = lodash.find(acne_data, { 'area_name': 'face' })
        const acne_value = acne_values?.main_metric?.value

        const pigmentation = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.pigmentation')
        const pigmentation_data = pigmentation?.result?.area_results;
        const pigmentation_values = lodash.find(pigmentation_data, { 'area_name': 'face' })
        const pigmentation_value = pigmentation_values?.main_metric?.value

        const hydration = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.hydration')
        const hydration_data = hydration?.result?.area_results;
        const hydration_values = lodash.find(hydration_data, { 'area_name': 'face' })
        const hydration_value = hydration_values?.main_metric?.value

        const redness = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.redness')
        const redness_data = redness?.result?.area_results;
        const redness_values = lodash.find(redness_data, { 'area_name': 'face' })
        const redness_value = redness_values?.main_metric?.value

        const uniformness = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.uniformness')
        const uniformness_data = uniformness?.result?.area_results;
        const uniformness_values = lodash.find(uniformness_data, { 'area_name': 'face' })
        const uniformness_value = uniformness_values?.main_metric?.value

        const lines = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.lines')
        const lines_data = lines?.result?.area_results;
        const lines_values = lodash.find(lines_data, { 'area_name': 'face' })
        const lines_value = lines_values?.main_metric?.value

        const pores = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.pores')
        const pores_data = pores?.result?.area_results;
        const pores_values = lodash.find(pores_data, { 'area_name': 'face' })
        const pores_value = pores_values?.main_metric?.value

        const eye_bags = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.eye_bags')
        const eye_bags_data = eye_bags?.result?.area_results;
        const eye_bags_values = lodash.find(eye_bags_data, { 'area_name': 'face' })
        const eye_bags_value = eye_bags_values?.main_metric?.value

        const translucency = lodash.find(response?.data, el => el.algorithm_family_tech_name === 'selfie_v2.translucency')
        const translucency_data = translucency?.result?.area_results;
        const translucency_values = lodash.find(translucency_data, { 'area_name': 'face' })
        const translucency_value = translucency_values?.main_metric?.value

        const hautScore = new hautScores({
            age: age_value,
            acne: acne_value,
            hydration: hydration_value,
            pigmentation: pigmentation_value,
            redness: redness_value,
            uniformness: uniformness_value,
            eyeBags: eye_bags_value,
            eyeAge: eye_age_value,
            skinTone: skin_tone_value,
            lines: lines_value,
            pores: pores_value,
            translucency: translucency_value
        })

        const newHautScore = await hautScore.save();
        res.status(201).json(newHautScore)


    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
})

module.exports = router