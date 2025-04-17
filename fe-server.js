var fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

// Loading the config fileContents
const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

// Generating some constants to be used to create the common HTML elements.
var header = '<!doctype html><html>' +
  '<head>';

var body = '</head><body><div id="container">' +
  '<div id="logo">' + global.gConfig.app_name + '</div>' +
  '<div id="space"></div>' +
  '<div id="form">' +
  '<form id="form" action="/" method="post"><center>' +
  '<label class="control-label">Name:</label>' +
  '<input class="input" type="text" name="name"/><br />' +
  '<label class="control-label">Ingredients:</label>' +
  '<input class="input" type="text" name="ingredients" /><br />' +
  '<label class="control-label">Prep Time:</label>' +
  '<input class="input" type="number" name="prepTimeInMinutes" /><br />';

var submitButton = '<button class="button button1">Submit</button>' +
  '</div></form>';

var endBody = '</div></body></html>';

// Serve static files (CSS, etc.)
app.use(express.static('public'));

// Route for handling the form submission (POST method)
app.post('/', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString(); // Collect the data
  });
  req.on('end', () => {
    var qs = require('querystring');
    var post = qs.parse(body);
    var myJSONObject = {
      name: post.name,
      ingredients: post.ingredients.split(','),
      prepTimeInMinutes: post.prepTimeInMinutes
    };

    // Send the data to the web service
    const http = require('http');
    const options = {
      hostname: global.gConfig.webservice_host,
      port: global.gConfig.webservice_port,
      path: '/recipe',
      method: 'POST',
      json: true,
    };

    const req2 = http.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        console.log("Data Saved!");
        res.redirect('/'); // Redirect to home page after saving
      });
    });
    req2.setHeader('content-type', 'application/json');
    req2.write(JSON.stringify(myJSONObject));
    req2.end();
  });
});

// Home route (GET method)
app.get('/', (req, res) => {
  var fileContents = fs.readFileSync('./public/default.css', { encoding: 'utf8' });
  res.write(header);
  res.write('<style>' + fileContents + '</style>');
  res.write(body);
  res.write(submitButton);
  
  // Read and display the saved recipes after form submission
  setTimeout(function () {
    const options = {
      hostname: global.gConfig.webservice_host,
      port: global.gConfig.webservice_port,
      path: '/recipes',
      method: 'GET',
    };

    const req = http.request(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        res.write('<div id="space"></div>');
        res.write('<div id="logo">Your Previous Recipes</div>');
        res.write('<div id="space"></div>');
        res.write('<div id="results">Name | Ingredients | PrepTime</div>');
        res.write('<div id="space"></div>');
        const myArr = JSON.parse(data);

        let i = 0;
        while (i < myArr.length) {
          res.write(myArr[i].name + ' | ' + myArr[i].ingredients + ' | ');
          res.write(myArr[i].prepTimeInMinutes + '<br/>');
          i++;
        }
        res.write('</div><div id="space"></div>');
        res.end(endBody);
      });
    });
    req.end();

  }, 2000);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend app listening at http://0.0.0.0:${port}`);
});
