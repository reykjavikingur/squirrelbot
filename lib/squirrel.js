const Promise = require('promise');
const cheerio = require('cheerio');
const CacheDirectory = require('./cache-directory');
const crawl = require('./crawl');

const squirrel = {

	async create(cachePathname, entrypointUrl) {
		const cache = new CacheDirectory(cachePathname);

		await cache.create();

		var promise = Promise.resolve();

		await crawl(entrypointUrl, (url, $) => {
			console.log('GET ' + url);
			const html = $.html();
			promise = promise.then(() => cache.set(url, html));
		});

		await promise;
	},

	async list(cachePathname) {
		const cache = new CacheDirectory(cachePathname);
		return await cache.list();
	},

	async query(cachePathname, selector) {
		const cache = new CacheDirectory(cachePathname);
		const results = {};
		await cache.forEach((url, html) => {
			const $ = cheerio.load(html);
			const selection = $(selector);
			if (selection.length > 0) {
				results[url] = selection;
			}
		});
		return results;
	}

};

module.exports = squirrel;
