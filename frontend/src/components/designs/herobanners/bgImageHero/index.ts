import BgImageHeroEdit from "./bgImageHeroEdit";
import BgImageHero from "./bgImageHero";
import {
  WebsiteComponent,
  EditorialComponentProps,
  BaseComponentProps,
  EditableComponent,
  ImageProp,
} from "@/types";

// EditableComponent details
export const bgImageHeroDetails: EditableComponent = {
  name: "BgImageHero",
  details: "A full-width hero section with a background image, title, and description.",
  uniqueEdits: [],
  editableFields: [
    // Text Fields
    {
      key: "title",
      label: "Title",
      description: "Main headline for the hero",
      type: "text",
      wordLimit: 10,
    },
    {
      key: "description",
      label: "Description",
      description: "Supporting text under the headline",
      type: "text",
      wordLimit: 25,
    },

    // Image Field
    {
      key: "images.main",
      label: "Background Image",
      description: "Hero background image",
      type: "image",
    },
  ],
  category: "hero",
};

// Props interface - all optional, extends Partial<BaseComponentProps>
export interface BgImageHeroProps extends Partial<BaseComponentProps> {
  title?: string;
  description?: string;
  images?: {
    main?: ImageProp;
  };
}

// Default props with Required<> type
export const defaultBgImageHeroProps: Required<BgImageHeroProps> = {
  textColor: "#1f2937",
  baseBgColor: "#f0f9ff",
  mainColor: "#3B82F6",
  bgLayout: {
    type: "radial",
    radialSize: "125% 125%",
    radialPosition: "50% 0%",
    radialBaseStop: 50,
  } as const,
  title: "Your Hero Title",
  description: "A brief description goes here.",
  subTitle: "",
  buttonText: "",
  array: [],
  images: {
    main: {
      src: "/placeholder.webp",
      alt: "Hero Background",
    },
  },
  items: [],
};

// WebsiteComponent object combining editorial & production - use Partial<>
export const bgImageHeroComponent: WebsiteComponent<EditorialComponentProps, Partial<BgImageHeroProps>> = {
  editorial: BgImageHeroEdit,
  production: BgImageHero,
  editableProps: bgImageHeroDetails,
};

// Named exports
export { BgImageHero, BgImageHeroEdit };
