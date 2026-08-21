import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function run() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const doc = await PDFDocument.load(await res.arrayBuffer());
  
  for (let idx = 0; idx < 3; idx++) {
    const page = doc.getPage(idx);
    const contents = page.node.Contents();
    if (!contents) {
      console.log(`Page ${idx + 1}: No contents`);
      continue;
    }
    
    let streams = Array.isArray(contents) ? contents : [contents];
    console.log(`Page ${idx + 1} has ${streams.length} streams`);
    
    for (let sIdx = 0; sIdx < streams.length; sIdx++) {
      const stream = streams[sIdx];
      const bytes = stream.getContents();
      console.log(`  Stream ${sIdx + 1} bytes length: ${bytes.length}`);
      
      // Let's try standard inflate
      try {
        const decompressed = zlib.inflateSync(Buffer.from(bytes));
        console.log(`    Success with inflateSync! Decompressed size: ${decompressed.length}`);
        continue;
      } catch (e) {
        console.log(`    inflateSync failed: ${e.message}`);
      }
      
      // Let's try inflateRaw
      try {
        const decompressed = zlib.inflateRawSync(Buffer.from(bytes));
        console.log(`    Success with inflateRawSync! Decompressed size: ${decompressed.length}`);
        continue;
      } catch (e) {
        console.log(`    inflateRawSync failed: ${e.message}`);
      }
    }
  }
}

run();
