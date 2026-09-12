# Reel-Inspired Agency-Grade Barber Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Billu Saloon into a modern agency-grade barber shop web application matching the Triple One Studio reel, featuring a Hairstyle Lookbook, Before & After Transformation Slider, Master Barbers showcase, Google Reviews, and 1-Click WhatsApp Booking.

**Architecture:** Extend existing single-page architecture (`index.html`, `style.css`, `app.js`) with responsive new components, interactive lookbook filters, dynamic split-view slider, and WhatsApp deep-linking.

**Tech Stack:** HTML5, CSS3 (Glassmorphism, Flexbox, Grid), JavaScript (ES6+), Three.js r160, GSAP 3.12.5, WhatsApp Click-to-Chat API.

**Spec:** `docs/superpowers/specs/2026-09-12-reel-barber-experience-design.md`

## Global Constraints
- Preserve existing Three.js 3D background atmosphere and robust fallback mechanisms.
- Zero broken external assets: use high-quality optimized royalty-free images (Unsplash CDN with fallback).
- Responsive on all devices with mobile-first floating quick actions.

---

### Task 1: UI Stylesheet Additions for Lookbook, Slider, Team & WhatsApp (`style.css`)
**Files:**
- Modify: `style.css`

- [ ] **Step 1: Add styles for Hairstyle Lookbook & category filter tabs**
- [ ] **Step 2: Add styles for Before & After transformation comparison slider**
- [ ] **Step 3: Add styles for Master Barbers profile cards**
- [ ] **Step 4: Add styles for Client Testimonial cards & Google Review badges**
- [ ] **Step 5: Add styles for WhatsApp booking button and mobile floating action bar**
- [ ] **Step 6: Commit CSS changes**

---

### Task 2: Markup Additions in `index.html`
**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Lookbook section with category filter buttons & style cards**
- [ ] **Step 2: Add Transformation section with Before/After interactive slider markup**
- [ ] **Step 3: Add Barbers Showcase section with Billu, Marcus, and Elena profiles**
- [ ] **Step 4: Add Client Reviews section with 5-star testimonials**
- [ ] **Step 5: Add "Book via WhatsApp" CTA in booking modal and mobile floating action bar**
- [ ] **Step 6: Commit HTML changes**

---

### Task 3: Interactive Logic in `app.js`
**Files:**
- Modify: `app.js`

- [ ] **Step 1: Implement Lookbook category filtering logic**
- [ ] **Step 2: Implement Before/After interactive slider drag controller (mouse & touch)**
- [ ] **Step 3: Connect Barber card "Book With [Barber]" triggers to pre-select in modal**
- [ ] **Step 4: Implement WhatsApp 1-Click booking deep-link generator**
- [ ] **Step 5: Commit JavaScript changes**

---

### Task 4: Verification & Git Push
**Files:**
- Test all files in headless Chrome CDP and verify zero errors.
- Push to GitHub `main` and `feat/3d-landing-page`.
