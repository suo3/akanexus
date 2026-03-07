async function test() {
    const url = "https://riptujvubywixiyskkbv.supabase.co/functions/v1/audit-engine";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUrl: "https://google.com" })
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}
test();
