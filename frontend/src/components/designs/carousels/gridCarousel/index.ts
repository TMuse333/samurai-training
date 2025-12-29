import { BaseComponentProps,EditableComponent } from "@/types/editorial";
import { CarouselItem } from "@/types";;
import GridCarouselEdit from "./gridCarouselEdit";

export const gridCarouselDetails: EditableComponent = {
  name: "GridCarousel",
  details: "An interactive grid-to-carousel image gallery. Starts as a responsive grid layout that transforms into a full-screen carousel when images are clicked. Features smooth transitions, infinite scrolling, and mobile-responsive design.",
  uniqueEdits: [],
  editableFields: [
    {
      key: "items",
      label: "Carousel Items",
      description: "Array of images for the grid/carousel. Each image supports src, alt, and objectCover positioning. Managed via Carousel Editor.",
      type: "carousel",
      arrayLength: { min: 1, max: 20 },
    },
    {
      key: "subTitle",
      label: "Subtitle",
      description: "Optional subtitle text above the main title",
      type: "text",
      wordLimit: 8,
    },
    {
      key: "title",
      label: "Title",
      description: "Main heading text for the grid carousel section",
      type: "text",
      wordLimit: 10,
    },
    {
      key: "description",
      label: "Description",
      description: "Supporting text for the grid carousel section",
      type: "text",
      wordLimit: 50,
    },
    {
      key: "textColor",
      label: "Text Color",
      description: "Text color for titles, descriptions, and other text elements",
      type: "color",
    },
    {
      key: "baseBgColor",
      label: "Background Color",
      description: "Background color for the entire section",
      type: "color",
    },
    {
      key: "mainColor",
      label: "Accent Color",
      description: "Accent color for navigation and interactive elements",
      type: "color",
    },
    {
      key: "bgLayout",
      label: "Background Layout",
      description: "Background gradient or solid configuration",
      type: "color",
    },
  ],
  category: "carousel",
};

export interface GridCarouselProps extends Partial<BaseComponentProps> {
  items?: CarouselItem[];
}

export const defaultGridCarouselProps: Required<Omit<GridCarouselProps, 'items'>> & { items: CarouselItem[] } = {
  textColor: "#1f2937",
  baseBgColor: "#f0f9ff",
  mainColor: "#3B82F6",
  bgLayout: {
    type: "radial",
    radialSize: "125% 125%",
    radialPosition: "50% 0%",
    radialBaseStop: 50,
  } as const,
  title: "This is where you can display your best work or services in a grid format",
  description: "This is a description for the grid carousel section. It provides additional information that can be expanded when clicked.",
  subTitle: "",
  buttonText: "",
  array: [],
  images: {},
  items: [
    {
      image: { src: "/placeholder.webp", alt: "Image 1" },
    },
    {
      image: { src: "/placeholder.webp", alt: "Image 2" },
    },
    {
      image: { src: "/placeholder.webp", alt: "Image 3" },
    },
    {
      image: { src: "/placeholder.webp", alt: "Image 4" },
    },
  ],
};

export { GridCarouselEdit };
