"use server";

import { suggestProductTags, type SuggestProductTagsOutput } from '@/ai/flows/suggest-product-tags';

export interface SuggestTagsState {
  tags?: string[];
  error?: string;
  description?: string;
}

export async function handleSuggestTags(
  prevState: SuggestTagsState,
  formData: FormData,
): Promise<SuggestTagsState> {
  const productDescription = formData.get('description') as string;
  
  if (!productDescription || productDescription.trim().length < 10) {
    return { error: 'Please enter a product description of at least 10 characters.', description: productDescription };
  }

  try {
    const result: SuggestProductTagsOutput = await suggestProductTags({ productDescription });
    return { tags: result.tags, description: productDescription };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to suggest tags. Please try again later.', description: productDescription };
  }
}
