"use client"

import * as React from "react"
import { cn } from "utils"
import { ComponentConfig } from "types/Config";
import getClassNameFactory from "lib/get-class-name-factory";
import { AccordionItem, AccordionTrigger, AccordionContent } from "../accordion"
import { ArrayField } from '../../../types/Config';

const getClassName = getClassNameFactory("accordion", "accordion-style");

// <FieldLabel label={field.label}>
// <input {/*...*/} />
// </FieldLabel>

export type AccordiongTriggerProps = {
   className: string;
   ChevronDown: {
      className: string;
   };
};

export type AccordionProps = { 
   accordiontype: "single" | "multiple";
   orientation?: "horizontal" | "vertical";
   AccordionItemProps: {
      value: string;
      className: string;
      AccordionTrigger

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

 export const Accordion: ComponentConfig<AccordionProps> = {
   fields: {
      accordiontype: {
         type: "radio",
         options: [ 
            { label: "single", value: "single"},
            { label: "multiple", value: "multiple"},
         ],
      },
      orientation: {
         type: "radio",
         options: [ 
            { label: "horizontal", value: "horizontal"},
            { label: "vertical", value: "vertical"},
         ],
      },
      AccordionItemProps: {
         type: "array",
         getItemSummary: (item) => item.value || "Section",
         arrayFields: {
            value: { type: "text" },
            className: { type: "text" },
            AccordionTriggerProps: {
               type: "array",
               arrayFields: {
                  className: { type: "text" },
                  ChevronDown: {
                     type: "object",
                     fields: { className: { type: "text" }, },
                  },
               },
            },
            AccordionContentProps: {
               type: "array",
               arrayFields: {
                  className: { type: "text" },
                  Children: {
                     type: "object",
                     fields: { 
                        Content: { type: "textarea" },
                        className: { type: "text" },
                     },
                  },
               },
            },
         },
      },
   },
      render: ({ accordiontype, orientation, AccordionItemProps }) => {
         return (
           <div className={getClassName({ [accordiontype]: accordiontype })}>
            <div className={getClassName({ [orientation]: orientation })}>,
            <div className={getClassName("item-1")}>
               {AccordionItemProps.map((section, i) => (
               <section
               key={i}
               AccordionTriggerProps={(className: "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",)}
               variant={button.variant}
               size="large"
               >
               {button.label}
               </section>
            ))}

 
         );
      } 

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