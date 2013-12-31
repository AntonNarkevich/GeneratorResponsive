/*global responsify*/
(function initClientMap() {
	responsify.clientMap = {
		bounds: {
			phone: { minWidth: 2, maxWidth: 767 },
			tablet: { minWidth: 768 },
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