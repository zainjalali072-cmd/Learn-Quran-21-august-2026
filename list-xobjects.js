import { PDFDocument } from "pdf-lib";

async function run() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const doc = await PDFDocument.load(await res.arrayBuffer());
  const page = doc.getPage(1); // Page 2
  
  const resources = page.node.Resources();
  if (resources) {
    const xObject = resources.get(PDFDocument.createLiteralName("XObject"));
    if (xObject) {
      console.log("XObjects on Page 2:");
      const keys = xObject.keys();
      for (const key of keys) {
        const value = xObject.get(key);
        console.log(`  Key: ${key.toString()} | Type: ${value?.constructor.name}`);
      }
    } else {
      console.log("No XObjects found in resources of Page 2");
    }
  }
}

run();
