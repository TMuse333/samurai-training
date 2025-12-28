'use client'

import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import { CarouselItem, GradientConfig } from "@/types";

export interface GridCarouselProdProps {
  items: CarouselItem[];
  title: string;
  description: string;
  subTitle: string;
  textColor: string;
  baseBgColor: string;
  mainColor: string;
  bgLayout: GradientConfig;
}

const GridCarousel: React.FC<GridCarouselProdProps> = (props) => {
  const {
    items,
    title,
    description,
    subTitle,
    textColor,
    baseBgColor,
    mainColor,
    bgLayout,
  } = props;

  const colors = deriveColorPalette(
    { textColor, baseBgColor, mainColor, bgLayout },
    bgLayout.type
  );
  const background = useAnimatedGradient(bgLayout, colors);
  const [shift, setShift] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [leftClicked, setLeftClicked] = useState<boolean>(false);
  const [leftEdgeShift, setLeftEdgeShift] = useState<number>(-100);
  const [leftEdgeCase, setLeftEdgeCase] = useState<boolean>(true);
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const [rightEdgeShift, setRightEdgeShift] = useState<number>(0);
  const [carouselClicked, setCarouselClicked] = useState(false);
  const [isCoolDown, setIsCoolDown] = useState(false);
  const [gridClicked, setGridClicked] = useState(false)

  const coolDownTime = 1000;

  function handleCarouselClick(index: number | null) {
    if (index !== null) {
        setGridClicked(true)
      setCarouselClicked(true);
      setCurrentImage(index);
      setShift(-index);
    } else {
      setCarouselClicked(false);
    }
  }

  useEffect(()=>{
    if(leftClicked || rightClicked){
        setGridClicked(false)
    }
  },[leftClicked, rightClicked])
  

  function handlePrevClick() {
    if (isCoolDown) return;
    setGridClicked(false)
    setLeftClicked(true);
    setRightClicked(false);

    if (shift === 0) {
      setLeftEdgeCase(true);
    } else {
      setShift((prev) => prev + 1);
      setCurrentImage((prev) => prev - 1);
    }

    setIsCoolDown(true);
    setTimeout(() => setIsCoolDown(false), coolDownTime);
  }

  function handleNextClick() {
    if (isCoolDown) return;
    setGridClicked(false)
    setRightClicked(true);
    setLeftClicked(false);
    if (shift === - items.length + 1) {
      setShift(0);
      setCurrentImage(0);
    } else {
      setShift((prev) => prev - 1);
      setCurrentImage((prev) => prev + 1);
    }

    setIsCoolDown(true);
    setTimeout(() => setIsCoolDown(false), coolDownTime);
  }

  useEffect(() => {
 
    if (shift === 0 && rightClicked) {
      console.warn('carousel wrapping!');
    }

    if (leftEdgeCase && rightClicked) {
      setLeftEdgeCase(false);
    }

    if (shift === -items.length + 1) {
      setCurrentImage(items.length - 1);
      setRightEdgeShift(100);
    } else {
      setRightEdgeShift(shift * 100);
    }

    if (leftEdgeCase === true && leftClicked === true) {
      setLeftEdgeCase(false);
      setCurrentImage(items.length - 1);
      setShift(-items.length + 1);
      setCurrentImage(items.length - 1);
      setLeftEdgeShift(0);
    }

    if (shift === 0) {
      setLeftEdgeShift(-100);
      setCurrentImage(0);
    } else {
      setLeftEdgeShift(shift * 100 + 100 * (items.length - 1));
    }

    console.log('shift', shift);
  }, [leftEdgeCase, shift, currentImage, leftClicked, rightClicked, items.length]);

  const shouldApplyTransition = (index: number) => {
    if(gridClicked){
        return false
    }
    return !(
      (index === 0 && rightEdgeShift === 100 && !leftClicked) ||
      (index === items.length - 1 && leftEdgeShift === -100 && !rightClicked) ||
      (shift === -items.length + 1 && leftClicked && !(index === 0 || index === items.length - 1)) ||
      (rightEdgeShift === -100 && index === 0 && !rightClicked) ||
      (leftEdgeShift === 100 && rightClicked && index === items.length - 1) ||
      (shift === 0 && rightClicked && index !== 0 && index !== items.length - 1) ||
      (shift === -1 && rightClicked && index === items.length - 1) ||
      (shift === -items.length + 2 && index === 0 && leftClicked)
    );
  };

  const isMobile = false

  return (
    <>
<motion.section className={`w-full `} style={{ background }}>
      <div className="text-center mb-8 px-4 py-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-sm font-medium mb-2"
          style={{ color: colors.textColor }}
        >
          {subTitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl mb-4 font-semibold bg-gradient-to-br bg-clip-text text-transparent
          py-4
          "
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
          className="max-w-2xl mx-auto text-base leading-relaxed md:text-lg"
          style={{ color: colors.textColor }}
        >
          {description}
        </motion.p>
      </div>

    {isMobile || carouselClicked ? (
      <section
        aria-label="Image carousel"
        className={`w-screen  
          flex flex-col   ml-auto mr-auto
          justify-center items-center md:flex-row 
          mb-5 ${!carouselClicked ? 'max-w-[1200px]  relative' : 'bg-black h-[100vh] fixed top-0 left-0 z-[95]'}`}
      >
        <div
          className={`mt-10 ml-auto mr-auto flex relative ${ !carouselClicked ? '' : 'w-[100%]'} `}
          role="region"
          aria-labelledby="carousel-heading"
        >
          <div
            className={`flex relative justify-center items-center ml-auto mr-auto 
            ${!carouselClicked ? `
              w-[98vw]
              md:max-h-[800px]
              h-[100vw]
              max-w-[900px] 
              max-h-[480px]
              
              md:max-w-[1400px]
            ` : 'w-screen  h-[100vh]'}
            overflow-hidden `}
          >
            {items.map((item, index) => (
              <div
                key={index}
                onClick={()=>handleCarouselClick(index)}
                className={` z-[29]
                ml-auto mr-auto mb-auto absolute top-0
                ${!carouselClicked ? `
                  w-[100vw] h-[90vw]
                  max-h-[480px]
                 
                  md:max-h-[850px]` : 'w-[100vw]  h-[100vh] '}
                  ${shouldApplyTransition(index) ? 'transition-transform duration-1000' : ''}
                `}
                role="img"
                aria-label={item.image.alt}
                style={{
                  transform: `translateX(${index === items.length - 1 ? leftEdgeShift :
                    index === 0 ? rightEdgeShift :
                      (shift * 100) + (100 * index)}%)`,
                }}
              >
                <Image
                width={600}
                height={1300}
                onClick={()=>handleCarouselClick(index)}
                  alt={item.image.alt}
                  src={item.image.src}
                  className={`
                    ${!carouselClicked ? ` w-[100%] 
                      max-w-[805px]
                      max-h-[624px]
                      md:max-h-[750px]
                      md:max-w-[1200px]
                      ${!item.image.objectCover ? 'object-contain' : 'object-cover'}
                      z-[29]
                      
                     `
                      : `w-[100vw] 
                      max-w-[1400px] 
                      ${!item.image.objectCover ? 'object-contain' : 'object-cover'}
                       ml-auto mr-auto h-[100vh]
                       
                      
                    `}
                      z-[500] relative
                    ml-auto mr-auto`}
                    style={{
                      objectPosition:'50% 50%' 
                    }}
                    
                />
              </div>
            ))}
 
                    <div className='h-full w-full absolute top-0
                    '
                    />
           
           <button aria-label="Previous image"
        className={`bg-transparent p-0 absolute left-0 top-[30%] text-white sm:scale-[1.5] 
                   text-3xl ${carouselClicked ? 'z-[96]' : 'z-[30]'}`}
        onClick={handlePrevClick}>
  <ChevronLeft className='sm:scale-[1.5]' size={40} />
</button>

<button aria-label="Next image"
        className={`bg-transparent p-0 absolute right-0 top-[30%] text-white sm:scale-[1.5] 
                   ${carouselClicked ? 'z-[96]' : 'z-[30]'}`}
        onClick={handleNextClick}>
  <ChevronRight className='sm:scale-[1.5]' size={40} />
</button>

           
          </div>
        </div>
      
        {carouselClicked && (
          <button
            className='fixed bottom-[2%] left-[50%] -translate-x-[50%] z-[100] bg-gray-200 p-2 rounded-xl text-black'
            onClick={()=>handleCarouselClick(null)}
          >
            Collapse
          </button>
        )}
      </section>
      ) : (
        <>
        <section className='w-screen max-w-[1800px] mx-auto
        grid grid-cols-2 md:grid-cols-3 justify-center'>
            {items.map((item, index) => (
                <Image src={item.image.src}
                alt={item.image.alt}
                key={index}
                className='w-[40vw] md:w-[31vw] object-contain
                mx-auto max-w-[480px] max-h-[320px]
                mb-8 hover:scale-[1.1] transition-transform'
                onClick={()=>handleCarouselClick(index)}
                width={600}
                height={1300}
                />
            ))}
        </section>
        </>
      ) }
      </motion.section>
    </>
  );
};

export default GridCarousel;

