var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var routes = require('./routes/index');

var app = express();
var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
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
        },
        concat:  function (v1,v2) {
          console.log(v1);
          if (v1 == undefined){
            v1 = ' ';
          }
          if(v2){
            v1=  v1.bold();
          }
            finalString+=v1;
        return finalString;
    },
        verifyText: function(charArray){
            var finalString = ' ';
            for (var i = 0, len = charArray.length; i < len; i++) {
               if( charArray[i]._ == undefined){
                   charArray[i]._ = ' ';
               }
                if( charArray[i].suspicious){
                    charArray[i]._ = charArray[i]._.fontcolor("red").bold();
                }
                finalString+= charArray[i]._;

            }
            console.log(finalString);
            return finalString;
        }
    },
    extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'
});
var fileUpload = require('express-fileupload');
// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.locals.points = "10,000";
app.locals.videodata = require('./public/result/out2.json');
app.locals.resultdata = require('./public/result/out.json');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(fileUpload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

app.use('/', routes);
//app.use(express.static('public'))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
