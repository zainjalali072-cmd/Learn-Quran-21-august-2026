import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function decompressAndCheck() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  const contents = page.node.Contents();
  
  if (contents) {
    const rawBytes = contents.getContents ? contents.getContents() : null;
    if (rawBytes) {
      console.log("Raw bytes length:", rawBytes.length);
      try {
        const decompressed = zlib.inflateSync(rawBytes);
        console.log("Decompressed length:", decompressed.length);
        const text = decompressed.toString("utf-8");
        console.log("Decompressed text contains 'quran':", text.includes("quran"));
        console.log("Decompressed text sample:", text.substring(0, 500));
      } catch (err) {
        console.error("Zlib decompression error:", err);
      }
    }
  }
}

decompressAndCheck();
