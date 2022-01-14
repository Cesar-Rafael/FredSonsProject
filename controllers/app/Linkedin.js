
const router = require('express').Router();
const { getData, postData } = require('../utils/fetchData');// Tenemos ruta x3?

router.route('/') // Tenemos ruta?
  .get(async (req, res) => {
        res.render("/", { // Tenemos ruta x2?
            // Lite fields
            id: res.id,
            firstName: res.firstname,
            localizedFirstName: res.localizedFirstName,
            lastName : res.lastName,
            localizedLastName : res.localizedLastName,
            profilePicture : res.profilePicture,
            //Basic fields
            /*
            maidenName : res.maidenName,
            localizedMaidenName : res.localizedMaidenName,
            headline : res.headline,
            localizedHeadline : res.localizedHeadline,
            vanityName : res.vanityName
            */
          jwt // ????
        });
      
  });