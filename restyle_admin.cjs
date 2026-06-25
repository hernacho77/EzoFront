const fs = require('fs');
const path = require('path');

const adminComponentsDir = path.join(__dirname, 'src', 'components', 'admin');
const adminDashboardFile = path.join(__dirname, 'src', 'pages', 'AdminDashboard.jsx');

const replacements = [
  // Table headers & layout backgrounds
  { from: /bg-\[\#222222\]/g, to: 'bg-white/5' },
  { from: /bg-\[\#1a1a1a\]/g, to: 'bg-surface/40 backdrop-blur-md border border-white/5' },
  { from: /bg-\[\#1e1e1e\]/g, to: 'bg-white/5' },
  { from: /bg-\[\#111111\]/g, to: 'bg-background/80 border border-white/5' },
  { from: /bg-\[\#0f1115\]\/80/g, to: 'bg-background/80 backdrop-blur-xl border border-white/5' },
  { from: /bg-\[\#0f1115\]\/30/g, to: 'bg-background/30 backdrop-blur-xl border border-white/5' },
  
  // Hovers
  { from: /hover:bg-\[\#202020\]/g, to: 'hover:bg-white/5' },
  { from: /hover:bg-\[\#222222\]/g, to: 'hover:bg-white/5' },
  { from: /hover:bg-\[\#323232\]/g, to: 'hover:bg-white/15' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-white/10' },

  // Buttons
  { from: /bg-\[\#262626\]/g, to: 'bg-white/10 border border-white/5' },
  { from: /text-darkBg/g, to: 'text-white' },

  // Borders
  { from: /border-r-gray-800/g, to: 'border-r border-white/5' },
  { from: /border-gray-850/g, to: 'border-white/5' },
  { from: /divide-gray-850/g, to: 'divide-white/5' },
  { from: /border-white\/10/g, to: 'border border-white/10' },
  { from: /border-white\/5/g, to: 'border border-white/5' },
  { from: /border border border-white\/5/g, to: 'border border-white/5' },
  { from: /border border border-white\/10/g, to: 'border border-white/10' }
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File does not exist: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const rep of replacements) {
    content = content.replace(rep.from, rep.to);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Restyled: ${filePath}`);
  } else {
    console.log(`No changes: ${filePath}`);
  }
}

// Restyle all component files
if (fs.existsSync(adminComponentsDir)) {
  const files = fs.readdirSync(adminComponentsDir);
  for (const file of files) {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(path.join(adminComponentsDir, file));
    }
  }
}

// Restyle the dashboard page
processFile(adminDashboardFile);

console.log("Restyling completed!");
