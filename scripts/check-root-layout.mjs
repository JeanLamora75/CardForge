import {execFileSync} from 'node:child_process';
const allowed=new Set([".gitignore","AGENTS.md","README.md","Test-CardForge.bat","index.html","package.json","package-lock.json","tsconfig.json","vite.config.ts"]);
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const unexpected=files.filter(p=>!p.includes('/')&&!allowed.has(p));
if(unexpected.length){console.error('Fichiers versionnés inattendus à la racine : '+unexpected.join(', '));process.exitCode=1;}else console.log('Racine CardForge conforme.');
