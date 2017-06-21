var express = require('express');
var router = express.Router();
var path = require('path');
var handlebars = require('express-handlebars')
var fileName ;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Online Cheque Processing System ',isUploaded: false, success: req.session.success, errors: req.session.errors });
  req.session.errors = null;
});

router.post('/upload', function(req, res,  next) {
  console.log('in upload');
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var sampleFile = req.files.sampleFile;
     fileName = req.files.sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path.join(__dirname+ '/../public', 'Images/')+fileName, function(err) {
        if (err)
            return res.status(400).send(err);

        res.render('index',{isUploaded: true, fileName: fileName, title: 'Express Cheque Processing System '});
    });
});

router.get('/recognizeImage', function(req, res, next) {

    console.log('in recognizeImage');
    console.log('in recognizeImage');
    //if (!req.files)
      //  return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   // var sampleFile = req.files.sampleFile;
   // var fileName = req.files.sampleFile.name;

    // Use the mv() method to place the file somewhere on your server
    //sampleFile.mv(path.join(__dirname+ '/../public', 'Images/')+fileName, function(err) {
       // if (err)
         //   return res.status(400).send(err);

        res.render('index',{isRecognized: true,isUploaded:true, fileName: fileName, title: 'Online Cheque Processing System '});
   // });
});


module.exports = router;
