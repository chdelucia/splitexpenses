const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'node_modules', '@angular', 'cli', 'src', 'utilities', 'node-version.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  content = content.replace(
    /function isNodeVersionSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionSupported() {\n    return true;\n}'
  );
  content = content.replace(
    /function isNodeVersionMinSupported\(\) \{[\s\S]*?\n\}/,
    'function isNodeVersionMinSupported() {\n    return true;\n}'
  );
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Successfully patched Angular CLI Node.js version checks.');
} else {
  console.log('Angular CLI node-version.js not found, skipping patch.');
}
