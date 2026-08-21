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
      const { data, error } = await supabase.from('stats').select('*').eq('id', 1).single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { field } = req.body || {};
      const column = field === 'downloaded' ? 'total_downloaded' : 'total_analyzed';
      const { data: current, error: readErr } = await supabase.from('stats').select('*').eq('id', 1).single();
      if (readErr) throw readErr;
      const { data, error } = await supabase
        .from('stats')
        .update({ [column]: (current[column] || 0) + 1, updated_at: new Date().toISOString() })
        .eq('id', 1)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Stats API error:', err);
    res.status(500).json({ error: err.message });
  }
}
