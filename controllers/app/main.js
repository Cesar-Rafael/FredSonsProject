const router = require('express').Router();

router.route('/')
    .get((req, res) => {
        res.render("app/index", {
            user: req.user
        });
    });

module.exports = router;