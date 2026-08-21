async function checkMetadata() {
  const ids = ["quran-para-01-to-30-pdf", "noorani-qaida-english-complete"];
  for (const id of ids) {
    const url = `https://archive.org/metadata/${id}`;
    console.log(`Fetching metadata for ${id}...`);
    try {
      const response = await fetch(url);
      console.log(`${id} status:`, response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Keys:", Object.keys(data));
        console.log("Metadata:", data.metadata);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

checkMetadata();
