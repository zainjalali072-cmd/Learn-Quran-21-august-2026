import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function testPositions() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  const contents = page.node.Contents();
  
  if (contents) {
    const rawBytes = contents.getContents();
    const decompressed = zlib.inflateSync(rawBytes);
    const text = decompressed.toString("utf-8");
    const lines = text.split("\n");
    console.log("Analyzing text objects on Page 1:");
    let currentY = null;
    let currentMatrix = null;
    for (const line of lines) {
      if (line.includes("Tm")) {
        currentMatrix = line;
        // Parse Tm matrix: [a b c d e f] Tm. Usually f is the y-coordinate.
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 6) {
          currentY = parseFloat(parts[5]);
        }
      }
      if (line.includes("Tj") || line.includes("TJ")) {
        console.log(`Matrix: ${currentMatrix} | Y: ${currentY} | Content: ${line}`);
      }
    }
  }
}

testPositions();
