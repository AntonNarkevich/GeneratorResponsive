'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');
var helper = require('../logic/clientMapRegistrationHelper');

var log4js = require('log4js');
//Can't just set filename. Cur. dir. is set to the generated project folder.
var log4jsConfig = require('../log4js.json');
log4js.configure(log4jsConfig);
var logger = log4js.getLogger();

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);

	console.log('You called the page subgenerator with the argument ' + this.name + '.');

	//Reading config file. Should be written by main generator.
	var respConfig, content;

	try {
		content = fs.readFileSync('respConfig.json', 'utf8');
		respConfig = JSON.parse(content);
	}
	catch (exception) {
		throw new Error('Can\'t parse respConfig.json', exception);
	}

	//We'll use the same breakpoints etc for templates that was used by main generator.
	for (var propName in respConfig) {
		if (respConfig.hasOwnProperty(propName)) {
			this[propName] = respConfig[propName];
		}
	}
};

util.inherits(PageGenerator, yeoman.generators.NamedBase);

PageGenerator.prototype.files = function files() {
	var that = this;

	logger.trace('PageGenerator.prototype.files: name is ' + that.name);

	this.callBackName = helper.getJsCallbackName(this.name);

	logger.trace('PageGenerator.prototype.files: callBackName is ' + this.callBackName);

	this.template('page.js', 'sources/js/' + this.name + '.js');
	this.template('page.less', 'sources/less/' + this.name + '.less');

	console.log('Registration new files in clientMap.js');

	var clientMapFileName = 'sources/js/clientMap.js';

	//Registration in the clientMap.js
	fs.readFile(clientMapFileName, 'utf8', function (err, data) {
		var newClientMapString;

		logger.trace('PageGenerator.prototype.files: clentMap data is:\n' + data);

		if (err) {
			logger.error('Couldn\'t read clientMap.js to register new page.\n' + err);
			console.warn('Couldn\'t read clientMap.js. You have to register it manually.');
		}

		//Process the string twice to register css and js.
		newClientMapString = helper.registerJsFile(that.name, data);
		newClientMapString = helper.registerCssFile(that.name, newClientMapString);

		logger.trace('PageGenerator.prototype.files: writing to ' + clientMapFileName);

		fs.writeFile(clientMapFileName, newClientMapString, 'utf8', function (err) {
			if (err) {
				logger.error('Couldn\'t write to clientMap.js to register new page: ' + err);
				console.warn('Couldn\'t writer to clientMap.js. You have to register it manually.');
			}
		});
	});
};

