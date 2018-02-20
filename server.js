var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var articles={
   'article-One':{
      title: 'Article one i Suraj Kishor',
      heading: 'Article One',
      date: 'july 6 1997',
      content: ' <p> This is the content of my first page This is Article One</p>'
      
  },
   'article-Two':{
      title:'Article two i Suraj Kishor', 
      heading:'Article Two',
      date:'july 6 1997',
      content:' <p> This is the content of my Second page This is Article One</p>'
   },
   'aticle-Three':{
      title:'Article Three i Suraj Kishor', 
      heading:'Article Three',
      date:'july 6 1997',
      content:' <p> This is the content of my Third page This is Article One</p>'
   }
};

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
           <div>${date}</div>
           <div>
           <p> ${content}</p>
           </div>
       </div>
    </body>
</html>
`;
return htmlTemplet;
}

app.get('/:articleName', function (req,res) {
  var articleName=req.params.articleName;
  res.send(createTemplet(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
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
