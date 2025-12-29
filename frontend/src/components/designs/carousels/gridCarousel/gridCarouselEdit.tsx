"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "react-feather";
import Image from "next/image";
import { EditorialComponentProps, CarouselItem, GradientConfig } from "@/types/editorial";
import { useComponentEditor } from "@/context/context";

import {
  handleComponentClick,
  useSyncColorEdits,
  useSyncLlmOutput,
  useSyncPageDataToComponent,
} from "@/lib/hooks/hooks";
import useWebsiteStore from "@/stores/websiteStore";
import { gridCarouselDetails, GridCarouselProps, defaultGridCarouselProps } from ".";
import { deriveColorPalette, useAnimatedGradient } from "@/lib/colorUtils";
import { useIsMobile } from "@/lib/hooks/isMobile";
import {  useCarouselStore } from "@/stores/carouselStore";
import EditableTextField from "@/components/editor/editableTextField/editableTextArea";


const GridCarouselEdit: React.FC<EditorialComponentProps> = ({ id }) => {
  const [componentProps, setComponentProps] = useState<Partial<GridCarouselProps>>({});

  const carousels = useCarouselStore((state) => state.carousels);
  const addCarousel = useCarouselStore((state) => state.addCarousel);
  const carouselItemsFromStore = useCarouselStore((s) => s.carousels[id]);
  const carouselItems = carouselItemsFromStore || [];

  const editableFieldsId = {
    ...gridCarouselDetails,
    id: id,
  };

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
  const currentPageSlug = useWebsiteStore((state) => state.currentPageSlug);

  // Merge with defaults to ensure all required props exist
  const propsWithDefaults = { ...defaultGridCarouselProps, ...componentProps };

  // Extract title, description, subTitle
  const title = propsWithDefaults.title;
  const description = propsWithDefaults.description;
  const subTitle = propsWithDefaults.subTitle;

  // Ensure items array is never empty - use store items if available, otherwise defaults
  const safeItems = (carouselItems.length > 0 ? carouselItems : propsWithDefaults.items.length > 0 ? propsWithDefaults.items : defaultGridCarouselProps.items);

  useEffect(()=>{
    addCarousel(id, safeItems)
  },[id, addCarousel, safeItems])
  
  
  const isMobile = useIsMobile(768)

  
  // Carousel state (matching production)
  const [shift, setShift] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [leftClicked, setLeftClicked] = useState<boolean>(false);
  const [leftEdgeShift, setLeftEdgeShift] = useState<number>(-100);
  const [leftEdgeCase, setLeftEdgeCase] = useState<boolean>(true);
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const [rightEdgeShift, setRightEdgeShift] = useState<number>(0);
  const [isCoolDown, setIsCoolDown] = useState(false);
  const [carouselClicked, setCarouselClicked] = useState(false);
  const [gridClicked, setGridClicked] = useState(false);

  // Safe color fallbacks
  const safeTextColor = propsWithDefaults.textColor ?? defaultGridCarouselProps.textColor;
  const safeBaseBgColor = propsWithDefaults.baseBgColor ?? defaultGridCarouselProps.baseBgColor;
  const safeMainColor = propsWithDefaults.mainColor ?? defaultGridCarouselProps.mainColor;
  const safeBgLayout = propsWithDefaults.bgLayout ?? defaultGridCarouselProps.bgLayout;

  const colors = deriveColorPalette(
    { textColor: safeTextColor, baseBgColor: safeBaseBgColor, mainColor: safeMainColor, bgLayout: safeBgLayout },
    safeBgLayout.type
  );
  const backgroundImage = useAnimatedGradient(safeBgLayout as GradientConfig, colors);
  const coolDownTime = 1000;



  const onClick = () => {
    handleComponentClick({
      currentComponent: currentComponent!,
      componentDetails: editableFieldsId,
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

  


  const updateProp = <K extends keyof GridCarouselProps>(
    key: K,
    value: GridCarouselProps[K]
  ) => {
    setComponentProps((prev) => ({ ...prev, [key]: value }));
    updateComponentProps(currentPageSlug, id, { [key]: value });
  };

  useSyncLlmOutput(
    currentComponent?.name,
    "GridCarousel",
    setComponentProps,
    LlmCurrentTextOutput,
    setLlmCurrentTextOutput,
    gridCarouselDetails?.editableFields
  );

  useSyncColorEdits(
    currentComponent?.name,
    "GridCarousel",
    setComponentProps,
    currentColorEdits
  );

  useSyncPageDataToComponent(id, "GridCarousel", setComponentProps);

  // Carousel navigation
  function handleCarouselClick(index: number | null) {
    if (index !== null) {
      setGridClicked(true);
      setCarouselClicked(true);
      setCurrentImage(index);
      setShift(-index);
    } else {
      setCarouselClicked(false);
    }
  }

  useEffect(() => {
    if (leftClicked || rightClicked) {
      setGridClicked(false);
    }
  }, [leftClicked, rightClicked]);

  function handlePrevClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isCoolDown) return;
    setGridClicked(false);
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

  function handleNextClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isCoolDown) return;
    setGridClicked(false);
    setRightClicked(true);
    setLeftClicked(false);

    if (shift === -safeItems.length + 1) {
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
      console.warn("carousel wrapping!");
    }

    if (leftEdgeCase && rightClicked) {
      setLeftEdgeCase(false);
    }

    if (shift === -safeItems.length + 1) {
      setCurrentImage(safeItems.length - 1);
      setRightEdgeShift(100);
    } else {
      setRightEdgeShift(shift * 100);
    }

    if (leftEdgeCase === true && leftClicked === true) {
      setLeftEdgeCase(false);
      setCurrentImage(safeItems.length - 1);
      setShift(-safeItems.length + 1);
      setLeftEdgeShift(0);
    }

    if (shift === 0) {
      setLeftEdgeShift(-100);
      setCurrentImage(0);
    } else {
      setLeftEdgeShift(shift * 100 + 100 * (safeItems.length - 1));
    }
  }, [leftEdgeCase, shift, currentImage, leftClicked, rightClicked, safeItems.length]);

  const shouldApplyTransition = (index: number) => {
    if (gridClicked) {
      return false;
    }
    return !(
      (index === 0 && rightEdgeShift === 100 && !leftClicked) ||
      (index === safeItems.length - 1 && leftEdgeShift === -100 && !rightClicked) ||
      (shift === -safeItems.length + 1 && leftClicked && !(index === 0 || index === safeItems.length - 1)) ||
      (rightEdgeShift === -100 && index === 0 && !rightClicked) ||
      (leftEdgeShift === 100 && rightClicked && index === safeItems.length - 1) ||
      (shift === 0 && rightClicked && index !== 0 && index !== safeItems.length - 1) ||
      (shift === -1 && rightClicked && index === safeItems.length - 1) ||
      (shift === -safeItems.length + 2 && index === 0 && leftClicked)
    );
  };

  if (safeItems.length === 0) {
    return (
      <motion.section
        onClick={onClick}
        style={{ background: backgroundImage, color: colors.textColor }}
        className="w-full py-20 px-6 min-h-[400px] flex items-center justify-center"
      >
        <div className="text-center">
          <p className="text-2xl mb-4">📸</p>
          <p className="text-lg font-semibold">No images in carousel</p>
          <p className="text-sm text-gray-500">Add images using the Carousel Editor</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      onClick={onClick}
      style={{ background: backgroundImage }}
      className="w-full"
    >
      {(title || description || subTitle) && (
        <div className="text-center mb-8 px-4 flex flex-col items-center justify-center
        text-center mx-auto" onClick={(e) => e.stopPropagation()}>
          {subTitle && (
            <EditableTextField
              value={subTitle ?? ""}
              onChange={(val) => updateProp("subTitle", val)}
              placeholder="Subtitle"
              className="text-sm font-medium mb-2"
              fieldKey="subTitle"
              componentId={id}
              style={{ color: colors.textColor ?? safeTextColor }}
            />
          )}
          {title && (
            <EditableTextField
            isTextarea
              value={title ?? ""}
              onChange={(val) => updateProp("title", val)}
              placeholder="Title"
              className="text-3xl sm:text-4xl md:text-5xl mb-4 font-semibold bg-gradient-to-br bg-clip-text text-transparent w-full mx-auto text-center"
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
              className="max-w-2xl mx-auto text-base leading-relaxed md:text-lg w-full"
              fieldKey="description"
              componentId={id}
              style={{ color: colors.textColor ?? safeTextColor }}
              isTextarea
            />
          )}
        </div>
      )}

      {isMobile || carouselClicked ? (
        // Carousel View
        <section
          aria-label="Image carousel"
          className={`w-screen flex flex-col ml-auto mr-auto justify-center items-center md:flex-row mb-5 ${
            !carouselClicked ? "max-w-[1200px] relative" : "bg-black h-[100vh] fixed top-0 left-0 z-[95]"
          }`}
        >
          <div className={`mt-10 ml-auto mr-auto flex relative ${!carouselClicked ? "" : "w-[100%]"}`}>
            <div
              className={`flex relative justify-center items-center ml-auto mr-auto ${
                !carouselClicked
                  ? "w-[98vw] md:max-h-[800px] h-[100vw] max-w-[900px] max-h-[480px] md:max-w-[1400px]"
                  : "w-screen h-[100vh]"
              } overflow-hidden`}
            >
              {safeItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCarouselClick(index)}
                  className={`z-[29] ml-auto mr-auto mb-auto absolute top-0 ${
                    !carouselClicked
                      ? "w-[100vw] h-[90vw] max-h-[480px] md:max-h-[850px]"
                      : "w-[100vw] h-[100vh]"
                  } ${shouldApplyTransition(index) ? "transition-transform duration-1000" : ""}`}
                  role="img"
                  aria-label={item.image.alt}
                  style={{
                    transform: `translateX(${
                      index === safeItems.length - 1
                        ? leftEdgeShift
                        : index === 0
                        ? rightEdgeShift
                        : shift * 100 + 100 * index
                    }%)`,
                  }}
                >
                  <Image
                    width={600}
                    height={1300}
                    alt={item.image.alt}
                    src={item.image.src}
                    className={`${
                      !carouselClicked
                        ? `w-[100%] max-w-[805px] max-h-[624px] md:max-h-[750px] md:max-w-[1200px] ${
                            !item.image.objectCover ? "object-contain" : "object-cover"
                          } z-[29]`
                        : `w-[100vw] max-w-[1400px] ${
                            !item.image.objectCover ? "object-contain" : "object-cover"
                          } ml-auto mr-auto h-[100vh]`
                    } z-[500] relative ml-auto mr-auto`}
                    style={{ objectPosition: "50% 50%" }}
                  />
                </div>
              ))}

              <button
                aria-label="Previous image"
                className={`bg-transparent p-0 absolute left-0 top-[30%] text-white sm:scale-[1.5] text-3xl ${
                  carouselClicked ? "z-[96]" : "z-[30]"
                }`}
                onClick={handlePrevClick}
              >
                <ChevronLeft className="sm:scale-[1.5]" size={40} />
              </button>

              <button
                aria-label="Next image"
                className={`bg-transparent p-0 absolute right-0 top-[30%] text-white sm:scale-[1.5] ${
                  carouselClicked ? "z-[96]" : "z-[30]"
                }`}
                onClick={handleNextClick}
              >
                <ChevronRight className="sm:scale-[1.5]" size={40} />
              </button>
            </div>
          </div>

          {carouselClicked && (
            <button
              className="fixed bottom-[2%] left-[50%] -translate-x-[50%] z-[100] bg-gray-200 p-2 rounded-xl text-black"
              onClick={() => handleCarouselClick(null)}
            >
              Collapse
            </button>
          )}
        </section>
      ) : (
        // Grid View
        <section className="w-screen max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-3 justify-center">
          {safeItems.map((item, index) => (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              key={index}
              className="w-[40vw] md:w-[31vw] object-contain mx-auto max-w-[480px] max-h-[320px] mb-8 hover:scale-[1.1] transition-transform cursor-pointer"
              onClick={() => handleCarouselClick(index)}
              width={600}
              height={1300}
            />
          ))}
        </section>
      )}
    </motion.section>
  );
};

export default GridCarouselEdit;