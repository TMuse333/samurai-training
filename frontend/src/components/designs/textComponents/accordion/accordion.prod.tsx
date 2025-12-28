"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  Variants,
  useInView,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  animate,
} from "framer-motion";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import { GradientConfig } from "@/types";

export interface AccordionProdProps {
  array: Array<{ title: string; description: string }>;
  title: string;
  description: string;
  buttonText: string;
  textColor: string;
  baseBgColor: string;
  mainColor: string;
  bgLayout: GradientConfig;
}

const Accordion: React.FC<AccordionProdProps> = (props) => {
  const {
    array,
    title,
    description,
    buttonText,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = props;

  const items = array
    .filter((item): item is { title: string; description: string } => 
      typeof item === 'object' && item !== null && 'title' in item && 'description' in item
    )
    .map(item => ({
      title: item.title,
      description: item.description,
    }));

  // Generate animation colors from mainColor
  const animationColors = [
    mainColor,
    baseBgColor,
    mainColor,
    baseBgColor,
  ];

  const colors = deriveColorPalette(
    { textColor, baseBgColor, mainColor, bgLayout },
    bgLayout.type
  );
  const background = useAnimatedGradient(bgLayout, colors);

  const componentRef = useRef(null);
  const inView = useInView(componentRef, { once: true, amount: 0.3 });
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5;

  const totalPages = Math.ceil(items.length / elementsPerPage);
  const startIndex = (currentPage - 1) * elementsPerPage;
  const currentElements = items.slice(startIndex, startIndex + elementsPerPage);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ background, color: colors.textColor }}
      className="flex flex-col justify-start items-center py-12"
    >
      <div className="text-center mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-semibold bg-gradient-to-br bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${colors.lightAccent ?? mainColor}, ${colors.darkAccent ?? mainColor})`,
          }}
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4 max-w-2xl mx-auto text-base leading-relaxed md:text-lg"
        >
          {description}
        </motion.p>
      </div>

      <section
        className="rounded-xl shadow-lg"
        ref={componentRef}
      >
        <div className="flex flex-col" style={{ backgroundColor: `${colors.baseBgColor}80` }}>
          {items.length > elementsPerPage && (
            <motion.div className="flex justify-center space-x-4 mb-4 p-4">
              <motion.button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  currentPage === 1
                    ? "opacity-50 text-gray-500 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
                style={{
                  ...(currentPage !== 1 ? { border: border.get(), boxShadow: boxShadow.get() } : {}),
                  backgroundColor: currentPage === 1 ? `${colors.baseBgColor}80` : `${colors.mainColor}30`,
                  color: colors.textColor,
                }}
              >
                Previous
              </motion.button>
              <span className="font-medium flex items-center" style={{ color: colors.textColor }}>
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  currentPage === totalPages
                    ? "opacity-50 text-gray-500 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
                style={{
                  ...(currentPage !== totalPages ? { border: border.get(), boxShadow: boxShadow.get() } : {}),
                  backgroundColor: currentPage === totalPages ? `${colors.baseBgColor}80` : `${colors.mainColor}30`,
                  color: colors.textColor,
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
                {currentElements.map((item: { title: string; description: string }, index: number) => (
                  <motion.div
                    key={startIndex + index}
                    variants={listVariants}
                    initial="initial"
                    animate={inView ? "animate" : "initial"}
                    onClick={() => handleSectionClick(startIndex + index)}
                    className="border-b p-4 rounded-lg hover:opacity-80 transition-colors cursor-pointer relative max-w-4xl mx-auto"
                    style={{
                      boxShadow: boxShadow.get(),
                      borderColor: `${colors.mainColor}30`,
                      backgroundColor: expandedIndex === startIndex + index ? `${colors.mainColor}10` : `${colors.baseBgColor}40`,
                    }}
                  >
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 pr-12" style={{ color: colors.textColor }}>
                      {item.title}
                    </h2>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: expandedIndex === startIndex + index ? "auto" : 0,
                        opacity: expandedIndex === startIndex + index ? 1 : 0,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-base leading-relaxed pt-2" style={{ color: colors.textColor }}>
                        {item.description}
                      </p>
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
          transition={{ duration: 0.8, delay: items.length * 0.1 + 0.8 }}
          className="mt-8"
        >
          <motion.button
            style={{ border, boxShadow, backgroundColor: `${colors.mainColor}30`, color: colors.textColor }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative flex w-fit mx-auto items-center gap-1.5 rounded-full px-6 py-3 transition-colors hover:opacity-80 font-semibold"
          >
            {buttonText}
          </motion.button>
        </motion.div>
      )}
    </motion.section>
  );
};

export default Accordion;

