"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { calculatePrice, type OptionSelections, type PriceEstimate } from "@/lib/pricing/calculate-price";
import { SERVICES } from "@/lib/pricing/pricing-config";

type LandingState = {
  serviceSlug: string;
  setServiceSlug: (slug: string) => void;
  optionSelections: OptionSelections;
  setOptionSelections: (selections: OptionSelections | ((prev: OptionSelections) => OptionSelections)) => void;
  estimate: PriceEstimate | null;
};

const LandingStateContext = createContext<LandingState | null>(null);

export function LandingStateProvider({ children }: { children: ReactNode }) {
  const [serviceSlug, setServiceSlug] = useState(SERVICES[0].slug);
  const [optionSelections, setOptionSelections] = useState<OptionSelections>({});

  const estimate = useMemo(
    () => calculatePrice(serviceSlug, optionSelections),
    [serviceSlug, optionSelections]
  );

  const value: LandingState = {
    serviceSlug,
    setServiceSlug,
    optionSelections,
    setOptionSelections,
    estimate,
  };

  return <LandingStateContext.Provider value={value}>{children}</LandingStateContext.Provider>;
}

export function useLandingState() {
  const context = useContext(LandingStateContext);
  if (!context) {
    throw new Error("useLandingState должен использоваться внутри LandingStateProvider");
  }
  return context;
}

export function selectServiceAndScroll(setServiceSlug: (slug: string) => void, slug: string) {
  setServiceSlug(slug);
  const target = document.getElementById("calculator");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}
