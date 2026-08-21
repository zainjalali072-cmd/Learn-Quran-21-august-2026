import { PDFDocument } from "pdf-lib";
import fs from "fs";

async function checkContentStream() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  console.log("Downloading...");
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  const page = pdfDoc.getPage(0);
  
  // Let's inspect the page content stream to see if we can find any strings like "quranlearnacademy"
  const content = page.node.Contents();
  if (content) {
    const stream = content.asString ? content.asString() : "";
    console.log("Stream contains quranlearnacademy:", stream.includes("quranlearnacademy"));
    console.log("Stream length:", stream.length);
    // Print a portion of the stream if it's there
    if (stream.includes("quranlearnacademy")) {
      const index = stream.indexOf("quranlearnacademy");
      console.log("Context:", stream.substring(Math.max(0, index - 100), index + 100));
    }
  }
}

checkContentStream();
