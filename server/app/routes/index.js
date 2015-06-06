'use strict';
var router = require('express').Router();
module.exports = router;

// TRICK
// router.use( function(req, res, next) {
//     console.log("Uncomment to verify it went through here"); next();
// })

router.use('/users', require('./users'));
router.use('/amazon', require('./amazon'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});