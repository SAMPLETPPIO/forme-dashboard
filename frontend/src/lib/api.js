const BASE = import.meta.env.PROD ? '' : 'http://localhost:5000';
export async function api(path, opts={}) {
  const res = await fetch(BASE + '/api' + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}