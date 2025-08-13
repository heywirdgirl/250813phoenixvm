"use client";

import { useFormState, useFormStatus } from "react-dom";
import { handleSuggestTags } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Terminal } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Suggesting..." : "Suggest Tags"}
    </Button>
  );
}

export default function SuggestTagsForm() {
  const initialState = { tags: [], error: undefined, description: "" };
  const [state, formAction] = useFormState(handleSuggestTags, initialState);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form action={formAction}>
        <CardHeader>
          <CardTitle className="font-headline">AI Product Tagger</CardTitle>
          <CardDescription>
            Enter a product description below and our AI will suggest relevant SEO tags.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="e.g., A cozy, 100% cotton t-shirt with a minimalist design..."
              rows={6}
              defaultValue={state?.description}
              required
            />
          </div>
          {state?.error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
      
      {state?.tags && state.tags.length > 0 && (
          <div className="p-6 pt-0">
             <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Suggested Tags</AlertTitle>
                <AlertDescription>
                   <div className="flex flex-wrap gap-2 mt-2">
                     {state.tags.map((tag, index) => (
                       <Badge key={index} variant="secondary">{tag}</Badge>
                     ))}
                   </div>
                </AlertDescription>
            </Alert>
          </div>
        )}
    </Card>
  );
}
