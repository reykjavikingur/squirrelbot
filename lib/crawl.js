const util = require('util');
const Crawler = require('cheerio-crawler');

function crawl(entrypoint, iterate) {
	const c = util.promisify(Crawler(iterate));
	return c(entrypoint);
}

module.exports = crawl;
