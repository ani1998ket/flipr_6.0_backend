// Create express app
var express = require("express")
var cors = require('cors')
var app = express()
app.use(cors())
var db = require("./database.js")

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});
app.get("/api/test", (req, res, next) => {
    req.query.age_min = parseInt( req.query.age_min )
    req.query.age_max = parseInt( req.query.age_max )
    let p = req.query;

    if(p.age_max == 0) p.age_max = 100;
    if( p.date_start == "" ) p.date_start = "2020-01-01";
    if( p.date_end == "" )p.date_end = "2020-12-31";

    let age_query = ` AND ageEstimate + 0 >= ${p.age_min} AND ageEstimate + 0 <= ${p.age_max}`;
    let gender_query = ` AND gender = "${p.gender}"`;
    let state_query = ` AND STATE = "${p.state}"`;
    let date_query = ` AND (substr(reportedOn, 7, 4) || '-' || substr(reportedOn, 4, 2) || '-' || substr(reportedOn, 1, 2)) between "${p.date_start}" and "${p.date_end}" `;

    var sql = `SELECT patientId, reportedOn, ageEstimate, gender, state, status FROM covid19india where 1`;
    if( p.gender != "") sql += gender_query;
    if( p.state != "") sql += state_query;
    sql += age_query;
    sql += date_query;

    console.log( sql )
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get('*', function(req, res){
    res.status(404).send('Not available');
});

app.use(function(req, res){
    res.status(404);
});
