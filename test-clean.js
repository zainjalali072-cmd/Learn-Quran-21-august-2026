import { PDFDocument } from "pdf-lib";
import zlib from "zlib";
import fs from "fs";

async function testCleanWatermark() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.Contents();
    if (!contents) continue;
    
    const streams = Array.isArray(contents) ? contents : [contents];
    for (const stream of streams) {
      const rawBytes = stream.getContents();
      if (!rawBytes) continue;
      
      try {
        const decompressed = zlib.inflateSync(rawBytes);
        let text = decompressed.toString("binary");
        
        // Remove BT ... ET text blocks
        if (text.includes("BT") && text.includes("ET")) {
          text = text.replace(/BT[\s\S]*?ET/g, "");
          // Re-compress the modified text
          const compressed = zlib.deflateSync(Buffer.from(text, "binary"));
          // Set the modified contents
          stream.contents = compressed;
        }
      } catch (e) {
        console.error("Error on page", i, e);
      }
    }
  }
  
  // Save the modified PDF
  const modifiedBytes = await pdfDoc.save();
  
  // Load again to verify
  const verifyDoc = await PDFDocument.load(modifiedBytes);
  console.log("Verified total pages:", verifyDoc.getPageCount());
  
  // Let's check if there are any remaining Tj or TJ operators on page 1
  const firstPage = verifyDoc.getPage(0);
  const firstContents = firstPage.node.Contents();
  const verifyStream = Array.isArray(firstContents) ? firstContents[0] : firstContents;
  const verifyDecompressed = zlib.inflateSync(verifyStream.getContents());
  const verifyText = verifyDecompressed.toString("utf-8");
  console.log("Remaining BT on Page 1:", verifyText.includes("BT"));
  console.log("Remaining Tj on Page 1:", verifyText.includes("Tj"));
}

testCleanWatermark();
