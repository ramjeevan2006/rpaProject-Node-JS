// Demo sample using ABBYY Cloud OCR SDK from Node.js

if (((typeof process) == 'undefined') || ((typeof window) != 'undefined')) {
	throw new Error("This code must be run on server side under NodeJS");
}

// !!! Please provide your application id and password and remove this line !!!
// To create an application and obtain a password,
// register at http://cloud.ocrsdk.com/Account/Register
// More info on getting your application id and password at
// http://ocrsdk.com/documentation/faq/#faq3

// Name of application you created
var appId = 'ITCDemoApp';
// Password should be sent to your e-mail after application was created
var password = 'R/J4pwC7zrrQOqWkNVm9P+RQ';

var imagePath = 'D:/RPA/rpaProj/public/Images/sage-Layout-3.jpg';
var outputPath = 'result.txt';

try {
	console.log("ABBYY Cloud OCR SDK Sample for Node.js");

	var ocrsdkModule = require('./ocrsdk.js');
	var ocrsdk = ocrsdkModule.create(appId, password);
	ocrsdk.serverUrl = "http://cloud.ocrsdk.com"; // change to https for secure connection

	if (appId.length == 0 || password.length == 0) {
		throw new Error("Please provide your application id and password!");
	}
	
	if (imagePath == 'myFile.jpg') {
		throw new Error( "Please provide path to your image!");
	}

	function downloadCompleted(error) {
		if (error) {
			console.log("downloadCompleted Error: " + error.message);
			return;
		}
		console.log("downloadComplete Done.");
	}

	function processingCompleted(error, taskData) {
		if (error) {
			console.log("processingCompleted Error: " + error.message);
			return;
		}

		console.log('processingCompleted: Task Id=' + taskData.id + ', Status=' + taskData.status);
		if (taskData.status != 'Completed') {
			console.log("Error processing the task.");
			if (taskData.error) {
				console.log("Message: " + taskData.error);
			}
			return;
		}

		console.log("Processing completed.");
		console.log("Downloading result to " + outputPath);

		// ocrsdk.processFields(taskData.id, outputPath, processFieldsCompleted);
		ocrsdk.downloadResult(taskData.resultUrl.toString(), outputPath, downloadCompleted);
	}

	function processFieldsCompleted(error) {
		if (error) {
			console.log("processFieldsCompleted Error: " + error.message);
			return;
		}
		console.log("processFieldsCompleted Done.");
	}

	function uploadCompleted(error, taskData) {
		if (error) {
			console.log("uploadCompleted Error: " + error.message);
			return;
		}

		console.log('uploadCompleted: Task Id=' + taskData.id + ', Status=' + taskData.status);
		if (!ocrsdk.isTaskActive(taskData)) {
			console.log("Unexpected task status " + taskData.status);
			return;
		}

		ocrsdk.waitForCompletion(taskData.id, processingCompleted);
	}

	var settings = new ocrsdkModule.ProcessingSettings();
	settings.region = '32,148,150,160';
	settings.region = '544,264,596,278';
	// Set your own recognition language and output format here
	settings.language = "English"; // Can be comma-separated list, e.g. "German,French".
	// settings.exportFormat = "txt"; // All possible values are listed in 'exportFormat' parameter description 
                                   // at http://ocrsdk.com/documentation/apireference/processImage/

	console.log("Uploading image..");
	ocrsdk.processImage(imagePath, settings, uploadCompleted);

} catch (err) {
	console.log("Error: " + err.message);
}
