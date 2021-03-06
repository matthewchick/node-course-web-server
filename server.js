/* 1. npm init
   2. npm install express@latest --saveNotes
   3. Debug node => http://www.mead.io/node-debugging/
   4. Ctml Shift R => reload the page ignoring cache
   5. how to use template engine, hbs => handlebarsjs.com  - mustache.js, Riot.js, reactive.js
   6. use middleware to override other pages
   7. generate keystore ssh-keygen -t rsa -b 4096 -C 'chikmatthew@outlook.com'
*/

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// deploy to heroku
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));  // use middleware for static page

// use middleware to create log file
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {  //err is a callback
    if (err){
      console.log('Unable to append to server.log.')
    }
  })
  next();
});
// override home.hbs and about.hbs
/* app.use((req, res, next) => {
  res.render('maintenance.hbs');
  //next();
}) */

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  // res.send('<h1>Hello Express</h1>');
  /* res.send({
    name: 'Matthew',
    likes: [
      'Biking',
      'Cities'
    ]
  }) */
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
    //currentYear: new Date().getFullYear()    //use hbs.registerHelper
  })
});
// Route handlers app.get, app.post
app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {     // pass pageTitle and currentYear to view
    pageTitle: 'About Page',
    //currentYear: new Date().getFullYear()
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects',
  })
});

// bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//deploy to heroku, must change port number as a variable
app.listen(port, () => {
  console.log(`Server is up to ${port}`);
});
