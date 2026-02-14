
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found in environment.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Define tool declarations for Gemini
export const tools: FunctionDeclaration[] = [
  {
    name: "navigate",
    description: "Change the current page or section of the website.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        sectionId: {
          type: Type.STRING,
          description: "The ID of the section to navigate to ('dashboard', 'education', 'contact').",
        },
      },
      required: ["sectionId"],
    },
  },
  {
    name: "scrollToElement",
    description: "Scroll the page to a specific element identified by a CSS selector.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        selector: {
          type: Type.STRING,
          description: "The CSS selector of the element (e.g., '#proj-mern-1' or '#edu-be').",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "highlightElement",
    description: "Visually highlight an element on the page to show it to the user.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        selector: {
          type: Type.STRING,
          description: "The CSS selector of the element to highlight.",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "fillForm",
    description: "Fill a specific field in the contact form.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        field: {
          type: Type.STRING,
          description: "The name of the field ('name', 'email', 'message').",
        },
        value: {
          type: Type.STRING,
          description: "The text value to input.",
        },
      },
      required: ["field", "value"],
    },
  },
  {
    name: "clickElement",
    description: "Simulate a click on a button or link.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        selector: {
          type: Type.STRING,
          description: "The CSS selector of the element to click.",
        },
      },
      required: ["selector"],
    },
  }
];

export const getAssistantResponse = async (prompt: string, context: string, history: any[] = []) => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are Alex's Personal Portfolio Assistant. Your primary goal is to answer questions about Alex's background using the provided data.

REQUIRED RESPONSE STRUCTURE:
1. VERBAL ANSWER: You MUST first provide a complete, conversational sentence that answers the user's question with specific numbers or names from the context.
2. ACTION: Then, call the relevant tool to navigate or highlight the information.

DO NOT RESPOND WITH ONLY A TOOL CALL.
DO NOT RESPOND WITH GENERIC TEXT.

EXAMPLES:
User: "What is my 10th percentage?"
Your Response: "Your 10th grade percentage was 79% from Godavari English Medium CBSE School. I'm highlighting it in the education section for you now!" [Call navigate(sectionId: 'education'), Call highlightElement(selector: '#edu-10th')]

User: "How many React Native projects?"
Your Response: "You have 2 React Native projects: FitTrack Pro and GeoSafe. Let me show you where they are on the dashboard." [Call navigate(sectionId: 'dashboard'), Call highlightElement(selector: '#proj-rn-1'), Call highlightElement(selector: '#proj-rn-2')]

ALEX'S DATA (CONFIRM FROM CONTEXT):
- Education: 10th (79%, CBSE), 12th (75%, Maharashtra Board), BE CS (9.02 CGPA).
- Projects: AIML (Neural Vision Engine, NLP Sentiment Bot), MERN (Eco-Marketplace, DevFlow Social), React Native (FitTrack Pro, GeoSafe).

CURRENT PAGE CONTEXT:
${context}

Always extract the facts and speak them to the user.`,
        tools: [{ functionDeclarations: tools }],
      }
    });

    const response = await chat.sendMessage({ message: prompt });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
