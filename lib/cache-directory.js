const util = require('util');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

/**
 * Creates and manages directory of cached HTML files
 * with index.json containing the URL's
 * and each file named after the MD5 sum of the URL.
 *
 * Usage:
 * Instantiate with a path name.
 * Use "create" to make the directory and initialize the index file.
 * Use "set" to add key-value pairs.
 * Then use "list" to get all the URL's
 * and "get" to get the values keyed off of a URL.
 */
class CacheDirectory {

	constructor(pathname) {
		this.pathname = pathname;
	}

	async create() {
		await mkdir(this.pathname);
		await this.setIndex({});
	}

	async set(key, value) {
		const index = await this.getIndex();
		index[key] = true;
		await this.setIndex(index);
		return await writeFile(this.valuePathname(key), value, 'utf8');
	}

	async get(key) {
		return await readFile(this.valuePathname(key), 'utf8');
	}

	async list() {
		const index = await this.getIndex();
		return Object.keys(index);
	}

	async forEach(cb) {
		const list = await this.list();
		for (let url of list) {
			let html = await this.get(url);
			cb(url, html);
		}
	}

	indexPathname() {
		return path.join(this.pathname, 'index.json');
	}

	valuePathname(key) {
		return path.join(this.pathname, md5(key) + '.html');
	}

	async getIndex() {
		const string = await readFile(this.indexPathname(), 'utf8');
		return JSON.parse(string);
	}

	async setIndex(data) {
		const string = JSON.stringify(data);
		return await writeFile(this.indexPathname(), string, 'utf8');
	}

}

module.exports = CacheDirectory;
