var DeploymentConfig = {

	/**
	 * Deployed client URLs
	 */
	CLIENTURL_DEV: "dev.cosmos.teamleonine.com",
	CLIENTURL_STAGING: "stg.cosmos.teamleonine.com",
	CLIENTURL_RELEASE: "cosmos.teamleonine.com",
	CLIENTURL_PREVIEW: "preview.cosmos.teamleonine.com",
	CLIENTURL_PREVIEW_AZURE: "tl-cosmos-client-preview.azurewebsites.net",

	/**
	 * Deployed server URLs
	 */
	SERVERURL_LOCAL: "http://" + location.hostname + ":2000",
	SERVERURL_DEV: "http://dev.srv.cosmos.teamleonine.com",
	SERVERURL_STAGING: "http://stg.srv.cosmos.teamleonine.com",
	SERVERURL_RELEASE: "http://srv.cosmos.teamleonine.com",
	SERVERURL_PREVIEW: "http://preview.srv.teamleonine.com"
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = DeploymentConfig;
}