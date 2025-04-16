import OpenAI from "openai";

// CONFIG
import dotenv from 'dotenv';
dotenv.config();

import { getCompletion } from "../services/GeminiAzureOpenAI.js";

console.log( await getCompletion('hi'))