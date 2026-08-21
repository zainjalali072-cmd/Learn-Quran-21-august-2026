import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

// Ensure directories exist
fs.mkdirSync("public/paras", { recursive: true });
fs.mkdirSync("public/qaida", { recursive: true });

async function cleanPdf(inputBuffer, isQaida = false) {
  const pdfDoc = await PDFDocument.load(inputBuffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pageCount = pdfDoc.getPageCount();
  
  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    
    // Header masking
    // Origin is bottom-left, top is height - headerHeight
    const headerHeight = isQaida ? 40 : 125;
    page.drawRectangle({
      x: 0,
      y: height - headerHeight,
      width: width,
      height: headerHeight,
      color: rgb(1, 1, 1), // white
    });
    
    // Footer masking
    const footerHeight = isQaida ? 40 : 45;
    page.drawRectangle({
      x: 0,
      y: 0,
      width: width,
      height: footerHeight,
      color: rgb(1, 1, 1), // white
    });
    
    // Add watermark
    const text = "TruthQuranacademy.com";
    if (isQaida) {
      const fontSize = 5.5;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: 10,
        y: height - 12,
        size: fontSize,
        font: font,
        color: rgb(0.25, 0.25, 0.25),
      });
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: 8,
        size: fontSize,
        font: font,
        color: rgb(0.25, 0.25, 0.25),
      });
    } else {
      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: 30,
        y: height - 25,
        size: fontSize,
        font: font,
        color: rgb(0.25, 0.25, 0.25),
      });
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: 15,
        size: fontSize,
        font: font,
        color: rgb(0.25, 0.25, 0.25),
      });
    }
  }
  
  return await pdfDoc.save();
}

async function processFile(url, outputPath, isQaida = false) {
  try {
    console.log(`Downloading ${url}...`);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const buffer = await res.arrayBuffer();
    console.log(`Processing & cleaning ${path.basename(outputPath)}...`);
    const cleanedBytes = await cleanPdf(buffer, isQaida);
    fs.writeFileSync(outputPath, Buffer.from(cleanedBytes));
    console.log(`Successfully saved clean PDF to ${outputPath}`);
    return true;
  } catch (err) {
    console.error(`Error processing ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("=== STARTING BATCH DOWNLOAD AND CLEANING PROCESS ===");
  
  // 1. Process Noorani Qaida
  const qaidaUrl = "https://archive.org/download/noorani-qaida-english-complete/noorani-qaida-english-complete.pdf";
  const qaidaPath = "public/qaida/noorani-qaida-english-complete.pdf";
  await processFile(qaidaUrl, qaidaPath, true);
  
  // 2. Process all 30 Paras sequentially or in small chunks
  // Sequential is safer to avoid out-of-memory or rate-limiting
  for (let num = 1; num <= 30; num++) {
    const padded = String(num).padStart(2, "0");
    const paraUrl = `https://archive.org/download/quran-para-01-to-30-pdf/para-${padded}.pdf`;
    const paraPath = `public/paras/para-${padded}.pdf`;
    
    console.log(`\n--- [${num}/30] ---`);
    let success = await processFile(paraUrl, paraPath, false);
    if (!success) {
      console.log(`Retrying Para ${num} from alternative source...`);
      // Try from quranlearnacademy directly if archive.org fails
      // We mapped URLs from test-scrape:
      const nameMap = {
        1: "1-alif-laam-meem",
        2: "2-Sayaqool",
        3: "3-Tilkal-Rusull",
        4: "4-Lan-Tana-Loo",
        5: "5-Wal-Mohsanat",
        6: "6-La-Yuhibbullah",
        7: "7-Wa-Iza-Samiu",
        8: "8-Wa-Lau-Annana",
        9: "9-Qalal-Malao",
        10: "10-Wa-Alamu",
        11: "11-Yatazeroon",
        12: "12-Wa-Mamin-Daabat",
        13: "13-Wa-Ma-Ubrioo",
        14: "14-Rubama",
        15: "15-Subhanallazi",
        16: "16-Qal-Alam",
        17: "17-Aqtarabo",
        18: "18-Qadd-Aflaha",
        19: "19-Wa-Qalallazina",
        20: "20-Aman-Khalaq",
        21: "21-Utlu-Ma-Oohi",
        22: "22-Wa-Manyaqnut",
        23: "23-Wa-Mali",
        24: "24-Faman-Azlam",
        25: "25-Elahe-Yuruddo",
        26: "26-Haa-Meem",
        27: "27-Qala-Fama-Khatbukum",
        28: "28-Qadd-Sami-Allah",
        29: "29-Tabarakallazi",
        30: "30-Amma-Yatasaaloon"
      };
      const directUrl = `https://www.quranlearnacademy.com/wp-content/uploads/2021/03/${nameMap[num]}.pdf`;
      await processFile(directUrl, paraPath, false);
    }
  }
  
  console.log("\n=== COMPLETED BATCH PROCESS ===");
}

main();
