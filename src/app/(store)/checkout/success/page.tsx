import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const orderId = params.order;

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">Order Placed!</h1>

      <p className="text-surface-300 mb-2">
        Thank you for your order. We&apos;ll reach out to confirm delivery details.
      </p>

      {orderId && (
        <p className="text-sm text-surface-300 mb-8">
          Order ID:{" "}
          <span className="font-mono text-white">
            #{orderId.slice(0, 8).toUpperCase()}
          </span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/account/orders">
          <Button variant="outline" size="lg">
            View My Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
