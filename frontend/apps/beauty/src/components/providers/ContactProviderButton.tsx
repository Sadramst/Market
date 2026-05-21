"use client";

import { useState } from "react";
import { EnquiryModal } from "./EnquiryModal";

type ContactProviderButtonProps = {
  providerId: string;
  providerName: string;
  services?: Array<{ name: string }>;
};

export function ContactProviderButton({ providerId, providerName, services }: ContactProviderButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full px-4 py-3.5 text-[14px] font-medium text-white transition-all"
        style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
      >
        Contact Provider
      </button>
      {open && (
        <EnquiryModal
          providerId={providerId}
          providerName={providerName}
          services={services}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
