import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function analyzeOperators() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  const contents = page.node.Contents();
  
  if (contents) {
    const streams = Array.isArray(contents) ? contents : [contents];
    for (let s = 0; s < streams.length; s++) {
      const stream = streams[s];
      const rawBytes = stream.getContents();
      if (!rawBytes) continue;
      
      try {
        const decompressed = zlib.inflateSync(rawBytes);
        const text = decompressed.toString("utf-8");
        const lines = text.split("\n");
        console.log(`--- Page 1 Stream ${s} Operators ---`);
        for (const line of lines) {
          // If the line draws text or sets text matrix
          if (line.includes("Tj") || line.includes("TJ") || line.includes("Tm") || line.includes("Td") || line.includes("Tf")) {
            console.log(line);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

analyzeOperators();
