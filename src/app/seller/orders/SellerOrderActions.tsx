"use client";

import { Button } from "@/components/ui/Button";
import { updateOrderStatus } from "@/actions/orders";

export default function SellerOrderActions({ 
  orderId, 
  status 
}: { 
  orderId: string; 
  status: string; 
}) {
  const handleUpdateStatus = async (newStatus: 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED') => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="flex gap-2">
      {status === "PENDING" && (
        <>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleUpdateStatus("CONFIRMED")}
          >
            Confirm
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleUpdateStatus("CANCELLED")}
          >
            Cancel
          </Button>
        </>
      )}
      {status === "CONFIRMED" && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleUpdateStatus("SHIPPED")}
        >
          Mark Shipped
        </Button>
      )}
      {status === "SHIPPED" && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleUpdateStatus("DELIVERED")}
        >
          Mark Delivered
        </Button>
      )}
    </div>
  );
}
