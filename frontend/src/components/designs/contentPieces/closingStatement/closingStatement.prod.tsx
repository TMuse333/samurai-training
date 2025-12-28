"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import { ImageProp, GradientConfig } from "@/types";

export interface ClosingStatementProdProps {
  title: string;
  description: string;
  images: {
    logo: ImageProp;
  };
  textColor: string;
  baseBgColor: string;
  mainColor: string;
  bgLayout: GradientConfig;
}

const ClosingStatement: React.FC<ClosingStatementProdProps> = (props) => {
  const {
    title,
    description,
    images,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = props;

  const logoImage = images.logo;

  const colors = deriveColorPalette(
    {
      textColor,
      baseBgColor,
      mainColor,
      bgLayout,
    },
    bgLayout.type
  );

  const background = useAnimatedGradient(bgLayout, colors);

  return (
    <motion.section
      style={{ background, color: colors.textColor }}
      className="w-full py-20 px-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <motion.div
          className="mb-10 inline-block"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-32 h-32 mx-auto relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <Image
              src={logoImage.src}
              alt={logoImage.alt}
              fill
              className="object-contain p-4"
              sizes="128px"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-br bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to bottom right, ${colors.lightAccent ?? mainColor}, ${colors.darkAccent ?? mainColor})`,
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {title}
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto opacity-90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.9 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default ClosingStatement;

