# UI Implementation Assistant V.2

ระบบช่วยจัดทำรายงานผู้ควบคุมงานก่อสร้างแบบดิจิทัล โดยใช้ React + Express + Gemini API เพื่อช่วย:
- สแกนข้อมูลจากสัญญา/เอกสารก่อสร้าง
- กรอกข้อมูลโครงการและสัญญา
- สร้างสัปดาห์และบันทึกรายวัน
- บันทึกแรงงานและสภาพอากาศ
- สรุปผลการทำงานและส่งออกข้อมูล

## ภาพรวมของระบบ

- Frontend: React + Vite
- Backend: Express server
- AI integration: Google Gemini API
- Storage: browser localStorage
- Deployment target: Node.js compatible host

## เครื่องมือและเทคโนโลยี

- React 19
- Vite 6
- Express
- TypeScript
- Google Generative AI (`@google/genai`)
- Tailwind CSS

## โครงสร้างโปรเจกต์

```text
ui-implementation-assistant V.2/
├─ src/
│  ├─ components/
│  ├─ data/
│  ├─ utils/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ types.ts
├─ server.ts
├─ vite.config.ts
├─ package.json
├─ .env
├─ .env.example
├─ index.html
├─ public/
├─ assets/
├─ dist/
├─ ecosystem.config.cjs
└─ README.md
```

## ข้อกำหนดเบื้องต้น

- Node.js 18+
- npm หรือ package manager ที่รองรับ
- Google Gemini API key

## การติดตั้ง

```bash
npm install
```

## การตั้งค่า API key

สร้างไฟล์ `.env` ตามค่าในโปรเจ็กต์ หรือใช้ `.env.example` เป็นตัวอย่าง

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

> ค่าจริงที่ใช้งานได้สำหรับโปรเจ็กต์นี้จะต้องมีค่า `GEMINI_API_KEY` ที่ถูกต้องและมีสิทธิ์ใช้งาน Gemini API

## การรันแอปในเครื่อง

```bash
npm run dev
```

หลังจากรันแล้ว ให้เปิด:

```text
http://localhost:3000
```

## การ build สำหรับ production

```bash
npm run build
```

## การรัน build แบบ production

```bash
npm run start
```

## ฟังก์ชันการทำงานหลัก

1. Upload & Scan เอกสารสัญญา
2. ดึงข้อมูลสัญญาและพารามิเตอร์งาน
3. สร้างสัปดาห์และคำนวณความคืบหน้า
4. บันทึกรายวัน/สภาพอากาศ/แรงงาน
5. Export หรือ Save ข้อมูลโครงการ
6. ใช้ Gemini AI ช่วยสรุปและปรับข้อมูลรายงาน

## หมายเหตุด้านความปลอดภัย

- API key ถูกเก็บไว้ในไฟล์ `.env` ของเครื่องหรือ hosting environment เท่านั้น
- ไม่ควร commit ค่าความลับลง Git อย่างเด็ดขิด
- แบบ production ควรเก็บ `GEMINI_API_KEY` ใน environment variable ของ host/service provider

## การ deploy ต่อ

แอปนี้รองรับการ deploy บน Node.js compatible host เช่น:
- Azure App Service
- Render
- Railway
- VPS / Linux server
- Cloud Run (ต้องปรับ env config ให้เหมาะสม)

สำหรับการ deploy จริง ควรตั้งค่า environment variable:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=3000
NODE_ENV=production
```

## ทีมผู้ดูแล / maintainer

- แนะนำให้เก็บโค้ดนี้ใน GitHub branch ที่ใช้งานจริง
- ก่อน deploy ควร run build ทดสอบเสมอ
- หากมีการเปลี่ยนแปลงการใช้งาน Gemini หรือ env config ให้ปรับใน `.env` หรือ hosting config พร้อมกัน

## สถานะปัจจุบัน

- โครงสร้างแอปทำงานได้ในเครื่อง
- build สำเร็จแล้ว
- สามารถ deploy ต่อได้ใน environment ที่รองรับ Node.js
- API key ต้องได้รับการตั้งค่าใน environment ของ deployment target ก่อนใช้งานจริง
