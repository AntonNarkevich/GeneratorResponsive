'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var GeneratorResponsiveGenerator = module.exports = function GeneratorResponsiveGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GeneratorResponsiveGenerator, yeoman.generators.Base);

GeneratorResponsiveGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			type: 'confirm',
			name: 'someOption',
			message: 'Would you like to enable this option?',
			default: true
		},
		{
			name: 'mobileResolution',
			message: 'What is a resolution for the mobile breakpoint?'
		}
	];

	this.prompt(prompts, function (props) {
		this.someOption = props.someOption;
		this.mobileResolution = props.mobileResolution;

		cb();
	}.bind(this));
};

GeneratorResponsiveGenerator.prototype.app = function app() {
	this.mkdir('app');
	this.mkdir('app/templates');

	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');

	this.template('_master.less', 'app/less/master.less');
};

GeneratorResponsiveGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('editorconfig', '.editorconfig');
	this.copy('jshintrc', '.jshintrc');
};
