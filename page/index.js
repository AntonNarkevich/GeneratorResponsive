'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var PageGenerator = module.exports = function PageGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the page subgenerator with the argument ' + this.name + '.');
};

util.inherits(PageGenerator, yeoman.generators.NamedBase);


PageGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			name: 'pageName',
			message: 'What is a page name?'
		}
	];

	this.prompt(prompts, function (props) {
		this.pageName = props.pageName;

		cb();
	}.bind(this));
};

PageGenerator.prototype.files = function files() {
  this.template('page.js', 'js/page.js');
  this.template('page.less', 'less/page.less');
};
