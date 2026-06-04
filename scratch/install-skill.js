const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'ui-ux-pro-max-skill', 'src', 'ui-ux-pro-max');
const destDir = path.join(__dirname, '..', '.agents', 'skills', 'ui-ux-pro-max');

async function main() {
  console.log('Installing UI/UX Pro Max skill for Antigravity...');

  if (!fs.existsSync(srcDir)) {
    console.error(`Source directory does not exist: ${srcDir}`);
    process.exit(1);
  }

  // Create destination directory
  fs.mkdirSync(destDir, { recursive: true });

  // 1. Render SKILL.md
  const templatePath = path.join(srcDir, 'templates', 'base', 'skill-content.md');
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    process.exit(1);
  }

  let content = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders
  content = content
    .replace(/\{\{TITLE\}\}/g, 'ui-ux-pro-max')
    .replace(/\{\{DESCRIPTION\}\}/g, 'Comprehensive design guide for web and mobile applications. Contains 67 styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 16 technology stacks. Searchable database with priority-based recommendations.')
    .replace(/\{\{SCRIPT_PATH\}\}/g, 'skills/ui-ux-pro-max/scripts/search.py')
    .replace(/\{\{SKILL_OR_WORKFLOW\}\}/g, 'Skill')
    .replace(/\{\{QUICK_REFERENCE\}\}/g, '');

  const frontmatter = [
    '---',
    'name: ui-ux-pro-max',
    'description: "Comprehensive design guide for web and mobile applications. Contains 67 styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 16 technology stacks."',
    '---',
    '',
    ''
  ].join('\n');

  const finalSkillContent = frontmatter + content;
  fs.writeFileSync(path.join(destDir, 'SKILL.md'), finalSkillContent, 'utf-8');
  console.log('✓ Generated SKILL.md');

  // 2. Copy data directory
  const srcData = path.join(srcDir, 'data');
  const destData = path.join(destDir, 'data');
  copyFolderSync(srcData, destData);
  console.log('✓ Copied data directory');

  // 3. Copy scripts directory
  const srcScripts = path.join(srcDir, 'scripts');
  const destScripts = path.join(destDir, 'scripts');
  copyFolderSync(srcScripts, destScripts);
  console.log('✓ Copied scripts directory');

  console.log('UI/UX Pro Max skill successfully installed to .agents/skills/ui-ux-pro-max!');
}

function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const fromPath = path.join(from, element);
    const toPath = path.join(to, element);
    if (fs.lstatSync(fromPath).isDirectory()) {
      copyFolderSync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
