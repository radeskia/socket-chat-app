var express = require("express");
var router = express.Router();

/* GET home page. */
router
    .get("/", (req, res) => {
        console.log(`okay`);
        res.send(`okay`);
    })
    .get("/asd", (req, res) => {
        console.log(`asd is okay too`);
        res.send(`asd is okay too`);
    });

module.exports = router;
