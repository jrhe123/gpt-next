/**
 * Step 1: create cloudflare service with this script (to redirect all api calls to openAI)
 * Step 2:(optional) register your custom domain name to cloudflare (e.g., hejiarong.ca)
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  url.host = 'api.openai.com'
  return fetch(url, {
    headers: request.headers,
    method: request.method,
    body: request.body
  })
}
