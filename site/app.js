// The download page: finds the GitHub repository this page belongs to, points the buttons at the latest release's files, and
// shows the Windows button to Windows visitors and the Mac buttons to Mac visitors (everything for anyone else).
(function () {
  const metaRepo = document.querySelector('meta[name="repo"]').content.trim();
  let repo = metaRepo;
  if (!repo) { // a GitHub Pages address: https://<owner>.github.io/<repo>/
    const m = location.hostname.match(/^([^.]+)\.github\.io$/i);
    const name = location.pathname.split('/').filter(Boolean)[0];
    if (m && name) repo = `${m[1]}/${name}`;
  }
  const base = repo ? `https://github.com/${repo}/releases/latest/download/` : '#';
  const files = { 'dl-win': 'Plushtype-Setup.exe', 'dl-mac-arm': 'Plushtype-mac-arm64.dmg', 'dl-mac-x64': 'Plushtype-mac-x64.dmg' };
  for (const [id, file] of Object.entries(files)) {
    const a = document.getElementById(id);
    a.href = repo ? base + file : '#install';
  }
  document.getElementById('src').href = repo ? `https://github.com/${repo}/releases` : '#';

  const ua = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent;
  const os = /mac/i.test(ua) && !/iphone|ipad/i.test(navigator.userAgent) ? 'mac' : /win/i.test(ua) ? 'win' : '';
  if (os) document.getElementById('cta').classList.add(os);
  if (os) document.getElementById(os === 'win' ? 'steps-mac' : 'steps-win').style.opacity = '0.55';

  if (repo) {
    fetch(`https://api.github.com/repos/${repo}/releases/latest`)
      .then((r) => (r.ok ? r.json() : null))
      .then((rel) => { if (rel && rel.tag_name) document.getElementById('version').textContent = `Latest version ${rel.tag_name.replace(/^v/, '')}. Free.`; })
      .catch(() => {});
  } else {
    document.getElementById('version').textContent = 'Free.';
  }
})();
