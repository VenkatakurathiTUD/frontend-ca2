const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const http = require('http'); // Import http at the top

// Middleware to parse request body for POST requests
app.use(express.urlencoded({ extended: false })); // For URL-encoded data
app.use(express.text({ type: 'text/plain' }));   // For plain text data
app.use(express.json());                         // For JSON data

// Loading the config fileContents
const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

// Generating some constants to be used to create the common HTML elements.
const header = '<!doctype html><html><head>';
const body = '</head><body><div id="container"><div id="logo">' + global.gConfig.app_name + '</div><div id="space"></div><div id="form"><form id="form" action="/" method="post"><center><label class="control-label">Name:</label><input class="input" type="text" name="name"/><br /><label class="control-label">Ingredients:</label><input class="input" type="text" name="ingredients" /><br /><label class="control-label">Prep Time:</label><input class="input" type="number" name="prepTimeInMinutes" /><br />';
const submitButton = '<button class="button button1">Submit</button></div></form>';
const endBody = '</div></body></html>';

// Serve static files (CSS, etc.)
app.use(express.static('public'));

// Route for handling the form submission (POST method)
app.post('/', (req, res) => {
  const { name, ingredients, prepTimeInMinutes } = req.body;
  const ingredientsArray = ingredients ? ingredients.split(',') : [];

  const myJSONObject = {
    name: name,
    ingredients: ingredientsArray,
    prepTimeInMinutes: parseInt(prepTimeInMinutes)
  };

  // Send the data to the web service
  const options = {
    hostname: global.gConfig.webservice_host,
    port: global.gConfig.webservice_port,
    path: '/recipe',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
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

    resp.on('error', (error) => {
      console.error("Error sending data to web service:", error);
      res.status(500).send('Failed to save recipe');
    });
  });

  req2.on('error', (error) => {
    console.error("Error connecting to web service:", error);
    res.status(500).send('Failed to connect to recipe service');
  });

  req2.write(JSON.stringify(myJSONObject));
  req2.end();
});

// Home route (GET method)
app.get('/', (req, res) => {
  try {
    const fileContents = fs.readFileSync('./public/default.css', { encoding: 'utf8' });
    res.write(header);
    res.write(`<style>${fileContents}</style>`);
    res.write(body);
    res.write(submitButton);
    res.write('<div id="space"></div><div id="logo">Backend not connected. Recipes will appear here once backend is ready.</div>');
    res.end(endBody);
  } catch (error) {
    console.error("Error in GET '/':", error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Frontend app listening at http://0.0.0.0:${port}`);
});
