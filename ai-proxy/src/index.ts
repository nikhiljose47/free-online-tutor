export default {
  async fetch(request: Request, env: any) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await request.json();

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'FreeTutor AI'
      },
      body: JSON.stringify(body)
    });

    return new Response(await res.text(), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
