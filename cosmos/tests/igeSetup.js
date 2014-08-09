ige.isServer = false;
ige.isClient = true;

// Load empty textures so that we don't get caught on these when running tests.
ige.client.textures = {
	block: new IgeTexture(),
	glow: new IgeTexture(),
	background_helix_nebula: new IgeTexture(),
	background_starfield: new IgeTexture(),
	fixtureDebuggingTexture: new IgeTexture(),
	laserBeamTexture: new IgeTexture(),
	rectangleTexture: new IgeTexture(),
	healthBar: new IgeTexture(),

	// Cap textures
	mineCap_color: new IgeTexture(),
	mineCap_white: new IgeTexture(),
	constructCap_color: new IgeTexture(),
	constructCap_white: new IgeTexture(),
	baseCap_color: new IgeTexture(),
	baseCap_white: new IgeTexture(),

	// Block textures
	constructionZone: new IgeTexture(),
	power: new IgeTexture(),
	engine: new IgeTexture(),
	thruster: new IgeTexture(),
	kryptoniteThruster: new IgeTexture(),
	fuel: new IgeTexture(),
	cargo: new IgeTexture(),
	control: new IgeTexture(),
	miningLaser: new IgeTexture(),
	plating: new IgeTexture()
};