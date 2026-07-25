"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  AspectRatio,
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Bubble,
  BubbleContent,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DirectionProvider,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  EmblaCarousel,
  EmblaCarouselContent,
  EmblaCarouselDots,
  EmblaCarouselNext,
  EmblaCarouselPrev,
  EmblaCarouselSlide,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  Field,
  FieldDescription,
  FieldLabel,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Kbd,
  Label,
  Marker,
  MarkerContent,
  MarkerIcon,
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  Message,
  MessageAvatar,
  MessageContent,
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  NativeSelect,
  NativeSelectOption,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ProgressLabel,
  ProgressValue,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  ScrollReveal,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  type TabsCarouselItem,
  TabsCarouselList,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@fe-template/ui";
import {
  BoldIcon,
  CalculatorIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  FileIcon,
  InfoIcon,
  ItalicIcon,
  MailIcon,
  SearchIcon,
  SmileIcon,
  UnderlineIcon,
  XIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const accordionItems = [
  {
    value: "item-1",
    title: "Is it accessible?",
    content: "Yes. It follows WAI-ARIA design patterns for accordions and keyboard navigation.",
  },
  {
    value: "item-2",
    title: "Is it styled?",
    content: "Yes. It comes with default styles that match the rest of the design system.",
  },
  {
    value: "item-3",
    title: "Is it animated?",
    content: "Yes. Panels animate open and closed with smooth height transitions.",
  },
];

const frameworks = ["Next.js", "React", "Vue", "Svelte", "Astro"];

const slides = [
  { title: "Slide 1", description: "First slide content" },
  { title: "Slide 2", description: "Second slide content" },
  { title: "Slide 3", description: "Third slide content" },
  { title: "Slide 4", description: "Fourth slide content" },
  { title: "Slide 5", description: "Fifth slide content" },
];

const autoWidthLabels = [
  "All",
  "Dogs",
  "Cats",
  "Puppies",
  "Senior pets",
  "Playdates",
  "Walking buddies",
  "Training tips",
];

const responsiveTabs: TabsCarouselItem[] = [
  { value: "overview", label: "Overview" },
  { value: "matches", label: "Matches" },
  { value: "playdates", label: "Playdates" },
  { value: "messages", label: "Messages" },
  { value: "community", label: "Community" },
  { value: "safety", label: "Safety tips" },
  { value: "settings", label: "Settings" },
];

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit card", amount: "$250.00" },
  { id: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
  { id: "INV003", status: "Unpaid", method: "Bank transfer", amount: "$350.00" },
];

const scrollTags = Array.from({ length: 20 }, (_, index) => `Tag ${index + 1}`);

const sampleMessages = [
  "Hey there! Welcome to PawPair support.",
  "How can we help you and your pet today?",
  "You can ask about matching, safety tips, or account settings.",
  "Our team typically replies within a few minutes.",
  "Feel free to share photos of your pet too!",
];

function Preview({
  name,
  children,
  className,
}: {
  name: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
    >
      <p className="font-mono text-xs text-muted-foreground">{name}</p>
      <div>{children}</div>
    </div>
  );
}

const fullWidth = "sm:col-span-2 xl:col-span-3";

export function ComponentsShowcase() {
  return (
    <TooltipProvider>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Preview name="accordion">
          <Accordion defaultValue={["item-1"]} className="max-w-md">
            {accordionItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Preview>

        <Preview name="alert">
          <Alert className="max-w-lg">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
          </Alert>
        </Preview>

        <Preview name="alert-dialog">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Delete account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your account and all associated data will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Preview>

        <Preview name="aspect-ratio">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-muted">
            <div className="flex size-full items-center justify-center bg-linear-to-br from-brand-coral/30 to-muted text-sm text-muted-foreground">
              16:9
            </div>
          </AspectRatio>
        </Preview>

        <Preview name="attachment">
          <Attachment>
            <AttachmentMedia>
              <FileIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>project-brief.pdf</AttachmentTitle>
              <AttachmentDescription>2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="Remove attachment">
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </Preview>

        <Preview name="avatar">
          <Avatar>
            <AvatarFallback>PP</AvatarFallback>
          </Avatar>
        </Preview>

        <Preview name="badge">
          <Badge>Badge</Badge>
        </Preview>

        <Preview name="breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Preview>

        <Preview name="bubble">
          <Bubble>
            <BubbleContent>Hey! Are we still on for the playdate tomorrow?</BubbleContent>
          </Bubble>
        </Preview>

        <Preview name="button">
          <Button>Button</Button>
        </Preview>

        <Preview name="button-group">
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </Preview>

        <Preview name="calendar">
          <Calendar mode="single" />
        </Preview>

        <Preview name="card">
          <Card className="w-full max-w-[350px]">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content area for details, metrics, or supporting copy.</p>
            </CardContent>
          </Card>
        </Preview>

        <Preview name="carousel" className={fullWidth}>
          <div className="mx-auto w-full max-w-sm px-12">
            <Carousel>
              <CarouselContent>
                {slides.map((slide) => (
                  <CarouselItem key={slide.title}>
                    <Card>
                      <CardContent className="flex aspect-video items-center justify-center p-6">
                        <div className="text-center">
                          <p className="font-medium">{slide.title}</p>
                          <p className="text-sm text-muted-foreground">{slide.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </Preview>

        <Preview name="embla-carousel" className={fullWidth}>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Horizontal</p>
              <div className="mx-auto mb-8 w-full max-w-sm px-12">
                <EmblaCarousel variant="horizontal">
                  <EmblaCarouselContent>
                    {slides.map((slide) => (
                      <EmblaCarouselSlide key={slide.title}>
                        <Card>
                          <CardContent className="flex aspect-video items-center justify-center p-6">
                            <div className="text-center">
                              <p className="font-medium">{slide.title}</p>
                              <p className="text-sm text-muted-foreground">{slide.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </EmblaCarouselSlide>
                    ))}
                  </EmblaCarouselContent>
                  <EmblaCarouselPrev />
                  <EmblaCarouselNext />
                  <EmblaCarouselDots />
                </EmblaCarousel>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Horizontal auto-width</p>
              <div className="mx-auto w-full max-w-md px-12">
                <EmblaCarousel variant="horizontal-auto">
                  <EmblaCarouselContent className="-ml-2">
                    {autoWidthLabels.map((label) => (
                      <EmblaCarouselSlide key={label} className="pl-2">
                        <div className="rounded-full border bg-muted px-4 py-2 text-sm font-medium whitespace-nowrap">
                          {label}
                        </div>
                      </EmblaCarouselSlide>
                    ))}
                  </EmblaCarouselContent>
                  <EmblaCarouselPrev />
                  <EmblaCarouselNext />
                </EmblaCarousel>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Vertical</p>
              <div className="mx-auto w-full max-w-xs pt-12 pb-12">
                <EmblaCarousel variant="vertical" className="h-[280px]">
                  <EmblaCarouselContent className="-mt-4 h-[280px]">
                    {slides.map((slide) => (
                      <EmblaCarouselSlide key={slide.title}>
                        <Card>
                          <CardContent className="flex h-24 items-center justify-center p-6">
                            <span className="font-medium">{slide.title}</span>
                          </CardContent>
                        </Card>
                      </EmblaCarouselSlide>
                    ))}
                  </EmblaCarouselContent>
                  <EmblaCarouselPrev />
                  <EmblaCarouselNext />
                </EmblaCarousel>
              </div>
            </div>
          </div>
        </Preview>

        <Preview name="chart" className={fullWidth}>
          <ChartContainer config={chartConfig} className="min-h-[240px] w-full max-w-xl">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Preview>

        <Preview name="checkbox">
          <Checkbox aria-label="Accept terms" />
        </Preview>

        <Preview name="collapsible">
          <Collapsible className="w-full max-w-[360px] space-y-2">
            <div className="flex items-center justify-between gap-4 px-1">
              <h4 className="text-sm font-medium">Order summary</h4>
              <CollapsibleTrigger render={<Button variant="ghost" size="icon-xs" />}>
                <ChevronsUpDownIcon />
                <span className="sr-only">Toggle</span>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-lg border px-4 py-2 text-sm">3 items · $129.00</div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-lg border px-4 py-2 text-sm">Premium harness · $49.00</div>
              <div className="rounded-lg border px-4 py-2 text-sm">Travel bowl · $24.00</div>
              <div className="rounded-lg border px-4 py-2 text-sm">Leash set · $56.00</div>
            </CollapsibleContent>
          </Collapsible>
        </Preview>

        <Preview name="combobox">
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Select framework..." className="w-[240px]" />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxCollection>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Preview>

        <Preview name="command" className={fullWidth}>
          <Command className="max-w-sm rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CalendarIcon />
                  Calendar
                </CommandItem>
                <CommandItem>
                  <SmileIcon />
                  Search emoji
                </CommandItem>
                <CommandItem>
                  <CalculatorIcon />
                  Calculator
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Preview>

        <Preview name="context-menu">
          <ContextMenu>
            <ContextMenuTrigger>
              <Button variant="outline">Right click me</Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                Back
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem disabled>
                Forward
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Reload
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Preview>

        <Preview name="dialog">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>
                  Make changes here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </Preview>

        <Preview name="direction">
          <DirectionProvider>
            <div className="flex max-w-sm items-center justify-between rounded-xl border p-4">
              <span className="text-sm">Left to right layout</span>
              <Button size="sm" variant="outline">
                Action
              </Button>
            </div>
          </DirectionProvider>
        </Preview>

        <Preview name="drawer">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer title</DrawerTitle>
                <DrawerDescription>
                  Swipe down or tap outside to close this drawer.
                </DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </Preview>

        <Preview name="dropdown-menu">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Open menu
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Preview>

        <Preview name="empty">
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No messages yet</EmptyTitle>
              <EmptyDescription>
                When you start chatting with matches, conversations will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Preview>

        <Preview name="field">
          <Field className="max-w-sm">
            <FieldLabel htmlFor="showcase-email">Email</FieldLabel>
            <Input id="showcase-email" type="email" placeholder="you@example.com" />
            <FieldDescription>We will never share your email with anyone else.</FieldDescription>
          </Field>
        </Preview>

        <Preview name="hover-card">
          <HoverCard>
            <HoverCardTrigger render={<Button variant="link" className="px-0" />}>
              @pawpair
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">PawPair</h4>
                <p className="text-sm text-muted-foreground">
                  Smart matching for pet owners and trusted sitters in your neighborhood.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Preview>

        <Preview name="input">
          <Input type="text" placeholder="Enter text..." className="max-w-sm" />
        </Preview>

        <Preview name="input-group">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>
        </Preview>

        <Preview name="input-otp">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Preview>

        <Preview name="item">
          <ItemGroup className="max-w-md">
            <Item>
              <ItemMedia variant="icon">
                <MailIcon />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Unread messages</ItemTitle>
                <ItemDescription>3 new messages from pet owners near you.</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </Preview>

        <Preview name="kbd">
          <Kbd>K</Kbd>
        </Preview>

        <Preview name="label">
          <div className="grid max-w-sm gap-2">
            <Label htmlFor="showcase-label-email">Email address</Label>
            <Input id="showcase-label-email" type="email" placeholder="name@example.com" />
          </div>
        </Preview>

        <Preview name="marker">
          <Marker>
            <MarkerIcon>
              <InfoIcon />
            </MarkerIcon>
            <MarkerContent>Updated 2 hours ago</MarkerContent>
          </Marker>
        </Preview>

        <Preview name="menubar" className={fullWidth}>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab
                  <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo
                  <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo
                  <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>View</MenubarTrigger>
              <MenubarContent>
                <MenubarCheckboxItem checked>Show sidebar</MenubarCheckboxItem>
                <MenubarCheckboxItem>Show toolbar</MenubarCheckboxItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </Preview>

        <Preview name="message">
          <Message>
            <MessageAvatar>
              <Avatar className="size-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </MessageAvatar>
            <MessageContent>
              <Bubble>
                <BubbleContent>Hello! How can I help you today?</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        </Preview>

        <Preview name="message-scroller" className={fullWidth}>
          <MessageScrollerProvider>
            <MessageScroller className="h-72 w-full max-w-md rounded-xl border">
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  {sampleMessages.map((text, index) => (
                    <MessageScrollerItem
                      key={text}
                      scrollAnchor={index === sampleMessages.length - 1}
                    >
                      <Message align={index % 2 === 0 ? "start" : "end"}>
                        <MessageContent>
                          <Bubble align={index % 2 === 0 ? "start" : "end"}>
                            <BubbleContent>{text}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        </Preview>

        <Preview name="motion/scroll-reveal">
          <ScrollReveal>
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <h3 className="font-display text-lg font-semibold">Revealed content</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This block animates into view with a subtle fade and slide.
              </p>
            </div>
          </ScrollReveal>
        </Preview>

        <Preview name="native-select">
          <NativeSelect defaultValue="medium">
            <NativeSelectOption value="small">Small</NativeSelectOption>
            <NativeSelectOption value="medium">Medium</NativeSelectOption>
            <NativeSelectOption value="large">Large</NativeSelectOption>
          </NativeSelect>
        </Preview>

        <Preview name="navigation-menu" className={fullWidth}>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Home</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">About</NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="#">Contact</NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Preview>

        <Preview name="pagination">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Preview>

        <Preview name="popover">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-sm text-muted-foreground">
                Place content here such as settings, filters, or quick actions.
              </p>
            </PopoverContent>
          </Popover>
        </Preview>

        <Preview name="progress">
          <Progress value={25} className="max-w-sm">
            <ProgressLabel>Uploading</ProgressLabel>
            <ProgressValue />
          </Progress>
        </Preview>

        <Preview name="radio-group">
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="default" id="showcase-rg-default" />
              <Label htmlFor="showcase-rg-default">Default</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="showcase-rg-comfortable" />
              <Label htmlFor="showcase-rg-comfortable">Comfortable</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="showcase-rg-compact" />
              <Label htmlFor="showcase-rg-compact">Compact</Label>
            </div>
          </RadioGroup>
        </Preview>

        <Preview name="resizable">
          <ResizablePanelGroup orientation="horizontal" className="max-w-md rounded-xl border">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-[160px] items-center justify-center p-6">
                <span className="font-medium">Panel One</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-[160px] items-center justify-center p-6">
                <span className="font-medium">Panel Two</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Preview>

        <Preview name="scroll-area">
          <ScrollArea className="h-48 w-48 rounded-xl border">
            <div className="space-y-2 p-4">
              {scrollTags.map((tag) => (
                <div key={tag} className="text-sm">
                  {tag}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Preview>

        <Preview name="select">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </Preview>

        <Preview name="separator">
          <div className="max-w-sm space-y-3">
            <p className="text-sm">Above</p>
            <Separator />
            <p className="text-sm">Below</p>
          </div>
        </Preview>

        <Preview name="sheet">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Sheet title</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when done.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </Preview>

        <Preview name="skeleton">
          <Skeleton className="h-4 w-[240px]" />
        </Preview>

        <Preview name="slider">
          <Slider className="max-w-sm" defaultValue={[33]} />
        </Preview>

        <Preview name="sonner">
          <div className="space-y-4">
            <Button onClick={() => toast("Your changes have been saved.")}>Show toast</Button>
            <Toaster />
          </div>
        </Preview>

        <Preview name="spinner">
          <Spinner />
        </Preview>

        <Preview name="switch">
          <Switch aria-label="Toggle setting" />
        </Preview>

        <Preview name="table" className={fullWidth}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell>{invoice.method}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Preview>

        <Preview name="tabs" className={fullWidth}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Default</p>
              <Tabs defaultValue="account" className="max-w-md">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <p className="text-sm text-muted-foreground">
                    Make changes to your account settings here.
                  </p>
                </TabsContent>
                <TabsContent value="password">
                  <p className="text-sm text-muted-foreground">Change your password here.</p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Responsive (carousel below @sm)
              </p>
              <div className="w-[280px] max-w-full">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsCarouselList tabs={responsiveTabs} breakpoint="sm" />
                  {responsiveTabs.map((tab) => (
                    <TabsContent key={tab.value} value={tab.value}>
                      <p className="text-sm text-muted-foreground">
                        Content for <span className="font-medium text-foreground">{tab.label}</span>
                        .
                      </p>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
        </Preview>

        <Preview name="textarea">
          <Textarea placeholder="Type your message here." className="max-w-md" />
        </Preview>

        <Preview name="toggle">
          <Toggle aria-label="Toggle bold">
            <BoldIcon />
          </Toggle>
        </Preview>

        <Preview name="toggle-group">
          <ToggleGroup defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </Preview>

        <Preview name="tooltip">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
        </Preview>
      </div>
    </TooltipProvider>
  );
}
