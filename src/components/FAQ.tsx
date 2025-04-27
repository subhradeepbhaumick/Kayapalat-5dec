'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useState } from "react"

type FAQ = {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQ({ faqs }: FAQAccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null)

  const handleToggle = (value: string) => {
    setOpenItem(prev => (prev === value ? null : value))
  }

  return (
    <div className="w-full px-6 md:px-16 py-12 bg-[#D2EBD0]">
      <h2
        className="text-4xl md:text-6xl text-[#00423D] text-center stroke-text mb-15"
        style={{
          WebkitTextStroke: '1px black',
          fontFamily: "'Abril Fatface', cursive",
        }}
      >
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="space-y-4 w-full max-w-5xl mx-auto">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-none"
          >
            <AccordionTrigger
              className="flex justify-between items-center text-left p-6 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all w-full text-[#00423D]  stroke-text no-underline cursor-pointer"
              onClick={() => handleToggle(`item-${index}`)}
              style={{
                fontFamily: "'Abril Fatface', cursive",
                fontSize: '1.5rem',
                textDecoration: 'none'
              }}
            >
              {faq.question}
              <motion.span
                animate={{ rotate: openItem === `item-${index}` ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
              </motion.span>
            </AccordionTrigger>

            <AccordionContent
              className="px-6 pb-6  text-gray-700  bg-white/10 rounded-b-xl text-justify"
              style={{
                fontSize: '1.25rem',
                color: '#00423D'
              }}
            >
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
