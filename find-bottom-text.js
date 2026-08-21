import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

function decompressStream(stream) {
  try {
    const contents = stream.getContents();
    return zlib.inflateSync(contents).toString("utf-8");
  } catch (err) {
    try {
      const contents = stream.getContents();
      return zlib.inflateRawSync(contents).toString("utf-8");
    } catch (e) {
      return null;
    }
  }
}

async function run() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const doc = await PDFDocument.load(await res.arrayBuffer());
  const pageCount = doc.getPageCount();
  
  console.log(`Analyzing bottom text objects of ${pageCount} pages...`);
  
  for (let idx = 0; idx < pageCount; idx++) {
    const page = doc.getPage(idx);
    const contents = page.node.Contents();
    if (!contents) continue;
    
    let streams = [];
    if (contents.asArray) {
      streams = contents.asArray();
    } else {
      streams = [contents];
    }
    
    for (let sIdx = 0; sIdx < streams.length; sIdx++) {
      const streamText = decompressStream(streams[sIdx]);
      if (!streamText) continue;
      
      const lines = streamText.split("\n");
      let currentY = 0;
      let currentX = 0;
      
      for (const line of lines) {
        if (line.includes("Tm")) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 6) {
            currentX = parseFloat(parts[4]);
            currentY = parseFloat(parts[5]);
          }
        }
        if (line.includes("Tj") || line.includes("TJ")) {
          // If the text is near the bottom (e.g. Y from top > 750)
          if (currentY > 750 && currentY < 842) {
            console.log(`Page ${idx + 1} | X: ${currentX}, Y: ${currentY} (from bottom: ${842 - currentY}) | Tj/TJ: ${line}`);
          }
        }
      }
    }
  }
}

run();
