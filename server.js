let express = require('express');
let app = express();
let path = require('path');
let reloadMagic = require('./reload-magic.js');
let multer = require('multer');
let upload = multer({ dest: 'public/imgs/' });
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let data = require('./data.js');
app.use(cookieParser());
app.use(bodyParser.json());
let users = data.initialUsers;
let sessions = {};
let items = data.initialItems;
let cart = [];
reloadMagic(app);

function randomString() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 6) +
    Math.random()
      .toString(36)
      .substring(2, 6)
  );
}

class NewItem {
  constructor(
    name,
    year,
    price,
    image,
    format,
    description,
    id,
    sellerId,
    seller
  ) {
    this.name = name;
    this.year = year;
    this.price = price;
    this.image = image;
    this.format = format;
    this.description = description;
    this.id = id;
    this.sellerId = sellerId;
    this.seller = seller;
  }
}

app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

// Your endpoints go after this line
app.get('/', function(req, res) {
  res.redirect('/session');
});

app.post('/login', upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log('this is the parsed body', req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let expectedPassword = users[username].password;
  let name = users[username].name;
  console.log('expected password', expectedPassword);
  if (enteredPassword === expectedPassword) {
    console.log('password matches');
    let sessionId = generateId();
    console.log('generated id', sessionId);
    sessions[sessionId] = name;
    res.cookie('sid', sessionId);
    res.cookie('name', name);
    res.send(
      JSON.stringify({
        success: true,
        name: name,
        userObject: { [username]: users[username] },
        username: username,
      })
    );
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

let generateId = () => {
  return '' + Math.floor(Math.random() * 100000000);
};

app.post('/signup', upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log('this is the body', req.body);
  let username = req.body.username;
  let enteredPassword = req.body.password;
  let name = req.body.name;
  if (users[username]) {
    return res.send(JSON.stringify({ success: false }));
  }
  users[username] = {
    password: enteredPassword,
    id: randomString(),
    name: name,
  };
  console.log('users object', users);
  let sessionId = generateId();
  console.log('generated id', sessionId);
  sessions[sessionId] = name;
  res.cookie('sid', sessionId);
  res.cookie('name', name);
  res.cookie('username', username);
  res.cookie('id', users[username].id);
  res.send(
    JSON.stringify({
      success: true,
      userObject: { [username]: users[username] },
    })
  );
});

app.post('/logout', (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  const name = req.cookies.name;
  delete name;

  res.send(JSON.stringify({ success: true }));
});

app.get('/session', (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId]) {
    const name = sessions[sessionId];
    return res.send(JSON.stringify({ success: true, name }));
  }
  res.send(JSON.stringify({ success: false }));
});

app.get('/setitems', upload.none(), (req, res) => {
  console.log("**** I'm in the get items endpoint");
  res.send(JSON.stringify(items));
});

app.get('/setusers', upload.none(), (req, res) => {
  console.log("**** I'm in the get users endpoint");
  res.send(JSON.stringify(users));
});

app.post('/addtocart', upload.none(), (req, res) => {
  console.log("**** I'm in the addtocart endpoint");
  console.log('this is the body', req.body);
  let username = req.cookies.username;
  console.log('addtocart username', username);
  if (!cart[username]) {
    cart[username] = [];
  }
  cart[username].push(req.body);
  console.log('addtocart cart', cart);
  console.log('addtocart cart at username', cart[username]);
  res.send(JSON.stringify({ cart: cart[username] }));
});

app.get('/setcart', upload.none(), (req, res) => {
  console.log("**** I'm in the get cart endpoint");
  let username = req.cookies.username;
  console.log('cart username', username);
  if (!cart[username]) {
    cart[username] = [];
  }
  res.send(JSON.stringify({ cart: cart[username] }));
});

app.post('/checkout', upload.none(), (req, res) => {
  console.log("**** I'm in the post checkout endpoint");
  console.log('this is the checkout body', req.body);
  const cart = req.body;
  for (let i = 0; i < cart.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (cart[i].id === items[j].id) {
        items.splice(j, 1);
      }
    }
  }
  res.send(JSON.stringify({ cart: cart }));
});

app.post('/removefromcart', upload.none(), (req, res) => {
  console.log("**** I'm in the post removefromcart endpoint");
  console.log('this is the removefromcart body', req.body);
  let username = req.cookies.username;
  const item = req.body;
  const userCart = cart[username];
  for (let i = 0; i < userCart.length; i++) {
    if (userCart[i].id === item.id) {
      userCart.splice(i, 1);
    }
  }
  res.send(JSON.stringify({ cart: userCart }));
});

app.post('/additem', upload.single('imgPath'), (req, res) => {
  console.log('*** inside add item');
  console.log('body', req.body);
  // name, year, price, image, format, description, id, sellerId
  const name = req.body.name;
  const year = req.body.year;
  const price = req.body.price;
  const imgPath = `/imgs/${req.file.filename}`;
  const format = req.body.format;
  const description = req.body.description;
  const id = randomString();
  const sellerId = req.cookies.id;
  const seller = req.cookies.name;
  const itemToAdd = new NewItem(
    name,
    year,
    price,
    imgPath,
    format,
    description,
    id,
    sellerId,
    seller
  );
  console.log('itemToAdd', itemToAdd);
  items.push(itemToAdd);
  res.send(JSON.stringify({ success: true, itemToAdd }));
});

// Your endpoints go before this line

app.all('/*', (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + '/build/index.html');
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});
