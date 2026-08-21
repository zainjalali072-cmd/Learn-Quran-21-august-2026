import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function scanAllStreams() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  let totalStreams = 0;
  let matches = [];
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.Contents();
    if (!contents) continue;
    
    const streams = Array.isArray(contents) ? contents : [contents];
    for (let s = 0; s < streams.length; s++) {
      totalStreams++;
      const stream = streams[s];
      const rawBytes = stream.getContents();
      if (!rawBytes) continue;
      
      try {
        const decompressed = zlib.inflateSync(rawBytes);
        const text = decompressed.toString("binary");
        if (text.toLowerCase().includes("quran")) {
          matches.push({ page: i + 1, stream: s, keyword: "quran" });
        }
        if (text.toLowerCase().includes("academy")) {
          matches.push({ page: i + 1, stream: s, keyword: "academy" });
        }
        if (text.toLowerCase().includes("www.")) {
          matches.push({ page: i + 1, stream: s, keyword: "www." });
        }
      } catch (err) {
        // ignore zlib errors
      }
    }
  }
  
  console.log("Total streams scanned:", totalStreams);
  console.log("Matches found:", matches);
}

scanAllStreams();
