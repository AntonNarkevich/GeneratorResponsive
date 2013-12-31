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
			name: 'projectName',
			message: 'What is a project name (will be used to configure s3 task)?'
		},
		{
			name: 'mobileResolution',
			message: 'What is a resolution for the mobile breakpoint?',
			default: 320
		},
		{
			name: 'tabletResolution',
			message: 'What is a resolution for the tablet breakpoint?',
			default: 768
		},
		{
			name: 's3Key',
			message: 'What is your s3 key?',
			default: 'HereShouldBeYourS3Key'
		},
		{
			name: 's3Secret',
			message: 'What is your s3 secret?',
			default: 'HereShouldBeYourS3Secret'
		}
	];

	this.prompt(prompts, function (props) {
		this.projectName = props.projectName;

		this.mobileResolution = props.mobileResolution;
		this.tabletResolution = props.tabletResolution;

		this.s3Key = props.s3Key;
		this.s3Secret = props.s3Secret;

		cb();
	}.bind(this));
};

GeneratorResponsiveGenerator.prototype.app = function app() {
	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');
	this.template('_gruntfile.js', 'gruntfile.js');

	this.template('_clientMap.js', 'responsive/sources/js/clientMap.js');
	this.copy('master.js', 'responsive/sources/js/master.js');

	this.template('_master.less', 'responsive/sources/less/master.less');
	this.copy('mixins.less', 'responsive/sources/less/common/mixins.less');
	this.copy('variables.less', 'responsive/sources/less/common/variables.less');

	this.mkdir('responsive/sources/fonts');
	this.mkdir('responsive/sources/images');
};

GeneratorResponsiveGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('editorconfig', '.editorconfig');
	this.copy('jshintrc', '.jshintrc');
};
