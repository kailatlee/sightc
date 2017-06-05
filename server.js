// Import module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// Create the database
var PouchDB = require('pouchdb');
var db = new PouchDB('workshop');

//Create the app
var app = express();

var data = require('./data');

// =========================
// App Configs
// =========================
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/calendar'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.disable('x-powered-by');
// Allowing CORS
app.use(function(req,res,next) {
	res.append('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.append('Access-Control-Allow-Credentials', 'true');
	res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST', 'DELETE']);
	res.append('Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.enable('trust proxy');
app.set('view engine', 'ejs');


// =======================================================================
// RESTful Routes
// HTTP Verbs: GET, POST, PUT, DELETE
//
// Name     |   Path      |   HTTP Verb |   Purpose
// =======================================================================
// Index    |   /         |   GET       | List all the posts
// Create   |   /         |   POST      | Create a new post
// Show     |   /:id      |   GET       | Show a single post
// Update   |   /:id      |   PUT       | Update a particular post
// Delete   |   /:id      |   DELETE    | Delete a particular post
// =======================================================================

// app.use('/', routes);
// app.use('/calendar', calendar);
app.get('/', function(req,res) {
	var dataToPass = {
		city: data.sandiego.city
	}
	res.render('home', dataToPass);
});

//Gets the route of the URL and gives back a response
app.get('/ping', function(req, res) {
  console.log(req);
  res.send('Hello!');
});

app.get('/calendar', function(req,res) {
  console.log(req);
  res.send('Hiya!')

})

// app.get('/calendar', function(req, res) {
//   res.sendFile(path.join(__dirname + '/calendar.html'));
// });

app.get('/posts/', function(req, res) {
    db.allDocs({
      include_docs: true,
      attachments: true
    }, function(err, result) {
      // If there was an error, log it
      if (err) {
        console.log(err);
      }
      // Else render the 'posts' view and pass it all the posts
      else {
        res.status(200).json(result.rows);
      }
    });
});

app.get('/:city/:groups', function(req,res){
	var city = req.params.city;

	var dataToPass = {
		categories: data[city][req.params.groups]
	};

	res.render("groups", dataToPass);
});

// api.twitter.com/user/posts/

app.post('/posts/', function(req, res) {
  // This is what our post looks like
  var post = {
    title: req.body.title,
    post: req.body.post
  };

    db.post(post, function(err, created) {
  // If there was an error, log it
      if (err || !created) {
        console.log(err);
        res.sendStatus(500);
      } else {
        return res.status(201).json(created);
      }
  });
});

app.get('/posts/:id', function(req, res) {
    db.get(req.params.id, function(err, found) {
      // If there was an error, log it
    if (err || !found) {
      console.log('Something went wrong');
      res.sendStatus(500);
    }
    // Else the post was found
    else {
      res.status(200).json(found);
    }
  });
});

// UPDATE route
app.put('/posts/:id', function(req, res) {
  db.get(req.params.id, function(err, found) {
// If there was an error, log it
  if (err || !found) {
    console.log('Something went wrong');
    res.sendStatus(500);
  }
  // Else the post was found
  else {
    // Now save the updated post
    db.put({
      _id: found._id,
      _rev: found._rev,
      title: req.body.title,
      post: req.body.post
    }, function(err, saved) {
      // If there was an error, log it
      if (err || !saved) {
        console.log('Something went wrong');
        res.sendStatus(500);
      } else {
        res.status(201).json(saved);
      }
    });
  }
  });
});

// DELETE route
app.delete('/posts/:id', function(req, res) {
    db.get(req.params.id, function(err, found) {
      // If there was an error, log it
      if (err) {
        console.log(err);
        // Redirect to the '/' route
        res.sendStatus(500);
      }
      // Else the post was found
      else {
        // Remove the post from the database
        db.remove(found, function(err, removed) {
          // If there was an error, log it
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.status(202).json(removed);
          }
        });
      }
    });
});

// Listen for requests
//What port to listen for requests
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server listening on PORT: ' + PORT);
});
