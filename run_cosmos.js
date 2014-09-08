var argv = require('minimist')(process.argv.slice(2));
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var osConfigs = {
	osx: {
		// Map port 80 -> 2001 and port 443 -> 2000
		// Port 80 (HTTP) and 443(HTTPS) are common ports that are likely not
		// firewalled. Note that 101 are 101 are arbitrary rule numbers.
		portRedirectCmd: 'sudo ipfw add 100 fwd 127.0.0.1,2001 tcp from any to ' +
			'any 80 in && sudo ipfw add 101 fwd 127.0.0.1,2000 tcp from any to ' +
			'any 443 in',
		// 1. Kills the express server and game server
		// 2. If the physics server is running,
		// 3. Kills the bash script responsible for restarting the physics server,
		// 4. Kills the physics server
		killGameCmd: 'pm2 delete all && ' +
			'$([$(pgrep physics_server) == ""] && : || ' +
			'$(kill $(ps -p $(pgrep physics_server) -o ppid=) && ' +
			'kill $(pgrep physics_server)))'
	},
	linux: {
		portRedirectCmd: 'sudo iptables -t nat -A PREROUTING -i eth0 -p tcp ' +
			'--dport 80 -j REDIRECT --to-port 2001 && sudo iptables -t nat -A '+
			'PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 2000',
		killGameCmd: 'pm2 delete all && ' +
			'$([$(pgrep physics_server) == ""] && : || ' +
			'$(kill $(ps -p $(pgrep physics_server) -o ppid=) && ' +
			'kill $(pgrep physics_server)))'
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
	osDetect();
}

function osDetect() {
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
	killExistingGame();
}

// Kill the existing express, game, and physics servers
function killExistingGame() {
	console.log('Killing existing game...');
	exec(osConfigs[config.os].killGameCmd, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		redirectPorts();
	});
}

// Change firewall rules to map port 80 -> 2001 and port 443 -> 2000
function redirectPorts() {
	console.log('Changing firewall rules...');
	exec(osConfigs[config.os].portRedirectCmd, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		startPhysicsServer();
	});
}

// Start physics server
function startPhysicsServer() {
	console.log('Starting physics server...');
	var cmd = __dirname + '/physics/scripts/start_physics_server.sh';
	var cwd = 'physics/bin/' + config.os;
	spawn(cmd, [], {cwd: cwd}); // Use spawn because bash script never exits
	startGameServer();

}

// Start game server
function startGameServer() {
	console.log('Starting game server...');
	var cmd = 'grunt production:' + config.productionMode;
	var cwd = '.';
	exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		startExpressServer();
	});
}

// Start express server
function startExpressServer() {
	console.log('Starting express server...');
	var cmd = 'grunt production:' + config.productionMode;
	var cwd = 'client';
	exec(cmd, {cwd: cwd}, function(err, stdout, stderr){
		printOutput(err, stdout, stderr);
		console.log('Done launching Cosmos!');
		process.exit(0);
	});
}

function printOutput(err, stdout, stderr) {
	if (stdout) console.log('stdout:\n' + stdout);
	if (stderr) console.error('stderr:\n' + stderr);
	if (err) console.error('exec error:\n' + err);
}

