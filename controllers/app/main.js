const router = require('express').Router()
const token = require('../../db/models/token')
const TwitterKeys = require('../../config/twitter')
const TwitterClient = require('twitter-api-client').TwitterClient
const SerpApi = require('google-search-results-nodejs')
const { getData, postData } = require('../utils/fetch')
const { urlencode, clientId, clientSecret } = require('../../config/linkedin')
const GoogleKeys = require('../../config/google')

// Google Search
const googleClient = new SerpApi.GoogleSearch(GoogleKeys.apiKey)

// Twitter: Doesn't work because the free plan for developers is limited, so we can't search profiles with completely name
const twitterClient = new TwitterClient({
    apiKey: TwitterKeys.apiKey,
    apiSecret: TwitterKeys.apiKeySecret,
    accessToken: TwitterKeys.accessToken,
    accessTokenSecret: TwitterKeys.accessTokenSecret,
})

// Main route API
router.route('/')
    .get(async (req, res) => {
        try {
            // This functionality is for linkedin APIs, to get the access tokens and others
            let code = req.query.code
            if (code) {
                // Update the token
                await token.findOneAndUpdate({ id: 1 }, { code }, { new: true })
                // Get the access token
                let response = await postData(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&redirect_uri=${urlencode}&client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {})
                // Save the access token
                await token.findOneAndUpdate({ id: 2 }, { code: response.access_token }, { new: true })
            }
        } catch (e) {
            console.log(e)
        }
        res.render('app/index')
    })

// API that searchs all person information with the linkedin URL
router.route('/search-person-information')
    .post(async (req, res) => {
        let response = { result: 'NOK', content: {} }

        try {
            const { publicUrl } = req.body // Get the linkedin publicUrl as input 
            let publicId = publicUrl.split('/')[4] // Get the publicId which is the linkedin publicUrl last part 
            let linkedinData = await postData('http://10.150.0.3:3000/get-linkedin-data', { publicId }) // Call the flask API that collects all the linkedin information 
            let name = linkedinData.firstName + linkedinData.lastName // Get the name which will be the input for the Google Search

            response.content.linkedin = linkedinData // Save the linkedin information in response

            // Call the Google API for collects all the google information
            await googleClient.json({
                q: name, // The query search is the name person
                location: "Lima Region" // The location is get it from the linkedin data
            }, (result) => {
                response.content.google = result // Save the google information in response
                response.result = 'OK'
                response.content = filterInformation(response.content)
                res.json(response).status(200)
            })

        } catch (e) {
            console.log(e)
            res.json(response).status(200)
        }
    })

router.route('/profile')
    .get(async (req, res) => {
        res.render('app/profile')
    })

// API that gets twitter information, but It's also limited for the basic plan, even so, we send a form expecting we can access to all APIs 
router.route('/twitter/:query')
    .get(async (req, res) => {
        const query = req.params.query
        let response = { result: 'NOK' }

        try {
            response.content = await twitterClient.tweets.search({ q: query })
            response.result = 'OK'
        } catch (e) {
            console.error(e)
        }

        res.json(response).status(200)
    })

module.exports = router;

function filterInformation(data) {
    console.log("data", data)
    return data
}