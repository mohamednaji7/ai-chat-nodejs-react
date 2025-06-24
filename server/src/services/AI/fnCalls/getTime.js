import dotenv from 'dotenv';
dotenv.config();

import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

// Function metadata
const funInfo = {
  name: 'get_current_time',

  description: "Get the current time in the specified time zone",

  parameters : z.object({
        time_zone: z.string().describe('The IANA time zone string, e.g., "Africa/Cairo", "America/New_York", or "UTC"'),
    })

};

// Core logic
const functionExecution = async ({ time_zone }) => {
  console.log(funInfo.name, ' | ', {time_zone});

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: time_zone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const timeNow = formatter.format(new Date());

  console.log(funInfo.name, '|', { time_zone, timeNow });

  return {
    time: timeNow,
    time_zone,
  };
};

// Execution wrapper
const functionCall = async (args, session) => {
  console.log('functionCall', funInfo.name, session);

  // Execute
  const result = await functionExecution({ ...args });

  // Return
  return result;
};

// Export as OpenAI-compatible tool
export default {
  functionImpl: functionCall,
  openai_tool: zodFunction(funInfo),
};
