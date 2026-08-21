import fs from "fs";

async function testDownload() {
  const url = "https://archive.org/download/noorani-qaida-english-complete/noorani-qaida-english-complete.pdf";
  console.log("Starting Noorani Qaida download test...");
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      console.log("Success! Noorani Qaida exists!");
    } else {
      console.log("Failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

testDownload();
