var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.json({called: `${req.protocol}://${req.get('host')}${req.originalUrl}`});
});

module.exports = router;
