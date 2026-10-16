const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsContent = fs.readFileSync(path.join(rootDir, 'assets', 'js', 'main.js'), 'utf8');

const htmlFiles = [
  'index.html',
  'seo-dashboard.html',
  'services.html',
  'case-studies.html',
  'blog.html',
  'blog-post-indexing.html',
  'contact.html'
];

htmlFiles.forEach(fileName => {
  const filePath = path.join(rootDir, fileName);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace external script tag with inlined script
  const targetTag = '<script src="/assets/js/main.js"></script>';
  const inlinedTag = `<script>\n${jsContent}\n</script>`;

  if (html.includes(targetTag)) {
    html = html.replace(targetTag, inlinedTag);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`Inlined JS into ${fileName}`);
  }
});
