import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { googleCloud } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [googleAI(), googleCloud()],
  model: 'googleai/gemini-2.0-flash',
});
