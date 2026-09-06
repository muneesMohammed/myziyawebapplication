import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const faqsData: FaqItem[] = [
  {
    question: "How should I apply the perfume?",
    answer:
      "Apply a small amount to pulse points such as your wrists, neck and behind your ears. Avoid rubbing the fragrance after applying it.",
  },
  {
    question: "How long does the fragrance last?",
    answer:
      "Wear time depends on skin type, weather and application. Applying to moisturized skin can help the fragrance last longer.",
  },
  {
    question: "Where should I store my perfume?",
    answer:
      "Store it upright, tightly closed and away from direct sunlight, heat and humidity to preserve the scent quality.",
  },
  {
    question: "Can I use this fragrance every day?",
    answer:
      "Yes. Use a light application for daytime wear and add a little more for evenings or special occasions.",
  },
  {
    question: "Is the fragrance suitable as a gift?",
    answer:
      "Yes. The fragrance makes a thoughtful gift for anyone who enjoys refined, long-lasting scents.",
  },
  {
    question: "What are the shipping and return options?",
    answer:
      "Delivery times and charges are shown at checkout. Unopened products can be returned according to the store's return policy.",
  },
];

const FaqContent = () => {
  return (
    <section>
      <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
        Frequently asked questions
      </h3>
      <Accordion type="single" collapsible>
        {faqsData.map((faq, idx) => (
          <AccordionItem key={idx} value={`item-${idx + 1}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FaqContent;
