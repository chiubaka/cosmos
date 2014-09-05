var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;

var osConfigs = {
	osx: {
		portRedirectCmd: 'sudo ipfw add 100 fwd 127.0.0.1,2001 tcp from any to ' +
			'any 80 in && sudo ipfw add 101 fwd 127.0.0.1,2000 tcp from any to ' +
			'any 443 in'
	},
	linux: {
		portRedirectCmd: 'sudo iptables -t nat -A PREROUTING -i eth0 -p tcp ' +
			'--dport 80 -j REDIRECT --to-port 2001 && sudo iptables -t nat -A '+
			'PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 2000'
	}
}

var config = {
	os: undefined,
	productionMode: undefined,
};

// Change current working directory to the script's directory
process.chdir(__dirname);

parseCommandLineOptions();

function parseCommandLineOptions() {
	// Parse commmand line options
	if (argv['local']) {
		config['productionMode'] = 'local';
	}
	else if (argv['dev']) {
		config['productionMode'] = 'dev';
	}
	else if (argv['preview']) {
		config['productionMode'] = 'preview';
	}
	else {
		console.error('Error: No configuration specified.');
		console.error('Available configurations are: --local --dev --preview');
		process.exit(1);
	}
	redirectPorts();
}

function redirectPorts() {
	console.log('Changing firewall rules...');
	switch(process.platform) {
		case 'darwin':
			config['os'] = 'osx';
			break;
		case 'linux':
			config['os'] = 'linux';
			break;
		default:
			console.error('Error: Your OS is not supported!');
			process.exit(1);
	}

	exec(osConfigs[config.os].portRedirectCmd, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		startPhysicsServer();
		startGameServer();
	});
}

// Start physics server
function startPhysicsServer() {
	console.log('Starting physics server...');
	var cmd = __dirname + '/physics/scripts/start_physics_server.sh &';
	var cwd = 'physics/bin/' + config.os;
	exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		startGameServer();
	});
}

// Start game server
function startGameServer() {
	var cmd = 'grunt production:' + config.productionMode + ' &';
	var cwd = '.';
	exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		startExpressServer();
	});
}

// Start express server
function startExpressServer() {
	var cmd = 'grunt production:' + config.productionMode + ' &';
	var cwd = 'client';
	exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		console.log('Done launching Cosmos!');
	});
}

function printOutput(err, stdout, stderr) {
	if (stdout) console.log('stdout:\n' + stdout);
	if (stderr) console.error('stderr:\n' + stderr);
	if (err) console.error('exec error:\n' + err);
}

