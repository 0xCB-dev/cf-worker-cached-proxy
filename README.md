# Reverse Proxy for Cloudflare Workers

## useful to proxy the /assets/ path from vendure to your root domain where the storefront is hosted

the assets are fetched from the backend on request and cached for futher requests by cloudlfares CDN

- edit the origin const in src/index.js to your backend host: `https://demo.vendure.io`
- add a trigger to the worker on the route with the path you want to proxy to: `your-storefront.com/assets/*`
