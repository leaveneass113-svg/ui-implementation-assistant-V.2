# รายงานตรวจสอบและปรับปรุงเว็บไซต์

**โครงการ:** ContractScan AI — ระบบจัดทำรายงานช่างผู้ควบคุมงานก่อสร้าง  
**Repository:** [ui-implementation-assistant-V.2][2]  
**URL ที่ตรวจสอบ:** [ui-implementation-assistant-v-2.onrender.com][1]  
**Commit ล่าสุด:** `44c308e` และ `68d6f34` บน branch `main`

## สรุปผล

สาเหตุหลักที่เว็บไซต์เข้าไม่ได้คือ service บน Render ตอบกลับด้วย **Vite development host protection** แทนที่จะเสิร์ฟ production build จาก `dist/` โดยตรง หลักฐานจาก URL จริงก่อนแก้ไขคือ HTTP 403 พร้อมข้อความ `Blocked request. This host ... is not allowed.` ซึ่งเป็นอาการของการรัน Vite dev middleware หรือการ deploy ด้วยคำสั่งผิดโหมด ไม่ใช่ปัญหาจากข้อมูลในฟอร์มหรือ React page โดยตรง [1]

โค้ดได้รับการแก้ไขและ push ขึ้น GitHub แล้ว โดยเพิ่มการตั้งค่า production สำหรับ Render, ปรับ `npm start` ให้บังคับ `NODE_ENV=production`, เพิ่ม health check และอนุญาตเฉพาะโดเมนย่อยของ `onrender.com` ในกรณี preview/dev ที่จำเป็น นอกจากนี้ status block เดิมถูกเปลี่ยนเป็นปุ่ม interactive ที่อยู่ด้านล่างสุดของเนื้อหา โดยคงข้อความเดิม `ตรวจสอบแก้ไข บัค และปรับปรุงระบบ` ครบถ้วน และไม่ลบหรือเพิ่มข้อมูลธุรกิจในรายงาน

## หลักฐานและการวิเคราะห์สาเหตุ

| จุดตรวจสอบ | ผลที่พบ | ความหมาย |
|---|---|---|
| URL Render ก่อนแก้ไข | HTTP 403 และข้อความ Vite `Blocked request` | Service กำลังตอบจาก Vite host check หรือ deployment ยังใช้โค้ด/คำสั่งเดิม |
| `server.ts` | มีสองโหมด: Vite middleware เมื่อไม่ใช่ production และ static `dist/` เมื่อ production | หาก Render ไม่ตั้ง production จะเกิด host rejection ได้ |
| README ของ repository | ระบุ `npm run build`, `npm run start`, `PORT=3000`, `NODE_ENV=production` | วิธี deploy ที่ตั้งใจไว้ไม่ตรงกับ service ที่กำลังรันอยู่ |
| `npm ci` ก่อนแก้ไข | ล้มเหลวเพราะ lock file ไม่ sync กับ `package.json` | Render อาจล้มเหลวตั้งแต่ขั้น build หากใช้ clean install |
| URL Render หลัง push | ระหว่างการตรวจซ้ำ service timeout และก่อนหน้านั้นยังตอบข้อความ Vite เดิม | ยังยืนยันไม่ได้ว่า Render deploy commit ล่าสุดแล้ว ต้องตรวจ Deploy Logs/การตั้งค่า service |

ดังนั้น การแก้ที่ repository แก้ต้นเหตุในระดับโค้ดและ deployment contract แล้ว แต่การเปลี่ยน service เดิมบน Render ให้ใช้ commit ใหม่นั้นยังต้องอาศัย auto-deploy หรือ manual deploy ของ Render หาก service ไม่ได้เชื่อมกับ branch `main` หรือปิด auto-deploy ไว้

## การแก้ไขที่ดำเนินการแล้ว

| ไฟล์ | การเปลี่ยนแปลง | เหตุผล |
|---|---|---|
| `render.yaml` | เพิ่ม Blueprint ที่กำหนด `npm ci && npm run build`, `npm run start`, `NODE_ENV=production` และ `/health` | ลดความคลุมเครือของคำสั่ง deploy และเพิ่มจุดตรวจสุขภาพ service |
| `package.json` | เปลี่ยน `start` เป็น `NODE_ENV=production node dist/server.cjs` | แม้ Render ไม่ส่ง environment variable ก็ยังเสิร์ฟ production build |
| `server.ts` | รองรับ production เมื่อ `NODE_ENV=production` หรือ Render มี build พร้อมใช้ | ป้องกันการตกกลับไปใช้ Vite dev middleware โดยไม่ตั้งใจ |
| `vite.config.ts` | เพิ่ม `allowedHosts: ['.onrender.com']` | รองรับ preview/dev ผ่าน Render แบบจำกัดขอบเขต โดยไม่ปิด host validation ทั้งหมด |
| `package-lock.json` | ทำให้ clean install ผ่าน | ให้ `npm ci` ทำงานตรงกับ dependency ใน `package.json` |
| `src/App.tsx` | เปลี่ยน status block เดิมเป็นปุ่ม interactive ที่ตำแหน่งเดิมด้านล่างสุด | ทำให้จุดปฏิบัติการรับรู้ได้ทันที โดยคงข้อความเดิม |
| `src/index.css` | เพิ่ม visual treatment, hover/focus state และ `prefers-reduced-motion` | เพิ่ม visual hierarchy, keyboard accessibility และลด motion สำหรับผู้ใช้ที่ร้องขอ |
| `README.md` | เพิ่ม Render deployment checklist และคำอธิบาย host rejection | ทำให้ผู้ดูแล deploy ซ้ำได้อย่างถูกต้อง |

## ผลการทดสอบ

การทดสอบ clean install, type check, production build และ diff validation ผ่านทั้งหมด ดังตารางต่อไปนี้

| การทดสอบ | ผลลัพธ์ |
|---|---|
| `npm ci --no-audit --no-fund` | ผ่าน |
| `npm run lint` | ผ่าน |
| `npm run build` | ผ่าน |
| `git diff --check` | ผ่าน |
| Local `GET /health` ใน production mode | HTTP 200 พร้อม `status: ok` |
| Local `GET /` ใน production mode | HTTP 200 และโหลด SPA ได้ |
| Dev middleware พร้อม Host `ui-implementation-assistant-v-2.onrender.com` | HTTP 200 หลังเพิ่ม allowlist |
| ตรวจหน้า local หลัง build ล่าสุด | โหลดฟอร์มเดิมครบ และ status text แสดงเป็น interactive button |

หลักฐานภาพหน้า local หลังแก้ไขอยู่ที่ `/home/ubuntu/screenshots/127_0_0_1_2026-09-03_15-03-45_2575.webp` ส่วนหลักฐานภาพก่อนแก้ไขอยู่ที่ `/home/ubuntu/screenshots/ui-implementation-as_2026-09-03_14-57-50_5270.webp`

## สิ่งที่ต้องทำใน Render ต่อ

ให้เปิด Service Settings ของ Render แล้วตรวจว่า **Branch เป็น `main`**, เปิด auto-deploy หรือกด Manual Deploy จาก commit `44c308e` และตั้งค่า command ดังนี้

```text
Build Command: npm ci && npm run build
Start Command: npm run start
Health Check Path: /health
Environment Variable: NODE_ENV=production
Secret: GEMINI_API_KEY=<ค่าจริงของผู้ดูแล>
```

หลัง deploy ให้ดู log ต้องพบข้อความลักษณะ `Server running on http://0.0.0.0:<PORT> [production]` จากนั้นตรวจ `https://ui-implementation-assistant-v-2.onrender.com/health` ให้ตอบ HTTP 200 ก่อนเปิดหน้า root หากยังพบข้อความ Vite เดิม แปลว่า service ยังไม่ได้ใช้ commit ใหม่ หรือ Start Command ยังเป็น `npm run dev` อยู่ ไม่ใช่ปัญหาที่แก้ด้วยการล้าง browser cache เพียงอย่างเดียว

## คำแนะนำเพิ่มเติมด้าน performance และการทำงาน

Production build ยังมีคำเตือนว่า JavaScript initial chunk มีขนาดประมาณ **759.5 kB แบบ minified และ 204.8 kB แบบ gzip** การเข้าสู่ระบบไม่ได้เกิดจากขนาดนี้ แต่ขนาดดังกล่าวมีโอกาสทำให้การโหลดครั้งแรกช้าบนเครือข่ายมือถือ จึงควรทำเป็นงานถัดไปโดยวัด baseline ก่อน แล้วค่อยแยกโหลดหน้าเอกสารด้วย route-level หรือ component-level code splitting โดยเฉพาะหน้าที่ผู้ใช้ยังไม่ได้เปิด

สำหรับการใช้งานจริง ควรเพิ่ม monitoring ของ `/health`, บันทึก build SHA ที่ deploy สำเร็จ และทดสอบ flow สำคัญ ได้แก่ เปิดฟอร์ม, บันทึกข้อมูลลง localStorage, export/import JSON, upload scanner และ export รายงาน ก่อน release ทุกครั้ง ข้อมูลเดิมควรเก็บ schema migration ที่มี version ชัดเจนต่อไป เนื่องจากระบบพึ่งพา localStorage ใน browser ของผู้ใช้

ส่วน Gemini API ควรรักษา `GEMINI_API_KEY` ไว้เฉพาะ environment ของ Render และไม่ใส่ใน client bundle การกำหนด rate limit และการเลือก model จาก server ที่มีอยู่แล้วควรรักษาไว้ ไม่ควรย้าย secret หรือ system instruction กลับไปฝั่ง frontend

## References

[1]: https://ui-implementation-assistant-v-2.onrender.com "เว็บไซต์ที่ตรวจสอบ"  
[2]: https://github.com/leaveneass113-svg/ui-implementation-assistant-V.2 "Repository ของโครงการ"
