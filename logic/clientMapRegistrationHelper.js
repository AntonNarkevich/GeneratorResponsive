"use strict";
var log4js = require('log4js');
var logger = log4js.getLogger();

/**
 * Capitalizes first letter newPage => NewPage.
 * @param string String to capitalize.
 * @returns {string} Capitalized string.
 */
function capitalizeFirstLetter(string) {
	logger.trace('capitalizeFirstLetter: ' + string);

	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Gets js callback name by page name newPage => runNewPage.
 * @param pageName Name of the page.
 * @returns {string} Callback function name.
 */
function getJsCallbackName(pageName) {
	logger.trace('getJsCallbackName: ' + pageName);

	return 'run' + capitalizeFirstLetter(pageName);
}

/**
 * Generates callback name
 * and object literal, inserts it to the specific place in clientMap.js.
 * @param pageName Page to register.
 * @param clientMapString clientMap.js string content.
 * @returns {newClientMapString} Processed clientMap.js content
 */
function registerJsFile(pageName, clientMapString) {
	var jsArrayPattern, registrationString, callbackName, newClientMapString;

	/**
	 * Pattern of the last object in array like js: [{}, {}, {}]
	 * Warning: nested object are not supported.
	 * @type {RegExp}
	 */
	jsArrayPattern = new RegExp(
			'(js\\s*:\\s*\\[' +	//Starts with js: [
			'[\\s\\S]*?' +	//Array content, any symbols.
			'(\\s*)' +	//Getting whites before the last element to keep the aligning.
			'(?:{[^{]*?}))' +	//Object literal without nested objects.
			'(?:[^,])'	//	Doesn't have "," in the end. So it's the last in array.
	);

	callbackName = getJsCallbackName(pageName);

	logger.trace('registerJsFile: callbackName is ' + callbackName);

	registrationString = "{ src: 'pageName.js', contentCondition: ['#SomeUniqueElementIdFromThePage'], callback: 'callBackName'}\n"
		.replace('pageName', pageName)
		.replace('callBackName', callbackName);

	logger.trace('registerJsFile: registrationString is ' + registrationString);

	//Replace with: old content + spacing + reg. string
	newClientMapString = clientMapString.replace(jsArrayPattern, '$1,$2' + registrationString);

	logger.info('registerJsFile: insertion is completed:\n' + newClientMapString);

	return newClientMapString;
}

function registerCssFile(pageName, clientMapString) {
	var cssArrayPattern, registrationString, newClientMapString;

	/**
	 * Pattern of the last object in array like css: [ {}, {}, {} ]
	 * Warning: nested object are not supported.
	 * @type {RegExp}
	 */
	cssArrayPattern = new RegExp(
		'(css\\s*:\\s*\\[' +	//Starts with csss: [
			'[\\s\\S]*?' +	//Array content, any symbols.
			'(\\s*)' +	//Getting whites before the last element to keep the aligning.
			'(?:{[^{]*?}))' +	//Object literal without nested objects.
			'(?:[^,])'	//	Doesn't have "," in the end. So it's the last in array.
	);

	registrationString = "{ href: '../css/pageName.css', contentCondition: ['#SomeUniqueElementIdFromThePage']}\n"
		.replace('pageName', pageName);

	logger.trace('registerCssFile: registrationString is ' + registrationString);

	//Replace with: old content + spacing + reg. string
	newClientMapString = clientMapString.replace(cssArrayPattern, '$1,$2' + registrationString);

	logger.info('registerCssFile: insertion is completed:\n' + newClientMapString);

	return newClientMapString;
}

module.exports = {
	registerJsFile: registerJsFile,
	registerCssFile: registerCssFile,
	capitalizeFirstLetter: capitalizeFirstLetter,
	getJsCallbackName: getJsCallbackName
};