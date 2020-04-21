const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');

// 引用express-handlebars
const exphbs = require('express-handlebars');

//fix handlebars
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');



//express-ssession
const session = require('express-session');



// 引用 body-parser
const bodyParser = require('body-parser');

// 引用 method-override
const methodOverride = require('method-override');



// 載入 passport
const passport = require('passport');




// 登入後可以取得使用者的資訊方便我們在 view 裡面直接使用
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
});

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
//設定bodyparser json
app.use(bodyParser.json());

//使用helper
const hbs = exphbs.create({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  //create custom helpers
  helpers: {
    addOne: function (value) {
      return ++value;
    },
    dateFormat: function (date) {
      try {
        return new Date(date).toISOString().split('T')[0];
      }
      catch (e) {
        return "尚未填寫"
      }
    },
    selectCompare: function (v1, v2, options) {
      if (v1 === v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
});





app.use(session({
  secret: 'your secret key',   // secret: 定義一組屬於你的字串做為私鑰
  resave: false,
  saveUninitialized: true,
}));
// 使用 Passport 
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // 載入 Passport config

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
});

// 告訴express 使用handlebars 當作template engine 並預設layout 是main
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'));

mongoose.connect('mongodb://db/engineerLog', { useNewUrlParser: true, useCreateIndex: true });// 設定連線到 mongoDB
const db = mongoose.connection; // mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
//連線異常
db.on('error', () => {
  console.log('mongodb error:(')
});
//連線成功
db.once('open', () => {
  console.log('mongodb connected:)')
});


// setting static files
app.use(express.static('public'));
//home router
app.use('/', require('./routes/home'));
//home router
app.use('/engineerLog', require('./routes/engineerLog'));

//api router
app.use('/api', require('./routes/api'));

//users router
app.use('/users', require('./routes/users.js'));









app.listen(port, () => {
  console.log(`web on ${port}`)
});
