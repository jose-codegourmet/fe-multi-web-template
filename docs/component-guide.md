# Component Usage Guide

LLM-oriented reference for every UI component under [`apps/web/src/components/`](../apps/web/src/components/). Use this **before** reading component source: pick the right component, confirm when (and when not) to use it, then open the file only if you need implementation details.

Each component also has a co-located `*.usecase.md` (purpose, when/when-not, code examples). Links under each section below point to that file.

Folder/file conventions (naming, stories, schema files, usecase docs) live in [`docs/template/COMPONENTS.md`](./template/COMPONENTS.md). Required agent patterns: [`docs/llm/PATTERNS.md`](./llm/PATTERNS.md).

**Primitives:** most interactive components wrap `@base-ui/react/*`. Also used: `cmdk`, `embla-carousel-react`, `sonner`, `react-day-picker`, `input-otp`, `react-resizable-panels`, `recharts`, `framer-motion` (scroll-reveal only).

Import path pattern: `@/components/<folder>/<ComponentName>`.

---

## Cross-reference: commonly confused components

### Overlays

| Need | Use | Not |
| --- | --- | --- |
| Blocking confirmation (delete, irreversible) | **AlertDialog** | Dialog, Alert |
| Centered modal / short form | **Dialog** | Sheet, Drawer |
| Edge panel (filters, mobile nav), no swipe | **Sheet** (`side`) | Dialog, Drawer |
| Swipeable / snap-point mobile sheet | **Drawer** | Sheet, Dialog |
| Click-anchored non-modal panel | **Popover** | Dialog, Tooltip |
| Hover/focus preview (richer than tooltip) | **HoverCard** | Popover, Tooltip |
| Short non-interactive hint | **Tooltip** | HoverCard, Popover |

### Selects

| Need | Use | Not |
| --- | --- | --- |
| Fixed list, no search | **Select** | Combobox, NativeSelect |
| Native OS picker / max compatibility | **NativeSelect** | Select |
| Typeahead / large lists / chips | **Combobox** | Select |
| Command palette / actions | **Command** | Combobox |

### Tables & carousels

| Need | Use |
| --- | --- |
| Static / hand-composed table markup | **Table** primitives |
| Sort / filter / paginate column-driven data | **DataTable** (`table/data-table/`) |
| Slideshow with prev/next | **Carousel** or **EmblaCarousel** (prefer EmblaCarousel when you need dots / auto-width / richer variants) |

### Chat UI stack

```text
MessageScroller (viewport + autoscroll)
  └── MessageScrollerItem
        └── Message (row: avatar + content, align start|end)
              └── Bubble (speech styling)
```

Do not use Card/Item for chat bubbles, or ScrollArea for stick-to-bottom chat.

---

## Quick reference by category

### Layout & structure

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [AspectRatio](#aspectratio) | Lock media to a ratio | Circular people images → Avatar |
| [Card](#card) | Bordered content block | Modals → Dialog; status → Alert |
| [Collapsible](#collapsible) | Single expand/collapse panel | Multi FAQ → Accordion |
| [Item](#item) | List-row / media-object | Form layout → Field; empty → Empty |
| [Resizable](#resizable) | Draggable split panels | Static grids → CSS |
| [ScrollArea](#scrollarea) | Custom scrollbar overflow | Chat stick-to-bottom → MessageScroller |
| [Separator](#separator) | Visual divider | Menu option dividers → SelectSeparator / menu separators |
| [Skeleton](#skeleton) | Loading placeholder shape | Indeterminate spinner → Spinner |

### Overlays & popups

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [AlertDialog](#alertdialog) | Modal confirm / destructive | Inline notice → Alert |
| [Dialog](#dialog) | Centered modal | Side panel → Sheet; swipe sheet → Drawer |
| [Drawer](#drawer) | Swipeable edge panel | Static side panel → Sheet |
| [Sheet](#sheet) | Edge slide-over | Centered modal → Dialog |
| [Popover](#popover) | Anchored interactive panel | Hint only → Tooltip |
| [HoverCard](#hovercard) | Hover preview card | Click forms → Popover/Dialog |
| [Tooltip](#tooltip) | Short hover/focus hint | Rich/interactive → Popover |
| [ContextMenu](#contextmenu) | Right-click menu | Button menu → DropdownMenu |
| [DropdownMenu](#dropdownmenu) | Click/hover action menu | Form value pick → Select |
| [Menubar](#menubar) | App File/Edit bar | Site nav → NavigationMenu |

### Navigation

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Breadcrumb](#breadcrumb) | Hierarchy trail | Primary nav → NavigationMenu / Tabs |
| [NavigationMenu](#navigationmenu) | Site nav + flyouts | App menus → Menubar |
| [Pagination](#pagination) | Page links | Infinite/chat scroll → MessageScroller |
| [Tabs](#tabs) | Tabbed panels | Routing → Link / App Router |
| [ToggleGroup](#togglegroup) | Related pressed options | Settings boolean → Switch |

### Forms & inputs

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Button](#button) | Primary actions | Status labels → Badge |
| [ButtonGroup](#buttongroup) | Joined button cluster | Unrelated CTAs → separate Buttons |
| [Calendar](#calendar) | Date / range picker | Time-only → time input |
| [Checkbox](#checkbox) | Multi-select boolean | Exclusive choice → RadioGroup |
| [Combobox](#combobox) | Searchable select / chips | Small fixed list → Select |
| [Field](#field) | Label / error layout chrome | Form store → RHF (not Field) |
| [Input](#input) | Single-line text | Icons/addons → InputGroup; OTP → InputOTP |
| [InputGroup](#inputgroup) | Input + addon chrome | Plain field → Input |
| [InputOTP](#inputotp) | Digit / PIN entry | Free text → Input |
| [Label](#label) | Accessible field label | Section titles → typography / Marker |
| [NativeSelect](#nativeselect) | Native `<select>` | Custom/search UI → Select / Combobox |
| [RadioGroup](#radiogroup) | Exclusive options | Multi-select → Checkbox |
| [Select](#select) | Styled single-value dropdown | Search/chips → Combobox |
| [Slider](#slider) | Continuous / range value | Discrete options → Select / ToggleGroup |
| [Switch](#switch) | On/off settings | Toolbar press → Toggle |
| [Textarea](#textarea) | Multi-line text | Single line → Input |
| [Toggle](#toggle) | Single pressed control | Related group → ToggleGroup |

### Data display

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Avatar](#avatar) | User image + fallback | Fixed-ratio media → AspectRatio |
| [Badge](#badge) | Compact status pill | Primary actions → Button |
| [Chart](#chart) | Themed Recharts wrapper | Tables → Table / DataTable |
| [Kbd](#kbd) | Keyboard shortcut display | Interactive control → Button |
| [Marker](#marker) | Meta line (icon + text) | Alerts → Alert; labels → Label |
| [Progress](#progress) | Determinate bar | Indeterminate → Spinner |
| [Table](#table) / [DataTable](#datatable) | Markup / TanStack table | Card lists → Item / Card |

### Feedback & status

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Alert](#alert) | Inline banner | Blocking confirm → AlertDialog |
| [Empty](#empty) | Empty-state layout | Combobox/Command empty → their Empty |
| [Sonner](#sonner) (`Toaster`) | Toast host | Inline persistent → Alert |
| [Spinner](#spinner) | Indeterminate loader | Content-shaped load → Skeleton |

### Chat / conversational

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Attachment](#attachment) | File chip / upload states | Status tags → Badge |
| [Bubble](#bubble) | Chat speech bubble | Page notices → Alert |
| [Message](#message) | Chat row layout | Bubble styling → Bubble |
| [MessageScroller](#messagescroller) | Chat viewport + autoscroll | Generic overflow → ScrollArea |
| [Command](#command) | Command palette (cmdk) | Form select → Combobox / Select |

### Media

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Carousel](#carousel) | Embla slideshow | File chips → AttachmentGroup |
| [EmblaCarousel](#emblacarousel) | Embla + dots / variants | Static grid → CSS |

### Motion & direction

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [ScrollReveal](#scrollreveal) | In-view fade/slide | Page transitions (not allowed) |
| [Direction](#direction) | LTR/RTL Base UI context | Pure CSS `dir` when no Base UI |

### App infrastructure

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Providers](#providers) | Redux + Query + theme root | Nested duplicate providers |

### Disclosure (FAQ)

| Component | Purpose | Prefer instead when… |
| --- | --- | --- |
| [Accordion](#accordion) | Multi-panel FAQ / groups | Peer panels → Tabs; single panel → Collapsible |

---

## Layout & structure

### AspectRatio

→ [`AspectRatio.usecase.md`](../apps/web/src/components/aspect-ratio/AspectRatio.usecase.md)

- **Purpose:** Wrapper that locks children to a numeric width/height ratio via CSS `aspect-ratio`.
- **Import:** `@/components/aspect-ratio/AspectRatio`
- **Key props / variants:** Required `ratio: number` (e.g. `16/9`, `1`); sets CSS `--ratio`; other props are standard `div` props.
- **When to use:**
  - Video/thumbnail placeholders at 16:9
  - Square product crops at `ratio={1}`
  - Consistent media frames inside responsive widths
- **When NOT to use:**
  - Circular user images with fallback → **Avatar**
  - File upload chips → **Attachment**
  - Full content sections → **Card**
- **Gotchas:** Parent must constrain width; `ratio` is required.

### Card

→ [`Card.usecase.md`](../apps/web/src/components/card/Card.usecase.md)

- **Purpose:** Bordered content container with optional header, body, action, and footer.
- **Import:** `@/components/card/Card`
- **Exports:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`
- **Key props / variants:** Root `size?: "default" | "sm"` (controls `--card-spacing`); composition slots only.
- **When to use:**
  - Feature/summary blocks with title + description
  - Forms or settings sections with a muted footer
  - Header actions via `CardAction`
- **When NOT to use:**
  - Modal confirms → **AlertDialog** / **Dialog**
  - Inline status banners → **Alert**
  - Tiny status labels → **Badge**
- **Gotchas:** `CardAction` expects to live in `CardHeader` for grid placement.

### Collapsible

→ [`Collapsible.usecase.md`](../apps/web/src/components/collapsible/Collapsible.usecase.md)

- **Purpose:** Toggles showing/hiding a content panel when its trigger is activated.
- **Import:** `@/components/collapsible/Collapsible`
- **Exports:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`
- **Key props / variants:** Base UI root (`defaultOpen`, `open`, `disabled`); Trigger supports `render` (compose with **Button**).
- **When to use:**
  - Expand/collapse inline sections (“read more”, order details)
  - Progressive disclosure without a modal
- **When NOT to use:**
  - Multi-item exclusive FAQ → **Accordion**
  - Overlay content → **Dialog** / **Drawer** / **Sheet**
- **Gotchas:** `"use client"` required.

### Item

→ [`Item.usecase.md`](../apps/web/src/components/item/Item.usecase.md)

- **Purpose:** Flexible list-row / media-object building blocks for notifications, digests, and selectable rows.
- **Import:** `@/components/item/Item`
- **Exports:** `Item`, `ItemGroup`, `ItemSeparator`, `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, `ItemActions`, `ItemHeader`, `ItemFooter`
- **Key props / variants:** `variant?: "default" | "outline" | "muted"`; `size?: "default" | "sm" | "xs"`; `ItemMedia` `variant?: "default" | "icon" | "image"`; polymorphic via Base UI `render`.
- **When to use:**
  - Notification or feed rows (icon/image + title + description)
  - Compact rows inside menus (`size="xs"`)
  - Grouped lists with separators and actions
- **When NOT to use:**
  - Form field layout → **Field**
  - Empty states → **Empty**
  - Menu primitives → **DropdownMenu** / **Command** items
- **Gotchas:** `ItemGroup` uses `role="list"`.

### Resizable

→ [`Resizable.usecase.md`](../apps/web/src/components/resizable/Resizable.usecase.md)

- **Purpose:** Split layouts with draggable separators between panels (`react-resizable-panels`).
- **Import:** `@/components/resizable/Resizable`
- **Exports:** `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`
- **Key props / variants:** Group `orientation?: "horizontal" | "vertical"`; panels use `defaultSize`; Handle optional `withHandle?: boolean`.
- **When to use:**
  - Sidebar | main editor splits
  - Vertical header/content splits
- **When NOT to use:**
  - Static grids that never resize
  - Mobile drawer navigation → **Sheet** / **Drawer**
- **Gotchas:** `"use client"`; group should fill height (`h-full`); give panels sensible `defaultSize`s.

### ScrollArea

→ [`ScrollArea.usecase.md`](../apps/web/src/components/scroll-area/ScrollArea.usecase.md)

- **Purpose:** Custom-scrollbar overflow container for clipped content.
- **Import:** `@/components/scroll-area/ScrollArea`
- **Exports:** `ScrollArea`, `ScrollBar`
- **Key props / variants:** `ScrollBar` `orientation?: "vertical" | "horizontal"` (default `"vertical"`). Schema/defaultvalues files are Storybook helpers only.
- **When to use:**
  - Fixed-height lists that overflow
  - Horizontal chip/tag rows (add horizontal `ScrollBar`)
- **When NOT to use:**
  - Chat autoscroll / stick-to-bottom → **MessageScroller**
  - Full-page document scrolling → native page scroll
- **Gotchas:** `"use client"`; needs a constrained size (e.g. `h-48`); root always injects a vertical `ScrollBar`.

### Separator

→ [`Separator.usecase.md`](../apps/web/src/components/separator/Separator.usecase.md)

- **Purpose:** Thin visual divider for horizontal or vertical layout splits.
- **Import:** `@/components/separator/Separator`
- **Key props / variants:** `orientation?: "horizontal" | "vertical"` (default `"horizontal"`).
- **When to use:**
  - Dividing sections in a card, sidebar, or settings panel
  - Vertical rule between inline controls
- **When NOT to use:**
  - Separating Select options → `SelectSeparator`
  - Gaps that don’t need a semantic divider → spacing/`div`
- **Gotchas:** `"use client"` required.

### Skeleton

→ [`Skeleton.usecase.md`](../apps/web/src/components/skeleton/Skeleton.usecase.md)

- **Purpose:** Pulsing muted placeholder block for loading UI.
- **Import:** `@/components/skeleton/Skeleton`
- **Key props / variants:** `React.ComponentProps<"div">` — shape/size via `className`. Schema/defaultvalues are Storybook helpers.
- **When to use:**
  - Placeholder lines/circles/cards while data loads
- - Composing multiple skeletons to mimic a layout
- **When NOT to use:**
  - Active indeterminate spinner → **Spinner**
  - Real interactive content → keep real components (disabled)
- **Gotchas:** Server-safe (no `"use client"`); size is entirely class-driven.

---

## Overlays & popups

### AlertDialog

→ [`AlertDialog.usecase.md`](../apps/web/src/components/alert-dialog/AlertDialog.usecase.md)

- **Purpose:** Modal confirmation that interrupts the flow for destructive or irreversible actions.
- **Import:** `@/components/alert-dialog/AlertDialog`
- **Exports:** `AlertDialog`, `AlertDialogTrigger`, `AlertDialogPortal`, `AlertDialogOverlay`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogMedia`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogAction`, `AlertDialogCancel`
- **Key props / variants:** `AlertDialogContent` `size?: "default" | "sm"`; Trigger often uses `render={<Button … />}`; Cancel closes; Action is a **Button**.
- **When to use:**
  - Delete / irreversible confirmations
  - “Are you sure?” before costly actions
- **When NOT to use:**
  - Non-blocking inline messages → **Alert**
  - Non-confirm forms/detail panels → **Dialog** / **Card**
- **Gotchas:** `"use client"`; `AlertDialogAction` does **not** auto-close — handle close after confirm yourself.

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>
    Delete
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete item?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Confirm</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Dialog

→ [`Dialog.usecase.md`](../apps/web/src/components/dialog/Dialog.usecase.md)

- **Purpose:** Centered modal overlay for focused tasks, confirmations, and short forms.
- **Import:** `@/components/dialog/Dialog`
- **Exports:** `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`
- **Key props / variants:** Content `showCloseButton?: boolean` (default `true`); controlled via Root `open` / `onOpenChange`.
- **When to use:**
  - Short edit forms, alerts requiring focus trap
  - Centered modal content (not a side panel)
- **When NOT to use:**
  - Edge-anchored panels → **Sheet**
  - Swipeable / snap-point sheets → **Drawer**
  - Destructive confirm-only → **AlertDialog**
- **Gotchas:** `"use client"`; Content is fixed centered (`max-w-sm` on sm+).

### Drawer

→ [`Drawer.usecase.md`](../apps/web/src/components/drawer/Drawer.usecase.md)

- **Purpose:** Swipeable edge-anchored panel with optional snap points (Base UI Drawer, not vaul).
- **Import:** `@/components/drawer/Drawer`
- **Exports:** `Drawer`, `DrawerTrigger`, `DrawerPortal`, `DrawerClose`, `DrawerOverlay`, `DrawerContent`, `DrawerHeader`, `DrawerFooter`, `DrawerTitle`, `DrawerDescription`, `DrawerSwipeHandle`
- **Key props / variants:** Root `showSwipeHandle?: boolean`, `modal` (default `true`), `swipeDirection` (default `"down"`), `snapPoints`.
- **When to use:**
  - Bottom sheets / swipe-to-dismiss mobile flows
  - Snap-point drawers (partial → full height)
- **When NOT to use:**
  - Centered modals → **Dialog**
  - Static side panels without swipe → **Sheet**
- **Gotchas:** `"use client"`; Content must be inside `Drawer`; overlay only when `modal === true`.

### Sheet

→ [`Sheet.usecase.md`](../apps/web/src/components/sheet/Sheet.usecase.md)

- **Purpose:** Slide-over panel (edge drawer) built on the Dialog primitive — overlay + optional close.
- **Import:** `@/components/sheet/Sheet`
- **Exports:** `Sheet`, `SheetClose`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle`, `SheetTrigger`
- **Key props / variants:** `SheetContent` `side?: "top" | "right" | "bottom" | "left"` (default `"right"`), `showCloseButton?: boolean` (default `true`).
- **When to use:**
  - Side filters / edit forms
  - Mobile/nav drawers from left or right
- **When NOT to use:**
  - Centered modal → **Dialog**
  - Swipe/snap mobile sheets → **Drawer**
  - Transient feedback → **Sonner**
- **Gotchas:** `"use client"`; left/right sheets are `w-3/4` with `sm:max-w-sm`.

### Popover

→ [`Popover.usecase.md`](../apps/web/src/components/popover/Popover.usecase.md)

- **Purpose:** Anchored floating panel for short interactive content (settings, share, filters).
- **Import:** `@/components/popover/Popover`
- **Exports:** `Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`
- **Key props / variants:** Content `align` (default `"center"`), `side` (default `"bottom"`), `sideOffset` (default `4`); root supports controlled `open`.
- **When to use:**
  - Non-modal overlays with small forms/filters
  - “Share link” panels with title/description
- **When NOT to use:**
  - Brief hover hints → **Tooltip**
  - Blocking dialogs → **Dialog**
  - Site nav flyouts → **NavigationMenu**
- **Gotchas:** `"use client"`; default width `w-72`.

### HoverCard

→ [`HoverCard.usecase.md`](../apps/web/src/components/hover-card/HoverCard.usecase.md)

- **Purpose:** Hover/focus preview card anchored to a trigger (Base UI PreviewCard).
- **Import:** `@/components/hover-card/HoverCard`
- **Exports:** `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
- **Key props / variants:** Content defaults `side="bottom"`, `sideOffset=4`, `align="center"`; default width `w-64`.
- **When to use:**
  - User/profile previews on hover
  - Lightweight enrichment of links/buttons
- **When NOT to use:**
  - Click-required or long forms → **Popover** / **Dialog**
  - Dense action menus → **DropdownMenu**
- **Gotchas:** `"use client"`; hover/focus only — not primary navigation.

### Tooltip

→ [`Tooltip.usecase.md`](../apps/web/src/components/tooltip/Tooltip.usecase.md)

- **Purpose:** Hover/focus hint popup with portal, positioner, and arrow.
- **Import:** `@/components/tooltip/Tooltip`
- **Exports:** `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
- **Key props / variants:** Provider `delay` (default `0`); Content `side` (default `"top"`), `sideOffset` (default `4`).
- **When to use:**
  - Short hints on icon buttons
  - Clarifying truncated labels
- **When NOT to use:**
  - Longer interactive content → **Popover**
  - Critical always-visible info → visible text / **Alert**
- **Gotchas:** `"use client"`; wrap with `TooltipProvider`; content is non-interactive by design.

### ContextMenu

→ [`ContextMenu.usecase.md`](../apps/web/src/components/context-menu/ContextMenu.usecase.md)

- **Purpose:** Right-click (context) menu with items, checkboxes, radios, and nested submenus.
- **Import:** `@/components/context-menu/ContextMenu`
- **Exports:** `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubTrigger`, `ContextMenuSubContent`
- **Key props / variants:** Content defaults `align="start"`, `side="right"`; Item `variant?: "default" | "destructive"`, `inset?: boolean`.
- **When to use:**
  - Right-click actions on canvas, list rows, media, or editors
  - Contextual checkboxes/radios and nested submenus
- **When NOT to use:**
  - Button-triggered menus → **DropdownMenu**
  - Form option selection → **Select** / **Combobox**
- **Gotchas:** `"use client"` required.

### DropdownMenu

→ [`DropdownMenu.usecase.md`](../apps/web/src/components/dropdown-menu/DropdownMenu.usecase.md)

- **Purpose:** Click/hover-triggered action menu anchored to a control.
- **Import:** `@/components/dropdown-menu/DropdownMenu`
- **Exports:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`
- **Key props / variants:** Content defaults `side="bottom"`, `sideOffset=4`; Item `variant?: "default" | "destructive"`, `inset?: boolean`.
- **When to use:**
  - “More actions” / overflow menus
  - Account menus with shortcuts and destructive items
- **When NOT to use:**
  - Right-click → **ContextMenu**
  - Form field value → **Select** / **Combobox**
  - Command palette → **Command**
- **Gotchas:** `"use client"`; structurally parallel to ContextMenu but click-triggered.

### Menubar

→ [`Menubar.usecase.md`](../apps/web/src/components/menubar/Menubar.usecase.md)

- **Purpose:** Application-style horizontal menu bar (File / Edit / View) with dropdowns and submenus.
- **Import:** `@/components/menubar/Menubar`
- **Exports:** `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarGroup`, `MenubarPortal`
- **Key props / variants:** Item `variant` (`default` / `destructive`), `inset`; checkbox/radio items take `checked` / `value`.
- **When to use:**
  - Desktop-app File / Edit / View menus
  - Nested submenus and view-option radios/checkboxes
- **When NOT to use:**
  - Site header nav → **NavigationMenu**
  - Single button menu → **DropdownMenu**
  - Right-click → **ContextMenu**
- **Gotchas:** `"use client"`; nest `MenubarMenu` → Trigger + Content under `Menubar`.

---

## Navigation

### Breadcrumb

→ [`Breadcrumb.usecase.md`](../apps/web/src/components/breadcrumb/Breadcrumb.usecase.md)

- **Purpose:** Navigation trail showing the current page’s location in a hierarchy.
- **Import:** `@/components/breadcrumb/Breadcrumb`
- **Exports:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`
- **Key props / variants:** Semantic `nav` + `ol`/`li`; Link uses Base UI `render` (default `a`); Separator defaults to ChevronRight.
- **When to use:**
  - Nested app routes (Settings → Team → Members)
  - Truncated long paths with `BreadcrumbEllipsis`
- **When NOT to use:**
  - Primary site nav or tab switching → **NavigationMenu** / **Tabs**
  - Modal step indicators → stepper pattern (not Breadcrumb)
- **Gotchas:** `BreadcrumbPage` sets `aria-current="page"`.

### NavigationMenu

→ [`NavigationMenu.usecase.md`](../apps/web/src/components/navigation-menu/NavigationMenu.usecase.md)

- **Purpose:** Site navigation with optional hover/click dropdown panels.
- **Import:** `@/components/navigation-menu/NavigationMenu`
- **Exports:** `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuPositioner`, `navigationMenuTriggerStyle`
- **Key props / variants:** Root `align` forwarded to positioner (default `"start"`); trigger styles via CVA `navigationMenuTriggerStyle`.
- **When to use:**
  - Top-of-site nav with plain links
  - “Products” / “Resources” flyout panels
- **When NOT to use:**
  - App File/Edit menus → **Menubar**
  - Single button dropdown → **DropdownMenu**
  - Mobile hamburger → **Sheet** / **Drawer**
- **Gotchas:** Root always mounts `NavigationMenuPositioner` as a sibling of children.

### Pagination

→ [`Pagination.usecase.md`](../apps/web/src/components/pagination/Pagination.usecase.md)

- **Purpose:** Accessible page-navigation controls as a `<nav>` of links styled with **Button**.
- **Import:** `@/components/pagination/Pagination`
- **Exports:** `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`
- **Key props / variants:** `PaginationLink` `isActive?: boolean`, `size` from Button (default `"icon"`); Previous/Next accept `text?: string`.
- **When to use:**
  - Multi-page result lists
  - Truncated ranges with `PaginationEllipsis`
- **When NOT to use:**
  - Infinite scroll / chat → **MessageScroller** / **ScrollArea**
  - Tabbed content → **Tabs**
- **Gotchas:** Links use `Button` with `nativeButton={false}` and `render={<a />}`; set `isActive` for `aria-current="page"`.

### Tabs

→ [`Tabs.usecase.md`](../apps/web/src/components/tabs/Tabs.usecase.md)

- **Purpose:** Tabbed panels via Base UI Tabs, plus optional Embla-based `TabsCarouselList` for overflow on small containers.
- **Import:** `@/components/tabs/Tabs`
- **Exports:** `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `TabsCarouselList`, `tabsListVariants`; types `TabsCarouselItem`, `TabsCarouselBreakpoint`
- **Key props / variants:** Root `orientation?: "horizontal" | "vertical"`; `TabsList` `variant?: "default" | "line"`; `TabsCarouselList` `tabs`, `breakpoint?: "xs" | "sm" | "md" | "lg"` (default `"sm"`).
- **When to use:**
  - Settings/content sections (account/password)
  - Many tabs that overflow → `TabsCarouselList`
- **When NOT to use:**
  - In-page routing → App Router / `Link`
  - Mutually exclusive toolbar modes without panels → **ToggleGroup**
- **Gotchas:** `"use client"`; `TabsCarouselList` depends on `embla-carousel-react` and container queries.

### ToggleGroup

→ [`ToggleGroup.usecase.md`](../apps/web/src/components/toggle-group/ToggleGroup.usecase.md)

- **Purpose:** Group of toggles sharing variant/size via context; values are arrays.
- **Import:** `@/components/toggle-group/ToggleGroup`
- **Exports:** `ToggleGroup`, `ToggleGroupItem`
- **Key props / variants:** Group: `variant`/`size` from `toggleVariants` (`default` | `outline`; `default` | `sm` | `lg`), `spacing?: number` (default `2`), `orientation?: "horizontal" | "vertical"`; items take `value`.
- **When to use:**
  - Formatting toolbars (bold/italic/underline)
  - Alignment or view-mode pickers (list/grid)
- **When NOT to use:**
  - Single isolated press → **Toggle**
  - Settings boolean → **Switch**
  - One-of-many with long labels → **RadioGroup** / **Select**
- **Gotchas:** `"use client"`; `spacing={0}` enables segmented (joined) borders.

---

## Forms & inputs

### Button

→ [`Button.usecase.md`](../apps/web/src/components/button/Button.usecase.md)

- **Purpose:** Primary interactive control for actions and links-as-buttons.
- **Import:** `@/components/button/Button`
- **Exports:** `Button`, `buttonVariants`
- **Key props / variants:** `variant`: `default` | `outline` | `secondary` | `ghost` | `destructive` | `link`; `size`: `default` | `xs` | `sm` | `lg` | `icon` | `icon-xs` | `icon-sm` | `icon-lg`. Supports Base UI `render` polymorphism.
- **When to use:**
  - Form submits and primary CTAs
  - Secondary/outline actions and icon-only controls
- **When NOT to use:**
  - Non-interactive status labels → **Badge**
  - Joined toolbars → wrap with **ButtonGroup**
- **Gotchas:** Invalid state styles via `aria-invalid`.

### ButtonGroup

→ [`ButtonGroup.usecase.md`](../apps/web/src/components/button-group/ButtonGroup.usecase.md)

- **Purpose:** Visually joined cluster of buttons/inputs sharing borders and radius.
- **Import:** `@/components/button-group/ButtonGroup`
- **Exports:** `ButtonGroup`, `ButtonGroupText`, `ButtonGroupSeparator`, `buttonGroupVariants`
- **Key props / variants:** `orientation?: "horizontal" | "vertical"`; `role="group"`.
- **When to use:**
  - Segmented actions (Left / Center / Right)
  - Toolbar icon clusters; prefixed label + controls via `ButtonGroupText`
- **When NOT to use:**
  - Single standalone CTA → **Button**
  - Unrelated spaced actions → separate Buttons
- **Gotchas:** Joined borders assume children expose `data-slot` (works well with Button).

### Calendar

→ [`Calendar.usecase.md`](../apps/web/src/components/calendar/Calendar.usecase.md)

- **Purpose:** Date picker grid for single dates or ranges (`react-day-picker`).
- **Import:** `@/components/calendar/Calendar`
- **Exports:** `Calendar`, `CalendarDayButton`
- **Key props / variants:** DayPicker API: `mode` (`single`/`range`), `numberOfMonths`, `captionLayout`, `showOutsideDays`, `locale`; extras: `buttonVariant` for nav buttons.
- **When to use:**
  - Single date or date-range selection
  - Embedding in Card/Popover content
- **When NOT to use:**
  - Time-of-day alone → time input
  - Non-interactive date display → plain text
- **Gotchas:** `"use client"`; heavily depends on DayPicker (`selected`, `onSelect`, etc.).

### Checkbox

→ [`Checkbox.usecase.md`](../apps/web/src/components/checkbox/Checkbox.usecase.md)

- **Purpose:** Binary checked control with check indicator for forms and filters.
- **Import:** `@/components/checkbox/Checkbox`
- **Key props / variants:** Base UI checkbox (`checked`/`defaultChecked`, `disabled`); styles for `data-checked`, `aria-invalid`.
- **When to use:**
  - Multi-select form options
  - Filter lists with independent choices
- **When NOT to use:**
  - Exclusive single choice → **RadioGroup**
  - Settings on/off with switch UX → **Switch**
- **Gotchas:** `"use client"`; pair with a **Label**.

### Combobox

→ [`Combobox.usecase.md`](../apps/web/src/components/combobox/Combobox.usecase.md)

- **Purpose:** Searchable, filterable select with optional chips/multi-select UI.
- **Import:** `@/components/combobox/Combobox`
- **Exports:** `Combobox`, `ComboboxValue`, `ComboboxTrigger`, `ComboboxInput`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, `ComboboxEmpty`, `ComboboxSeparator`, `ComboboxChips`, `ComboboxChip`, `ComboboxChipsInput`, `useComboboxAnchor`
- **Key props / variants:** Root `items`, `defaultValue`, `disabled`; `ComboboxInput` `showTrigger?`, `showClear?`; Content positioning (`side`, `align`, offsets, `anchor`).
- **When to use:**
  - Large option lists that need typeahead
  - Autocomplete / tag pickers; multi-value chips via `ComboboxChips`
- **When NOT to use:**
  - Simple fixed list, no search → **Select**
  - Native OS picker → **NativeSelect**
  - Global command palette → **Command**
- **Gotchas:** `"use client"`; chip layouts often need `useComboboxAnchor` + `anchor` on Content.

### Field

→ [`Field.usecase.md`](../apps/web/src/components/field/Field.usecase.md)

- **Purpose:** Composition helpers for labeling, laying out, and showing errors around form controls.
- **Import:** `@/components/field/Field`
- **Exports:** `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError`
- **Key props / variants:** Field `orientation?: "vertical" | "horizontal" | "responsive"`; Legend `variant?: "legend" | "label"`; FieldError `errors?: Array<{ message?: string }>` or `children`.
- **When to use:**
  - Consistent label/description/error structure around Input/Select/etc.
  - Horizontal or responsive label+control rows
- **When NOT to use:**
  - As a form store / RHF replacement (this is layout/a11y chrome only)
- **Gotchas:** `"use client"`; set `data-invalid` on Field for destructive text styling; FieldError returns null when empty.

### Input

→ [`Input.usecase.md`](../apps/web/src/components/input/Input.usecase.md)

- **Purpose:** Styled single-line text input for forms.
- **Import:** `@/components/input/Input`
- **Key props / variants:** Native input props (`type`, `disabled`, `aria-invalid`, etc.); height `h-8`.
- **When to use:**
  - Standard text, email, password, number fields
- **When NOT to use:**
  - Inputs with icons/buttons → **InputGroup**
  - OTP digits → **InputOTP**
  - Multi-line → **Textarea**
- **Gotchas:** No `"use client"` (usable from Server Components if props stay serializable).

### InputGroup

→ [`InputGroup.usecase.md`](../apps/web/src/components/input-group/InputGroup.usecase.md)

- **Purpose:** Composite control wrapping Input/Textarea with aligned addons (icons, buttons, prefixes).
- **Import:** `@/components/input-group/InputGroup`
- **Exports:** `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupText`, `InputGroupTextarea`
- **Key props / variants:** Addon `align?: "inline-start" | "inline-end" | "block-start" | "block-end"`; Button sizes `xs` | `sm` | `icon-xs` | `icon-sm`.
- **When to use:**
  - Search fields with leading icon
  - Prefixed/suffixed inputs or textarea toolbars
- **When NOT to use:**
  - Plain single input → **Input**
  - OTP → **InputOTP**
- **Gotchas:** `"use client"`; clicking Addon focuses the inner input (unless target is a button); focus/invalid rings live on the group.

### InputOTP

→ [`InputOtp.usecase.md`](../apps/web/src/components/input-otp/InputOtp.usecase.md)

- **Purpose:** One-time-password / PIN digit entry with per-slot display and caret (`input-otp`).
- **Import:** `@/components/input-otp/InputOtp`
- **Exports:** `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator`
- **Key props / variants:** Root `maxLength`, `containerClassName`; `InputOTPSlot` requires `index: number`.
- **When to use:**
  - 2FA / verification codes
  - PIN entry with optional separators (e.g. 3+3)
- **When NOT to use:**
  - Free-text passwords or emails → **Input**
- **Gotchas:** `"use client"`; export names are `InputOTP*` (capital OTP); Slot must be under InputOTP with matching `index`/`maxLength`.

### Label

→ [`Label.usecase.md`](../apps/web/src/components/label/Label.usecase.md)

- **Purpose:** Accessible form field label styled for inputs and peers.
- **Import:** `@/components/label/Label`
- **Key props / variants:** Standard `label` props (`htmlFor`, `children`).
- **When to use:**
  - Pair with Input / NativeSelect / RadioGroupItem via `htmlFor` / `id`
- **When NOT to use:**
  - Non-form headings → typography / **Marker**
- **Gotchas:** `"use client"`; responds to `group-data-[disabled=true]` and `peer-disabled:`.

### NativeSelect

→ [`NativeSelect.usecase.md`](../apps/web/src/components/native-select/NativeSelect.usecase.md)

- **Purpose:** Styled wrapper around the browser’s native `<select>` with a chevron.
- **Import:** `@/components/native-select/NativeSelect`
- **Exports:** `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup`
- **Key props / variants:** Native select props minus HTML `size`; custom `size?: "sm" | "default"`.
- **When to use:**
  - Simple forms where native OS picker UX is fine
  - Grouped options with `NativeSelectOptGroup`
- **When NOT to use:**
  - Custom option UI or search → **Select** / **Combobox**
- **Gotchas:** Visual `size` prop is not HTML `size`; supports `aria-invalid` styling.

### RadioGroup

→ [`RadioGroup.usecase.md`](../apps/web/src/components/radio-group/RadioGroup.usecase.md)

- **Purpose:** Mutually exclusive radio options with accessible keyboard behavior.
- **Import:** `@/components/radio-group/RadioGroup`
- **Exports:** `RadioGroup`, `RadioGroupItem`
- **Key props / variants:** Group `defaultValue` / `value` / `onValueChange`; items need `value` (and usually `id` for Label).
- **When to use:**
  - Single-choice settings (density, plan billing)
  - Options with helper text beside Label
- **When NOT to use:**
  - Multi-select → **Checkbox**
  - Many options in a compact trigger → **Select** / **NativeSelect**
- **Gotchas:** `"use client"`; pair each item with `Label htmlFor={id}`.

### Select

→ [`Select.usecase.md`](../apps/web/src/components/select/Select.usecase.md)

- **Purpose:** Composable single-value dropdown with portal-positioned popup, groups, and scroll arrows.
- **Import:** `@/components/select/Select`
- **Exports:** `Select`, `SelectContent`, `SelectGroup`, `SelectItem`, `SelectLabel`, `SelectScrollDownButton`, `SelectScrollUpButton`, `SelectSeparator`, `SelectTrigger`, `SelectValue`
- **Key props / variants:** Trigger `size?: "sm" | "default"`; Content positioning (`side`, `sideOffset`, `align`, …); Root `defaultValue`, `disabled`.
- **When to use:**
  - Picking one option from a fixed list
  - Grouped option lists with labels and separators
- **When NOT to use:**
  - Typeahead / chips → **Combobox**
  - Native OS picker → **NativeSelect**
  - Navigational actions → **DropdownMenu**
- **Gotchas:** `"use client"`; compose Select → Trigger/Value + Content/Item.

```tsx
<Select defaultValue="apple">
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>
```

### Slider

→ [`Slider.usecase.md`](../apps/web/src/components/slider/Slider.usecase.md)

- **Purpose:** Range input with track, filled indicator, and one or more thumbs.
- **Import:** `@/components/slider/Slider`
- **Key props / variants:** `value` / `defaultValue` (arrays), `min` (default `0`), `max` (default `100`); thumb count = length of value array.
- **When to use:**
  - Single continuous value or dual-thumb ranges
- **When NOT to use:**
  - Discrete option picking → **Select** / **ToggleGroup**
- **Gotchas:** If neither `value` nor `defaultValue` is an array, thumbs default to `[min, max]` (two thumbs); vertical needs height; must be used from a client boundary.

### Switch

→ [`Switch.usecase.md`](../apps/web/src/components/switch/Switch.usecase.md)

- **Purpose:** Binary on/off control with sliding thumb.
- **Import:** `@/components/switch/Switch`
- **Key props / variants:** `size?: "sm" | "default"`; `checked`/`defaultChecked`, `disabled`; invalid via `aria-invalid`.
- **When to use:**
  - Settings toggles (notifications, features)
  - Compact boolean form controls
- **When NOT to use:**
  - Multi-option exclusive choice → **RadioGroup** / **ToggleGroup**
  - Instant toolbar formatting → **Toggle**
  - Tri-state / list selection → **Checkbox**
- **Gotchas:** `"use client"`; provide an accessible name (`aria-label` or Label).

### Textarea

→ [`Textarea.usecase.md`](../apps/web/src/components/textarea/Textarea.usecase.md)

- **Purpose:** Styled multi-line `<textarea>` with focus, invalid, and disabled styles.
- **Import:** `@/components/textarea/Textarea`
- **Key props / variants:** Native textarea props; `field-sizing-content`, `min-h-16`.
- **When to use:**
  - Multi-line form fields (bios, comments, descriptions)
- **When NOT to use:**
  - Single-line text → **Input**
  - Rich text / markdown → dedicated editor (not in this set)
- **Gotchas:** No `"use client"`; wire validation/`aria-invalid` yourself.

### Toggle

→ [`Toggle.usecase.md`](../apps/web/src/components/toggle/Toggle.usecase.md)

- **Purpose:** Pressable on/off button for a single option or formatting state.
- **Import:** `@/components/toggle/Toggle`
- **Exports:** `Toggle`, `toggleVariants`
- **Key props / variants:** `variant?: "default" | "outline"`; `size?: "default" | "sm" | "lg"`; `pressed`/`defaultPressed`.
- **When to use:**
  - Icon-only formatting toggle
  - Standalone pressed state with text
- **When NOT to use:**
  - Several related options → **ToggleGroup**
  - Persistent settings → **Switch**
  - Primary actions → **Button**
- **Gotchas:** `"use client"`; use `aria-label` for icon-only toggles.

---

## Data display

### Avatar

→ [`Avatar.usecase.md`](../apps/web/src/components/avatar/Avatar.usecase.md)

- **Purpose:** Circular user/entity image with fallback initials and optional status badge or stacked group.
- **Import:** `@/components/avatar/Avatar`
- **Exports:** `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount`
- **Key props / variants:** Root `size?: "default" | "sm" | "lg"`.
- **When to use:**
  - Profile photos with initials fallback
  - Participant stacks; online indicators via `AvatarBadge`
- **When NOT to use:**
  - Arbitrary fixed-ratio media → **AspectRatio**
  - File thumbnails with metadata → **Attachment**
- **Gotchas:** `"use client"`; prefer Image + Fallback together so Base UI can swap on load failure.

### Badge

→ [`Badge.usecase.md`](../apps/web/src/components/badge/Badge.usecase.md)

- **Purpose:** Compact pill label for status, category, or count.
- **Import:** `@/components/badge/Badge`
- **Exports:** `Badge`, `badgeVariants`
- **Key props / variants:** `variant`: `default` | `secondary` | `destructive` | `outline` | `ghost` | `link`; polymorphic via `render`.
- **When to use:**
  - Status chips (New, Error, Beta), category labels, inline counts
- **When NOT to use:**
  - Primary clickable actions → **Button**
  - Multi-line notices → **Alert**
- **Gotchas:** Default element is `span`; use `render` to polymorph into `a`/`button` when interactive.

### Chart

→ [`Chart.usecase.md`](../apps/web/src/components/chart/Chart.usecase.md)

- **Purpose:** Themed Recharts wrapper that injects CSS color variables and shared tooltip/legend content.
- **Import:** `@/components/chart/Chart`
- **Exports:** `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle`; type `ChartConfig`
- **Key props / variants:** `ChartContainer` requires `config: ChartConfig` (per-series `label`/`icon` + `color` or light/dark `theme`); TooltipContent `indicator?: "line" | "dot" | "dashed"`.
- **When to use:**
  - Bar/line (and other Recharts) dashboards with design-token colors
- **When NOT to use:**
  - Tabular data without a chart → **Table** / **DataTable**
  - Decorative non-data visuals → **Card** / **AspectRatio**
- **Gotchas:** `"use client"`; children must be Recharts chart components inside `ChartContainer`; colors from injected `--color-{key}`.

### Kbd

→ [`Kbd.usecase.md`](../apps/web/src/components/kbd/Kbd.usecase.md)

- **Purpose:** Styles a native `<kbd>` element (and grouped wrapper) to display keyboard shortcuts.
- **Import:** `@/components/kbd/Kbd`
- **Exports:** `Kbd`, `KbdGroup`
- **Key props / variants:** Standard `kbd` / `div` props; no variants.
- **When to use:**
  - Shortcut hints next to menu items (`⌘K`)
  - Modifier chords with `KbdGroup`
- **When NOT to use:**
  - Interactive controls → **Button**
  - Hotkey binding UI — this is display-only
- **Gotchas:** `pointer-events-none` / `select-none`; `KbdGroup` is typed as a `div` but renders a `<kbd>`.

### Marker

→ [`Marker.usecase.md`](../apps/web/src/components/marker/Marker.usecase.md)

- **Purpose:** Inline status/meta line (icon + text) with optional separator or bottom border.
- **Import:** `@/components/marker/Marker`
- **Exports:** `Marker`, `MarkerIcon`, `MarkerContent`, `markerVariants`
- **Key props / variants:** `variant?: "default" | "separator" | "border"`; polymorphic via `render`.
- **When to use:**
  - “Updated 2 hours ago” meta rows with an icon
  - Centered section dividers (`variant="separator"`)
- **When NOT to use:**
  - Full alerts → **Alert** / **Sonner**
  - Form labels → **Label**
  - Chat chrome → **Message** / **Bubble**
- **Gotchas:** `MarkerIcon` is `aria-hidden`.

### Progress

→ [`Progress.usecase.md`](../apps/web/src/components/progress/Progress.usecase.md)

- **Purpose:** Determinate progress bar with optional label and numeric value display.
- **Import:** `@/components/progress/Progress`
- **Exports:** `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue`
- **Key props / variants:** Root `value` (and other Base UI progress props).
- **When to use:**
  - Upload/processing indicators (`value={0–100}`)
  - Labeled bars with `ProgressLabel` + `ProgressValue`
- **When NOT to use:**
  - Indeterminate loaders → **Spinner**
- **Gotchas:** `"use client"`; `Progress` always appends Track/Indicator after children — put Label/Value as children.

### Table

→ [`Table.usecase.md`](../apps/web/src/components/table/Table.usecase.md)

- **Purpose:** Styled HTML table primitives (`Table` wraps `<table>` in a horizontally scrollable container).
- **Import:** `@/components/table/Table`
- **Exports:** `Table`, `TableBody`, `TableCaption`, `TableCell`, `TableFooter`, `TableHead`, `TableHeader`, `TableRow`
- **Key props / variants:** Native element props for each part.
- **When to use:**
  - Static/simple markup tables you compose yourself
  - Semantic captions/footers via `TableCaption` / `TableFooter`
- **When NOT to use:**
  - Sort / filter / paginate out of the box → **DataTable**
  - Non-tabular card/list layouts → **Item** / **Card**
- **Gotchas:** `"use client"`.

### DataTable

→ [`DataTable.usecase.md`](../apps/web/src/components/table/data-table/DataTable.usecase.md)

- **Purpose:** `@tanstack/react-table` wrapper that renders **Table** primitives with sorting, filtering, and pagination.
- **Import:** `@/components/table/data-table/DataTable`
- **Key props / variants:** `columns: ColumnDef<TData, TValue>[]`, `data: TData[]`, `pageSize?: number` (default `10`), `filterColumn?: string`, `filterPlaceholder?: string`.
- **When to use:**
  - Column-driven datasets needing sort, filter, prev/next pagination
- **When NOT to use:**
  - One-off static content → compose **Table** primitives
- **Gotchas:** `"use client"`; filter only works if `filterColumn` matches a column id; selection styling exists but no built-in row-selection UI.

---

## Feedback & status

### Alert

→ [`Alert.usecase.md`](../apps/web/src/components/alert/Alert.usecase.md)

- **Purpose:** Inline, non-modal status banner with optional icon and trailing action.
- **Import:** `@/components/alert/Alert`
- **Exports:** `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction`
- **Key props / variants:** CVA `variant`: `default` | `destructive`; `role="alert"`.
- **When to use:**
  - Form/API error or success banners on a page
  - Destructive warnings that stay in layout flow
- **When NOT to use:**
  - Actions needing focus trap and confirmation → **AlertDialog**
  - Compact status labels → **Badge**
  - Ephemeral toasts → **Sonner**
- **Gotchas:** Presence of a child `svg` switches layout to icon+text grid.

### Empty

→ [`Empty.usecase.md`](../apps/web/src/components/empty/Empty.usecase.md)

- **Purpose:** Centered empty-state layout (dashed border) for no-data / no-results screens.
- **Import:** `@/components/empty/Empty`
- **Exports:** `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`
- **Key props / variants:** `EmptyMedia` `variant?: "default" | "icon"`.
- **When to use:**
  - Empty inboxes, lists, search-no-results
  - First-run states with icon + CTA in `EmptyContent`
- **When NOT to use:**
  - Inline “no matches” inside Combobox/Command → their own Empty
  - Error boundaries → dedicated error UI
- **Gotchas:** Server-compatible (no `"use client"`).

### Sonner

→ [`Sonner.usecase.md`](../apps/web/src/components/sonner/Sonner.usecase.md)

- **Purpose:** Theme-aware toast host wrapping the `sonner` library’s `Toaster`.
- **Import:** `@/components/sonner/Sonner`
- **Exports:** `Toaster`
- **Key props / variants:** Accepts `ToasterProps` from `sonner`; theme synced via `next-themes`; custom Lucide icons for success/info/warning/error/loading.
- **When to use:**
  - App-wide ephemeral notifications via `toast()` / `toast.success()` / `toast.error()` from `sonner`
- **When NOT to use:**
  - Inline persistent messages → **Alert**
  - Blocking confirmations → **Dialog** / **AlertDialog**
- **Gotchas:** `"use client"`; mount `<Toaster />` once (typically in layout); call `toast` from `sonner`, not from this file.

### Spinner

→ [`Spinner.usecase.md`](../apps/web/src/components/spinner/Spinner.usecase.md)

- **Purpose:** Spinning `Loader2Icon` loading indicator with `role="status"` and `aria-label="Loading"`.
- **Import:** `@/components/spinner/Spinner`
- **Key props / variants:** SVG props; default `size-4 animate-spin`; override size via `className`.
- **When to use:**
  - Inline loading next to a label or button
  - Small indeterminate wait states
- **When NOT to use:**
  - Content-shaped placeholders → **Skeleton**
  - Toast-level async status → Sonner `toast.loading`
- **Gotchas:** Presentational only (no progress value).

---

## Chat / conversational

### Attachment

→ [`Attachment.usecase.md`](../apps/web/src/components/attachment/Attachment.usecase.md)

- **Purpose:** File/media chip UI for uploads and attached files, including progress and error states.
- **Import:** `@/components/attachment/Attachment`
- **Exports:** `Attachment`, `AttachmentMedia`, `AttachmentContent`, `AttachmentTitle`, `AttachmentDescription`, `AttachmentActions`, `AttachmentAction`, `AttachmentTrigger`, `AttachmentGroup`
- **Key props / variants:** `state?: "idle" | "uploading" | "processing" | "error" | "done"`; `size?: "default" | "sm" | "xs"`; `orientation?: "horizontal" | "vertical"`; Media `variant?: "icon" | "image"`.
- **When to use:**
  - Composer/file-picker attachment lists
  - Upload progress and failed uploads with remove/retry
- **When NOT to use:**
  - Simple status tags → **Badge**
  - Full image galleries → **Carousel** / **EmblaCarousel**
- **Gotchas:** State is presentational (`data-state`); `AttachmentTrigger` is an absolute overlay for full-chip click targets.

### Bubble

→ [`Bubble.usecase.md`](../apps/web/src/components/bubble/Bubble.usecase.md)

- **Purpose:** Chat/message bubble with alignment, variants, and optional reaction overlays.
- **Import:** `@/components/bubble/Bubble`
- **Exports:** `Bubble`, `BubbleContent`, `BubbleGroup`, `BubbleReactions`
- **Key props / variants:** `variant`: `default` | `secondary` | `muted` | `tinted` | `outline` | `ghost` | `destructive`; `align?: "start" | "end"`; Reactions `side` / `align`.
- **When to use:**
  - Messaging / AI chat transcripts (sent vs received)
  - Error delivery states (`destructive`); reaction piles
- **When NOT to use:**
  - Page-level system notices → **Alert**
  - Structured content cards → **Card**
- **Gotchas:** Default max width ~80% (`ghost` is full width); nest inside **Message** for row layout.

### Message

→ [`Message.usecase.md`](../apps/web/src/components/message/Message.usecase.md)

- **Purpose:** Layout primitives for a single chat message row (avatar + content column, start/end alignment).
- **Import:** `@/components/message/Message`
- **Exports:** `Message`, `MessageGroup`, `MessageAvatar`, `MessageContent`, `MessageHeader`, `MessageFooter`
- **Key props / variants:** `Message` `align?: "start" | "end"` (flips row with `flex-row-reverse`).
- **When to use:**
  - Incoming vs outgoing chat rows
  - Avatar + bubble + timestamp/header footers
- **When NOT to use:**
  - Speech-bubble visual → nest **Bubble** inside `MessageContent`
  - Scrollable chat pane → **MessageScroller**
- **Gotchas:** Presentational only; designed to nest Bubble and sit inside `MessageScrollerItem`.

### MessageScroller

→ [`MessageScroller.usecase.md`](../apps/web/src/components/message-scroller/MessageScroller.usecase.md)

- **Purpose:** Chat-oriented scroll container with autoscroll, scroll anchors, and jump-to-end/start buttons (`@shadcn/react/message-scroller`).
- **Import:** `@/components/message-scroller/MessageScroller`
- **Exports:** `MessageScroller`, `MessageScrollerProvider`, `MessageScrollerViewport`, `MessageScrollerContent`, `MessageScrollerItem`, `MessageScrollerButton`, `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility`
- **Key props / variants:** `MessageScrollerItem` `scrollAnchor?: boolean`; Button `direction?: "end" | "start"` plus Button `variant`/`size`.
- **When to use:**
  - Live chat / messaging threads that stick to the latest message
  - Long conversations with a floating “scroll to end” control
- **When NOT to use:**
  - Generic scrollable panels → **ScrollArea**
- **Gotchas:** `"use client"`; wrap with `MessageScrollerProvider`; root needs constrained height; mark the latest item with `scrollAnchor`.

### Command

→ [`Command.usecase.md`](../apps/web/src/components/command/Command.usecase.md)

- **Purpose:** Keyboard-first searchable command/menu list (`cmdk`), optionally inside a Dialog as a command palette.
- **Import:** `@/components/command/Command`
- **Exports:** `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`
- **Key props / variants:** `CommandDialog` extends Dialog props plus `title`, `description`, `showCloseButton` (default `false`); groups use `heading`.
- **When to use:**
  - App command palette (search actions, navigate, run commands)
  - Inline searchable suggestion lists with groups/shortcuts
- **When NOT to use:**
  - Form field selecting a value → **Combobox** / **Select**
  - Context/right-click → **ContextMenu**
  - Simple button menus → **DropdownMenu**
- **Gotchas:** `"use client"`; root uses `size-full` / overflow-hidden — parent sizing matters.

---

## Media

### Carousel

→ [`Carousel.usecase.md`](../apps/web/src/components/carousel/Carousel.usecase.md)

- **Purpose:** Embla-powered slideshow with prev/next controls and keyboard arrows.
- **Import:** `@/components/carousel/Carousel`
- **Exports:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `useCarousel`; type `CarouselApi`
- **Key props / variants:** `orientation?: "horizontal" | "vertical"`; `opts` / `plugins`; `setApi?: (api: CarouselApi) => void`.
- **When to use:**
  - Image or card slideshows
  - Horizontal product/feature rotators
- **When NOT to use:**
  - Simple horizontal file chips → **AttachmentGroup**
  - Tabbed peer panels → **Tabs**
  - Need dots / auto-width variants → prefer **EmblaCarousel**
- **Gotchas:** `"use client"`; nest Content/Item under Carousel; Prev/Next sit outside (`-left-12`/`-right-12`) — reserve margin.

### EmblaCarousel

→ [`EmblaCarousel.usecase.md`](../apps/web/src/components/embla-carousel/EmblaCarousel.usecase.md)

- **Purpose:** Accessible Embla-based carousel with prev/next, dots, and horizontal/vertical/auto-width variants.
- **Import:** `@/components/embla-carousel/EmblaCarousel`
- **Exports:** `EmblaCarousel`, `EmblaCarouselContent`, `EmblaCarouselSlide`, `EmblaCarouselPrev`, `EmblaCarouselNext`, `EmblaCarouselDots`, `useEmblaCarouselContext`; types `EmblaCarouselApi`, `EmblaCarouselVariant`
- **Key props / variants:** `variant?: "horizontal" | "horizontal-auto" | "vertical"`; `opts`, `plugins`, `setApi`.
- **When to use:**
  - Image/product galleries with keyboard arrows and dots
  - Auto-width chip/tag carousels (`horizontal-auto`)
- **When NOT to use:**
  - Static grids that don’t need swipe/snap
  - Tabbed content → **Tabs**
- **Gotchas:** `"use client"`; children must be inside EmblaCarousel; Prev/Next absolutely outside — parent needs padding; Dots hidden when ≤1 snap.

---

## Motion & direction

### ScrollReveal

→ [`ScrollReveal.usecase.md`](../apps/web/src/components/motion/scroll-reveal/ScrollReveal.usecase.md)

- **Purpose:** Fade/slide-in animation when children enter the viewport (Framer Motion).
- **Import:** `@/components/motion/scroll-reveal/ScrollReveal`
- **Key props / variants:** `delay?: number` (default `0`), `direction?: "up" | "down" | "left" | "right"` (default `"up"`), `once?: boolean` (default `true`).
- **When to use:**
  - Landing-page sections that reveal on scroll
  - Staggered reveals via different `delay` values
- **When NOT to use:**
  - Page transitions, looping animations (not allowed in this template — see PATTERNS)
- **Gotchas:** `"use client"`; respects `prefers-reduced-motion` (static fallback).

### Direction

→ [`Direction.usecase.md`](../apps/web/src/components/direction/Direction.usecase.md)

- **Purpose:** Provides LTR/RTL writing direction context for Base UI descendants.
- **Import:** `@/components/direction/Direction`
- **Exports:** `DirectionProvider`, `useDirection`
- **Key props / variants:** Re-exports `@base-ui/react/direction-provider`; `direction: "ltr" | "rtl"`.
- **When to use:**
  - Localizing layouts that must flip for RTL
  - Ensuring Base UI popups/menus respect text direction
- **When NOT to use:**
  - Pure CSS `dir` when no Base UI context is needed
- **Gotchas:** `"use client"`; thin re-export only.

---

## App infrastructure

### Providers

→ [`Providers.usecase.md`](../apps/web/src/components/providers/Providers.usecase.md)

- **Purpose:** App-wide client provider tree for Redux, React Query, and theme.
- **Import:** `@/components/providers/Providers`
- **Key props / variants:** `{ children: React.ReactNode }`. Wraps: `react-redux` Provider (`makeStore`), TanStack `QueryClientProvider` (60s `staleTime`), `next-themes` ThemeProvider (`attribute="class"`, `defaultTheme="system"`), internal `ThemeSync` (Redux → `setTheme`); React Query Devtools in development.
- **When to use:**
  - Mount **once** in the root layout around the app shell (already used in `apps/web/src/app/layout.tsx`)
- **When NOT to use:**
  - Nested duplicates in feature routes
  - Storybook/tests that need a lighter harness — provide only the deps you need
- **Gotchas:** `"use client"`; store and QueryClient created once via refs; pairs with `suppressHydrationWarning` on `<html>`.

---

## Disclosure (FAQ)

### Accordion

→ [`Accordion.usecase.md`](../apps/web/src/components/accordion/Accordion.usecase.md)

- **Purpose:** Collapsible FAQ/section panels with animated open/close and chevron indicators.
- **Import:** `@/components/accordion/Accordion`
- **Exports:** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
- **Key props / variants:** Root `defaultValue` / controlled value and `multiple` for multi-open; each `AccordionItem` needs a `value`.
- **When to use:**
  - FAQ or help content with many optional sections
  - Settings groups where only some details should expand
  - Multi-open lists via `multiple`
- **When NOT to use:**
  - Peer content switching that should stay visible → **Tabs**
  - Single expand panel → **Collapsible**
  - One-shot confirmations → **AlertDialog**
- **Gotchas:** Compose Accordion → Item → Trigger + Content; panel height animation uses `--accordion-panel-height` and `data-open`/`data-closed`.

```tsx
<Accordion defaultValue={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It follows WAI-ARIA patterns.</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## Related docs

- [`docs/template/COMPONENTS.md`](./template/COMPONENTS.md) — folder/file conventions
- [`docs/llm/CONTEXT.md`](./llm/CONTEXT.md) — agent stack & folder map
- [`docs/llm/PATTERNS.md`](./llm/PATTERNS.md) — required code patterns
- Storybook: `pnpm --filter web storybook` → http://localhost:6006
