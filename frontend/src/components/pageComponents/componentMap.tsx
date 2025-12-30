import React from "react";
import { EditorialComponentProps } from "@/types/templateTypes";

// Imported components
import CarouselHeroEdit from "@/components/designs/herobanners/carouselHero/carouselHeroEdit";
import ExperienceCardEdit from "@/components/designs/contentPieces/experienceCard/experienceCardEdit";
import TextAndListEdit from "@/components/designs/textComponents/textAndList/textAndListEdit";
import FeatureBoxesEdit from "@/components/designs/textComponents/featureBoxes/featureBoxesEdit";
import AccordionEdit from "@/components/designs/textComponents/accordion/accordionEdit";
import GridCarouselEdit from "@/components/designs/carousels/gridCarousel/gridCarouselEdit";
import Testimonials3Edit from "@/components/designs/testimonials/testimonials3/testimonials3Edit";
import ContactCloserEdit from "@/components/designs/misc/contactCloser/contactCloserEdit";
import BgImageHeroEdit from "@/components/designs/herobanners/bgImageHero/bgImageHeroEdit";
import ImageTextPointsEdit from "@/components/designs/contentPieces/imageTextPoints/imageTextPointsEdit";
import ProcessStepsEdit from "@/components/designs/textComponents/processSteps/processStepsEdit";
import UniqueValuePropositionEdit from "@/components/designs/textComponents/uniqueValueProposition/uniqueValuePropositionEdit";
import ImageTextBoxEdit from "@/components/designs/contentPieces/imageTextBox/imageTextBoxEdit";
import ClosingStatementEdit from "@/components/designs/contentPieces/closingStatement/closingStatementEdit";

export const componentMap: Record<string, React.ComponentType<EditorialComponentProps>> = {
  carouselHero: CarouselHeroEdit,
  experienceCard: ExperienceCardEdit,
  textAndList: TextAndListEdit,
  featureBoxes: FeatureBoxesEdit,
  accordion: AccordionEdit,
  gridCarousel: GridCarouselEdit,
  testimonials3: Testimonials3Edit,
  contactCloser: ContactCloserEdit,
  bgImageHero: BgImageHeroEdit,
  imageTextPoints: ImageTextPointsEdit,
  processSteps: ProcessStepsEdit,
  uniqueValueProposition: UniqueValuePropositionEdit,
  imageTextBox: ImageTextBoxEdit,
  closingStatement: ClosingStatementEdit,
};

/**
 * Creates a render function that maps component types to their editorial components
 */
export function createRenderComponent() {
  return (component: any) => {
    // Hardcoded skip for removed samuraiCard component
    if (component.type === "samuraiCard") {
      console.warn(`Skipping removed component type: samuraiCard`);
      return null;
    }

    const Component = componentMap[component.type];
    if (!Component) {
      console.warn(`Unknown component type: ${component.type}`);
      return (
        <div className="p-4 border-2 border-dashed border-red-300 rounded-lg text-center">
          <p className="text-red-500 text-sm">
            Component <code className="bg-red-100 px-2 py-1 rounded">{component.type}</code> not found
          </p>
        </div>
      );
    }
    return <Component id={component.id} />;
  };
}

export default componentMap;
