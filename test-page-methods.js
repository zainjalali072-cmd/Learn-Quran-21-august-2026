import { PDFDocument } from "pdf-lib";

async function checkPageMethods() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  
  console.log("Page prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(page)));
  console.log("Page.node prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(page.node)));
}

checkPageMethods();
