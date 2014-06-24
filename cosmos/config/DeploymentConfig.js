var DeploymentConfig = {

	/**
	 * Deployed client URLs
	 */
	CLIENTURL_DEV: "dev.cosmos.teamleonine.com",
	CLIENTURL_STAGING: "stg.cosmos.teamleonine.com",
	CLIENTURL_RELEASE: "cosmos.teamleonine.com",
	CLIENTURL_PREVIEW: "preview.cosmos.teamleonine.com",
	CLIENTURL_PREVIEW_AZURE: "tl-cosmos-client-preview.azurewebsites.net",
	CLIENTURL_DANIEL: "tl-cosmos-client-daniel.azurewebsites.net",
	CLIENTURL_DERRICK: "tl-cosmos-client-derrick.azurewebsites.net",
	CLIENTURL_ERIC: "tl-cosmos-client-eric.azurewebsites.net",
	CLIENTURL_RAFAEL: "tl-cosmos-client-rafael.azurewebsites.net",

	/**
	 * Deployed server URLs
	 */
	SERVERURL_LOCAL: "http://" + location.hostname + ":2000",
	SERVERURL_DEV: "http://dev.srv.cosmos.teamleonine.com",
	SERVERURL_STAGING: "http://stg.srv.cosmos.teamleonine.com",
	SERVERURL_RELEASE: "http://srv.cosmos.teamleonine.com",
	SERVERURL_PREVIEW: "http://preview.srv.cosmos.teamleonine.com",
	SERVERURL_DANIEL: "tl-cosmos-server-daniel.azurewebsites.net",
	SERVERURL_DERRICK: "tl-cosmos-server-derrick.azurewebsites.net",
	SERVERURL_ERIC: "tl-cosmos-server-eric.azurewebsites.net",
	SERVERURL_RAFAEL: "tl-cosmos-server-rafael.azurewebsites.net"
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = DeploymentConfig;
}