import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function printPdfStrings() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  for (let i = 0; i < 2; i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.Contents();
    if (!contents) continue;
    
    const streams = Array.isArray(contents) ? contents : [contents];
    for (let s = 0; s < streams.length; s++) {
      const stream = streams[s];
      const rawBytes = stream.getContents();
      if (!rawBytes) continue;
      
      try {
        const decompressed = zlib.inflateSync(rawBytes);
        const text = decompressed.toString("utf-8");
        // Let's find all instances of Tj or TJ
        console.log(`--- Page ${i + 1} Stream ${s} Strings ---`);
        const tjMatches = text.match(/\((.*?)\)\s*Tj/g);
        if (tjMatches) {
          console.log("Tj strings:", tjMatches.slice(0, 20));
        }
        const tj2Matches = text.match(/\[(.*?)\]\s*TJ/g);
        if (tj2Matches) {
          console.log("TJ strings:", tj2Matches.slice(0, 20));
        }
      } catch (e) {
        // ignore
      }
    }
  }
}

printPdfStrings();
