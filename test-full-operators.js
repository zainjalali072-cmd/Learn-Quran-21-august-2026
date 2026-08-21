import { PDFDocument } from "pdf-lib";
import zlib from "zlib";

async function printAllOperators() {
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
    console.log("Full page content stream:");
    console.log(text);
  }
}

printAllOperators();
