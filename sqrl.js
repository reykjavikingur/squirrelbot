const Promise = require('promise');
const squirrel = require('./lib/squirrel');

const commands = {
	create,
	list,
	query,
};

const args = process.argv.slice(2);

Promise.resolve(main(...args))
	.catch(e => {
		console.error(e.message);
		process.exit(1);
	})
;

function main(commandName, ...args) {
	if (!commandName) {
		return help();
	}
	const command = commands[commandName];
	if (command) {
		return command(...args);
	}
	else {
		return failure('Invalid command: ' + commandName);
	}
}

function help() {
	console.log('Available commands: ' + Object.keys(commands).join(', '));
}

function failure(message) {
	return Promise.reject(new Error(message));
}

function create(cachePathname, entrypointUrl) {
	if (!cachePathname) {
		return failure('you must specify the cache directory');
	}
	if (!entrypointUrl) {
		return failure('you must specify an entrypoint URL');
	}
	console.log('creating cache', cachePathname, 'from entrypoing URL', entrypointUrl);
	return squirrel.create(cachePathname, entrypointUrl);
}

async function list(cachePathname) {
	if (!cachePathname) {
		return failure('you must specify the cache directory');
	}
	console.log('listing contents of', cachePathname);
	const urls = await squirrel.list(cachePathname);
	for (let url of urls) {
		console.log(url);
	}
}

async function query(cachePathname, selector) {
	if (!cachePathname) {
		return failure('you must specify the cache directory');
	}
	if (!selector) {
		return failure('you must specify a CSS selector');
	}
	const results = await squirrel.query(cachePathname, selector);
	for (let url in results) {
		let selection = results[url];
		console.log(selection.length + '\t' + url);
	}
}
