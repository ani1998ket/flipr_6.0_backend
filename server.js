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
    var sql = "select * from covid19india"
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
