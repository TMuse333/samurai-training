"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ImageProp } from "@/types";

export interface BgImageHeroProdProps {
  title: string;
  description: string;
  images: {
    main: ImageProp;
  };
}

const BgImageHero: React.FC<BgImageHeroProdProps> = (props) => {
  const {
    title,
    description,
    images,
  } = props;

  const mainImg = images.main;

  return (
    <header
      className="w-screen min-h-[500px] h-[75vh] text-center text-gray-200 relative flex flex-col items-center justify-center transition-colors duration-1000"
      role="banner"
    >
      <Image
        className="w-full h-full object-cover absolute z-[1] brightness-[0.5]"
        src={mainImg.src}
        alt={mainImg.alt}
        priority
        width={600}
        height={1300}
      />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.3, delayChildren: 0.2 }}
        className="text-left w-4/5 relative z-[2]"
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="text-xl mt-4 sm:text-2xl md:text-3xl"
        >
          {description}
        </motion.h2>
      </motion.section>
    </header>
  );
};

export default BgImageHero;

