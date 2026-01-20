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

## 2️⃣ Breakpoints & Device Support (2025 Standards)

### 2.1 Granular Breakpoints

| Prefix | Range | Device Coverage |
|--------|-------|-----------------|
| `xs` | < 480px | Mobile Portrait (iPhone SE, Small Androids) |
| `sm` | 480px - 639px | Large Mobile / Foldable (Folded) |
| `md` | 640px - 767px | Tablet Portrait / Large Foldables |
| `lg` | 768px - 1023px | Tablet Landscape / Small Laptops |
| `xl` | 1024px - 1279px | Laptops / Desktops |
| `2xl` | 1280px - 1535px | High-Res Monitors |
| `3xl` | ≥ 1536px | Ultra Wide / 4K Screens |

### 2.2 Device Specific Support

#### 📱 iOS & Android Devices
- **Safe Area**: Must handle Notch, Dynamic Island, and Home Indicator.
- **Touch Targets**: Minimum **44x44px** (iOS) / **48x48px** (Android).
- **System Fonts**: Use SF Pro (iOS) and Roboto/Product Sans (Android).
- **Haptics**: Support native vibration feedback where possible.

#### 📟 Foldable Devices (Samsung Z Fold, Pixel Fold)
- **Compact View**: ใช้ Layout แบบ Mobile เมื่อพับจอ (< 600px)
- **Unfolded View**: เปลี่ยนเป็น Tablet Layout เมื่อกางจอ (> 600px)
- **Hinge Awareness**: เลี่ยงการวาง Content สำคัญตรงกลางรอยพับ

---

## 3️⃣ Advanced CSS Media Queries

### 3.1 Extended Theme Implementation

```css
/* ============================================
   2025 RESPONSIVE STANDARDS
   ============================================ */

/* 1. XS - Extra Small Devices (< 480px) */
@media screen and (max-width: 479px) {
    .container { padding-inline: 16px; }
    h1 { font-size: 1.5rem; }
}

/* 2. Foldable & Landscape Mobile (480px - 639px) */
@media screen and (min-width: 480px) and (max-width: 639px) {
    .grid-view { grid-template-columns: repeat(2, 1fr); }
}

/* 3. Tablet Portrait (640px - 767px) */
@media screen and (min-width: 640px) and (max-width: 767px) {
    .sidebar { transform: translateX(-100%); } /* Hidden by default */
}

/* 4. Safe Area Handling (Notch/Dynamic Island) */
.safe-area-padding {
    padding-top: env(safe-area-inset-top, 20px);
    padding-bottom: env(safe-area-inset-bottom, 20px);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
}

/* 5. Dynamic Viewport Units (For Mobile Browsers) */
.full-height {
    height: 100vh; /* Fallback */
    height: 100dvh; /* Dynamic CSS Viewport Height */
}
```

### 3.2 Feature Queries (Modern Capability Detection)

```css
/* Pointer Coarse (Touch Devices) */
@media (pointer: coarse) {
    .btn { min-height: 48px; } /* Larger touch targets */
    .hover-effect { display: none; } /* Disable hover on touch */
}

/* Dark Mode Preference */
@media (prefers-color-scheme: dark) {
    :root {
        --bg-primary: #0f172a;
        --text-primary: #f8fafc;
    }
}
```

---

## 4️⃣ Component Responsive Specs

### 4.1 Layout Components

| Component | Default (Mobile) | Foldable (Unfolded) | Tablet | Desktop |
|-----------|------------------|---------------------|--------|---------|
| **Sidebar** | Drawer (Hidden) | Drawer (Hidden) | Drawer (Hidden) | Fixed (Visible) |
| **Grid Cols** | 1-2 Columns | 2-3 Columns | 3-4 Columns | 4-6 Columns |
| **Nav Type** | Bottom Bar | Bottom Bar | Rail / Bottom | Full Sidebar |

### 4.2 Spacing & Typography Scale

| Scale | XS (<480) | SM-MD (480-768) | LG-XL (>768) |
|-------|-----------|-----------------|--------------|
| **Base Text** | 14px | 15px | 16px |
| **Heading 1** | 24px | 32px | 40px+ |
| **Container Padding** | 16px | 24px | 32px-48px |
| **Card Gap** | 12px | 16px | 24px |

---

## 5️⃣ Testing Strategy (Mobile First)

1.  **Smallest Mobile (320px - 375px)**: iPhone SE, older Androids
2.  **Standard Mobile (390px - 430px)**: iPhone 14/15/16, Pixel, Galaxy S
3.  **Foldable / Large Mobile (480px - 600px)**: Z Fold (Cover), Phablets
4.  **Tablet Portrait (768px)**: iPad Mini, iPad Air
5.  **Desktop**: 1280px+

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
