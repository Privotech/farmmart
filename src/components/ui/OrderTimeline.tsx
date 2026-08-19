import React from "react";
import { CheckIcon, ClockIcon } from "./Icons";

type OrderStatus =
  | "PENDING"
  | "PAID"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "completed";

interface TimelineStep {
  key: string;
  label: string;
  description: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    key: "PAID",
    label: "Paid",
    description: "Payment received successfully",
  },
  {
    key: "CONFIRMED",
    label: "Seller Confirmed",
    description: "Seller has acknowledged the order",
  },
  {
    key: "PICKUP",
    label: "Pickup Scheduled",
    description: "Logistics pickup has been arranged",
  },
  {
    key: "SHIPPED",
    label: "In Transit",
    description: "Your item is on its way to you",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Order has been delivered successfully",
  },
];

function normalizeStatus(status: OrderStatus | string): OrderStatus {
  const upper = typeof status === "string" ? status.toUpperCase() : status;
  if (upper === "COMPLETED") return "DELIVERED";
  return upper as OrderStatus;
}

function getActiveStepIndex(status: OrderStatus | string): number {
  const normalized = normalizeStatus(status);

  if (normalized === "CANCELLED" || normalized === "REFUNDED" || normalized === "PENDING") {
    return -1;
  }

  switch (normalized) {
    case "PAID":
      return 0;
    case "CONFIRMED":
      return 2;
    case "SHIPPED":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return -1;
  }
}

interface OrderTimelineProps {
  status: OrderStatus | string;
  className?: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  status,
  className = "",
}) => {
  const activeIndex = getActiveStepIndex(status);
  const normalized = normalizeStatus(status);
  const isCancelled = normalized === "CANCELLED" || normalized === "REFUNDED";
  const isPending = normalized === "PENDING";

  if (isPending) {
    return (
      <div className={`flex items-center gap-3 px-5 py-4 bg-warning-50 border border-warning-200 rounded-2xl ${className}`}>
        <ClockIcon className="w-5 h-5 text-warning-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-warning-800">Awaiting Payment</p>
          <p className="text-sm text-warning-600">Your order will begin processing once payment is confirmed.</p>
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className={`flex items-center gap-3 px-5 py-4 bg-danger-50 border border-danger-200 rounded-2xl ${className}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-danger-600 flex-shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <div>
          <p className="font-semibold text-danger-800">
            {normalized === "REFUNDED" ? "Order Refunded" : "Order Cancelled"}
          </p>
          <p className="text-sm text-danger-600">
            {normalized === "REFUNDED"
              ? "Your payment has been refunded."
              : "This order has been cancelled."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-2 ${className}`}>
      <div className="flex items-start justify-between gap-1 relative">
        <div className="absolute top-4 left-0 right-0 h-1 mx-8 hidden md:block">
          <div className="h-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{
                width:
                  activeIndex === 4
                    ? "100%"
                    : `${Math.max(0, ((activeIndex + 1) / TIMELINE_STEPS.length) * 100)}%`,
              }}
            />
          </div>
        </div>

        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center flex-1 relative z-10 min-w-0 px-1"
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${
                  isCompleted
                    ? "bg-success border-success text-white shadow-md shadow-success/20"
                    : "bg-surface border-border text-text-secondary"
                } ${isCurrent ? "ring-4 ring-success-100 scale-110" : ""}`}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <span className="text-xs font-semibold md:text-sm">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 md:mt-3 text-center">
                <p
                  className={`text-xs md:text-sm font-semibold truncate ${
                    isCompleted ? "text-success-700" : "text-text-secondary"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`hidden md:block text-xs mt-1 leading-tight ${
                    isCompleted ? "text-success-600/80" : "text-text-secondary/70"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
