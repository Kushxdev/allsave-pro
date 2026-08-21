import supabase from './db-client.js';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
      const { data, error } = await supabase
        .from('download_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { platform, title, thumbnail, source_url, status } = req.body || {};
      if (!platform || !source_url) return res.status(400).json({ error: 'platform and source_url are required' });
      const { data, error } = await supabase
        .from('download_history')
        .insert({
          platform,
          title: (title || 'Untitled').toString().slice(0, 300),
          thumbnail: thumbnail || null,
          source_url,
          status: status || 'ready',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('History API error:', err);
    res.status(500).json({ error: err.message });
  }
}
