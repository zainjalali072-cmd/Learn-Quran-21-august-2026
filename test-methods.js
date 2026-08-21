import { PDFDocument } from "pdf-lib";

async function printMethods() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  const contents = page.node.Contents();
  console.log("Contents type:", typeof contents);
  if (contents) {
    console.log("Contents constructor name:", contents.constructor.name);
    // Print keys of contents
    console.log("Contents keys:", Object.getOwnPropertyNames(contents));
    console.log("Contents prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(contents)));
  }
}

printMethods();
