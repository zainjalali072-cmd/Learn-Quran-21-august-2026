import { PDFDocument } from "pdf-lib";

async function findWatermark() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const contents = page.node.Contents();
    if (!contents) continue;
    
    const streams = Array.isArray(contents) ? contents : [contents];
    for (let s = 0; s < streams.length; s++) {
      const stream = streams[s];
      // Check if getContentsString exists
      if (typeof stream.getContentsString === "function") {
        const text = stream.getContentsString();
        if (text.includes("quranlearnacademy")) {
          console.log(`Page ${i + 1} stream ${s} contains watermark!`);
          console.log("Length of text:", text.length);
          // Let's print occurrences
          let idx = text.indexOf("quranlearnacademy");
          while (idx !== -1) {
            console.log("Context around idx", idx, ":", text.substring(idx - 50, idx + 100));
            idx = text.indexOf("quranlearnacademy", idx + 1);
          }
        }
      }
    }
  }
}

findWatermark();
