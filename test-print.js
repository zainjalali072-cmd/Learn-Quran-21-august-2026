import { PDFDocument } from "pdf-lib";

async function printContentString() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  const contents = page.node.Contents();
  if (contents) {
    if (typeof contents.getContentsString === "function") {
      const text = contents.getContentsString();
      console.log("Length of content string:", text.length);
      console.log("First 200 chars:", text.substring(0, 200));
    }
  }
}

printContentString();
