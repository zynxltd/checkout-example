import type { IDefinition } from "@tripetto/runner";

/**
 * Hand-authored form definition for the Plant Match quiz.
 * In production this JSON would come from the Tripetto builder
 * (or Studio / CLI) after designing the form with custom blocks.
 */
export const plantMatchDefinition: IDefinition = {
  name: "Plant Match",
  description: "Find plants that suit your garden light and space.",
  language: "en",
  builder: {
    name: "tripetto",
    version: "6.2.1",
  },
  prologue: {
    title: "Find your plant match",
    description:
      "Two quick questions — sun and space — then we’ll suggest a planting direction.",
  },
  sections: [
    {
      id: "sec-sun",
      name: "Sun",
      nodes: [
        {
          id: "node-sun",
          name: "How much sun does the spot get?",
          description: "Pick the option that best matches a typical summer day.",
          nameVisible: true,
          block: {
            type: "sun-exposure",
            version: "1.0.0",
          },
          slots: [
            {
              id: "slot-sun",
              type: "string",
              kind: "static",
              reference: "value",
              label: "Sun exposure",
              alias: "sun",
              required: true,
              exportable: true,
            },
          ],
        },
      ],
    },
    {
      id: "sec-space",
      name: "Space",
      nodes: [
        {
          id: "node-space",
          name: "What space are you planting in?",
          description: "This helps us size the recommendation.",
          nameVisible: true,
          block: {
            type: "garden-space",
            version: "1.0.0",
          },
          slots: [
            {
              id: "slot-space",
              type: "string",
              kind: "static",
              reference: "value",
              label: "Garden space",
              alias: "space",
              required: true,
              exportable: true,
            },
          ],
        },
      ],
    },
    {
      id: "sec-email",
      name: "Email",
      nodes: [
        {
          id: "node-email",
          name: "Where should we send your shortlist?",
          description: "Optional — leave blank to see results on screen only.",
          nameVisible: true,
          placeholder: "you@example.com",
          block: {
            type: "email-capture",
            version: "1.0.0",
          },
          slots: [
            {
              id: "slot-email",
              type: "string",
              kind: "static",
              reference: "value",
              label: "Email",
              alias: "email",
              required: false,
              exportable: true,
            },
          ],
        },
      ],
    },
  ],
  epilogue: {
    title: "You’re matched",
    description:
      "Thanks — your answers are ready. In a real shop flow we’d open a curated collection next.",
  },
};
