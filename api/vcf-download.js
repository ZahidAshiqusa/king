const { Buffer } = require('buffer');

module.exports = async function handler(req, res){
  if(req.method !== 'GET') return res.status(405).send('Method not allowed');

  const file = req.query.file;
  if(!file) return res.status(400).send('file query required');

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  try {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/vcf/${encodeURIComponent(file)}?ref=${branch}`, {
      headers: { Authorization:`token ${token}`, Accept:'application/vnd.github.v3+json' }
    });
    if(!r.ok) throw new Error('GitHub GET failed '+r.status);
    const json = await r.json();
    const content = Buffer.from(json.content,'base64');
    res.setHeader('Content-Disposition', `attachment; filename=${file}`);
    res.setHeader('Content-Type','text/vcard');
    res.send(content);
  } catch(err){
    console.error(err);
    res.status(500).send(err.message);
  }
};
