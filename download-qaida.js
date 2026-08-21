import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";

async function downloadQaida() {
  const url = "https://www.quranlearnacademy.com/wp-content/uploads/2021/04/NOORANI-QAIDA-ENGLISH.pdf";
  const outputPath = "public/qaida/noorani-qaida-english-complete.pdf";
  
  console.log(`Downloading Noorani Qaida from ${url}...`);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    console.log("Processing Noorani Qaida...");
    const pdfDoc = await PDFDocument.load(buffer);
    const pageCount = pdfDoc.getPageCount();
    console.log(`Loaded Noorani Qaida with ${pageCount} pages.`);
    
    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      
      // Mask header
      const headerHeight = 45;
      page.drawRectangle({
        x: 0,
        y: height - headerHeight,
        width: width,
        height: headerHeight,
        color: rgb(1, 1, 1),
      });
      
      // Mask footer
      const footerHeight = 45;
      page.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: footerHeight,
        color: rgb(1, 1, 1),
      });
    }
    
    const cleanedBytes = await pdfDoc.save();
    fs.mkdirSync("public/qaida", { recursive: true });
    fs.writeFileSync(outputPath, Buffer.from(cleanedBytes));
    console.log(`Successfully saved clean Noorani Qaida to ${outputPath}`);
  } catch (err) {
    console.error("Error processing Noorani Qaida:", err);
  }
}

downloadQaida();
