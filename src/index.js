// origin server
const origin = "https://demo.vendure.io/"

async function handleRequest(event) {
  const request = event.request;
  const cacheUrl = new URL(request.url);

  // Extract pathname and search parameters from url
  const { pathname, search } = cacheUrl;

  // Construct the cache key from the cache URL
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;

  // Check whether the value is already available in the cache
  // if not, you will need to fetch it from origin, and store it in the cache
  // for future access
  let response = await cache.match(cacheKey);

  if (!response) {
    console.log(
      `Response for request url: ${request.url} not present in cache. Fetching and caching request.`
    );
    // construct full url for origin request
    const fullURL = origin + pathname + search
    // If not in cache, get it from origin
    response = await fetch(fullURL);

    // Must use Response constructor to inherit all of response's fields
    response = new Response(response.body, response);

    // Cache API respects Cache-Control headers. Setting s-max-age to 10
    // will limit the response to be in cache for 10 seconds max

    // Any changes made to the response here will be reflected in the cached value
    response.headers.append('Cache-Control', 's-maxage=2628000');

    // Store the fetched response as cacheKey
    // Use waitUntil so you can return the response without blocking on
    // writing to cache
    event.waitUntil(cache.put(cacheKey, response.clone()));
  } else {
    console.log(`Cache hit for: ${request.url}.`);
  }
  return response;
}

addEventListener('fetch', event => {
  try {
    return event.respondWith(handleRequest(event));
  } catch (e) {
    return event.respondWith(new Response('Error thrown ' + e.message));
  }
});
