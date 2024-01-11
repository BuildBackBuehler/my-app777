"use client"

import * as React from "react"
import { cn } from "utils"
import { ComponentConfig } from "types/Config";
import getClassNameFactory from "lib/get-class-name-factory";
import { AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"
import { ArrayField } from '../../types/Config';
import AccordionContent from '@radix-ui/react-accordion';

const getClassName = getClassNameFactory("accordion", "accordion-style");

// <FieldLabel label={field.label}>
// <input {/*...*/} />
// </FieldLabel>

export type AccordionItemProps = {
   value: string;
   className: string;
};

export type AccordiongTriggerProps = {
   className: string;
   ChevronDown: {
      className: string;
   };
};

export type AccordionContentProps = {
   className: string;
   children: {
      Content: string;
      className: string;
   };
};

export type AccordionProps = { 
   accordiontype: "single" | "multiple";
   orientation?: "horizontal" | "vertical";
   Section: {
   AccordionItemProps;
   AccordionTriggerProps;
   AccordionContentProps;
   }[];
};

const AccordionItem  = {
   fields: {
      value: {
         type: "text",
      },
      className: {
         type: "utility",
      },
   },
};

const AccordionTrigger = {
   fields: {
      className: { type: "utility" },
      ChevronDown: {
         type: "object",
         fields: {
            className: { type: "utility" },
         },
      },
   },
};

const AccordionContent = {
   fields: {
      className: {
         type: "utility",
      },
      children: {
         type: "object",
         fields: {
            Content: {
               type: "textarea",
            },
            className: {
               type: "utility",
            },
         },
      },
   },
};

export const Accordion: ComponentConfig<AccordionProps> = {
   fields: {
      accordiontype: {
         type: "select",
         options: [ 
            { label: "single", value: "single"},
            { label: "multiple", value: "multiple"},
         ],
      },
      orientation: {
         type: "select",
         options: [ 
            { label: "horizontal", value: "horizontal"},
            { label: "vertical", value: "vertical"},
         ],
      },
      Section: {
         type: "array",
         arrayFields: {
               AccordionItemProps,
               AccordionTriggerProps,
               AccordionContentProps,
                     },
                  },
               },
            },
         },
      },
   },
   render: ({ accordiontype, orientation, Section }) => {
         return (
           <div className={getClassName({ [accordiontype]: accordiontype })}>
            <div className={getClassName({ [orientation]: orientation })}>,
            <div className={getClassName(Section)}>
               Section.map((section, i) => (
               <section
               key={i}
               AccordionItemProps 
               >


// export type AccordionProps = { 
//    accordiontype: "single" | "multiple";
//    orientation?: "horizontal" | "vertical";
//    AccordionItemProps: {
//       value: string;
//       className: string;
//       AccordionTrigger: {
//          className: string;
//          ChevronDown: {
//             className: string;
//          };
//       };
//       AccordionContentProps: {
//          className: string;
//          children: {
//             Content: string;
//             className: string;
//          };
//       };
//    }[]; 
    
 };


//TODO remember to add field label for type. Multi. means multiple section items can be open.

// export type AccordionProps = { 
// asChild: boolean;
// type: "single" | "multiple";
//    single: {
//    value: string;
//    defaultValue: string;
//    onValueChange: (value: string) => void;
//    }[];
//    multiple: {
//       value: string[];
// defaultValue: string[];
// onValueChange: (value: string[]) => void;
//    }[];
// collapsible: boolean;
// disabled: boolean;
// dir: "ltr" | "rtl";
// orientation?: "horizontal" | "vertical";

// };