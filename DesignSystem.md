# 🎨 Design System & Specs: ContractScan V2

คู่มือฉบับนี้รวบรวมสเปคการออกแบบ (Design Specifications) สไตล์ **Neumorphism Dark Mode** สำหรับนำไปใช้เป็น Blueprint ในการพัฒนาแอปพลิเคชันต่อบนสภาพแวดล้อมต่างๆ เช่น Google Project IDX, React, Vue หรือเฟรมเวิร์กอื่นๆ

---

## 1. Color Palette (ระบบสี)

ระบบสีถูกออกแบบมาให้ล้อไปกับ ContractScan V2 เน้นความลึกลับ (Dark) แต่แฝงด้วยความพรีเมียม (Premium) และใช้สีส้มเป็นตัวนำสายตา

* **Background (พื้นหลังหลัก):** `#292d32` 
* **Shadow Light (เงาสว่าง):** `#353a40`
* **Shadow Dark (เงาดำ):** `#1d2024`
* **Text Primary (ข้อความหลัก):** `#e0e5ec`
* **Text Muted (ข้อความรอง):** `#9ca3af`
* **Accent (สีเน้น/ส้ม):** `#f97316` 
* **Accent Hover (สีเน้นสถานะ Hover):** `#ea580c`

---

## 2. Typography & Iconography (ตัวอักษรและไอคอน)

* **Font Family:** `Sarabun, sans-serif` (รองรับภาษาไทยทางการ อ่านง่ายบนหน้าจอดิจิทัล)
    * *Weights:* 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
* **Icons Library:** `Lucide Icons` (ลักษณะเส้นสายเรียบง่าย สะอาดตา)
    * *Implementation:* `<i data-lucide="icon-name"></i>`

---

## 3. Neumorphism CSS Classes (คลาสหลักของระบบเงา)

โครงสร้างหลักของการออกแบบคือการจัดแสงและเงาให้ดูมีมิติสมจริง 3 ระดับ:

### 3.1 Flat Surface (พื้นผิวเรียบ/การ์ดหลัก)
ใช้สำหรับวางเป็นพื้นหลังของการ์ดแต่ละ Section
```css
.neu-flat {
    background: #292d32;
    box-shadow: 8px 8px 16px #1d2024, -8px -8px 16px #353a40;
    border-radius: 16px;
}
```

### 3.2 Pressed Surface (พื้นผิวยุบตัว)
ใช้สำหรับช่อง Input, ช่องว่างที่รอการกรอกข้อมูล หรือพื้นที่แสดงผลรวม (Total Sum)
```css
.neu-pressed {
    background: #292d32;
    box-shadow: inset 6px 6px 12px #1d2024, inset -6px -6px 12px #353a40;
    border-radius: 12px;
}
```

### 3.3 Convex Button (กล่องนูน/ปุ่มกด/หัวตาราง)
ใช้สำหรับหัวข้อ (Headers), ปุ่มกด (Buttons) เพื่อแยกมิติให้ลอยเด่นขึ้นมาจากพื้นผิว
```css
.neu-button {
    background: #292d32;
    box-shadow: 4px 4px 8px #1d2024, -4px -4px 8px #353a40;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}
.neu-button:active, .neu-button.active {
    box-shadow: inset 4px 4px 8px #1d2024, inset -4px -4px 8px #353a40;
}
```

---

## 4. UI Components & UX Rules

### 4.1 Borderless Matrix (ตารางไร้ขอบ)
* **ห้ามใช้เส้นขอบ (Border) แบบทึบหรือ `border-collapse: collapse` ที่มองเห็นเส้น** * ใช้การแบ่งระยะด้วย Padding และ Margin 
* **Hover Effect:** เมื่อเมาส์ชี้แถวในตาราง แถวนั้นจะต้องยุบตัวลง (เปลี่ยนเป็น Box-shadow inset) 
* **หัวตาราง (Thead):** ครอบด้วย `.neu-button` เพื่อให้ดูเป็นป้ายนูนขึ้นมา
* **ผลรวม (Tfoot):** ครอบเซลล์ตัวเลขด้วย `.neu-pressed` เพื่อให้ดูเป็นหลุมยุบลงไป

### 4.2 Editable Cells (ช่องกรอกข้อมูล)
* ทุกเซลล์ใช้ Property `contenteditable="true"` แทนการใช้ `<input>` เพื่อให้ตารางเป็นเนื้อเดียวกัน
* **Focus State:** เมื่อคลิกพิมพ์ เซลล์จะต้องมีพื้นหลังมืดลงเล็กน้อย `rgba(0,0,0,0.1)` และมี Inset Shadow บางๆ เพื่อแสดงขอบเขต

### 4.3 Interactive Toggles (สวิตช์และปุ่มกด)
* **Weather Cell:** คลิกแล้ววนลูปสถานะ `แจ่มใส (สีส้ม) -> ครึ้มฝน (สีเทา) -> ฝนตก (สีฟ้า)` ทันทีโดยไม่ต้องพิมพ์
* **Checkbox ปัญหา-อุปสรรค:** ใช้กล่อง `.neu-button` แทน Checkbox ธรรมดา เมื่อเลือกให้ยุบตัว (Active) และแสดงไอคอนติ๊กถูกสีส้ม (`text-accent`)

### 4.4 Tab Navigation (ระบบแท็บ)
* แท็บที่ไม่ได้เลือก: เป็นปุ่ม `.neu-button` นูนปกติ ตัวหนังสือสีเทา (Muted)
* แท็บที่เลือก (Active): ยุบตัวลง พื้นหลังเปลี่ยนเป็นสี Accent (`#f97316`) ตัวหนังสือสีขาว พร้อมเงาเรืองแสงรอบๆ (`box-shadow: 0 4px 20px rgba(249, 115, 22, 0.4);`)
* **Animation:** การสลับแท็บต้องมี Fade-in 0.4s เพื่อความนุ่มนวล

---

*“ดีไซน์นี้มุ่งเน้นการลดความซับซ้อนของเส้นตาราง (Cognitive Load) แต่คงไว้ซึ่งความชัดเจนของข้อมูลผ่านมิติแสงเงา (Depth & Elevation) ค่ะ”* - ราฟาเอล