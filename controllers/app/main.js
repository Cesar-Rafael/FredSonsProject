const router = require('express').Router()
const token = require('../../db/models/token')
const cheerio = require('cheerio')
const fetch = require('superagent')
const { getData, postData } = require('../utils/fetch')
const { urlencode, clientId, clientSecret } = require('../../config/linkedin')
const { apiKey } = require('../../config/google')
const { PythonShell } = require('python-shell')
const { getDirectoryProject } = require('../utils/getDirectoryProject')
const dirProject = getDirectoryProject(__dirname, 1);
const pythonScript = `${dirProject}/utils/getUserProfile.py`
const TwitterClient = require('twitter-api-client').TwitterClient
const twitterKeys = require('../../config/twitter')
const SerpApi = require('google-search-results-nodejs')
const search = new SerpApi.GoogleSearch(apiKey)

// Twitter

const twitterClient = new TwitterClient({
    apiKey: twitterKeys.apiKey,
    apiSecret: twitterKeys.apiKeySecret,
    accessToken: twitterKeys.accessToken,
    accessTokenSecret: twitterKeys.accessTokenSecret,
})

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
    })

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
    })

function convertToName(publicId) {
    let array = publicId.split('-');
    console.log("array", array);
    let name = '';
    let flag = false;
    array.forEach(word => {
        flag = false;
        for (let i = 0; i < word.length; i++) {
            if(i >= '0' && i <= '9') {
                flag = true; 
                break;
            }
        }
        if(flag != true) {
            name += word;
        }
    });
    return name;
}

router.route('/search-data')
    .post(async (req, res) => {
        let response = { result: 'NOK' }
        try {
            const { publicUrl } = req.body
            // Example: https://www.linkedin.com/in/carlos-melgarejo-roman-291498206/
            let publicId = publicUrl.split('/')[4]
            let name = convertToName(publicId);
            console.log("publicID", publicId);
            console.log("name", name);
            await PythonShell.run(pythonScript, { mode: 'text', args: [publicId] }, async function (err, results) {
                if (err) throw err;
                let result = results[0]
                result = result.replace(/False/g, false).replace(/True/g, true).replace(/'/g, '"')
                response.content = JSON.parse(result)
                response.result = 'OK'
                res.json(response).status(200)
            });
        } catch (e) {
            console.log(e)
        }

    })

router.route('/twitter/:query')
    .get(async (req, res) => {
        const query = req.params.query

        twitterClient.tweets.search({
            q: query
        }).then((response) => {
            res.send(response)
        }).catch((err) => {
            console.error(err)
            res.status(500).send('An error occurred, please try again later.')
        })
    })

router.route('/google')
    .get(async (req, res) => {
        await search.json({
            q: "Franccesco Jaimes Agreda",
            location: "Lima Region"
        }, (result) => {
            res.json({content: result}).status(200)
        })
    })

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