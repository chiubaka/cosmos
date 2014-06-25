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
			case DeploymentConfig.CLIENTURL_PREVIEW:
			case DeploymentConfig.CLIENTURL_PREVIEW_AZURE:
				selectedServer = DeploymentConfig.SERVERURL_PREVIEW;
				break;
			case DeploymentConfig.CLIENTURL_DANIEL:
				selectedServer = DeploymentConfig.SERVERURL_DANIEL;
				break;
			case DeploymentConfig.CLIENTURL_DERRICK:
				selectedServer = DeploymentConfig.SERVERURL_DERRICK;
				break;
			case DeploymentConfig.CLIENTURL_ERIC:
				selectedServer = DeploymentConfig.SERVERURL_ERIC;
				break;
			case DeploymentConfig.CLIENTURL_RAFAEL:
				selectedServer = DeploymentConfig.SERVERURL_RAFAEL;
				break;
			case undefined:
			default:
				selectedServer = DeploymentConfig.SERVERURL_LOCAL;
				break;
		}

		console.log("DeploymentConfig: Client hostname at " + location.host + ", select server host " + selectedServer, 'info');
		return selectedServer;
	}
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = DeploymentUtils;
}