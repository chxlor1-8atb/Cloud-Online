# 📱 Product Requirements Document (PRD)
# Responsive Design - Cloud-Online

## 📌 ข้อมูลเอกสาร
| หัวข้อ | รายละเอียด |
|--------|------------|
| **ชื่อโปรเจค** | Cloud-Online Responsive |
| **เวอร์ชัน** | 1.0.0 |
| **วันที่สร้าง** | 17 มกราคม 2569 |
| **ผู้พัฒนา** | Chaiwat B Sangsanit |

---

## 1️⃣ วัตถุประสงค์

การทำให้ Web Application รองรับการแสดงผลบนทุกขนาดหน้าจอ (Responsive Design) เพื่อให้ผู้ใช้สามารถใช้งานได้อย่างสะดวกทั้งบน Desktop, Tablet และ Mobile

---

## 2️⃣ Breakpoints (จุดพักหน้าจอ)

### 2.1 มาตรฐาน Breakpoints

| Breakpoint | ขนาดหน้าจอ | อุปกรณ์เป้าหมาย |
|------------|------------|-------------------|
| `xs` | < 375px | Mobile เล็ก |
| `sm` | 375px - 639px | Mobile ทั่วไป |
| `md` | 640px - 767px | Mobile แนวนอน / Tablet เล็ก |
| `lg` | 768px - 1023px | Tablet |
| `xl` | 1024px - 1279px | Laptop / Desktop เล็ก |
| `2xl` | ≥ 1280px | Desktop ใหญ่ |

### 2.2 Tailwind CSS Breakpoints (ที่ใช้ในโปรเจค)

```css
/* Tailwind Default Breakpoints */
sm: 640px   /* min-width: 640px */
md: 768px   /* min-width: 768px */
lg: 1024px  /* min-width: 1024px */
xl: 1280px  /* min-width: 1280px */
2xl: 1536px /* min-width: 1536px */
```

---

## 3️⃣ CSS Media Queries

### 3.1 Media Queries สำหรับ Mobile-First

```css
/* ============================================
   RESPONSIVE DESIGN - MEDIA QUERIES
   ============================================ */

/* ===========================================
   BASE (Mobile First - < 640px)
   =========================================== */
/* สไตล์พื้นฐานสำหรับ Mobile */

/* ===========================================
   SMALL DEVICES (≥ 640px)
   =========================================== */
@media screen and (min-width: 640px) {
    /* Tablet เล็ก / Mobile แนวนอน */
}

/* ===========================================
   MEDIUM DEVICES (≥ 768px)
   =========================================== */
@media screen and (min-width: 768px) {
    /* Tablet */
}

/* ===========================================
   LARGE DEVICES (≥ 1024px)
   =========================================== */
@media screen and (min-width: 1024px) {
    /* Laptop / Desktop เล็ก */
}

/* ===========================================
   EXTRA LARGE DEVICES (≥ 1280px)
   =========================================== */
@media screen and (min-width: 1280px) {
    /* Desktop ใหญ่ */
}

/* ===========================================
   2X LARGE DEVICES (≥ 1536px)
   =========================================== */
@media screen and (min-width: 1536px) {
    /* Desktop จอใหญ่มาก */
}
```

### 3.2 Media Queries สำหรับ Desktop-First

```css
/* ===========================================
   DESKTOP FIRST APPROACH
   =========================================== */

/* Base styles for desktop */

/* Tablet and below */
@media screen and (max-width: 1023px) {
    /* Tablet และเล็กกว่า */
}

/* Mobile only */
@media screen and (max-width: 767px) {
    /* Mobile เท่านั้น */
}

/* Small mobile */
@media screen and (max-width: 639px) {
    /* Mobile เล็ก */
}
```

---

## 4️⃣ Layout Specifications

### 4.1 Sidebar Component

| หน้าจอ | พฤติกรรม |
|--------|----------|
| **Desktop** (≥1024px) | แสดง Sidebar แบบ Fixed ด้านซ้าย กว้าง 288px |
| **Tablet/Mobile** (<1024px) | ซ่อน Sidebar, แสดง Hamburger Menu + Bottom Navigation |

```css
/* Sidebar Responsive */
@media screen and (max-width: 1023px) {
    .sidebar-desktop {
        display: none;
    }
    
    .sidebar-mobile {
        position: fixed;
        left: 0;
        top: 0;
        width: 288px;
        height: 100%;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 50;
    }
    
    .sidebar-mobile.open {
        transform: translateX(0);
    }
    
    .mobile-menu-button {
        display: flex;
    }
    
    .bottom-navigation {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 64px;
        background: white;
        border-top: 1px solid #e2e8f0;
    }
}

@media screen and (min-width: 1024px) {
    .sidebar-desktop {
        display: flex;
    }
    
    .mobile-menu-button,
    .bottom-navigation {
        display: none;
    }
}
```

### 4.2 Header Component

| หน้าจอ | พฤติกรรม |
|--------|----------|
| **Desktop** (≥1024px) | Padding: 32px, Search bar เต็มขนาด |
| **Mobile** (<1024px) | Padding: 16px, Search bar ปรับขนาด, ปุ่ม Upload แสดงแค่ไอคอน |

```css
/* Header Responsive */
.header {
    padding: 16px;
}

@media screen and (min-width: 1024px) {
    .header {
        padding: 24px 32px;
    }
}

/* Search Bar */
.search-input {
    padding: 10px 40px;
    font-size: 14px;
}

@media screen and (min-width: 1024px) {
    .search-input {
        padding: 14px 48px;
        font-size: 16px;
    }
}

/* Upload Button */
.upload-btn-text {
    display: none;
}

@media screen and (min-width: 640px) {
    .upload-btn-text {
        display: inline;
    }
}
```

### 4.3 Storage Card Component

| หน้าจอ | พฤติกรรม |
|--------|----------|
| **Desktop** (≥1024px) | ขนาดใหญ่, Circular Progress 128px |
| **Mobile** (<1024px) | ขนาดเล็กลง, Circular Progress 80px |

```css
/* Storage Card Responsive */
.storage-card {
    padding: 20px;
    border-radius: 16px;
}

.circular-progress {
    width: 80px;
    height: 80px;
}

.storage-text-main {
    font-size: 24px;
}

.storage-text-sub {
    font-size: 16px;
}

@media screen and (min-width: 1024px) {
    .storage-card {
        padding: 32px;
        border-radius: 24px;
    }
    
    .circular-progress {
        width: 128px;
        height: 128px;
    }
    
    .storage-text-main {
        font-size: 36px;
    }
    
    .storage-text-sub {
        font-size: 20px;
    }
}
```

### 4.4 Category Grid

| หน้าจอ | จำนวนคอลัมน์ |
|--------|-------------|
| **Mobile** (<640px) | 2 คอลัมน์ |
| **Tablet** (640px-1023px) | 3 คอลัมน์ |
| **Desktop** (≥1024px) | 4 คอลัมน์ |

```css
/* Category Grid Responsive */
.category-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
}

@media screen and (min-width: 640px) {
    .category-grid {
        gap: 16px;
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (min-width: 1024px) {
    .category-grid {
        gap: 24px;
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### 4.5 File List/Grid View

| หน้าจอ | พฤติกรรม |
|--------|----------|
| **Mobile** (<768px) | List view เป็นค่าเริ่มต้น |
| **Desktop** (≥768px) | สลับระหว่าง List/Grid view ได้ |

```css
/* File Grid Responsive */
.file-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, 1fr);
}

@media screen and (min-width: 640px) {
    .file-grid {
        gap: 16px;
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (min-width: 1024px) {
    .file-grid {
        gap: 20px;
        grid-template-columns: repeat(4, 1fr);
    }
}

@media screen and (min-width: 1280px) {
    .file-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}
```

---

## 5️⃣ Typography Responsive

```css
/* ===========================================
   TYPOGRAPHY RESPONSIVE
   =========================================== */

/* Headings */
h1 {
    font-size: 24px;
    line-height: 1.2;
}

h2 {
    font-size: 20px;
    line-height: 1.3;
}

h3 {
    font-size: 16px;
    line-height: 1.4;
}

@media screen and (min-width: 768px) {
    h1 {
        font-size: 32px;
    }
    
    h2 {
        font-size: 24px;
    }
    
    h3 {
        font-size: 18px;
    }
}

@media screen and (min-width: 1024px) {
    h1 {
        font-size: 40px;
    }
    
    h2 {
        font-size: 28px;
    }
    
    h3 {
        font-size: 20px;
    }
}
```

---

## 6️⃣ Spacing System

| Token | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| `xs` | 4px | 4px | 4px |
| `sm` | 8px | 8px | 8px |
| `md` | 12px | 16px | 16px |
| `lg` | 16px | 20px | 24px |
| `xl` | 20px | 28px | 32px |
| `2xl` | 24px | 36px | 48px |

---

## 7️⃣ Touch Targets (Mobile)

| องค์ประกอบ | ขนาดขั้นต่ำ |
|-----------|------------|
| **Button** | 44px × 44px |
| **Icon Touch Area** | 48px × 48px |
| **List Item** | ความสูงขั้นต่ำ 48px |
| **Bottom Nav Item** | 64px × 48px |

```css
/* Touch-friendly sizing for mobile */
@media screen and (max-width: 1023px) {
    .touch-target {
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .nav-item {
        min-height: 48px;
        padding: 12px 16px;
    }
    
    .btn {
        min-height: 44px;
        padding: 12px 24px;
    }
}
```

---

## 8️⃣ Safe Area (Mobile)

```css
/* ===========================================
   SAFE AREA FOR NOTCH DEVICES
   =========================================== */

/* iOS Safe Area */
.safe-area-top {
    padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
    padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
    padding-left: env(safe-area-inset-left);
}

.safe-area-right {
    padding-right: env(safe-area-inset-right);
}

/* Bottom Navigation Safe Area */
.bottom-navigation {
    padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 9️⃣ Utility Classes

```css
/* ===========================================
   RESPONSIVE UTILITY CLASSES
   =========================================== */

/* Hide on Mobile */
.hide-mobile {
    display: none;
}

@media screen and (min-width: 768px) {
    .hide-mobile {
        display: block;
    }
}

/* Hide on Desktop */
.hide-desktop {
    display: block;
}

@media screen and (min-width: 1024px) {
    .hide-desktop {
        display: none;
    }
}

/* Show on Mobile Only */
.mobile-only {
    display: block;
}

@media screen and (min-width: 1024px) {
    .mobile-only {
        display: none;
    }
}

/* Show on Desktop Only */
.desktop-only {
    display: none;
}

@media screen and (min-width: 1024px) {
    .desktop-only {
        display: block;
    }
}

/* Responsive Text */
.text-responsive {
    font-size: 14px;
}

@media screen and (min-width: 768px) {
    .text-responsive {
        font-size: 16px;
    }
}

/* Responsive Padding */
.padding-responsive {
    padding: 16px;
}

@media screen and (min-width: 768px) {
    .padding-responsive {
        padding: 24px;
    }
}

@media screen and (min-width: 1024px) {
    .padding-responsive {
        padding: 32px;
    }
}
```

---

## 🔟 Device Orientation

```css
/* ===========================================
   ORIENTATION MEDIA QUERIES
   =========================================== */

/* Landscape Mode */
@media screen and (orientation: landscape) and (max-height: 500px) {
    .bottom-navigation {
        height: 48px;
    }
    
    .header {
        padding-top: 8px;
        padding-bottom: 8px;
    }
}

/* Portrait Mode - Tablet */
@media screen and (min-width: 768px) and (orientation: portrait) {
    .main-content {
        max-width: 100%;
    }
}
```

---

## 1️⃣1️⃣ Print Styles

```css
/* ===========================================
   PRINT MEDIA QUERY
   =========================================== */
@media print {
    .sidebar,
    .header,
    .bottom-navigation,
    .mobile-menu-button,
    .upload-btn {
        display: none !important;
    }
    
    .main-content {
        margin: 0;
        padding: 0;
        width: 100%;
    }
    
    * {
        background: white !important;
        color: black !important;
    }
}
```

---

## 1️⃣2️⃣ High DPI Displays

```css
/* ===========================================
   RETINA / HIGH DPI DISPLAYS
   =========================================== */
@media screen and (-webkit-min-device-pixel-ratio: 2),
       screen and (min-resolution: 192dpi) {
    /* Use higher resolution images */
    .logo {
        background-image: url('/logo@2x.png');
        background-size: contain;
    }
}
```

---

## 1️⃣3️⃣ Reduced Motion

```css
/* ===========================================
   ACCESSIBILITY - REDUCED MOTION
   =========================================== */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

---

## 1️⃣4️⃣ Dark Mode Support

```css
/* ===========================================
   DARK MODE MEDIA QUERY
   =========================================== */
@media (prefers-color-scheme: dark) {
    :root {
        --background: #0f172a;
        --foreground: #f8fafc;
        --card: #1e293b;
        --sidebar: #1e293b;
        --border: rgba(255, 255, 255, 0.1);
    }
}
```

---

## 1️⃣5️⃣ สถานะการพัฒนา

### ✅ สิ่งที่มีอยู่แล้ว
- [x] Tailwind CSS Breakpoints (sm, md, lg, xl, 2xl)
- [x] Mobile Hamburger Menu
- [x] Mobile Bottom Navigation
- [x] Responsive Sidebar Toggle
- [x] Basic responsive classes in components

### 🔄 สิ่งที่ต้องเพิ่มเติม
- [ ] Custom Media Queries ใน globals.css
- [ ] Safe Area Support สำหรับ iOS
- [ ] Improved Touch Targets
- [ ] Reduced Motion Support
- [ ] Print Styles
- [ ] Dark Mode CSS Variables

---

## 📞 ข้อมูลติดต่อ

| ช่องทาง | รายละเอียด |
|---------|------------|
| **อีเมล** | chxlor@gmail.com |
| **Facebook** | [Chaiwat Bank Sangsanit](https://www.facebook.com/chaiwat.b.sangsanit/) |
| **GitHub** | เปิด Issue หรือ Pull Request |

---

© 2026 Chaiwat B Sangsanit | Cloud-Online Project
