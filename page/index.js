'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var fs = require('fs');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);

	console.log('You called the page subgenerator with the argument ' + this.name + '.');

	//Reading config file. Should be written by main generator.
	var respConfig;

	try {
		var content = fs.readFileSync('respConfig.json', 'utf8');
		console.log(content);
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
	this.capitaliseFirstLetter = function capitaliseFirstLetter(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	this.template('page.js', 'js/' + this.name + '.js');
	this.template('page.less', 'less/' + this.name + '.less');
};

