import OpenAI from "openai";
import { env } from "../config/env.js";

const openAiClient = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

function buildFallbackReply(message, context) {
  const lower = message.toLowerCase();

  if (lower.includes("price") || lower.includes("km")) {
    return `Our current pricing starts around Rs. ${context.defaultRatePerKm} per km. Innova, Kia Seltos, Ertiga and Scorpio N rates can vary slightly by route and minimum booking distance.`;
  }

  if (lower.includes("best car") || lower.includes("family")) {
    return "Toyota Innova is best for family and group travel, Kia Seltos works well for couples or executive trips, Ertiga is a strong budget family option, and Scorpio N is ideal for premium road presence.";
  }

  if (lower.includes("khajuraho") || lower.includes("panna")) {
    return "We cover Khajuraho temples, Panna National Park, Raneh Falls, airport pickup, hotel transfer, and outstation travel with multilingual drivers.";
  }

  return "I can help with car pricing, booking steps, vehicle suggestions, and travel planning for Khajuraho and Panna. Share your route, date, and passenger count for a better recommendation.";
}

function buildSystemPrompt(context) {
  return [
    "You are the booking assistant for Khajuraho Roads, a tour and travels company in Khajuraho and Panna, Madhya Pradesh, India.",
    "Answer politely and briefly.",
    "Use the provided business context only.",
    "If the user wants to book, ask only for the missing details needed to continue the booking.",
    "Do not claim a booking is confirmed unless the app explicitly confirms it.",
    "When pricing is requested, mention the default price rule and recommend the most suitable car.",
    `Pricing baseline: Rs. ${context.defaultRatePerKm} per km unless a car has a specific rate.`,
    `Cars: ${JSON.stringify(context.cars)}`,
    `FAQs: ${JSON.stringify(context.faqs)}`
  ].join(" ");
}

async function generateOpenAiReply(systemPrompt, message, context) {
  if (!openAiClient) {
    return buildFallbackReply(message, context);
  }

  const response = await openAiClient.responses.create({
    model: env.openAiModel,
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ]
  });

  return response.output_text || buildFallbackReply(message, context);
}

async function generateOllamaReply(systemPrompt, message, context) {
  const response = await fetch(`${env.ollamaBaseUrl}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.ollamaModel,
      prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.response?.trim() || buildFallbackReply(message, context);
}

export async function generateChatReply({ message, cars, faqs, defaultRatePerKm }) {
  const context = {
    defaultRatePerKm,
    cars: cars.map((car) => ({
      name: car.name,
      pricePerKm: car.pricePerKm,
      seats: car.seatingCapacity,
      ac: car.ac,
      summary: car.summary
    })),
    faqs
  };

  const systemPrompt = buildSystemPrompt(context);

  try {
    if (env.aiProvider === "ollama") {
      return await generateOllamaReply(systemPrompt, message, context);
    }

    return await generateOpenAiReply(systemPrompt, message, context);
  } catch (error) {
    console.error(`Chat provider "${env.aiProvider}" failed:`, error.message);
    return buildFallbackReply(message, context);
  }
}
