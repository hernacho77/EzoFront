const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceAdminDir = 'c:/Users/indus/OneDrive/Escritorio/UPB/Semestre_7/ProyCerti3/ezo-front-gael/src/components/admin';
const targetAdminDir = 'c:/Users/indus/OneDrive/Escritorio/UPB/Semestre_7/ProyCerti3/Final-Front/EZO-CerIII/src/components/admin';

const sourcePagesDir = 'c:/Users/indus/OneDrive/Escritorio/UPB/Semestre_7/ProyCerti3/ezo-front-gael/src/pages';
const targetPagesDir = 'c:/Users/indus/OneDrive/Escritorio/UPB/Semestre_7/ProyCerti3/Final-Front/EZO-CerIII/src/pages';

// Ensure target directories exist
if (!fs.existsSync(targetAdminDir)) {
    fs.mkdirSync(targetAdminDir, { recursive: true });
}

// Helper to compile and rewrite a file
function convertFile(srcFile, destFile, isDashboard = false) {
    console.log(`Converting ${srcFile} -> ${destFile}`);
    // Run esbuild
    execSync(`npx esbuild "${srcFile}" --jsx=preserve --outfile="${destFile}"`);

    // Read generated content
    let content = fs.readFileSync(destFile, 'utf8');

    // Replace api imports
    content = content.replace(/..\/..\/services\/api/g, '../../api/axiosConfig');

    // Custom changes for dashboard
    if (isDashboard) {
        content = content.replace(/import { Navbar } from "\..\/components\/Navbar";/g, '');
        content = content.replace(/import { Navbar } from '\..\/components\/Navbar';/g, '');
        content = content.replace(/<Navbar \/>/g, '');
        content = content.replace(/bg-\[\#121212\]/g, 'bg-[#0f1115]/30');
    }

    // Apply general styles from gael to finalfront
    content = content.replace(/bg-\[\#121212\]/g, 'bg-[#0f1115]/80');
    content = content.replace(/bg-\[\#141414\]/g, 'bg-background/20');
    content = content.replace(/bg-\[\#1a1a1a\]/g, 'bg-surface/50 backdrop-blur-md');
    content = content.replace(/bg-\[\#1e1e1e\]/g, 'bg-white/5');
    content = content.replace(/bg-gray-900/g, 'bg-background/50');
    content = content.replace(/bg-steamBlue/g, 'bg-gradient-to-r from-blue-600 to-indigo-600');
    content = content.replace(/border-gray-800/g, 'border-white/5');
    content = content.replace(/border-gray-700/g, 'border-white/10');
    content = content.replace(/border-gray-850/g, 'border-white/5');
    content = content.replace(/text-steamBlue/g, 'text-blue-400');
    content = content.replace(/border-steamBlue/g, 'border-primary');
    content = content.replace(/hover:bg-opacity-90/g, 'hover:from-blue-500 hover:to-indigo-500');

    // Write it back
    fs.writeFileSync(destFile, content, 'utf8');
}

// Convert all files in admin dir
const adminFiles = fs.readdirSync(sourceAdminDir);
adminFiles.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const src = path.join(sourceAdminDir, file);
        const dest = path.join(targetAdminDir, file.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js'));
        convertFile(src, dest);
    }
});

// Convert AdminDashboard page
convertFile(
    path.join(sourcePagesDir, 'AdminDashboard.tsx'),
    path.join(targetPagesDir, 'AdminDashboard.jsx'),
    true
);

console.log("Admin conversion completed successfully!");
