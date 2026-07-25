#!/usr/bin/env python3
"""
PLAN 03 — Migrate shadcn flat components to kebab-case folder convention.

Each component gets:
  src/components/<kebab>/
    <Pascal>.tsx              (moved from components/ui/<kebab>.tsx)
    <Pascal>.schema.ts
    <Pascal>.defaultvalues.ts
    <Pascal>.stories.tsx
"""

import os
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent
UI_DIR = ROOT / "apps/web/src/components/ui"
COMP_DIR = ROOT / "apps/web/src/components"


def to_pascal(kebab: str) -> str:
    return "".join(w.capitalize() for w in kebab.split("-"))


# Maps kebab name → primary export name(s) for schema/stories
# The first item is the "main" component export used in stories
COMPONENT_EXPORTS: dict[str, list[str]] = {
    "accordion": ["Accordion", "AccordionItem", "AccordionTrigger", "AccordionContent"],
    "alert-dialog": ["AlertDialog", "AlertDialogTrigger", "AlertDialogContent", "AlertDialogHeader",
                     "AlertDialogFooter", "AlertDialogTitle", "AlertDialogDescription",
                     "AlertDialogAction", "AlertDialogCancel"],
    "alert": ["Alert", "AlertTitle", "AlertDescription", "AlertAction"],
    "aspect-ratio": ["AspectRatio"],
    "attachment": ["Attachment", "AttachmentContent", "AttachmentName", "AttachmentRemoveButton",
                   "AttachmentSize", "AttachmentThumb"],
    "avatar": ["Avatar", "AvatarImage", "AvatarFallback", "AvatarBadge", "AvatarGroup",
               "AvatarGroupCount"],
    "badge": ["Badge", "badgeVariants"],
    "breadcrumb": ["Breadcrumb", "BreadcrumbList", "BreadcrumbItem", "BreadcrumbLink",
                   "BreadcrumbPage", "BreadcrumbSeparator", "BreadcrumbEllipsis"],
    "bubble": ["Bubble", "BubbleContent", "BubbleGroup", "BubbleReactions"],
    "button-group": ["ButtonGroup", "ButtonGroupSeparator", "ButtonGroupText", "buttonGroupVariants"],
    "button": ["Button", "buttonVariants"],
    "calendar": ["Calendar", "CalendarDayButton"],
    "card": ["Card", "CardHeader", "CardTitle", "CardDescription", "CardContent", "CardFooter",
             "CardAction"],
    "carousel": ["Carousel", "CarouselContent", "CarouselItem", "CarouselPrevious",
                 "CarouselNext"],
    "chart": ["ChartContainer", "ChartTooltip", "ChartTooltipContent", "ChartLegend",
              "ChartLegendContent", "ChartStyle"],
    "checkbox": ["Checkbox"],
    "collapsible": ["Collapsible", "CollapsibleTrigger", "CollapsibleContent"],
    "combobox": ["Combobox", "ComboboxAnchor", "ComboboxContent", "ComboboxEmpty",
                 "ComboboxGroup", "ComboboxInput", "ComboboxItem", "ComboboxLabel",
                 "ComboboxSeparator", "ComboboxTrigger"],
    "command": ["Command", "CommandDialog", "CommandEmpty", "CommandGroup", "CommandInput",
                "CommandItem", "CommandList", "CommandSeparator", "CommandShortcut"],
    "context-menu": ["ContextMenu", "ContextMenuCheckboxItem", "ContextMenuContent",
                     "ContextMenuGroup", "ContextMenuItem", "ContextMenuLabel",
                     "ContextMenuPortal", "ContextMenuRadioGroup", "ContextMenuRadioItem",
                     "ContextMenuSeparator", "ContextMenuShortcut", "ContextMenuSub",
                     "ContextMenuSubContent", "ContextMenuSubTrigger", "ContextMenuTrigger"],
    "dialog": ["Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogFooter",
               "DialogTitle", "DialogDescription", "DialogClose", "DialogOverlay", "DialogPortal"],
    "direction": ["Direction"],
    "drawer": ["Drawer", "DrawerClose", "DrawerContent", "DrawerDescription", "DrawerFooter",
               "DrawerHeader", "DrawerOverlay", "DrawerPortal", "DrawerTitle", "DrawerTrigger"],
    "dropdown-menu": ["DropdownMenu", "DropdownMenuCheckboxItem", "DropdownMenuContent",
                      "DropdownMenuGroup", "DropdownMenuItem", "DropdownMenuLabel",
                      "DropdownMenuPortal", "DropdownMenuRadioGroup", "DropdownMenuRadioItem",
                      "DropdownMenuSeparator", "DropdownMenuShortcut", "DropdownMenuSub",
                      "DropdownMenuSubContent", "DropdownMenuSubTrigger", "DropdownMenuTrigger"],
    "empty": ["Empty", "EmptyHeader", "EmptyMedia", "EmptyContent", "EmptyTitle",
              "EmptyDescription"],
    "field": ["Field", "FieldControl", "FieldDescription", "FieldError", "FieldHeader",
              "FieldLabel", "FieldRow"],
    "hover-card": ["HoverCard", "HoverCardContent", "HoverCardTrigger"],
    "input-group": ["InputGroup", "InputGroupAddon", "InputGroupSeparator"],
    "input-otp": ["InputOTP", "InputOTPGroup", "InputOTPSlot", "InputOTPSeparator"],
    "input": ["Input"],
    "item": ["Item", "ItemAction", "ItemContent", "ItemDescription", "ItemHeader",
             "ItemIndicator", "ItemMain", "ItemTitle"],
    "kbd": ["Kbd", "KbdGroup"],
    "label": ["Label"],
    "marker": ["Marker", "MarkerContent", "MarkerIcon", "markerVariants"],
    "menubar": ["Menubar", "MenubarCheckboxItem", "MenubarContent", "MenubarGroup",
                "MenubarItem", "MenubarLabel", "MenubarMenu", "MenubarPortal",
                "MenubarRadioGroup", "MenubarRadioItem", "MenubarSeparator",
                "MenubarShortcut", "MenubarSub", "MenubarSubContent", "MenubarSubTrigger",
                "MenubarTrigger"],
    "message-scroller": ["MessageScroller", "MessageScrollerContent"],
    "message": ["Message", "MessageAvatar", "MessageContent", "MessageFooter",
                "MessageGroup", "MessageHeader"],
    "native-select": ["NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"],
    "navigation-menu": ["NavigationMenu", "NavigationMenuContent", "NavigationMenuIndicator",
                        "NavigationMenuItem", "NavigationMenuLink", "NavigationMenuList",
                        "NavigationMenuTrigger", "NavigationMenuViewport"],
    "pagination": ["Pagination", "PaginationContent", "PaginationEllipsis", "PaginationItem",
                   "PaginationLink", "PaginationNext", "PaginationPrevious"],
    "popover": ["Popover", "PopoverContent", "PopoverTrigger", "PopoverHeader",
                "PopoverTitle", "PopoverDescription"],
    "progress": ["Progress", "ProgressTrack", "ProgressIndicator", "ProgressLabel",
                 "ProgressValue"],
    "radio-group": ["RadioGroup", "RadioGroupItem"],
    "resizable": ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"],
    "scroll-area": ["ScrollArea", "ScrollBar"],
    "select": ["Select", "SelectContent", "SelectGroup", "SelectItem", "SelectLabel",
               "SelectScrollDownButton", "SelectScrollUpButton", "SelectSeparator",
               "SelectTrigger", "SelectValue"],
    "separator": ["Separator"],
    "sheet": ["Sheet", "SheetClose", "SheetContent", "SheetDescription", "SheetFooter",
              "SheetHeader", "SheetOverlay", "SheetPortal", "SheetTitle", "SheetTrigger"],
    "sidebar": ["Sidebar", "SidebarContent", "SidebarFooter", "SidebarGroup",
                "SidebarGroupAction", "SidebarGroupContent", "SidebarGroupLabel",
                "SidebarHeader", "SidebarInput", "SidebarInset", "SidebarMenu",
                "SidebarMenuAction", "SidebarMenuBadge", "SidebarMenuButton",
                "SidebarMenuItem", "SidebarMenuSkeleton", "SidebarMenuSub",
                "SidebarMenuSubButton", "SidebarMenuSubItem", "SidebarProvider",
                "SidebarRail", "SidebarSeparator", "SidebarTrigger", "useSidebar"],
    "skeleton": ["Skeleton"],
    "slider": ["Slider"],
    "sonner": ["Toaster"],
    "spinner": ["Spinner"],
    "switch": ["Switch"],
    "table": ["Table", "TableHeader", "TableBody", "TableFooter", "TableRow", "TableHead",
              "TableCell", "TableCaption"],
    "tabs": ["Tabs", "TabsList", "TabsTrigger", "TabsContent", "tabsListVariants"],
    "textarea": ["Textarea"],
    "toggle-group": ["ToggleGroup", "ToggleGroupItem"],
    "toggle": ["Toggle", "toggleVariants"],
    "tooltip": ["Tooltip", "TooltipContent", "TooltipProvider", "TooltipTrigger"],
}

# Build a mapping from kebab → pascal for import replacement
KEBAB_TO_PASCAL: dict[str, str] = {k: to_pascal(k) for k in COMPONENT_EXPORTS}


def update_ui_imports(content: str) -> str:
    """Replace @/components/ui/<kebab> with @/components/<kebab>/<Pascal>."""
    def replace_match(m: re.Match) -> str:
        kebab = m.group(1)
        if kebab in KEBAB_TO_PASCAL:
            pascal = KEBAB_TO_PASCAL[kebab]
            return f"@/components/{kebab}/{pascal}"
        return m.group(0)

    return re.sub(r'@/components/ui/([\w-]+)', replace_match, content)


def get_variant_info(kebab: str, tsx_content: str) -> dict:
    """Extract variant info from component tsx content."""
    info = {}

    # Find variant enum values
    variant_match = re.search(
        r'variant:\s*\{[^}]*?(\w+):\s*["\']([^"\']+)["\']',
        tsx_content, re.DOTALL
    )

    # Extract all variant keys
    variants_block = re.search(r'variants:\s*\{(.*?)\},\s*defaultVariants', tsx_content, re.DOTALL)
    if variants_block:
        block = variants_block.group(1)
        variant_sections = re.findall(r'(\w+):\s*\{([^}]+)\}', block)
        for var_name, var_body in variant_sections:
            keys = re.findall(r'"([^"]+)":|\'([^\']+)\':|(\w+):', var_body)
            keys = [k[0] or k[1] or k[2] for k in keys if any(k)]
            info[var_name] = keys

    return info


def generate_schema(kebab: str, pascal: str, tsx_content: str, exports: list[str]) -> str:
    """Generate <Pascal>.schema.ts content."""
    main_export = exports[0]
    variants = get_variant_info(kebab, tsx_content)

    lines = [
        'import { z } from "zod";',
        'import type * as React from "react";',
        "",
    ]

    if variants:
        for var_name, var_values in variants.items():
            valid_values = [v for v in var_values if v and not v.startswith("//")]
            if valid_values:
                values_str = ", ".join(f'"{v}"' for v in valid_values)
                lines.append(f'export const {var_name}Schema = z.enum([{values_str}]);')
                lines.append(f'export type {pascal}{var_name.capitalize()} = z.infer<typeof {var_name}Schema>;')
                lines.append("")

        schema_fields = {}
        for var_name, var_values in variants.items():
            valid_values = [v for v in var_values if v and not v.startswith("//")]
            if valid_values:
                schema_fields[var_name] = f"{var_name}Schema.optional()"

        schema_fields["children"] = 'z.custom<React.ReactNode>().optional()'
        schema_fields["className"] = 'z.string().optional()'

        fields_str = "\n".join(f"  {k}: {v}," for k, v in schema_fields.items())
        lines.append(f"export const {kebab.replace('-', '')}PropsSchema = z.object({{")
        lines.append(fields_str)
        lines.append("});")
        lines.append("")
        lines.append(f"export type {main_export}Props = z.infer<typeof {kebab.replace('-', '')}PropsSchema>;")
    else:
        lines.append(f"export interface {main_export}Props {{")
        lines.append("  className?: string;")
        lines.append("  children?: React.ReactNode;")
        lines.append("}")
    lines.append("")
    return "\n".join(lines)


def generate_defaultvalues(kebab: str, pascal: str, tsx_content: str, exports: list[str]) -> str:
    """Generate <Pascal>.defaultvalues.ts content."""
    main_export = exports[0]
    variants = get_variant_info(kebab, tsx_content)

    # Find defaultVariants in the tsx
    default_variant_match = re.search(
        r'defaultVariants:\s*\{([^}]+)\}', tsx_content
    )
    default_variants: dict[str, str] = {}
    if default_variant_match:
        block = default_variant_match.group(1)
        pairs = re.findall(r'(\w+):\s*["\']([^"\']+)["\']', block)
        default_variants = dict(pairs)

    lines = [
        f'import type {{ {main_export}Props }} from "./{pascal}.schema";',
        "",
    ]

    if variants:
        defaults_entries = []
        for var_name in variants:
            val = default_variants.get(var_name, next(iter(variants[var_name]), "default"))
            defaults_entries.append(f'  {var_name}: "{val}"')
        defaults_entries.append('  children: "Example"')

        lines.append(f"export const {main_export[0].lower()}{main_export[1:]}DefaultValues: Partial<{main_export}Props> = {{")
        lines.extend([e + "," for e in defaults_entries])
        lines.append("};")
    else:
        camel = main_export[0].lower() + main_export[1:]
        lines.append(f"export const {camel}DefaultValues: Partial<{main_export}Props> = {{")
        lines.append('  children: "Example",')
        lines.append("};")

    lines.append("")
    return "\n".join(lines)


def generate_stories(kebab: str, pascal: str, tsx_content: str, exports: list[str]) -> str:
    """Generate <Pascal>.stories.tsx content."""
    main_export = exports[0]
    camel = main_export[0].lower() + main_export[1:]
    variants = get_variant_info(kebab, tsx_content)

    # Determine the default variant for a variant story
    default_variant_match = re.search(r'defaultVariants:\s*\{([^}]+)\}', tsx_content)
    default_variants: dict[str, str] = {}
    if default_variant_match:
        block = default_variant_match.group(1)
        pairs = re.findall(r'(\w+):\s*["\']([^"\']+)["\']', block)
        default_variants = dict(pairs)

    lines = [
        'import type { Meta, StoryObj } from "@storybook/react";',
        "",
        f'import {{ {main_export} }} from "./{pascal}";',
        f'import {{ {camel}DefaultValues }} from "./{pascal}.defaultvalues";',
        "",
        f"const meta: Meta<typeof {main_export}> = {{",
        f'  title: "Components/{pascal}",',
        f"  component: {main_export},",
        '  tags: ["autodocs"],',
        "  args: {",
        f"    ...{camel}DefaultValues,",
        "  },",
        "};",
        "",
        "export default meta;",
        f"type Story = StoryObj<typeof {main_export}>;",
        "",
        "export const Default: Story = {};",
        "",
    ]

    # Add a variant story if the component has variant props
    if variants and "variant" in variants:
        variant_values = variants["variant"]
        # Pick second variant (skip "default") or first if only one
        story_variants = [v for v in variant_values if v != "default"]
        if story_variants:
            story_variant = story_variants[0]
            story_name = story_variant.capitalize()
            lines.append(f"export const {story_name}: Story = {{")
            lines.append("  args: {")
            lines.append(f'    variant: "{story_variant}",')
            lines.append("  },")
            lines.append("};")
            lines.append("")
    elif kebab in ("dialog", "sheet", "drawer", "popover"):
        lines.append("export const Open: Story = {")
        lines.append("  args: {")
        lines.append("    open: true,")
        lines.append("  },")
        lines.append("};")
        lines.append("")

    return "\n".join(lines)


def migrate_component(kebab: str) -> None:
    src_file = UI_DIR / f"{kebab}.tsx"
    if not src_file.exists():
        print(f"  SKIP (not found): {kebab}")
        return

    pascal = to_pascal(kebab)
    folder = COMP_DIR / kebab
    folder.mkdir(exist_ok=True)

    # Read and update the source file
    content = src_file.read_text(encoding="utf-8")
    updated_content = update_ui_imports(content)

    # Write main component file
    main_file = folder / f"{pascal}.tsx"
    main_file.write_text(updated_content, encoding="utf-8")

    exports = COMPONENT_EXPORTS.get(kebab, [pascal])

    # Write schema
    schema_file = folder / f"{pascal}.schema.ts"
    schema_file.write_text(generate_schema(kebab, pascal, content, exports), encoding="utf-8")

    # Write defaultvalues
    dv_file = folder / f"{pascal}.defaultvalues.ts"
    dv_file.write_text(generate_defaultvalues(kebab, pascal, content, exports), encoding="utf-8")

    # Write stories
    stories_file = folder / f"{pascal}.stories.tsx"
    stories_file.write_text(generate_stories(kebab, pascal, content, exports), encoding="utf-8")

    print(f"  OK: {kebab}/ → {pascal}.tsx + schema + defaultvalues + stories")


def main():
    print(f"Migrating components from {UI_DIR} → {COMP_DIR}\n")

    all_components = sorted(COMPONENT_EXPORTS.keys())

    for kebab in all_components:
        migrate_component(kebab)

    print("\nDone. Remember to:")
    print("  1. Delete flat ui/ files after verifying imports")
    print("  2. Run: pnpm --filter web build")


if __name__ == "__main__":
    main()
