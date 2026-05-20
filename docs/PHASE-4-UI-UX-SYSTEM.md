# Phase 4 — UI/UX System Design

> Generated: May 2026
> Purpose: Design system, component architecture, and branding direction

---

## 1. Design System Foundation

### 1.1 Shared Component Library (packages/ui)

Base components built on shadcn/ui + Tailwind CSS 4:

| Component | Description | Used In |
|-----------|-------------|---------|
| Button | Primary, secondary, outline, ghost, destructive variants | All |
| Input | Text, email, password, search with labels + errors | All |
| Textarea | Multi-line input | All |
| Select | Dropdown select with search | All |
| Card | Content card with header, body, footer slots | All |
| Dialog | Modal dialog | All |
| Sheet | Side panel (mobile nav, filters) | All |
| Avatar | User/provider avatar with fallback | All |
| Badge | Status badges, category tags | All |
| Skeleton | Loading placeholders | All |
| Tabs | Tab navigation | All |
| DropdownMenu | Context menus, user menu | All |
| Toast | Notification toasts | All |
| Breadcrumb | SEO breadcrumb navigation | All |
| Pagination | Page navigation | All |
| StarRating | 1-5 star display + input | Beauty, IT |
| ImageGallery | Grid + lightbox viewer | Beauty |
| SearchBar | Search input with suggestions | All |
| FilterSidebar | Collapsible filter panel | Beauty, IT |
| EmptyState | No results illustration | All |
| LoadingSpinner | Spinner + text | All |

### 1.2 Layout Components

| Component | Description |
|-----------|-------------|
| Header | Logo, nav, search, auth menu, mobile hamburger |
| Footer | Links, social, copyright, newsletter |
| Sidebar | Provider dashboard sidebar |
| PageContainer | Max-width wrapper with padding |
| MobileNav | Bottom tab bar or drawer |
| BreadcrumbNav | Dynamic breadcrumb |

---

## 2. Beauty Marketplace — Brand Identity

### 2.1 Visual Direction
- **Feel:** Elegant, luxurious, soft, feminine, premium, modern
- **Inspiration:** High-end salon booking apps, Instagram-style visual discovery, luxury beauty e-commerce
- **Photography style:** Soft natural lighting, clean backgrounds, close-up beauty shots

### 2.2 Color Palette

```css
/* Beauty Theme — Warm Feminine Luxury */
:root {
  /* Primary — Soft Rose Gold */
  --beauty-primary: #B76E79;           /* Rose gold */
  --beauty-primary-light: #D4A0A7;     /* Light rose */
  --beauty-primary-dark: #8B4F57;      /* Deep rose */

  /* Secondary — Warm Nude */
  --beauty-secondary: #E8D5C4;         /* Warm nude */
  --beauty-secondary-light: #F5EDE6;   /* Soft cream */
  --beauty-secondary-dark: #C4A68A;    /* Warm tan */

  /* Accent — Soft Gold */
  --beauty-accent: #C9A96E;            /* Soft gold */

  /* Neutrals */
  --beauty-bg: #FDFBF9;               /* Warm white */
  --beauty-surface: #FFFFFF;            /* Pure white */
  --beauty-text: #2D2A26;              /* Warm black */
  --beauty-text-muted: #8B8580;        /* Warm gray */
  --beauty-border: #E8E2DC;            /* Subtle border */

  /* Functional */
  --beauty-success: #6B9E78;           /* Sage green */
  --beauty-error: #C45B5B;             /* Soft red */
  --beauty-warning: #D4A843;           /* Amber */
}

/* Dark mode */
[data-theme="dark"] {
  --beauty-bg: #1A1716;
  --beauty-surface: #242120;
  --beauty-text: #F5EDE6;
  --beauty-text-muted: #9B9490;
  --beauty-border: #3A3634;
}
```

### 2.3 Typography

```css
/* Headings — Elegant serif or modern sans */
--beauty-font-display: 'Playfair Display', serif;   /* For hero headlines */
--beauty-font-heading: 'Inter', sans-serif;          /* For section headings */
--beauty-font-body: 'Inter', sans-serif;             /* Body text */

/* Scale */
--text-hero: 3.5rem;     /* 56px — Homepage hero */
--text-h1: 2.5rem;       /* 40px */
--text-h2: 2rem;         /* 32px */
--text-h3: 1.5rem;       /* 24px */
--text-h4: 1.25rem;      /* 20px */
--text-body: 1rem;        /* 16px */
--text-small: 0.875rem;   /* 14px */
--text-xs: 0.75rem;       /* 12px */
```

### 2.4 Key Page Wireframes

#### Homepage
```
┌─────────────────────────────────────────────┐
│ [Logo] [Search...] [Categories] [Login]     │
├─────────────────────────────────────────────┤
│                                              │
│   ┌─────────────────────────────────────┐   │
│   │        HERO SECTION                  │   │
│   │   "Discover Perth's Best Beauty"     │   │
│   │   [Search by location or service]    │   │
│   │   Popular: Nails | Lashes | Brows    │   │
│   └─────────────────────────────────────┘   │
│                                              │
│   BROWSE BY CATEGORY                         │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│   │Nails│ │Lash │ │Hair │ │Skin │ ...       │
│   │  💅 │ │  👁 │ │  💇 │ │  ✨ │          │
│   └─────┘ └─────┘ └─────┘ └─────┘          │
│                                              │
│   FEATURED PROVIDERS                         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│   │  [Image] │ │  [Image] │ │  [Image] │   │
│   │  Name    │ │  Name    │ │  Name    │   │
│   │  ⭐ 4.8  │ │  ⭐ 4.9  │ │  ⭐ 5.0  │   │
│   │  Suburb  │ │  Suburb  │ │  Suburb  │   │
│   └──────────┘ └──────────┘ └──────────┘   │
│                                              │
│   POPULAR AREAS                              │
│   Perth CBD | Subiaco | Fremantle |...      │
│                                              │
│   HOW IT WORKS                               │
│   1. Search → 2. Discover → 3. Connect      │
│                                              │
├─────────────────────────────────────────────┤
│ [Footer: Links | Social | Newsletter]       │
└─────────────────────────────────────────────┘
```

#### Provider Profile Page
```
┌─────────────────────────────────────────────┐
│ [Breadcrumb: Home > Perth > Nail Salon]     │
├─────────────────────────────────────────────┤
│                                              │
│ ┌─────────────────────────────────────────┐ │
│ │  [Cover Image / Gallery Hero]            │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ ┌────────┐                                   │
│ │[Avatar]│  Provider Name                    │
│ └────────┘  ⭐ 4.8 (124 reviews)            │
│             📍 Subiaco, Perth                │
│             ✅ Verified Provider              │
│             [Follow] [Send Inquiry]          │
│                                              │
│ ┌──────┬──────┬──────┬──────┐               │
│ │About │Serv. │Gallery│Review│  (tabs)       │
│ └──────┴──────┴──────┴──────┘               │
│                                              │
│ ABOUT                                        │
│ Description text...                          │
│ 🕐 Mon-Fri 9am-6pm | Sat 10am-4pm          │
│ 📱 Instagram | Facebook                     │
│                                              │
│ SERVICES                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Gel Manicure            from $45        │ │
│ │ Full Set Acrylic        from $65        │ │
│ │ Nail Art                from $10+       │ │
│ └─────────────────────────────────────────┘ │
│                                              │
│ GALLERY                                      │
│ [Grid of images with lightbox]               │
│                                              │
│ REVIEWS                                      │
│ ⭐⭐⭐⭐⭐ "Amazing work!"                │
│ ⭐⭐⭐⭐  "Great service, will return"      │
│ [Write a Review]                             │
└─────────────────────────────────────────────┘
```

#### Suburb SEO Page (e.g., /perth/nail-salon)
```
┌─────────────────────────────────────────────┐
│ [Breadcrumb: Home > Perth > Nail Salons]    │
├─────────────────────────────────────────────┤
│                                              │
│ Best Nail Salons in Perth                    │
│ Discover 47 nail salons in Perth, WA        │
│                                              │
│ [Search within Perth...] [Filters ▾]         │
│                                              │
│ SHOWING 47 PROVIDERS                         │
│ Sort by: [Relevance ▾]                       │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ [Image] Provider Name        ⭐ 4.9     ││
│ │         📍 Perth CBD                     ││
│ │         Gel Nails, Acrylic, Nail Art     ││
│ │         [View Profile]                   ││
│ └──────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────┐│
│ │ [Image] Provider Name        ⭐ 4.7     ││
│ │         📍 Subiaco                       ││
│ │         SNS, Gel, Pedicure               ││
│ │         [View Profile]                   ││
│ └──────────────────────────────────────────┘│
│                                              │
│ NEARBY AREAS                                 │
│ Subiaco | Claremont | Fremantle | ...       │
│                                              │
│ RELATED CATEGORIES                           │
│ Hair Salons | Beauty Therapy | Lash Ext.    │
│                                              │
│ [Pagination: 1 2 3 4 5 ... 10]              │
│                                              │
│ ABOUT NAIL SALONS IN PERTH                   │
│ SEO-optimized content about nail salons...   │
└─────────────────────────────────────────────┘
```

---

## 3. IT Marketplace — Brand Identity

### 3.1 Visual Direction
- **Feel:** Professional, trustworthy, clean, fast, modern, enterprise-inspired
- **Inspiration:** LinkedIn, Upwork, professional services platforms

### 3.2 Color Palette

```css
/* IT Services Theme — Professional Blue */
:root {
  --it-primary: #2563EB;              /* Strong blue */
  --it-primary-light: #60A5FA;        /* Light blue */
  --it-primary-dark: #1D4ED8;         /* Dark blue */

  --it-secondary: #0F172A;            /* Navy */
  --it-accent: #10B981;               /* Green for success/verified */

  --it-bg: #F8FAFC;                   /* Cool gray bg */
  --it-surface: #FFFFFF;
  --it-text: #0F172A;
  --it-text-muted: #64748B;
  --it-border: #E2E8F0;
}
```

### 3.3 Typography

```css
--it-font-heading: 'Inter', sans-serif;
--it-font-body: 'Inter', sans-serif;
--it-font-mono: 'JetBrains Mono', monospace;  /* For technical content */
```

---

## 4. Admin Dashboard — Design

### 4.1 Visual Direction
- Clean, data-dense, efficient
- Left sidebar navigation
- Cards with metrics
- Tables with inline actions
- Chart components for analytics

### 4.2 Color Palette
- Neutral/professional palette
- Status colors: Green (approved), Yellow (pending), Red (rejected), Blue (info)

---

## 5. Responsive Breakpoints

```css
/* Mobile-first breakpoints */
sm:  640px    /* Small tablets */
md:  768px    /* Tablets */
lg:  1024px   /* Laptops */
xl:  1280px   /* Desktops */
2xl: 1536px   /* Large screens */
```

### Mobile-First Design Rules
1. Design for mobile viewport (375px) first
2. Provider cards: 1 column mobile → 2 columns tablet → 3-4 columns desktop
3. Filters: Bottom sheet on mobile → sidebar on desktop
4. Navigation: Bottom tab bar or hamburger on mobile → horizontal nav on desktop
5. Gallery: Swipeable carousel on mobile → grid on desktop
6. Search: Full-width sticky on mobile → inline on desktop

---

## 6. Animation System

Using Framer Motion (consistent across all apps):

| Animation | Use Case | Duration |
|-----------|----------|----------|
| fadeIn | Page transitions, card reveals | 300ms |
| slideUp | Cards loading, list items | 400ms |
| slideInRight | Sheet/drawer panels | 300ms |
| scale | Hover effects, button press | 150ms |
| staggerChildren | Grid items loading | 100ms delay per item |
| pulse | Loading states, skeleton | 2s loop |

---

## 7. Icon System

Use Lucide React icons (consistent, open-source):
- Navigation: Home, Search, Heart, MessageCircle, User, Bell
- Actions: Plus, Edit, Trash, Share, Download, Upload
- Status: Check, X, AlertTriangle, Clock, Shield
- Social: Instagram, Facebook, Globe
- Beauty: Sparkles, Star, MapPin, Calendar

---

## 8. Accessibility Requirements

- WCAG 2.1 AA compliance target
- Minimum contrast ratio 4.5:1 for text
- Focus indicators on all interactive elements
- Screen reader labels on icons/images
- Keyboard navigation support
- Reduced motion support via `prefers-reduced-motion`
- Semantic HTML structure (headings, landmarks, lists)
