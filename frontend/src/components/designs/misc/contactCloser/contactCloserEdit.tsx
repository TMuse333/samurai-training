"use client";

import React, { useState } from "react";
import { EditorialComponentProps } from "@/types/editorial";
import { contactCloserDetails, ContactCloserProps, defaultContactCloserProps } from ".";
import useWebsiteStore from "@/stores/websiteStore";
import { useComponentEditor } from "@/context";
import { handleComponentClick, useSyncColorEdits, useSyncLlmOutput, useSyncPageDataToComponent } from "@/lib/hooks/hooks";
import { deriveColorPalette } from "@/lib/colorUtils";
import ContactCloser, { ContactCloserProdProps } from "./contactCloser.prod";

export const ContactCloserEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<Partial<ContactCloserProps>>({});

  const {
    currentComponent,
    setCurrentComponent,
    setAssistantMessage,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    currentColorEdits,
    setCurrentColorEdits,
  } = useComponentEditor();

  const updateComponentProps = useWebsiteStore((state) => state.updateComponentProps);
  const currentPageSlug = useWebsiteStore((state) => state.currentPageSlug);

  // Merge with defaults
  const propsWithDefaults = { ...defaultContactCloserProps, ...componentProps };

  const colors = deriveColorPalette(propsWithDefaults, "solid");

  // Sync hooks
  useSyncLlmOutput(
    currentComponent?.name,
    "ContactCloser",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    contactCloserDetails.editableFields
  );

  useSyncColorEdits(currentComponent?.name, "ContactCloser", setComponentProps, currentColorEdits);
  useSyncPageDataToComponent(id, "ContactCloser", setComponentProps);

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

  const updateProp = <K extends keyof ContactCloserProps>(key: K, value: ContactCloserProps[K]) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(currentPageSlug, id, { [key]: value });
  };

  return (
    <div onClick={onClick} className="space-y-4 cursor-pointer">
      {/* Preview */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <ContactCloser {...(propsWithDefaults as ContactCloserProdProps)} />
      </div>
    </div>
  );
};

export default ContactCloserEdit;

