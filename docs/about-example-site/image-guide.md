# PawPair Image Placement Guide

## Purpose

This guide explains where every PawPair image should be placed, how it should be cropped, and which visual elements should remain editable in React.

The website should combine:

- Natural pet and lifestyle photography
- Clean product mockups
- Minimal branded illustrations
- Real HTML text and interactive UI
- Responsive crops for mobile, tablet, and desktop

> Do not place important headlines, buttons, pricing, compatibility scores, chat text, or navigation inside generated images. Build those elements in React so they remain responsive, accessible, and editable.

---

## Recommended Asset Structure

```text
apps/web/public/images/
├── brand/
│   ├── logo-pawpair-primary.png
│   └── logo-pawpair-icon.png
├── hero/
│   ├── hero-pet-meetup.webp
│   └── pet-mochi-profile.webp
├── product/
│   └── product-phone-mockups.png
├── features/
│   └── safety-public-meetup.webp
├── about/
│   └── about-pawpair-community.webp
├── community/
│   ├── community-group-walk.webp
│   └── final-cta-happy-match.webp
├── pets/
│   ├── pet-luna-profile.webp
│   ├── pet-atlas-profile.webp
│   ├── pet-pepper-profile.webp
│   └── pet-benny-profile.webp
├── blog/
│   ├── blog-first-meetup.webp
│   ├── blog-play-signals.webp
│   └── blog-senior-walking-buddy.webp
└── illustrations/
    └── pawpair-404.png
```

---

# Global Image Rules

## Use `next/image`

Use `next/image` for photography and raster illustrations.

Every meaningful image should include:

- Descriptive alt text
- Correct dimensions or `fill`
- A responsive `sizes` value
- An intentional aspect ratio
- An intentional `object-position`

## General Styling

Photography:

```text
rounded-[24px] to rounded-[32px]
overflow-hidden
object-cover
```

Product mockups:

```text
object-contain
subtle CSS shadow
```

Transparent illustrations:

```text
object-contain
transparent background
```

## Keep These Elements in React

Do not bake these into images:

- Pet profile cards
- Compatibility meters
- Match notifications
- Chat messages
- Safety checklists
- Meetup cards
- Map previews
- Buttons
- Pricing information
- Testimonials
- Blog titles

---

# Brand Assets

## 1. Primary PawPair Logo

**File:**

```text
/public/images/brand/logo-pawpair-primary.png
```

### Main Placement

Use in:

```text
src/components/navigation/header/
src/components/footer/
```

### Position

- Desktop header: top-left
- Mobile header: top-left beside the menu control
- Footer: above or beside the brand description

### Display Guidance

- Recommended rendered height: `28px–36px`
- Use `object-contain`
- Never crop or stretch
- Preserve clear space around the mark
- Prepare a dark-mode version if the wordmark does not contrast properly

---

## 2. PawPair Standalone Icon

**File:**

```text
/public/images/brand/logo-pawpair-icon.png
```

### Placements

- Favicon
- Apple touch icon
- Small mobile logo
- Loading state
- Match celebration
- Social avatar
- Footer mark
- Small feature badges

### Suggested App Files

```text
apps/web/app/icon.png
apps/web/app/apple-icon.png
```

### Guidance

Use the transparent icon inside a CSS-created rounded square when an app-icon background is needed.

---

# Home Page

Home page sections should live under:

```text
src/components/sections/home/
```

## 3. Hero Lifestyle Image

**File:**

```text
/public/images/hero/hero-pet-meetup.webp
```

### Section

```text
src/components/sections/home/hero/
```

### Desktop Placement

Use a two-column layout:

```text
Left:
- Eyebrow
- Main headline
- Supporting copy
- Primary and secondary CTA
- Trust points

Right:
- Hero lifestyle image
- Coded pet profile card
- Coded compatibility badge
- Decorative brand shapes
```

The image should occupy roughly `45–50%` of the hero width.

### Mobile Placement

- Copy first
- CTAs second
- Image below the CTAs
- Remove nonessential floating cards
- Use a `4:5` or `1:1` crop

### Suggested Alt Text

```text
Two pet parents introducing their dogs in a sunny city park.
```

### Coded Elements to Overlay

```text
PetProfileCard
CompatibilityBadge
MatchCelebration
```

---

## 4. Mochi Profile Portrait

**File:**

```text
/public/images/hero/pet-mochi-profile.webp
```

### Main Placement

Use inside the coded pet profile card in the hero.

Suggested component:

```text
src/components/pet-profile-card/
```

### Other Placements

- Discover interface
- Product preview
- Match card
- Testimonial story
- Profile avatar stack

### Crop Guidance

- Keep `4:5`
- Use `object-cover`
- Keep the eyes around the upper third
- Do not crop the ears

### Suggested Alt Text

```text
Mochi, an apricot Cockapoo wearing a lavender collar.
```

---

## 5. Product Phone Mockups

**File:**

```text
/public/images/product/product-phone-mockups.png
```

### Section

```text
src/components/sections/home/product-preview/
```

### Placement

Use the image as the hardware frame for three product states:

1. Discover
2. Match and chat
3. Meetup planning

### Important

The phone screens should contain real screenshots or coded UI. Do not rely on generated text inside the mockup.

### Responsive Behavior

- Desktop: show all three devices
- Tablet: show two devices or reduce overlap
- Mobile: show one device at a time using tabs, carousel, or horizontal scrolling

### Suggested Alt Text

```text
Three smartphone frames used to preview the PawPair application.
```

---

## 6. Safety Section Image

**File:**

```text
/public/images/features/safety-public-meetup.webp
```

### Section

```text
src/components/sections/home/safety/
```

### Recommended Layout

```text
Left:
- Safety image

Right:
- Eyebrow
- Safety headline
- Supporting copy
- Coded safety checklist
- Safety guide CTA
```

The order may be reversed to improve page rhythm.

### Build These in React

- Verified member badge
- Public meetup badge
- Safety checklist
- Report and block tools
- Meetup confirmation card

### Suggested Alt Text

```text
Two pet parents supervising a calm first meeting between their dogs in a public park.
```

---

## 7. Community Group Walk

**File:**

```text
/public/images/community/community-group-walk.webp
```

### Section

Use in either:

```text
src/components/sections/home/use-cases/
```

or:

```text
src/components/sections/home/community/
```

### Placement Option A

Use as a wide full-width visual break between feature sections and testimonials.

### Placement Option B

Use in a split layout beside content about:

- Group walks
- Local pet circles
- Pet-friendly events
- Neighborhood discovery

### Responsive Crops

- Desktop: `16:9`
- Tablet: `3:2`
- Mobile: `4:3`

### Suggested Alt Text

```text
A diverse group of pet parents walking their dogs together through a sunny city park.
```

---

## 8. Final CTA Image

**File:**

```text
/public/images/community/final-cta-happy-match.webp
```

### Section

```text
src/components/sections/home/final-cta/
```

### Placement Options

#### Split CTA

Copy on the left, image on the right.

#### Background CTA

Use the image as a full-width background with a CSS gradient overlay.

### Recommended Copy Area

```text
Ready when they are

Meet the right kind of wild.

Create a free profile and start discovering compatible pets near you.
```

### Readability Rules

- Use a gradient overlay for text contrast
- Keep text away from faces and pets
- Test both light and dark mode
- Keep buttons in a visually quiet area

### Suggested Alt Text

```text
Two pet parents and their dogs walking away together after a successful meetup.
```

---

# About Page

About page sections should live under:

```text
src/components/sections/about/
```

## 9. About Community Image

**File:**

```text
/public/images/about/about-pawpair-community.webp
```

### Primary Placement

Use in either:

```text
src/components/sections/about/hero/
```

or:

```text
src/components/sections/about/origin-story/
```

### Recommended Structure

```text
Eyebrow
About headline
Short introduction
Community image
Origin story
```

### Additional Use

A different crop may be used in:

```text
src/components/sections/about/community-commitment/
```

Do not repeat the exact same crop twice on one page.

### Suggested Alt Text

```text
A diverse group of pet parents gathering with dogs and a cat in an urban park.
```

---

# Pet Profile Portraits

Use pet portraits inside:

```text
src/components/pet-profile-card/
src/components/pet-avatar-stack/
src/components/discover-carousel/
src/components/match-celebration/
```

## 10. Luna

**File:**

```text
/public/images/pets/pet-luna-profile.webp
```

### Use For

- Gentle Senior use case
- Calm companion example
- Discover results
- Testimonial avatar

### Alt Text

```text
Luna, a calm cream-colored Golden Retriever wearing a coral collar.
```

---

## 11. Atlas

**File:**

```text
/public/images/pets/pet-atlas-profile.webp
```

### Use For

- Park Sprinter use case
- High-energy match example
- Compatibility demonstration
- Discover results

### Alt Text

```text
Atlas, an alert black-and-white Australian Shepherd wearing a lavender collar.
```

---

## 12. Pepper

**File:**

```text
/public/images/pets/pet-pepper-profile.webp
```

### Use For

- Curious Introvert use case
- Cat-specific discovery example
- Shy-pet blog content
- Profile avatar

### Alt Text

```text
Pepper, a gray tabby cat sitting beside a bright apartment window.
```

---

## 13. Benny

**File:**

```text
/public/images/pets/pet-benny-profile.webp
```

### Use For

- Weekend Walker use case
- Nearby profiles
- Discover carousel
- Match examples

### Alt Text

```text
Benny, a friendly tan mixed-breed dog sitting on a neighborhood path.
```

---

# Blog Images

Blog section components should live under:

```text
src/components/sections/blog/
```

Reusable article components may live under:

```text
src/components/blog-card/
src/components/featured-article/
src/components/related-posts/
```

## 14. First Meetup Article

**File:**

```text
/public/images/blog/blog-first-meetup.webp
```

### Use On

- Homepage blog preview
- `/blog`
- `/blog/grid`
- `/blog/how-to-plan-a-low-stress-first-pet-meetup`

### Recommended Treatment

Use as the featured article on the main blog page.

### Alt Text

```text
Two dogs approaching one another calmly during a supervised first meetup.
```

---

## 15. Healthy Play Signals Article

**File:**

```text
/public/images/blog/blog-play-signals.webp
```

### Use On

- Homepage blog preview
- `/blog`
- `/blog/grid`
- `/blog/understanding-healthy-pet-play-signals`

### Alt Text

```text
Two dogs demonstrating relaxed and healthy play behavior in a grassy park.
```

---

## 16. Senior Walking Buddy Article

**File:**

```text
/public/images/blog/blog-senior-walking-buddy.webp
```

### Use On

- Homepage blog preview
- `/blog`
- `/blog/grid`
- `/blog/choosing-a-walking-buddy-for-a-senior-dog`

### Alt Text

```text
Two senior dogs walking calmly with their pet parents along a tree-lined path.
```

---

## Blog Post Hero Structure

For `/blog/[slug]`, use the article image after the metadata and before the article body.

```text
Breadcrumbs
Category
Article title
Summary
Author, date, and reading time
Hero image
Article body
Related posts
Newsletter CTA
```

Use a `16:9` or `16:10` container and do not place the article title inside the image.

---

# 404 Page

## 17. PawPair 404 Illustration

**File:**

```text
/public/images/illustrations/pawpair-404.png
```

### Page

```text
apps/web/app/not-found.tsx
```

A reusable section may live under:

```text
src/components/sections/not-found/hero/
```

### Recommended Layout

```text
Left or top:
- 404 eyebrow
- “This trail went cold”
- Supporting copy
- Return home button
- Browse blog button

Right or bottom:
- 404 illustration
```

### Guidance

- Use `object-contain`
- Preserve the transparent background
- Do not crop the dog, cat, or paw trail

### Suggested Alt Text

```text
A curious dog and cat searching around an empty page by following a paw-print trail.
```

---

# Pricing Page

The pricing page does not require a large dedicated photo.

Use smaller brand elements instead:

- Pet avatar stack above the pricing cards
- PawPair icon inside the featured plan
- Mochi, Luna, Atlas, and Pepper in a small profile row
- Subtle paw and match decorations

Recommended sections:

```text
src/components/sections/pricing/hero/
src/components/sections/pricing/plans/
src/components/sections/pricing/comparison/
src/components/sections/pricing/faq/
src/components/sections/pricing/final-cta/
```

For the final CTA, reuse a different crop of:

```text
final-cta-happy-match.webp
```

---

# Contact Page

The contact page should remain form-focused.

Recommended image usage:

- PawPair icon beside the page heading
- Small pet avatar stack
- Optional crop from `about-pawpair-community.webp`
- Small paw-shaped decorative elements

Avoid placing a large image beside a long contact form on mobile.

Recommended sections:

```text
src/components/sections/contact/hero/
src/components/sections/contact/contact-form/
src/components/sections/contact/contact-options/
src/components/sections/contact/faq-preview/
src/components/sections/contact/final-cta/
```

---

# Responsive Crop Reference

| Image | Desktop | Tablet | Mobile |
| --- | --- | --- | --- |
| Hero meetup | `4:5` or `3:4` | `4:5` | `1:1` or `4:5` |
| Mochi portrait | `4:5` | `4:5` | `4:5` |
| Product phones | `4:3` contain | `4:3` contain | Single phone portrait |
| Safety meetup | `4:3` | `4:3` | `1:1` |
| About community | `4:3` | `4:3` | `3:4` |
| Community walk | `16:9` | `3:2` | `4:3` |
| Final CTA | `3:2` | `3:2` | `4:5` or hidden background |
| Pet portraits | `4:5` | `4:5` | `4:5` |
| Blog images | `16:10` | `16:10` | `4:3` |
| 404 illustration | `4:3` contain | `4:3` contain | `1:1` contain |

---

# Next.js Image Examples

## Photography

```tsx
<div className="relative aspect-[4/5] overflow-hidden rounded-[32px]">
  <Image
    src="/images/hero/hero-pet-meetup.webp"
    alt="Two pet parents introducing their dogs in a sunny city park."
    fill
    priority
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 42vw"
    className="object-cover object-center"
  />
</div>
```

## Transparent Product Mockup

```tsx
<div className="relative aspect-[4/3]">
  <Image
    src="/images/product/product-phone-mockups.png"
    alt="Three smartphone frames used to preview the PawPair application."
    fill
    sizes="(max-width: 768px) 100vw, 60vw"
    className="object-contain"
  />
</div>
```

---

# Loading Priority

Use `priority` only for images visible above the fold.

## Priority Images

- Header logo
- Hero lifestyle image
- Mochi portrait when immediately visible

## Lazy-Loaded Images

- Safety section
- About page image
- Community walk
- Testimonials
- Blog images
- Footer assets
- 404 illustration

---

# Optimization Guidance

## Photography

Use:

```text
WebP
```

Recommended quality:

```text
78–85
```

## Transparent Assets

Use:

```text
PNG
```

or WebP with alpha when it fits the workflow.

## Suggested Maximum Dimensions

| Asset | Suggested Maximum |
| --- | --- |
| Hero image | `1800 × 2250` |
| Wide section image | `2200 × 1240` |
| Blog image | `1600 × 1000` |
| Pet portrait | `1000 × 1250` |
| 404 illustration | `1600 × 1200` |
| Phone mockup | `1800 × 1350` |

The generated logo should eventually be redrawn or traced into SVG before production use.

---

# Missing Image Fallbacks

Every image-driven component should have a fallback state.

Suggested fallback:

- Warm cream background
- PawPair icon centered
- Subtle paw decoration
- Fixed expected aspect ratio
- No broken-image symbol

Use:

```text
/public/images/brand/logo-pawpair-icon.png
```

as the central fallback mark.

---

# Storybook Guidance

Image paths should be reusable in stories.

Example:

```ts
export const DEFAULT_HERO_IMAGE =
  "/images/hero/hero-pet-meetup.webp";
```

Create stories for:

- Default image
- Missing-image fallback
- Mobile crop
- Dark-mode container
- Image-left layout
- Image-right layout
- Long-copy layout
- Reduced-motion overlays

---

# Final Checklist

- [ ] Primary logo appears in the header and footer.
- [ ] Standalone icon is configured for app icons and favicons.
- [ ] Hero image contains no baked-in headline or CTA.
- [ ] Mochi portrait is displayed inside a coded profile card.
- [ ] Product UI is built in React or inserted from real screenshots.
- [ ] Safety image is paired with a real HTML checklist.
- [ ] About image includes different people and pet types.
- [ ] Community image crops correctly on mobile.
- [ ] Pet portraits use consistent `4:5` framing.
- [ ] Blog images are linked to matching article data.
- [ ] The 404 illustration uses `object-contain`.
- [ ] Every meaningful image has descriptive alt text.
- [ ] Only above-the-fold assets use loading priority.
- [ ] Images contain no fake metrics, generated buttons, or unreadable text.
- [ ] Mobile layouts remove nonessential overlays.
- [ ] Dark-mode contrast is tested around logos and illustrations.
