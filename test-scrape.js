async function getLinks() {
  const urls = [
    "https://quranlearnacademy.com/downloads/",
    "https://quranlearnacademy.com/downloads"
  ];
  for (const url of urls) {
    console.log(`Fetching ${url}...`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      console.log("Status:", res.status);
      if (res.ok) {
        const text = await res.text();
        const matches = text.match(/href="([^"]+\.pdf)"/g);
        console.log("Found PDF links:", matches);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

getLinks();
