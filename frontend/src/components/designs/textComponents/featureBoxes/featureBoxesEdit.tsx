// components/featureBoxes/featureBoxesEdit.tsx
"use client";

import React, { useState, useRef } from "react";
import { useInView, motion, Variants } from "framer-motion";
import Image from "next/image";
import { EditorialComponentProps, GradientConfig, ImageProp } from "@/types/editorial";
import { defaultFeatureBoxesProps, FeatureBoxesProps } from ".";
import { useComponentEditor } from "@/context/context";
import { handleComponentClick, useSyncLlmOutput, useSyncColorEdits, useSyncPageDataToComponent } from '../../../../lib/hooks/hooks';
import EditableTextField from "@/components/editor/editableTextField/editableTextArea";
import { featureBoxesDetails } from ".";
import useWebsiteStore from "@/stores/websiteStore";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import ImageField from "@/components/editor/imageField/imageField";

interface BoxProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  boxColor: string;
  boxTextColor: string;
  onImageChange?: (src: string, alt: string) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  imageKey: string;
  componentId: string;
}

const FeatureBoxEdit: React.FC<BoxProps> = ({
  imageSrc,
  imageAlt,
  title,
  description,
  boxColor,
  boxTextColor,
  onImageChange,
  onTitleChange,
  onDescriptionChange,
  imageKey,
  componentId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 1 });

  const containerVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 7,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`w-[90vw] mx-auto p-4 mb-8 border rounded-xl sm:w-[40vw] max-w-[550px] flex flex-col`}
      style={{
        backgroundColor: boxColor,
        color: boxTextColor,
        borderColor: boxTextColor,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        variants={childVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ type: "spring" as const, stiffness: 500, damping: 7, delay: 0.1 }}
        className="w-[30px] sm:w-[35px] md:h-[40px] mx-auto mb-4"
      >
        <ImageField
          componentId={componentId}
          fieldKey={`images.${imageKey}`}
          value={{ src: imageSrc, alt: imageAlt } as ImageProp}
          onChange={(val) => onImageChange?.(val.src, val.alt)}
          className="object-contain"
        />
      </motion.div>

      <div className="flex flex-col">
        <EditableTextField
          value={title}
          onChange={(val) => onTitleChange?.(val)}
          placeholder="Box Title"
          className="text-lg font-semibold mb-2"
          fieldKey={`array.${imageKey}.title`}
          componentId={componentId}
          style={{ color: boxTextColor }}
        />

        <EditableTextField
          value={description}
          onChange={(val) => onDescriptionChange?.(val)}
          placeholder="Box Description"
          rows={3}
          className="text-sm"
          fieldKey={`array.${imageKey}.description`}
          componentId={componentId}
          style={{ color: boxTextColor }}
        />
      </div>
    </motion.div>
  );
};

const FeatureBoxesEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<Partial<FeatureBoxesProps>>({});

  const { setCurrentComponent, currentComponent, setAssistantMessage, LlmCurrentTextOutput, setLlmCurrentTextOutput, currentColorEdits, setCurrentColorEdits } = useComponentEditor();

  const updateComponentProps = useWebsiteStore((state) => state.updateComponentProps);
  const currentPageSlug = useWebsiteStore((state) => state.currentPageSlug);

  const {
    array: rawArray = [],
    images,
    title,
    description,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = { ...defaultFeatureBoxesProps, ...componentProps };

  // Ensure array is never empty and extract items
  const safeArray = rawArray.length > 0 ? rawArray : defaultFeatureBoxesProps.array;
  const items = safeArray
    .filter((item): item is { title: string; description: string } => 
      typeof item === 'object' && item !== null && 'title' in item && 'description' in item
    )
    .map((item, index) => ({
      title: item.title ?? "",
      description: item.description ?? "",
      imageKey: String(index),
    }));

  // Safe color fallbacks
  const safeTextColor = textColor ?? defaultFeatureBoxesProps.textColor;
  const safeBaseBgColor = baseBgColor ?? defaultFeatureBoxesProps.baseBgColor;
  const safeMainColor = mainColor ?? defaultFeatureBoxesProps.mainColor;
  const safeBgLayout = bgLayout ?? defaultFeatureBoxesProps.bgLayout;

  const colors = deriveColorPalette({
    textColor: safeTextColor,
    baseBgColor: safeBaseBgColor,
    mainColor: safeMainColor,
    bgLayout: safeBgLayout,
  }, safeBgLayout.type);
  const background = useAnimatedGradient(colors.bgLayout as GradientConfig, colors);

  // Get images from images prop, keyed by index
  const getImageForIndex = (index: number) => {
    const imageKey = String(index);
    const image = images?.[imageKey];
    return {
      src: image?.src ?? "/placeholder.webp",
      alt: image?.alt ?? `Feature ${index + 1}`,
    };
  };

  useSyncLlmOutput(
    currentComponent?.name,
    "FeatureBoxes",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    featureBoxesDetails.editableFields
  );

  useSyncColorEdits(
    currentComponent?.name,
    "FeatureBoxes",
    setComponentProps,
    currentColorEdits
  );

  useSyncPageDataToComponent(id, "FeatureBoxes", setComponentProps);

  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: featureBoxesDetails,
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

  const updateProp = <K extends keyof FeatureBoxesProps>(key: K, value: FeatureBoxesProps[K]) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(currentPageSlug, id, { [key]: value });
  };

  const handleImageChange = (index: number, src: string, alt: string) => {
    const imageKey = String(index);
    const newImages = { ...images, [imageKey]: { src, alt } };
    updateProp("images", newImages);
  };

  const handleItemTitleChange = (index: number, title: string) => {
    const newArray = safeArray.map((item, idx) => {
      if (idx === index) {
        // Check if item has type property (is BaseArrayItem)
        if ('type' in item && item.type === "StandardText") {
          return {
            ...item,
            title,
          };
        }
        // If item doesn't have type, create StandardText item
        return {
          type: "StandardText" as const,
          title,
          description: 'description' in item ? String((item as any).description || "") : "",
        };
      }
      // Ensure all items have type property
      if ('type' in item) {
        return item;
      }
      // Convert items without type to StandardText
      return {
        type: "StandardText" as const,
        title: 'title' in item ? String((item as any).title || "") : "",
        description: 'description' in item ? String((item as any).description || "") : "",
      };
    });
    updateProp("array", newArray);
  };

  const handleItemDescriptionChange = (index: number, description: string) => {
    const newArray = safeArray.map((item, idx) => {
      if (idx === index) {
        // Check if item has type property (is BaseArrayItem)
        if ('type' in item && item.type === "StandardText") {
          return {
            ...item,
            description,
          };
        }
        // If item doesn't have type, create StandardText item
        return {
          type: "StandardText" as const,
          title: 'title' in item ? String((item as any).title || "") : "",
          description,
        };
      }
      // Ensure all items have type property
      if ('type' in item) {
        return item;
      }
      // Convert items without type to StandardText
      return {
        type: "StandardText" as const,
        title: 'title' in item ? String((item as any).title || "") : "",
        description: 'description' in item ? String((item as any).description || "") : "",
      };
    });
    updateProp("array", newArray);
  };

  return (
    <motion.section
      onClick={onClick}
      style={{ background, color: colors.textColor ?? safeTextColor }}
      className="w-full py-12 rounded-xl cursor-pointer"
    >
      {(title || description) && (
        <div className="text-center mb-8 px-4 flex flex-col items-center justify-center text-center mx-auto">
          {title && (
            <EditableTextField
              value={title ?? ""}
              onChange={(val) => updateProp("title", val)}
              placeholder="Title"
              className="text-4xl sm:text-5xl md:text-6xl mb-4 font-semibold bg-gradient-to-br bg-clip-text text-transparent"
              fieldKey="title"
              componentId={id}
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${colors.lightAccent ?? safeMainColor}, ${colors.darkAccent ?? safeMainColor})`,
              }}
              isTextarea
            />
          )}
          {description && (
            <EditableTextField
              value={description ?? ""}
              onChange={(val) => updateProp("description", val)}
              placeholder="Description"
              rows={3}
              className="max-w-2xl w-full mx-auto text-base leading-relaxed md:text-lg"
              fieldKey="description"
              componentId={id}
              isTextarea
            />
          )}
        </div>
      )}

      <section className="flex flex-col mx-auto justify-center items-center mt-6 sm:grid grid-cols-2 max-w-[1200px]">
        {items.map((item, index) => {
          const image = getImageForIndex(index);
          return (
            <FeatureBoxEdit
              key={index}
              imageSrc={image.src}
              imageAlt={image.alt}
              title={item.title}
              description={item.description}
              boxColor={`${colors.mainColor}20`}
              boxTextColor={colors.textColor ?? safeTextColor}
              onImageChange={(src, alt) => handleImageChange(index, src, alt)}
              onTitleChange={(title) => handleItemTitleChange(index, title)}
              onDescriptionChange={(description) => handleItemDescriptionChange(index, description)}
              imageKey={String(index)}
              componentId={id}
            />
          );
        })}
      </section>
    </motion.section>
  );
};

export default FeatureBoxesEdit;

