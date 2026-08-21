import { PDFDocument, PDFName } from "pdf-lib";

async function inspectFirstPage() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  
  // Print resources of page 1
  const resources = page.node.Resources();
  if (resources) {
    const xObject = resources.get(PDFName.of("XObject"));
    if (xObject) {
      console.log("XObject exists!");
      console.log("Keys:", Object.keys(xObject));
      if (typeof xObject.keys === "function") {
        console.log("XObject keys list:", xObject.keys().map(k => k.asString()));
      }
    } else {
      console.log("No XObject on page 1");
    }
  }
}

inspectFirstPage();
