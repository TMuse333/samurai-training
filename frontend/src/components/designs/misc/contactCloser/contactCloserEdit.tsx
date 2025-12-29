"use client";

import React, { useState } from "react";
import { EditorialComponentProps } from "@/types/editorial";
import { contactCloserDetails, ContactCloserProps } from ".";
import useWebsiteStore from "@/stores/websiteStore";
import { useComponentEditor } from "@/context";
import { handleComponentClick, useSyncColorEdits } from "@/lib/hooks/hooks";
import { deriveColorPalette } from "@/lib/colorUtils";

const initialContactCloserProps: ContactCloserProps = {
  title: "Ready to Get Started?",
  description: "Contact us today to discuss your cleaning needs. We're here to help!",
  buttonText: "Get in Touch",
  email: "info@example.com",
  phone: "(123) 456-7890",
  facebookUrl: "",
  mainColor: "#3B82F6",
  textColor: "#000000",
  baseBgColor: "#FFFFFF",
  bgLayout: {
    type: "solid",
  },
};

export const ContactCloserEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const currentPageData = useWebsiteStore((state) => state.currentPageData);
  const { currentComponent, setCurrentComponent, setAssistantMessage, currentColorEdits, setCurrentColorEdits } =
    useComponentEditor();

  const contactCloserComponent = currentPageData?.components.find(
    (c) => c.componentCategory === "misc" && c.id === id
  );
  const contactCloserProps = (contactCloserComponent?.props as ContactCloserProps) || initialContactCloserProps;

  const [componentProps, setComponentProps] = useState<ContactCloserProps>(contactCloserProps);

  const colors = deriveColorPalette(componentProps, "solid");

  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: contactCloserDetails,
      setCurrentComponent,
      setAssistantMessage,
    });

    setCurrentColorEdits({
      textColor: colors.textColor,
      baseBgColor: colors.baseBgColor,
      mainColor: colors.mainColor,
      bgLayout: colors.bgLayout,
    });
  };

  useSyncColorEdits(currentComponent?.name, "ContactCloser", setComponentProps, currentColorEdits);

  return (
    <div onClick={onClick} className="space-y-4 cursor-pointer">
      {/* Preview */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <ContactCloser {...componentProps} />
      </div>
    </div>
  );
};

export default ContactCloserEdit;

