// frontend/src/components/designs/contentPieces/closingStatement/index.ts
import ClosingStatementEdit from "./closingStatementEdit";
import { EditableComponent } from "@/types/editorial";
import { BaseComponentProps, ImageProp } from "@/types";;

export const closingStatementDetails: EditableComponent = {
  name: "ClosingStatement",
  details: "A powerful closing statement section with a small logo spot – perfect as the final message on a page.",
  uniqueEdits: ["title", "description", "images.logo"],
  editableFields: [
    {
      key: "title",
      label: "Closing Title",
      description: "Main headline for the closing statement",
      type: "text",
      wordLimit: 15,
    },
    {
      key: "description",
      label: "Closing Message",
      description: "Supporting paragraph that seals the deal",
      type: "text",
      wordLimit: 120,
    },
    {
      key: "images.logo",
      label: "Logo",
      description: "Small logo image (recommended 200×200px or smaller)",
      type: "image",
    },
    {
      key: "textColor",
      label: "Text Color",
      description: "Main body text color and header; should contrast with the baseBgColor",
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
      description: "Foreground color for highlights, gradients, buttons, borders, and accents",
      type: "color",
    },
    {
      key: "bgLayout",
      label: "Background Layout",
      description: "The layout for the background colors",
      type: "color",
    },
  ],
  category: "contentPiece",
};

export interface ClosingStatementProps extends Partial<BaseComponentProps> {
  // Uses images.logo from BaseComponentProps for the logo image
}

export const defaultClosingStatementProps: Required<Omit<ClosingStatementProps, 'images' | 'array' | 'items'>> & {
  images: Record<string, ImageProp>;
  array: Array<{ title: string; description: string }>;
  items: any[];
} = {
  title: "Thank You for Trusting Us",
  description: "We're excited to help you achieve your goals. Let's build something amazing together.",
  subTitle: "",
  buttonText: "",

  // Colors
  textColor: "#1f2937",
  baseBgColor: "#f8fafc",
  mainColor: "#0ea5e9",
  bgLayout: {
    type: "radial" as const,
    radialSize: "125% 125%",
    radialPosition: "50% 0%",
    radialBaseStop: 50,
  },

  // Images - logo stored in images.logo
  images: {
    logo: {
      src: "/placeholder.webp",
      alt: "Company logo",
    },
  },

  // Required BaseComponentProps
  array: [],
  items: [],
};

export { ClosingStatementEdit };
