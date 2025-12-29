// components/featureBoxes/index.ts
import FeatureBoxesEdit from "./featureBoxesEdit";
import { WebsiteComponent, EditorialComponentProps, BaseComponentProps, EditableComponent, ImageProp } from "@/types";

export const featureBoxesDetails: EditableComponent = {
  name: "FeatureBoxes",
  details:
    "A grid of feature boxes, each displaying an image, title, and description. Perfect for showcasing features, services, or benefits in a visually appealing grid layout.",
  uniqueEdits: ["title", "description", "array", "images"],
  editableFields: [
    {
      key: "array",
      label: "Feature Boxes",
      description: "Array of feature boxes with title and description",
      type: "standardArray",
      arrayLength: { min: 1, max: 12 },
    },
    {
      key: "title",
      label: "Title",
      description: "Main heading text for the feature boxes section",
      type: "text",
      wordLimit: 10,
    },
    {
      key: "description",
      label: "Description",
      description: "Supporting text for the feature boxes section",
      type: "text",
      wordLimit: 50,
    },
    {
      key: "textColor",
      label: "Text Color",
      description:
        "Main body text color and header; should contrast with the baseBgColor",
      type: "color",
    },
    {
      key: "baseBgColor",
      label: "Background Color",
      description: "This is the base background color on the screen",
      type: "color",
    },
    {
      key: "mainColor",
      label: "Main Color",
      description:
        "Foreground color for highlights, gradients, buttons, borders, and accents",
      type: "color",
    },
    {
      key: "bgLayout",
      label: "Background layout",
      description: "The layout for the background colors",
      type: "color",
    },
  ],
  category: "textComponent",
};

export interface FeatureBoxesProps extends Partial<BaseComponentProps> {
  // Uses array from BaseComponentProps for feature boxes (title/description)
  // Uses images from BaseComponentProps, keyed by index (e.g., "0", "1", "2")
}

export const defaultFeatureBoxesProps: Required<Omit<FeatureBoxesProps, 'array' | 'images'>> & { 
  array: Array<{ title: string; description: string }>;
  images: Record<string, ImageProp>;
} = {
  textColor: "#1f2937",
  baseBgColor: "#f0f9ff",
  mainColor: "#3B82F6",
  bgLayout: {
    type: "radial" as const,
    radialSize: "125% 125%",
    radialPosition: "50% 0%",
    radialBaseStop: 50,
  },
  title: "Our Features",
  description: "Discover what makes us different and how we can help you achieve your goals.",
  subTitle: "",
  buttonText: "",
  array: [
    {
      title: "Feature One",
      description: "This is a description for the first feature box. It highlights a key benefit or capability.",
    },
    {
      title: "Feature Two",
      description: "This is a description for the second feature box. It showcases another important aspect.",
    },
    {
      title: "Feature Three",
      description: "This is a description for the third feature box. It demonstrates additional value.",
    },
    {
      title: "Feature Four",
      description: "This is a description for the fourth feature box. It presents another key feature.",
    },
  ],
  images: {
    "0": { src: "/placeholder.webp", alt: "Feature One" },
    "1": { src: "/placeholder.webp", alt: "Feature Two" },
    "2": { src: "/placeholder.webp", alt: "Feature Three" },
    "3": { src: "/placeholder.webp", alt: "Feature Four" },
  },
  items: [],
};

export const featureBoxesComponent: WebsiteComponent<EditorialComponentProps, Partial<FeatureBoxesProps>> = {
  editorial: FeatureBoxesEdit,
  production: FeatureBoxes,
  editableProps: featureBoxesDetails,
};

export { FeatureBoxes, FeatureBoxesEdit };

