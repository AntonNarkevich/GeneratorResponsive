'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var fs = require('fs');

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
			message: 'What is your s3 key? You can set it later in gruntfile.js.',
			default: 'HereShouldBeYourS3Key'
		},
		{
			name: 's3Secret',
			message: 'What is your s3 secret? You can set it later in gruntfile.js.',
			default: 'HereShouldBeYourS3Secret'
		}
	];


	this.prompt(prompts, function (props) {
		var config = {
			projectName: props.projectName,

			mobileResolution: props.mobileResolution,
			tabletResolution: props.tabletResolution,

			s3Key: props.s3Key,
			s3Secret: props.s3Secret
		};

		for (var propName in config) {
			if (config.hasOwnProperty(propName)) {
				this[propName] = config[propName];
			}
		}

		fs.writeFile('respConfig.json', JSON.stringify(config, null, 4), function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log("\tConfig saved to respConfig.json");
			}
		});

		cb();
	}.bind(this));
};

GeneratorResponsiveGenerator.prototype.app = function app() {
	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');
	this.template('_gruntfile.js', 'gruntfile.js');

	this.copy('.hgignore', '.hgignore');

	this.template('_clientMap.js', 'sources/js/clientMap.js');
	this.copy('master.js', 'sources/js/master.js');

	this.template('_master.less', 'sources/less/master.less');
	this.copy('mixins.less', 'sources/less/common/mixins.less');
	this.copy('variables.less', 'sources/less/common/variables.less');

	this.mkdir('sources/fonts');
	this.mkdir('sources/images');
	this.mkdir('sources/templates');
};
