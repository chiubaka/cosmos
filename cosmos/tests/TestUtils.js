var TestUtils = {
	loggingEnabled: true,
	defaultLogFunctions: {
		log: console.log,
		warn: console.warn,
		error: console.error
	}
};

TestUtils.disableConsoleLogs = function() {
	// If console logs are already disabled do nothing.
	if (!TestUtils.loggingEnabled) {
		return;
	}

	TestUtils.loggingEnabled = false;

	console.log = function() {};
	console.warn = function() {};
	console.error = function() {};
};

TestUtils.enableConsoleLogs = function() {
	// If console logs are already enabled do nothing.
	if (TestUtils.loggingEnabled) {
		return;
	}

	TestUtils.loggingEnabled = true;

	console.log = TestUtils.defaultLogFunctions.log;
	console.warn = TestUtils.defaultLogFunctions.warn;
	console.error = TestUtils.defaultLogFunctions.error;
};