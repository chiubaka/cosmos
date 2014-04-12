var DeploymentConfig = {

	/**
	 * Deployed client URLs
	 */
	CLIENTURL_DEV: "dev.cosmos.teamleonine.com",
	CLIENTURL_STAGING: "stg.cosmos.teamleonine.com",
	CLIENTURL_RELEASE: "cosmos.teamleonine.com",

	/**
	 * Deployed server URLs
	 */
	SERVERURL_LOCAL: "http://" + location.hostname,
	SERVERURL_DEV: "http://dev.srv.cosmos.teamleonine.com",
	SERVERURL_STAGING: "http://stg.srv.cosmos.teamleonine.com",
	SERVERURL_RELEASE: "http://srv.cosmos.teamleonine.com",
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = DeploymentConfig;
}