// Dear ANG v36 Cloudflare Worker：大概城市預填
// 部署後，把網址填到 index.html 裡的 window.DEARANG_GEO_WORKER_URL 或 GEO_WORKER_URL。
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/geo') {
      const cf = request.cf || {};
      return new Response(JSON.stringify({
        ok: true,
        country: cf.country || '',
        region: cf.region || '',
        city: cf.city || '',
        timezone: cf.timezone || '',
        postalCode: cf.postalCode || ''
      }), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'access-control-allow-origin': '*',
          'cache-control': 'no-store'
        }
      });
    }
    return new Response('OK', {headers:{'content-type':'text/plain; charset=utf-8'}});
  }
};
