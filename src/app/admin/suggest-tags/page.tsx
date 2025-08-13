import SuggestTagsForm from "@/components/SuggestTagsForm";

export default function SuggestTagsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
                AI Product Tag Suggestions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                Leverage generative AI to enhance your product's SEO. Our tool analyzes your description to suggest relevant tags, improving discoverability.
            </p>
        </div>
        <SuggestTagsForm />
    </div>
  );
}
