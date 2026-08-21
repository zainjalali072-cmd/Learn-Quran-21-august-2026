async function testArchiveMain() {
  const url = "https://archive.org/";
  console.log("Fetching archive.org main page...");
  try {
    const response = await fetch(url);
    console.log("Main page status:", response.status);
  } catch (err) {
    console.error("Error:", err);
  }
}

testArchiveMain();
