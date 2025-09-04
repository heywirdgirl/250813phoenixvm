
// src/app/order-form/page.tsx

import OrderForm from "@/components/OrderForm";

export default function OrderFormPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-headline font-bold text-center mb-8">
                Create Printful Order
            </h1>
            <p className="text-center text-muted-foreground mb-8">
                This is a test page to demonstrate creating a draft order directly with Printful via a Server Action.
            </p>
            <OrderForm />
        </div>
    </div>
  );
}
