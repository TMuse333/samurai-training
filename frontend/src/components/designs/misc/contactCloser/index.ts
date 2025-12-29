import ContactCloser from "./contactCloser.prod";
import ContactCloserEdit from "./contactCloserEdit";
import { WebsiteComponent, EditorialComponentProps, EditableComponent } from "@/types/editorial";
import { BaseColorProps,  } from "@/types";;

export interface ContactCloserProps extends BaseColorProps {
  title?: string;
  description?: string;
  buttonText?: string;
  email?: string;
  phone?: string;
  facebookUrl?: string;
}

export const contactCloserDetails: EditableComponent = {
  name: "ContactCloser",
  details: "Simple contact section with email form and contact methods",
  uniqueEdits: [],
  editableFields: [
    { key: "title", label: "Title", description: "Main heading text", type: "text" },
    { key: "description", label: "Description", description: "Subheading paragraph", type: "text" },
    { key: "buttonText", label: "Button Text", description: "Text inside the submit button", type: "text" },
    { key: "email", label: "Email", description: "Contact email address", type: "text" },
    { key: "phone", label: "Phone", description: "Contact phone number", type: "text" },
    { key: "facebookUrl", label: "Facebook URL", description: "Facebook profile URL", type: "text" },
    { key: "textColor", label: "Text Color", description: "Primary text color", type: "color" },
    { key: "baseBgColor", label: "Background Color", description: "Background color of the section", type: "color" },
    { key: "mainColor", label: "Accent Color", description: "Main accent color for buttons and highlights", type: "color" },
  ],
  category: "misc",
};

export const contactCloserComponent: WebsiteComponent<
  EditorialComponentProps,
  ContactCloserProps
> = {
  editorial: ContactCloserEdit,
  production: ContactCloser,
  editableProps: contactCloserDetails,
};

export { ContactCloser, ContactCloserEdit };

