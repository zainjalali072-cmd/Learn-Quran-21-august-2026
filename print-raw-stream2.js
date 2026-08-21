import { PDFDocument } from "pdf-lib";

async function run() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  const res = await fetch(url);
  const doc = await PDFDocument.load(await res.arrayBuffer());
  const page = doc.getPage(1); // Page 2
  const contents = page.node.Contents();
  if (contents) {
    const bytes = contents.getContents();
    console.log("Page 2 raw bytes (length " + bytes.length + "):");
    console.log(Buffer.from(bytes).toString("hex"));
    console.log(Buffer.from(bytes).toString("binary"));
  }
}

run();
