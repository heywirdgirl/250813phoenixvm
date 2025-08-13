import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OrderConfirmationPageProps {
    params: {
        orderId: string;
    }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
    const trackingNumber = `PB${params.orderId.toUpperCase()}`;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto">
                <Card className="text-center shadow-lg">
                    <CardHeader className="pt-8">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
                        <CardTitle className="text-3xl font-headline mt-4">Thank You For Your Order!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                           Your order has been placed successfully. A confirmation email has been sent to you.
                        </p>
                        <Separator />
                        <div className="text-left space-y-2 py-4">
                           <div className="flex justify-between">
                             <span className="font-semibold">Order ID:</span>
                             <span className="font-mono text-primary">{params.orderId}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="font-semibold">Tracking Number:</span>
                             <span className="font-mono text-primary">{trackingNumber}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="font-semibold">Order Status:</span>
                             <span>Printing</span>
                           </div>
                        </div>
                         <Button asChild className="w-full">
                           <Link href="/products">Continue Shopping</Link>
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
