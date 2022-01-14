const router = require('express').Router()
const token = require('../../db/models/token')
const cheerio = require('cheerio')
const fetch = require('superagent')
const { getData, postData } = require('../utils/fetch')
const { urlencode, clientId, clientSecret } = require('../../config/linkedin')

router.route('/')
    .get(async (req, res) => {
        try {
            let code = req.query.code
            if (code) {
                // Update the token
                await token.findOneAndUpdate({ id: 1 }, { code }, { new: true })
                // Get the access token
                let response = await postData(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=${urlencode}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {})
                // Save the access token
                await token.findOneAndUpdate({ id: 2 }, { code: response.access_token }, { new: true })
            }
            res.render('app/index')
        } catch (e) {
            console.log(e)
            res.render('app/index')
        }
    });

router.route('/search')
    .get(async (req, res) => {
        let result = {}
        try {
            //let response = await getData('https://api.linkedin.com/v2/people?ids=List((id:291498206))')
            //res.render('app/index')

            let title = await fetch.get('https://www.linkedin.com/in/carlos-melgarejo-roman-291498206/').then(response => {
                var $ = cheerio.load(response.text)
                var title = $('title').text()
                return title
            }).catch(e => {
                console.log(e)
                return ''
            })

            result.content = { title }
            res.json(result).status(200)
        } catch (e) {
            console.log(e)
            res.render('app/index')
        }

        res.render('app/index')
    });

/*
    res.render("/", {
        // Lite fields
        id: res.id,
        firstName: res.firstname,
        localizedFirstName: res.localizedFirstName,
        lastName: res.lastName,
        localizedLastName: res.localizedLastName,
        profilePicture: res.profilePicture,
        //Basic fields
        maidenName : res.maidenName,
        localizedMaidenName : res.localizedMaidenName,
        headline : res.headline,
        localizedHeadline : res.localizedHeadline,
        vanityName : res.vanityName
jwt // ????
        });
    */

module.exports = router;