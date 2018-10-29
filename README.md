# squirrelbot

Command-line utility that can crawl a web server recursively,
cache a collection of HTML responses,
and query them using CSS selectors.

## Command-Line Usage

`node sqrl create CACHEFILE ENTRYPOINT`
to create a cache file by crawling from entrypoint

`node sqrl list CACHEFILE`
to list the URL's in the cache file

`node sqrl query CACHEFILE SELECTOR`
to query the HTML documents in the cache file by the CSS selector
