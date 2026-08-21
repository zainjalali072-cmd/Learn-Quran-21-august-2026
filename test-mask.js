import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

async function maskPdf() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/03/1-alif-laam-meem.pdf";
  console.log("Downloading Para 1...");
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const pdfDoc = await PDFDocument.load(buffer);
  
  const pageCount = pdfDoc.getPageCount();
  console.log(`Loaded PDF with ${pageCount} pages.`);
  
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    
    // Draw white rectangle at the top to cover header
    // Origin is bottom-left, so top is at height - headerHeight
    const headerHeight = 55;
    page.drawRectangle({
      x: 0,
      y: height - headerHeight,
      width: width,
      height: headerHeight,
      color: rgb(1, 1, 1), // white
    });
    
    // Draw white rectangle at the bottom to cover footer
    const footerHeight = 45;
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: footerHeight,
      color: rgb(1, 1, 1), // white
    });
  }
  
  const modifiedBytes = await pdfDoc.save();
  fs.mkdirSync("public/paras", { recursive: true });
  fs.writeFileSync("public/paras/para-01.pdf", Buffer.from(modifiedBytes));
  console.log("Saved masked Para 1 to public/paras/para-01.pdf");
}

maskPdf();
