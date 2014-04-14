var DeploymentUtils = {
	/**
	 * Gets the appropriate server URL to point the client to, according to the deployment stage defined in the HTML file.
	 * 
	 * @returns {String} the server URL that the client should connect to
	 */
	getServerUrl: function() {
		var selectedServer = DeploymentConfig.SERVERURL_LOCAL;

		// Switch on the location host (must be a string)
		switch (location.hostname) {
			case DeploymentConfig.CLIENTURL_DEV:
				selectedServer = DeploymentConfig.SERVERURL_DEV;
				break;
			case DeploymentConfig.CLIENTURL_STAGING:
				selectedServer = DeploymentConfig.SERVERURL_STAGING;
				break;
			case DeploymentConfig.CLIENTURL_RELEASE:
				selectedServer = DeploymentConfig.SERVERURL_RELEASE;
				break;
			case undefined:
			default:
				selectedServer = DeploymentConfig.SERVERURL_LOCAL;
				break;
		}

		console.log("Deployment: Selected server " + selectedServer + " for hostname " + location.host);
		return selectedServer;
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = DeploymentUtils;
}