var TestUtils = {
	loggingEnabled: true,
	defaultLogFunctions: {
		log: console.log,
		warn: console.warn,
		error: console.error
	}
};

TestUtils.disableLogging = function() {
	// If console logs are already disabled do nothing.
	if (!TestUtils.loggingEnabled) {
		return;
	}

	TestUtils.loggingEnabled = false;

	console.log = function() {};
	console.warn = function() {};
	console.error = function() {};
};

TestUtils.enableLogging = function() {
	// If console logs are already enabled do nothing.
	if (TestUtils.loggingEnabled) {
		return;
	}

	TestUtils.loggingEnabled = true;

	console.log = TestUtils.defaultLogFunctions.log;
	console.warn = TestUtils.defaultLogFunctions.warn;
	console.error = TestUtils.defaultLogFunctions.error;
};

TestUtils.testBlock = function(width, height) {
	var testBlock = new IronBlock();
	width = width || 1;
	height = height || 1;
	testBlock.gridData.width = width;
	testBlock.gridData.height = height;
	return testBlock;
};