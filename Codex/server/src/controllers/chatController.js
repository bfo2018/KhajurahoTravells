import Car from "../models/Car.js";
import { faqSeedData } from "../services/seedData.js";
import { env } from "../config/env.js";
import { generateChatReply } from "../services/chatbotService.js";

export async function sendChatMessage(req, res, next) {
  try {
    const cars = await Car.find().sort({ pricePerKm: 1 });
    const reply = await generateChatReply({
      message: req.body.message,
      cars,
      faqs: faqSeedData,
      defaultRatePerKm: env.defaultRatePerKm
    });
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}
