import React from 'react';
import { Palette, FileText, HelpCircle, Settings, Plus } from 'lucide-react';
import type { ModeOption } from './types';
import type { EditableComponent } from '@/types/editorial';

// Component detail imports
import { carouselHeroDetails } from "@/components/designs/herobanners/carouselHero";
import { experienceCardDetails } from "@/components/designs/contentPieces/experienceCard";
import { textAndListDetails } from "@/components/designs/textComponents/textAndList";
import { featureBoxesDetails } from "@/components/designs/textComponents/featureBoxes";
import { accordionDetails } from "@/components/designs/textComponents/accordion";
import { gridCarouselDetails } from "@/components/designs/carousels/gridCarousel";
import { testimonials3Details } from "@/components/designs/testimonials/testimonials3";
import { contactCloserDetails } from "@/components/designs/misc/contactCloser";
import { bgImageHeroDetails } from "@/components/designs/herobanners/bgImageHero";
import { imageTextPointsDetails } from "@/components/designs/contentPieces/imageTextPoints";
import { processStepsDetails } from "@/components/designs/textComponents/processSteps";
import { uniqueValuePropositionDetails } from "@/components/designs/textComponents/uniqueValueProposition";
import { imageTextBoxDetails } from "@/components/designs/contentPieces/imageTextBox";
import { closingStatementDetails } from "@/components/designs/contentPieces/closingStatement";

// Mode options configuration
export const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'colors',
    label: 'Edit Colors',
    icon: React.createElement(Palette, { className: "w-5 h-5" }),
    description: 'Change colors and styles',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'text',
    label: 'Edit Text',
    icon: React.createElement(FileText, { className: "w-5 h-5" }),
    description: 'Update content and copy',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'general',
    label: 'General Question',
    icon: React.createElement(HelpCircle, { className: "w-5 h-5" }),
    description: 'Ask about website building',
    collection: 'general-website-knowledge',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'modify-component',
    label: 'Modify Component',
    icon: React.createElement(Settings, { className: "w-5 h-5" }),
    description: 'Change component structure',
    collection: 'component-knowledge',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'new-component',
    label: 'Make New Component',
    icon: React.createElement(Plus, { className: "w-5 h-5" }),
    description: 'Create a new component',
    collection: 'component-knowledge',
    color: 'from-indigo-500 to-purple-500',
  },
];

// Map component types to their details
export const COMPONENT_DETAILS_MAP: Record<string, EditableComponent> = {
  carouselHero: carouselHeroDetails,
  experienceCard: experienceCardDetails,
  textAndList: textAndListDetails,
  featureBoxes: featureBoxesDetails,
  accordion: accordionDetails,
  gridCarousel: gridCarouselDetails,
  testimonials3: testimonials3Details,
  contactCloser: contactCloserDetails,
  bgImageHero: bgImageHeroDetails,
  imageTextPoints: imageTextPointsDetails,
  processSteps: processStepsDetails,
  uniqueValueProposition: uniqueValuePropositionDetails,
  imageTextBox: imageTextBoxDetails,
  closingStatement: closingStatementDetails,
};
