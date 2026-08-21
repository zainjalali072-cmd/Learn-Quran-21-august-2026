import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

async function inspectPdf() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  console.log("Downloading Para 1...");
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log("Download failed:", res.status);
      return;
    }
    const buffer = await res.arrayBuffer();
    const pdfDoc = await PDFDocument.load(buffer);
    console.log("Total pages:", pdfDoc.getPageCount());
    const firstPage = pdfDoc.getPage(0);
    const { width, height } = firstPage.getSize();
    console.log("Page 1 dimensions:", width, "x", height);
    
    // Check other pages
    const pageCount = pdfDoc.getPageCount();
    console.log("Checking page count of Para 1:", pageCount);
  } catch (err) {
    console.error("Error inspecting PDF:", err);
  }
}

inspectPdf();
