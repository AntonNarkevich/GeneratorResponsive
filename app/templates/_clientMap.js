/*global responsify*/
(function initClientMap() {
	responsify.clientMap = {
		bounds: {
			phone: { minWidth: 2, maxWidth: <%= tabletResolution - 1 %> },
			tablet: { minWidth: <%= tabletResolution %> },
			desktop: { maxWidth: 1 }
		},
		sources: {
			js: [
				/*common*/
				{ src: "master.js", callback: "runMaster" }
			],
			css: [
				/*common*/
				{ href: "../css/master.css", id: "rd-master-css" }
			]
		}
	};
}());