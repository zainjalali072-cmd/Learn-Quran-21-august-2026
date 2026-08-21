import { PDFDocument } from "pdf-lib";
import fs from "fs";
import zlib from "zlib";

async function testReplaceWatermark() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  console.log("Downloading Para 1...");
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  let foundCount = 0;
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    // In pdf-lib, we can get the content streams
    const contents = page.node.Contents();
    if (!contents) continue;
    
    // contents can be a single PDFStream or a PDFArray of PDFStreams
    const contentStreams = Array.isArray(contents) ? contents : [contents];
    for (const stream of contentStreams) {
      // In pdf-lib, stream is a PDFStream or Ref
      // Let's get the raw bytes
      const bytes = stream.getUncompressedContents();
      if (!bytes) continue;
      const text = new TextDecoder().decode(bytes);
      if (text.includes("quranlearnacademy")) {
        foundCount++;
        console.log(`Page ${i + 1} stream contains watermark!`);
      }
    }
  }
  console.log(`Total watermarks found in uncompressed contents: ${foundCount}`);
}

testReplaceWatermark();
