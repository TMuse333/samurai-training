"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EditorialComponentProps } from "@/types/editorial";
import { useComponentEditor } from "@/context/context";
import EditableTextField from "@/components/editor/editableTextField/editableTextArea";
import ImageField from "@/components/editor/imageField/imageField";
import useWebsiteStore from "@/stores/websiteStore";
import { handleComponentClick, useSyncPageDataToComponent, useSyncLlmOutput, useSyncColorEdits } from "@/lib/hooks/hooks";
import { bgImageHeroDetails, BgImageHeroProps, defaultBgImageHeroProps } from ".";

const BgImageHeroEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<BgImageHeroProps>(defaultBgImageHeroProps);

  const { 
    currentComponent, 
    setCurrentComponent, 
    setAssistantMessage,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    currentColorEdits,
    setCurrentColorEdits
  } = useComponentEditor();
  const updateComponentProps = useWebsiteStore((state) => state.updateComponentProps);
  const currentPageSlug = useWebsiteStore((state) => state.currentPageSlug);

  // Merge with defaults to ensure all required props exist
  const propsWithDefaults = { ...defaultBgImageHeroProps, ...componentProps };

  useSyncLlmOutput(
    currentComponent?.name,
    "BgImageHero",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    bgImageHeroDetails.editableFields
  );

  useSyncColorEdits(
    currentComponent?.name,
    "BgImageHero",
    setComponentProps,
    currentColorEdits
  );

  useSyncPageDataToComponent(id, "BgImageHero", setComponentProps);

  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: bgImageHeroDetails,
      setCurrentComponent,
      setAssistantMessage,
    });
  };

  const updateProp = <K extends keyof BgImageHeroProps>(key: K, value: BgImageHeroProps[K]) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(currentPageSlug, id, { [key]: value });
  };

  // Safe image fallback
  const mainImg = propsWithDefaults.images?.main ?? defaultBgImageHeroProps.images.main;

  return (
    <header
      onClick={onClick}
      className="w-screen min-h-[500px] h-[75vh] text-center text-gray-200 relative flex flex-col items-center justify-center transition-colors duration-1000 rounded-xl"
      role="banner"
    >
      <div className="w-full h-full absolute z-[1] brightness-[0.5]">
        <ImageField
          className="w-full h-full object-cover"
          componentId={id}
          fieldKey="images.main"
          value={mainImg!}
          onChange={(val) =>
            updateProp("images", {
              ...propsWithDefaults.images,
              main: val,
            })
          }
          rounded={false}
          objectCover
        />
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
        className="text-left w-4/5 relative z-[2]"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <EditableTextField
            value={propsWithDefaults.title}
            onChange={(val) => updateProp("title", val)}
            placeholder="Hero Title"
            isTextarea
            maxWords={10}
            className="text-4xl sm:text-5xl md:text-6xl w-full"
            fieldKey="title"
            componentId={id}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <EditableTextField
            value={propsWithDefaults.description}
            onChange={(val) => updateProp("description", val)}
            placeholder="Hero Description"
            isTextarea
            maxWords={25}
            className="text-xl mt-4 sm:text-2xl md:text-3xl w-full"
            fieldKey="description"
            componentId={id}
          />
        </motion.div>

        {/* Uncomment if needed
        <motion.a
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          href={destination}
          className="inline-block mt-8 bg-gray-300 p-4 text-black rounded-md hover:scale-[1.1] hover:bg-slate-900 hover:text-white transition-all"
        >
          {buttonText}
        </motion.a>
        */}
      </motion.section>
    </header>
  );
};

export default BgImageHeroEdit;