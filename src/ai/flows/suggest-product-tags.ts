'use server';

/**
 * @fileOverview A product tag suggestion AI agent.
 *
 * - suggestProductTags - A function that suggests relevant tags for product descriptions.
 * - SuggestProductTagsInput - The input type for the suggestProductTags function.
 * - SuggestProductTagsOutput - The return type for the suggestProductTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductTagsInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product for which tags are to be suggested.'),
});
export type SuggestProductTagsInput = z.infer<typeof SuggestProductTagsInputSchema>;

const SuggestProductTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the product description.'),
});
export type SuggestProductTagsOutput = z.infer<typeof SuggestProductTagsOutputSchema>;

export async function suggestProductTags(input: SuggestProductTagsInput): Promise<SuggestProductTagsOutput> {
  return suggestProductTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductTagsPrompt',
  input: {schema: SuggestProductTagsInputSchema},
  output: {schema: SuggestProductTagsOutputSchema},
  prompt: `You are an SEO expert specializing in e-commerce product descriptions.

  Given the following product description, suggest 10 relevant tags to improve SEO and discoverability. Return the tags as a JSON array of strings.

  Product Description: {{{productDescription}}}`,
});

const suggestProductTagsFlow = ai.defineFlow(
  {
    name: 'suggestProductTagsFlow',
    inputSchema: SuggestProductTagsInputSchema,
    outputSchema: SuggestProductTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
