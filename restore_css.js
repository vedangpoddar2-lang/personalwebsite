const { execSync } = require('child_process');
const fs = require('fs');
try {
    const output = execSync('git show HEAD:components/Timeline.module.css', { encoding: 'utf8' });
    fs.writeFileSync('restored_timeline.css', output);
    console.log('Successfully restored file.');
} catch (e) {
    console.error(e);
}
