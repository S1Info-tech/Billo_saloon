# Technical Design Specification: Reel-Inspired Agency-Grade Barber Experience

**Date:** 2026-09-12  
**Project:** Billu Saloon — Agency-Grade Modern Barber Web Application  
**Reference:** Triple One Studio Modern Barber Website Showcase  
**Status:** Approved Design Spec  

---

## 1. Executive Summary & Goals
Elevate Billu Saloon into an agency-grade, high-converting modern barber shop web application matching the visual benchmarks from Triple One Studio's reel showcase:
- **Hairstyle Lookbook & Gallery**: Interactive filterable style gallery (*Skin Fades*, *Beard Sculpture*, *Royal Shaves*, *Classic Pompadour*).
- **Interactive Before & After Transformation Slider**: Draggable split-view slider comparing haircut transformation.
- **Master Barbers Showcase**: Highlighting Billu and the master barbers with direct booking integration.
- **Client Reviews & Social Proof**: 5-star testimonial cards with Google Review badges.
- **1-Click WhatsApp Booking Engine**: Direct WhatsApp pre-filled messaging integration alongside the on-screen digital ticket.
- **Mobile Floating Action Bar**: Sticky mobile bottom bar with Call, WhatsApp, and Quick Booking buttons.

---

## 2. Component Specifications

### 2.1 Hairstyle Lookbook (`#lookbook`)
- Filter category pills: All Styles, Skin Fades, Beard Sculpture, Royal Shaves, Classic Pompadour.
- Filter logic: Instant DOM filtering with smooth CSS transitions (`opacity`, `transform`).
- Lookbook cards: High-quality visuals with gold badge, duration, price, and "Book This Style" button that pre-selects the service in the modal.

### 2.2 Interactive Before & After Slider (`#transformation`)
- Dual image container: Base "Before" image with an overlay "After" container clipped dynamically via CSS `width: X%`.
- Draggable center bar with double-arrow handle icon.
- Supports both mouse drag (`mousemove`/`mousedown`) and mobile touch drag (`touchmove`/`touchstart`) or synchronized range slider.

### 2.3 Master Barbers Showcase (`#team`)
- 3 Profiles:
  1. **Billu** — Founder & Master Craftsman (15+ yrs experience, Master scissor work, bespoke styling).
  2. **Marcus Vance** — Lead Beard Architect (8+ yrs experience, straight razor lineup & beard sculpting).
  3. **Elena Rossi** — Texture & Fade Specialist (6+ yrs experience, taper fades & modern street texturing).
- Action buttons: "Book with Billu", "Book with Marcus", "Book with Elena" triggering the modal with the chosen barber pre-selected.

### 2.4 Client Reviews & Social Proof (`#reviews`)
- 4 verified client reviews with 5-star rating stars, client names, service received, and date.
- Overall score header: "4.9 / 5.0 Rating based on 1,200+ Google Reviews".

### 2.5 1-Click WhatsApp Booking Integration
- In `#appointment-form`, add a secondary CTA button: **"Book via WhatsApp"**.
- Constructs a dynamic WhatsApp URL:
  `https://wa.me/918780103848?text=Hello%20Billu%20Saloon!%20I%20would%20like%20to%20book%20an%20appointment...`
  Including: Service name, Barber name, Date, Time, and Client Name.
- Opens in a new tab / launches WhatsApp mobile app instantly.

### 2.6 Floating Mobile Quick-Action Bar
- Fixed bottom bar visible on viewport width `<= 768px`:
  - Quick Call: `tel:+918780103848`
  - Quick WhatsApp: `https://wa.me/918780103848`
  - Quick Book Chair: Triggers booking modal.

---

## 3. Verification Plan
- Verify lookbook category filtering across all categories.
- Verify Before & After slider dragging functionality on desktop and mobile touch.
- Verify "Book With [Barber]" correctly pre-selects barber in modal.
- Verify WhatsApp link generation with encoded parameters.
- Verify responsive layout across mobile, tablet, and desktop viewports.
