var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require("pg").Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    user : 'kishorsuraj1997',
    database : 'kishorsuraj1997',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

function createTemplet (data){
var title=data.title;
var heading=data.heading;
var date=data.date;
var content=data.content;

var htmlTemplet=`
<html>
    <head>
        <title>
            ${title}
        </title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
       <div class='container'>
          <div>
            <href><a href="/">Home</a></href>
           </div>
           <hr/>
           <h3>${heading}</h3>
           <div>${date.toDateString()}</div>
           <div>
           <p> ${content}</p>
           </div>
       </div>
    </body>
</html>
`;
return htmlTemplet;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt){
    
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ['pbkdf2','10000',salt,hashed.toString('hex')].join('$');
}



app.get('/hash/:input',function(req,res){
    var hashedString = hash(req.params.input,'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user',function(req,res){
   
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
       
        if(err){
            res.status(500).send(err.toString());
        } else{
            res.send('user succesfully created: ' + username);
        }
       
   });
});

app.post('/login',function(req,res){
    
   var username = req.body.username;
   var password = req.body.password;
   pool.query('SELECT FROM "user" WHERE username =$1',[username,dbString],function(err,result){
       
        if(err){
            res.status(500).send(err.toString());
        } else{
            if(result.rows.length === 0){
                res.send(403).send('username/password is invalid');
            } else {
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password,salt);
                if(hashedPassword === dbString){
                 res.send('creadentials are correct');
                } else{
                    res.send(403).send('username/password is invalid');
                }
            }
        }
   });
});

var pool = new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT*FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        } else{
            res.send(JSON.stringify(result.rows));
        }
    });
});


var counter=0;
app.get('/counter',function(req,res){
    counter=counter+1;
    res.send(counter.toString());
});
app.get('/articles/:articleName', function (req,res) {
 
  pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName], function(err,result){
     if(err){
            res.status(500).send(err.toString());
        } else{
            if(result.rows.length === 0){
              res.status(404).send('Article not found');
            } else{
                var articleData = result.rows[0];
                res.send(createTemplet(articleData));
            }
        }
 });
  
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
