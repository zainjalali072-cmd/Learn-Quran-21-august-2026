const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const parasInfo = [
  { id: 1, arabic: "المّ", english: "Alif Lam Meem" },
  { id: 2, arabic: "سيقول", english: "Sayaqool" },
  { id: 3, arabic: "تلك الرسل", english: "Tilkal Rusull" },
  { id: 4, arabic: "لن تنالوا", english: "Lan Tana Loo" },
  { id: 5, arabic: "والمحصنات", english: "Wal Mohsanat" },
  { id: 6, arabic: "لا يحب الله", english: "La Yuhibbullah" },
  { id: 7, arabic: "واذا سمعوا", english: "Wa Iza Samiu" },
  { id: 8, arabic: "ولو اننا", english: "Wa Lau Annana" },
  { id: 9, arabic: "قال الملاء", english: "Qalal Malao" },
  { id: 10, arabic: "واعلموا", english: "Wa A'lamu" },
  { id: 11, arabic: "يعتذرون", english: "Yatazeroon" },
  { id: 12, arabic: "وما من دابة", english: "Wa Mamin Da'abat" },
  { id: 13, arabic: "وما ابرئ", english: "Wa Ma Ubrioo" },
  { id: 14, arabic: "ربما", english: "Rubama" },
  { id: 15, arabic: "سبحان الذي", english: "Subhanallazi" },
  { id: 16, arabic: "قال الم", english: "Qal Alam" },
  { id: 17, arabic: "اقترب", english: "Aqtarabo" },
  { id: 18, arabic: "قد افلح", english: "Qadd Aflaha" },
  { id: 19, arabic: "وقال الذين", english: "Wa Qalallazina" },
  { id: 20, arabic: "امن خلق", english: "A'man Khalaq" },
  { id: 21, arabic: "اتل ما اوحي", english: "Utlu Ma Oohi" },
  { id: 22, arabic: "ومن يقنت", english: "Wa Manyaqnut" },
  { id: 23, arabic: "وما لي", english: "Wa Mali" },
  { id: 24, arabic: "فمن اظلم", english: "Faman Azlam" },
  { id: 25, arabic: "اليه يرد", english: "Elahe Yuruddo" },
  { id: 26, arabic: "حم", english: "Ha'a Meem" },
  { id: 27, arabic: "قال فما خطبكم", english: "Qala Fama Khatbukum" },
  { id: 28, arabic: "قد سمع الله", english: "Qadd Sami Allah" },
  { id: 29, arabic: "تبارك الذي", english: "Tabarakallazi" },
  { id: 30, arabic: "عم يتساءلون", english: "Amma Yatasa'aloon" }
];

const fontRegular = path.join(process.cwd(), 'fonts/Amiri-Regular.ttf');
const fontBold = path.join(process.cwd(), 'fonts/Amiri-Bold.ttf');

const parasDir = path.join(process.cwd(), 'public/paras');
const qaidaDir = path.join(process.cwd(), 'public/qaida');

if (!fs.existsSync(parasDir)) fs.mkdirSync(parasDir, { recursive: true });
if (!fs.existsSync(qaidaDir)) fs.mkdirSync(qaidaDir, { recursive: true });

async function generatePara(info) {
  return new Promise(async (resolve, reject) => {
    try {
      const numStr = String(info.id).padStart(2, '0');
      const filePath = path.join(parasDir, `para-${numStr}.pdf`);
      console.log(`Fetching Para ${info.id} (${info.english})...`);

      const res = await fetch(`https://api.alquran.cloud/v1/juz/${info.id}/quran-uthmani`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const ayahs = json.data.ayahs;

      const doc = new PDFDocument({ margin: 36, size: 'A4', bufferPages: true });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Header on first page
      doc.font('Helvetica-Bold').fontSize(16).fillColor('#0f2b1d').text('TRUTH QURAN ACADEMY', { align: 'center' });
      doc.font('Helvetica').fontSize(11).fillColor('#b7791f').text('https://truthquranacademy.com', { align: 'center' });
      doc.moveDown(0.4);
      doc.font(fontBold).fontSize(20).fillColor('#1a365d').text(`Para ${info.id} – ${info.english} (${info.arabic})`, { align: 'center' });
      doc.moveDown(0.8);

      // Process Ayahs grouped by Surah
      let currentSurah = '';
      for (let i = 0; i < ayahs.length; i++) {
        const ayah = ayahs[i];
        if (ayah.surah.name !== currentSurah) {
          currentSurah = ayah.surah.name;
          doc.moveDown(0.6);
          // Surah Banner
          doc.font('Helvetica-Bold').fontSize(11).fillColor('#1a365d').text(`--- Surah ${ayah.surah.englishName} (${ayah.surah.name}) ---`, { align: 'center' });
          if (ayah.surah.number !== 1 && ayah.surah.number !== 9 && ayah.numberInSurah === 1) {
            doc.font(fontBold).fontSize(16).fillColor('#0f2b1d').text('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', { align: 'center' });
          }
          doc.moveDown(0.4);
        }

        const ayahText = ayah.text + ` ﴿${ayah.numberInSurah}﴾ `;
        doc.font(fontRegular).fontSize(16).fillColor('#1a202c').text(ayahText, {
          align: 'right',
          lineGap: 8
        });
      }

      // Add Headers & Footers across all pages
      const pages = doc.bufferedPageRange();
      for (let i = pages.start; i < pages.start + pages.count; i++) {
        doc.switchToPage(i);

        // Gold border frame
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .strokeColor('#d9b45c')
           .lineWidth(1)
           .stroke();

        // Footer Divider Line
        doc.moveTo(30, doc.page.height - 42)
           .lineTo(doc.page.width - 30, doc.page.height - 42)
           .strokeColor('#d9b45c')
           .lineWidth(0.5)
           .stroke();

        // Footer Branding Text
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f2b1d').text(
          `Truth Quran Academy  •  https://truthquranacademy.com  •  1-on-1 Online Quran & Tajweed Classes`,
          30,
          doc.page.height - 34,
          { width: doc.page.width - 60, align: 'center' }
        );

        // Page number
        doc.font('Helvetica').fontSize(8).fillColor('#718096').text(
          `Page ${i + 1} of ${pages.count}`,
          doc.page.width - 90,
          doc.page.height - 34,
          { align: 'right' }
        );
      }

      doc.end();
      writeStream.on('finish', () => {
        console.log(`✓ Para ${info.id} generated (${pages.count} pages, ${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
      writeStream.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

async function generateQaida() {
  return new Promise((resolve, reject) => {
    try {
      const filePath = path.join(qaidaDir, 'noorani-qaida-english-complete.pdf');
      console.log('Generating Noorani Qaida PDF...');

      const doc = new PDFDocument({ margin: 36, size: 'A4', bufferPages: true });
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Title & Branding Header
      doc.font('Helvetica-Bold').fontSize(18).fillColor('#0f2b1d').text('TRUTH QURAN ACADEMY', { align: 'center' });
      doc.font('Helvetica').fontSize(11).fillColor('#b7791f').text('https://truthquranacademy.com', { align: 'center' });
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').fontSize(22).fillColor('#1a365d').text('Complete English Noorani Qaida', { align: 'center' });
      doc.font('Helvetica').fontSize(11).fillColor('#4a5568').text('The Essential Step-by-Step Foundation for Arabic Phonetics & Quran Reading', { align: 'center' });
      doc.moveDown(1);

      const lessons = [
        { title: "Lesson 1: Individual Arabic Letters (Huroof Mufradat - حروف مفردة)", arabic: "ا  ب  ت  ث  ج  ح  خ  د  ذ  ر  ز  س  ش  ص  ض  ط  ظ  ع  غ  ف  ق  ك  ل  م  ن  و  ه  ء  ي", desc: "Learn the 29 individual Arabic alphabet letters and their correct articulation points (Makharij)." },
        { title: "Lesson 2: Compound Letters (Huroof Murakkabat - حروف مركبة)", arabic: "لا  با  تا  ثا  جيم  حا  خا  سا  شا  صا  ضا  طا  ظا", desc: "Recognize how letters connect at the beginning, middle, and end of words." },
        { title: "Lesson 3: Abbreviated Letters (Huroof Muqatta'at - حروف مقطعات)", arabic: "الم  المر  الر  كهيعص  طه  طسم  طس  يس  ص  حم  عسق  ق  ن", desc: "Mystic disconnected letters recited at the beginning of specific Quranic Surahs." },
        { title: "Lesson 4: Short Vowels (Harakat: Fatha, Kasra, Damma - الحركات)", arabic: "بَ (Ba)   بِ (Bi)   بُ (Bu)  •  تَ (Ta)   تِ (Ti)   تُ (Tu)", desc: "Master the 3 short vowel movements: Fatha (Zabar), Kasra (Zaer), Damma (Pesh)." },
        { title: "Lesson 5: Nunation (Tanween: Double Vowels - التنوين)", arabic: "بً (Ban)   بٍ (Bin)   بٌ (Bun)  •  تً (Tan)   تٍ (Tin)   تٌ (Tun)", desc: "Double short vowels representing an unwritten Sakin Nun sound at word endings." },
        { title: "Lesson 6: Exercises on Harakat and Tanween (تدريبات على الحركات والتنوين)", arabic: "أَبَدًا   أَحَدٌ   أَخَذَ   بَرَرَةٍ   جَعَلَ   حَسَدَ   خَلَقَ   ذَكَرَ", desc: "Practical word examples combining short vowels and tanween." },
        { title: "Lesson 7: Maddah Letters (Soft Vowel Stretches - حروف المدة)", arabic: "بَا (Baa)   بِي (Bee)   بُو (Boo)  •  مَا  مِي  مُو", desc: "Prolonging sounds using Alif Maddah, Ya Maddah, and Waw Maddah for 2 counts." },
        { title: "Lesson 8: Leen Letters (Soft Diphthongs - حروف اللين)", arabic: "بَوْ (Baw)   بَيْ (Bay)  •  تَوْ (Taw)   تَيْ (Tay)", desc: "Soft, flowing pronunciation when Waw or Ya have Sukoon preceded by a Fatha." },
        { title: "Lesson 9: Sukoon / Jazm (Unvoweled Silence - السكون)", arabic: "أَبْ   أَبِ   أَبُ  •  أَتْ   أَثْ   أَجْ   أَحْ   أَخْ", desc: "Reading silent letters marked with Jazm / Sukoon." },
        { title: "Lesson 10: Tashdeed / Shaddah (Doubled Emphasis - التشديد)", arabic: "رَبَّ   رَبِّ   رَبُّ  •  إِنَّ   أَنَّ   كَنَّ", desc: "Emphasizing doubled letters with a firm hold (Shaddah)." },
        { title: "Lesson 11: Tajweed Rules - Nun Sakinah & Tanween (إظهار ، إدغام ، إقلاب ، إخفاء)", arabic: "مَنْ آمَنَ (Izhar)  •  مَنْ يَقُولُ (Idgham)  •  مِنْ بَعْدِ (Iqlab)  •  مَنْ كَانَ (Ikhfa)", desc: "The four core rules governing Sakin Nun and Tanween sounds." },
        { title: "Lesson 12: Tajweed Rules - Meem Sakinah (أحكام الميم الساكنة)", arabic: "لَكُمْ مَا (Idgham Shafawi)  •  تَرْمِيهِمْ بِحِجَارَةٍ (Ikhfa Shafawi)", desc: "Rules for Sakin Meem: Idgham Shafawi, Ikhfa Shafawi, and Izhar Shafawi." }
      ];

      lessons.forEach((l, idx) => {
        doc.font('Helvetica-Bold').fontSize(13).fillColor('#1a365d').text(l.title);
        doc.font('Helvetica').fontSize(10).fillColor('#4a5568').text(l.desc);
        doc.moveDown(0.3);
        doc.font(fontBold).fontSize(18).fillColor('#0f2b1d').text(l.arabic, { align: 'right', lineGap: 6 });
        doc.moveDown(0.8);
        if (idx % 3 === 2 && idx < lessons.length - 1) {
          doc.addPage();
        }
      });

      // Add Headers & Footers across all pages
      const pages = doc.bufferedPageRange();
      for (let i = pages.start; i < pages.start + pages.count; i++) {
        doc.switchToPage(i);

        // Gold border frame
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
           .strokeColor('#d9b45c')
           .lineWidth(1)
           .stroke();

        // Footer Divider Line
        doc.moveTo(30, doc.page.height - 42)
           .lineTo(doc.page.width - 30, doc.page.height - 42)
           .strokeColor('#d9b45c')
           .lineWidth(0.5)
           .stroke();

        // Footer Branding Text
        doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#0f2b1d').text(
          `Truth Quran Academy  •  https://truthquranacademy.com  •  Complete Beginner English Noorani Qaida`,
          30,
          doc.page.height - 34,
          { width: doc.page.width - 60, align: 'center' }
        );

        // Page number
        doc.font('Helvetica').fontSize(8).fillColor('#718096').text(
          `Page ${i + 1} of ${pages.count}`,
          doc.page.width - 90,
          doc.page.height - 34,
          { align: 'right' }
        );
      }

      doc.end();
      writeStream.on('finish', () => {
        console.log(`✓ Noorani Qaida PDF generated (${pages.count} pages, ${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
      writeStream.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

async function main() {
  console.log("Starting PDF generation for 30 Quran Paras + Noorani Qaida...");
  for (const info of parasInfo) {
    await generatePara(info);
  }
  await generateQaida();
  console.log("All 31 PDFs generated successfully!");
}

main().catch(err => {
  console.error("Failed PDF generation:", err);
  process.exit(1);
});
