// frontend/src/components/designs/contentPieces/closingStatement/closingStatementEdit.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { EditorialComponentProps } from "@/types/editorial";
import { defaultClosingStatementProps, ClosingStatementProps } from ".";
import { useComponentEditor } from "@/context/context";
import {
  handleComponentClick,
  useSyncLlmOutput,
  useSyncColorEdits,
  useSyncPageDataToComponent,
} from "@/lib/hooks/hooks";
import EditableTextField from "@/components/editor/editableTextField/editableTextArea";
import ImageField from "@/components/editor/imageField/imageField";
import useWebsiteStore from "@/stores/websiteStore";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import { closingStatementDetails } from ".";
import { GradientConfig, ImageProp } from "@/types/editorial";

const ClosingStatementEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<Partial<ClosingStatementProps>>({});

  const {
    setCurrentComponent,
    currentComponent,
    setAssistantMessage,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    currentColorEdits,
    setCurrentColorEdits,
  } = useComponentEditor();

  const updateComponentProps = useWebsiteStore((state) => state.updateComponentProps);

  const {
    title,
    description,
    images,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = { ...defaultClosingStatementProps, ...componentProps };

  const safeTextColor = textColor ?? defaultClosingStatementProps.textColor;
  const safeBaseBgColor = baseBgColor ?? defaultClosingStatementProps.baseBgColor;
  const safeMainColor = mainColor ?? defaultClosingStatementProps.mainColor;
  const safeBgLayout = bgLayout ?? defaultClosingStatementProps.bgLayout;
  
  // Get logo from images prop
  const logoImage = images?.logo ?? defaultClosingStatementProps.images.logo;

  const colors = deriveColorPalette(
    {
      textColor: safeTextColor,
      baseBgColor: safeBaseBgColor,
      mainColor: safeMainColor,
      bgLayout: safeBgLayout,
    },
    safeBgLayout.type
  );

  const background = useAnimatedGradient(safeBgLayout as GradientConfig, colors);

  // Sync hooks (required)
  useSyncLlmOutput(
    currentComponent?.name,
    "ClosingStatement",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    closingStatementDetails.editableFields
  );

  useSyncColorEdits(currentComponent?.name, "ClosingStatement", setComponentProps, currentColorEdits, id,);
  useSyncPageDataToComponent(id, "ClosingStatement", setComponentProps);

  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: closingStatementDetails,
      setCurrentComponent,
      setAssistantMessage,
    });
    setCurrentColorEdits({
      textColor: colors.textColor ?? safeTextColor,
      baseBgColor: colors.baseBgColor ?? safeBaseBgColor,
      mainColor: colors.mainColor ?? safeMainColor,
      bgLayout: colors.bgLayout ?? safeBgLayout,
    });
  };

  const updateProp = <K extends keyof ClosingStatementProps>(
    key: K,
    value: ClosingStatementProps[K]
  ) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(id, { [key]: value });
  };

  return (
    <motion.section
      onClick={onClick}
      style={{ background, color: colors.textColor ?? safeTextColor }}
      className="w-full py-20 px-6 rounded-xl cursor-pointer relative"
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center text-center">
        {/* Editable Logo */}
        <div className="mb-10 inline-block" onClick={(e) => e.stopPropagation()}>
          <div className="w-32 h-32 mx-auto relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <ImageField
              componentId={id}
              fieldKey="images.logo"
              value={logoImage ?? defaultClosingStatementProps.images.logo}
              onChange={(val) => updateProp("images", { ...images, logo: val })}
              className="object-contain p-4"
            />
          </div>
        </div>

        {/* Editable Title */}
        {title && (
          <EditableTextField
            value={title}
            onChange={(val) => updateProp("title", val)}
            placeholder="Closing Title"
            className="text-2xl w-[80%] text-center md:text-3xl w-screen lg:text-5xl font-bold mb-8 bg-gradient-to-br bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to bottom right, ${colors.lightAccent ?? safeMainColor}, ${colors.darkAccent ?? safeMainColor})`,
            }}
            fieldKey="title"
            componentId={id}
          />
        )}

        {/* Editable Description */}
        {description && (
          <EditableTextField
            value={description}
            onChange={(val) => updateProp("description", val)}
            placeholder="Your final message..."
            rows={4}
            className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto opacity-90"
            fieldKey="description"
            componentId={id}
          />
        )}
      </div>
    </motion.section>
  );
};

export default ClosingStatementEdit;