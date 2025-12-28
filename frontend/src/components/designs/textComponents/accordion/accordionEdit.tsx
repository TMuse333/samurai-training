// components/accordion/accordionEdit.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, Variants, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { EditorialComponentProps, GradientConfig } from "@/types/editorial";
import { defaultAccordionProps, AccordionProps } from ".";
import { useComponentEditor } from "@/context/context";
import { handleComponentClick, useSyncLlmOutput, useSyncColorEdits, useSyncPageDataToComponent } from '../../../../lib/hooks/hooks';
import EditableTextField from "@/components/editor/editableTextField/editableTextArea";
import { accordionDetails } from ".";
import useWebsiteStore from "@/stores/websiteStore";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";

const AccordionEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<Partial<AccordionProps>>({});

  const { setCurrentComponent, currentComponent, setAssistantMessage, LlmCurrentTextOutput, setLlmCurrentTextOutput, currentColorEdits, setCurrentColorEdits } = useComponentEditor();

  const updateComponentProps = useWebsiteStore((state) => state.updateComponentProps);

  const {
    array: rawArray = [],
    title,
    description,
    buttonText,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = { ...defaultAccordionProps, ...componentProps };

  // Ensure array is never empty and extract items
  const safeArray = rawArray.length > 0 ? rawArray : defaultAccordionProps.array;
  const safeItems = safeArray
    .filter((item): item is { title: string; description: string } => 
      typeof item === 'object' && item !== null && 'title' in item && 'description' in item
    )
    .map(item => ({
      title: item.title ?? "",
      description: item.description ?? "",
    }));

  // Safe color fallbacks
  const safeTextColor = textColor ?? defaultAccordionProps.textColor;
  const safeBaseBgColor = baseBgColor ?? defaultAccordionProps.baseBgColor;
  const safeMainColor = mainColor ?? defaultAccordionProps.mainColor;
  const safeBgLayout = bgLayout ?? defaultAccordionProps.bgLayout;
  
  // Generate animation colors from mainColor
  const animationColors = [
    safeMainColor,
    safeBaseBgColor,
    safeMainColor,
    safeBaseBgColor,
  ];

  const colors = deriveColorPalette({
    textColor: safeTextColor,
    baseBgColor: safeBaseBgColor,
    mainColor: safeMainColor,
    bgLayout: safeBgLayout,
  }, safeBgLayout.type);
  const background = useAnimatedGradient(colors.bgLayout as GradientConfig, colors);

  const componentRef = useRef(null);
  const inView = useInView(componentRef, { once: true, amount: 0.3 });
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5;

  const totalPages = Math.ceil(safeItems.length / elementsPerPage);
  const startIndex = (currentPage - 1) * elementsPerPage;
  const currentElements = safeItems.slice(startIndex, startIndex + elementsPerPage);

  const color = useMotionValue(animationColors[0]);
  useEffect(() => {
    animate(color, animationColors, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [animationColors, color]);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  useSyncLlmOutput(
    currentComponent?.name,
    "Accordion",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    accordionDetails.editableFields
  );

  useSyncColorEdits(
    currentComponent?.name,
    "Accordion",
    setComponentProps,
    currentColorEdits
  );

  useSyncPageDataToComponent(id, "Accordion", setComponentProps);

  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: accordionDetails,
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

  const updateProp = <K extends keyof AccordionProps>(key: K, value: AccordionProps[K]) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(id, { [key]: value });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    setExpandedIndex(-1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    setExpandedIndex(-1);
  };
  const handleSectionClick = (index: number) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const listVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.section
      ref={componentRef}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ background, color: colors.textColor ?? safeTextColor }}
      className="flex flex-col justify-start items-center py-12 rounded-xl cursor-pointer"
    >
      {(title || description) && (
        <div className="text-center mb-8 flex flex-col items-center justify-center w-full 
        mx-auto">
          {title && (
            <EditableTextField
              value={title ?? ""}
              onChange={(val) => updateProp("title", val)}
              placeholder="Title"
              className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-br bg-clip-text text-transparent
              w-full text-center mx-auto
              "
              fieldKey="title"
              componentId={id}
              style={{
                backgroundImage: `linear-gradient(to bottom right, ${colors.lightAccent ?? safeMainColor}, ${colors.darkAccent ?? safeMainColor})`,
              }}
            />
          )}
          {description && (
            <EditableTextField
              value={description ?? ""}
              onChange={(val) => updateProp("description", val)}
              placeholder="Description"
              rows={3}
              className="mt-4 max-w-2xl mx-auto text-base leading-relaxed md:text-lg
               w-full text-center mx-auto
              "
              fieldKey="description"
              componentId={id}
            />
          )}
        </div>
      )}

      <section
        className="rounded-xl shadow-lg w-[90vw] md:w-[80vw]"
      >
        <div className="flex flex-col" style={{ backgroundColor: `${colors.baseBgColor}80` }}>
          {safeItems.length > elementsPerPage && (
            <motion.div className="flex justify-center space-x-4 mb-4 p-4">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPage();
                }}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  currentPage === 1
                    ? "opacity-50 text-gray-500 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
                style={{
                  ...(currentPage !== 1 ? { border: border.get(), boxShadow: boxShadow.get() } : {}),
                  backgroundColor: currentPage === 1 ? `${colors.baseBgColor}80` : `${colors.mainColor}30`,
                  color: colors.textColor ?? safeTextColor,
                }}
              >
                Previous
              </motion.button>
              <span className="font-medium flex items-center" style={{ color: colors.textColor ?? safeTextColor }}>
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPage();
                }}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  currentPage === totalPages
                    ? "opacity-50 text-gray-500 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
                style={{
                  ...(currentPage !== totalPages ? { border: border.get(), boxShadow: boxShadow.get() } : {}),
                  backgroundColor: currentPage === totalPages ? `${colors.baseBgColor}80` : `${colors.mainColor}30`,
                  color: colors.textColor ?? safeTextColor,
                }}
              >
                Next
              </motion.button>
            </motion.div>
          )}
          <div className="space-y-4 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentElements.map((item, index) => (
                  <motion.div
                    key={startIndex + index}
                    variants={listVariants}
                    initial="initial"
                    animate={inView ? "animate" : "initial"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSectionClick(startIndex + index);
                    }}
                    className="border-b p-4 rounded-lg hover:opacity-80 transition-colors cursor-pointer relative w-full mx-auto"
                    style={{
                      boxShadow: boxShadow.get(),
                      borderColor: `${colors.mainColor}30`,
                      backgroundColor: expandedIndex === startIndex + index ? `${colors.mainColor}10` : `${colors.baseBgColor}40`,
                    }}
                  >
                    <EditableTextField
                    isTextarea
                      value={item.title}
                      onChange={(val) => {
                        const newArray = safeArray.map((arrItem, idx) => {
                          if (idx === startIndex + index) {
                            // Ensure we preserve the type property
                            if ('type' in arrItem && arrItem.type === "StandardText") {
                              return {
                                ...arrItem,
                                title: val,
                              };
                            }
                            // If item doesn't have type, create StandardText item
                            return {
                              type: "StandardText" as const,
                              title: val,
                              description: 'description' in arrItem ? String((arrItem as any).description || "") : "",
                            };
                          }
                          // Ensure all items have type property
                          if ('type' in arrItem) {
                            return arrItem;
                          }
                          // Convert items without type to StandardText
                          return {
                            type: "StandardText" as const,
                            title: 'title' in arrItem ? String((arrItem as any).title || "") : "",
                            description: 'description' in arrItem ? String((arrItem as any).description || "") : "",
                          };
                        });
                        updateProp("array", newArray);
                      }}
                      placeholder="Item Title"
                      className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 pr-12 w-full"
                      fieldKey={`array.${startIndex + index}.title`}
                      componentId={id}
                      style={{ color: colors.textColor ?? safeTextColor }}
                      
                    />
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedIndex === startIndex + index ? "auto" : 0,
                        opacity: expandedIndex === startIndex + index ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="overflow-hidden w-full"
                    >
                      <EditableTextField
                      isTextarea
                        value={item.description}
                        onChange={(val) => {
                          const newArray = safeArray.map((arrItem, idx) => {
                            if (idx === startIndex + index) {
                              // Ensure we preserve the type property
                              if ('type' in arrItem && arrItem.type === "StandardText") {
                                return {
                                  ...arrItem,
                                  description: val,
                                };
                              }
                              // If item doesn't have type, create StandardText item
                              return {
                                type: "StandardText" as const,
                                title: 'title' in arrItem ? String((arrItem as any).title || "") : "",
                                description: val,
                              };
                            }
                            // Ensure all items have type property
                            if ('type' in arrItem) {
                              return arrItem;
                            }
                            // Convert items without type to StandardText
                            return {
                              type: "StandardText" as const,
                              title: 'title' in arrItem ? String((arrItem as any).title || "") : "",
                              description: 'description' in arrItem ? String((arrItem as any).description || "") : "",
                            };
                          });
                          updateProp("array", newArray);
                        }}
                        placeholder="Item Description"
                        rows={3}
                        className="text-base leading-relaxed pt-2 w-full"
                        fieldKey={`array.${startIndex + index}.description`}
                        componentId={id}
                        style={{ color: colors.textColor ?? safeTextColor }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {buttonText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: safeItems.length * 0.1 + 0.8 }}
          className="mt-8"
        >
          <motion.button
            style={{ border, boxShadow, backgroundColor: `${colors.mainColor}30`, color: colors.textColor ?? safeTextColor }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative flex w-fit mx-auto items-center gap-1.5 rounded-full px-6 py-3 transition-colors hover:opacity-80 font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <EditableTextField
              value={buttonText ?? ""}
              onChange={(val) => updateProp("buttonText", val)}
              placeholder="Button Text"
              className="font-semibold"
              fieldKey="buttonText"
              componentId={id}
            />
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default AccordionEdit;

