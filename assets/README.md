# assets/ — ไลบรารีที่ดึงมาเก็บไว้ในรีโป (self-hosted)

ทุกหน้าในเว็บนี้โหลด CSS/JS/ฟอนต์ จากโฟลเดอร์นี้เท่านั้น **ไม่มีการเรียก CDN ภายนอกแล้ว**
(เดิมใช้ `cdn.tailwindcss.com`, `cdn.jsdelivr.net`, `cdnjs.cloudflare.com`, `unpkg.com`,
`fonts.googleapis.com`, `fonts.gstatic.com` และ `fontmeme.com`)

ปลายทางภายนอกที่ยังเหลืออยู่มีที่เดียวคือ `https://generativelanguage.googleapis.com`
ซึ่งเป็น Gemini API ที่หน้า `/pdfai/` เรียกใช้ตอนทำงาน (ไม่ใช่การโหลดโค้ด)

## รายการไฟล์และเวอร์ชัน

| ไฟล์ | ไลบรารี | เวอร์ชัน | สัญญาอนุญาต |
|---|---|---|---|
| `css/tailwind.pdfai.css`, `css/tailwind.qrcode.css` | Tailwind CSS (build ไว้ล่วงหน้า) | 3.4.19 | MIT |
| `css/fontawesome.min.css` + `webfonts/` | Font Awesome Free | 7.3.1 | CC-BY-4.0 AND OFL-1.1 AND MIT |
| `css/toastify.css`, `js/toastify.js` | Toastify JS | 1.12.0 | MIT |
| `css/fonts-sarabun.css`, `css/fonts-k2d.css`, `css/fonts-inter-outfit.css` + `fonts/` | Google Fonts (Sarabun, K2D, Inter, Outfit) | ตามที่ Google Fonts ให้ ณ วันที่ดึง | SIL OFL 1.1 |
| `js/sweetalert2.all.min.js` | SweetAlert2 | 11.26.25 | MIT |
| `js/pdf-lib.min.js` | @cantoo/pdf-lib (fork ของ pdf-lib) | 2.11.1 | MIT |
| `js/fontkit.umd.min.js` | @pdf-lib/fontkit | 1.1.1 | MIT |
| `js/pdf.min.mjs`, `js/pdf.worker.min.mjs` | pdf.js (pdfjs-dist, legacy build) | 6.3.289 | Apache-2.0 |
| `js/jszip.min.js` | JSZip | 3.10.2 | MIT OR GPL-3.0-or-later |
| `js/qr-code-styling.js` | qr-code-styling | 1.9.2 | MIT |
| `js/html5-qrcode.min.js` | html5-qrcode | 2.3.8 | Apache-2.0 |

ทุกไฟล์ดึงจาก npm registry โดยตรง (`npm pack <pkg>@<version>`) ไม่ได้ดึงผ่าน CDN

## หมายเหตุสำคัญ

**Tailwind CSS** — เดิมหน้าเว็บโหลด `cdn.tailwindcss.com` ซึ่งเป็นตัวคอมไพล์ที่ทำงานในเบราว์เซอร์
(Play CDN ~400 KB และผู้พัฒนาระบุเองว่าไม่เหมาะกับ production) ตอนนี้เปลี่ยนเป็นไฟล์ CSS
ที่ build ไว้ล่วงหน้าแยกตามหน้า เหลือ 22 KB และ 16 KB ไม่มีการคอมไพล์ตอนรันอีกแล้ว

ยังใช้ Tailwind รุ่น 3.4.19 (รุ่นล่าสุดของสาย 3) ไม่ได้ขึ้น 4.x **โดยตั้งใจ** เพราะ v4
เปลี่ยนความหมายของคลาสที่หน้าเว็บนี้ใช้อยู่จริง เช่น `shadow-sm`/`shadow` เลื่อนความหมาย,
`rounded-sm` เลื่อนความหมาย, สีเส้นขอบเริ่มต้นของ `border` เปลี่ยนเป็น `currentColor`
และ `ring` เปลี่ยนความหนา/สีเริ่มต้น — ถ้าอัปเป็น v4 ต้องไล่แก้ HTML ทั้งสองหน้าก่อน

**pdf.js** — ขึ้นจาก 3.11.174 เป็น 6.3.289 เพื่อปิดช่องโหว่ GHSA-wgrm-67xf-hhpq
(CVE-2024-4367 — เปิดไฟล์ PDF ที่ถูกดัดแปลงแล้วรันจาวาสคริปต์ได้ ระดับ high กระทบทุกรุ่น ≤ 4.7.76)
รุ่น 4 ขึ้นไปเผยแพร่เป็น ES module เท่านั้น หน้า `/pdfai/` จึง import ผ่าน `<script type="module">`
แล้วผูกเป็น `window.pdfjsLib` ให้โค้ดเดิมเรียกใช้ได้เหมือนเดิม

**pdf-lib** — เปลี่ยนจาก `pdf-lib` (Hopding) ตัวดั้งเดิมมาเป็น `@cantoo/pdf-lib` ซึ่งเป็น
fork ที่ยังคง API และ global `PDFLib` ตัวเดิมทุกอย่าง (`PDFDocument.create/load`, `degrees`,
`rgb`, `embedFont`, `embedPng`, `copyPages`, ฯลฯ ใช้แบบเดิมได้หมด) แต่เพิ่ม
`pdfDoc.encrypt({ userPassword, ownerPassword, permissions })` ที่เข้ารหัสจริงด้วย AES-256
(revision 6, มาตรฐาน ISO 32000-2) — pdf-lib ตัวเดิมไม่มีความสามารถนี้เลย ฟีเจอร์ "ตั้งรหัสผ่าน"
ในหน้า `/pdfai/` เดิมจึงเป็นแค่ป้ายกำกับที่ไม่ได้ทำอะไรจริง ตอนนี้เข้ารหัสไฟล์จริงตอนส่งออก
ตรวจแล้วว่า pdf.js (เวอร์ชันที่ vendor ไว้) ปฏิเสธเปิดไฟล์โดยไม่มีรหัสผ่าน/รหัสผิด และเปิด
+ อ่านข้อความ (รวมข้อความไทยที่ฝังฟอนต์) ได้ถูกต้องเมื่อใส่รหัสผ่านที่ถูกต้อง

### วิธีอัปเดตไลบรารีในอนาคต

```bash
npm pack <package>@<version>          # ดึง tarball จาก npm
tar xzf <package>-<version>.tgz       # แตกไฟล์
cp package/dist/<file> assets/js/     # ก๊อปทับ แล้วอัปเดตตารางด้านบน
```

ฟอนต์จาก Google Fonts ดึง CSS ด้วย User-Agent ของเบราว์เซอร์รุ่นใหม่ (เพื่อให้ได้ woff2)
แล้วโหลดไฟล์ `.woff2` ทุกตัวลง `assets/fonts/<family>/` พร้อมแก้ `url()` ใน CSS ให้ชี้ไฟล์ในเครื่อง
