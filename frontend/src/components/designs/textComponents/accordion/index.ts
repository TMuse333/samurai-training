// components/accordion/index.ts
import AccordionEdit from "./accordionEdit";
import { EditableComponent } from "@/types/editorial";
import { BaseComponentProps } from "@/types";;

export const accordionDetails: EditableComponent = {
  name: "Accordion",
  details:
    "An interactive accordion component that displays a list of items with expandable descriptions. Supports pagination, intro text, and optional link button.",
  uniqueEdits: ["title", "description", "buttonText", "array"],
  editableFields: [
    {
      key: "array",
      label: "Accordion Items",
      description: "Array of items with title and description that can be expanded/collapsed",
      type: "standardArray",
      arrayLength: { min: 1, max: 20 },
    },
    {
      key: "title",
      label: "Title",
      description: "Main heading text for the accordion section",
      type: "text",
      wordLimit: 10,
    },
    {
      key: "description",
      label: "Description",
      description: "Supporting text for the accordion section",
      type: "text",
      wordLimit: 50,
    },
    {
      key: "buttonText",
      label: "Button Text",
      description: "Text for the optional button at the bottom (if needed)",
      type: "text",
      wordLimit: 15,
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

export interface AccordionProps extends Omit<Partial<BaseComponentProps>, 'items'> {
  // Uses array from BaseComponentProps for accordion items
  // Each item should be StandardText type: { title: string, description: string }
}

export const defaultAccordionProps: Required<Omit<AccordionProps, 'array'>> & { 
  array: Array<{ title: string; description: string }>;
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
  title: "A list of items that can be expanded and collapsed",
  description: "This is a description for the accordion section. It provides additional information that can be expanded when clicked.",
  subTitle: "Accordion Section",
  buttonText: "",
  array: [
    {
      title: "First Accordion Item",
      description: "This is a description for the first accordion item. Click to expand and see more details about this topic.",
    },
    {
      title: "Second Accordion Item",
      description: "This is a description for the second accordion item. It provides additional information that can be expanded when clicked.",
    },
    {
      title: "Third Accordion Item",
      description: "This is a description for the third accordion item. Use accordions to organize content in a space-efficient way.",
    },
    {
      title: "Fourth Accordion Item",
      description: "This is a description for the fourth accordion item. They're great for FAQs, features, or any collapsible content.",
    },
    {
      title: "Fifth Accordion Item",
      description: "This is a description for the fifth accordion item. The component supports pagination when you have many items.",
    },
  ],
  images: {},

};

export { AccordionEdit };
