import React, { createContext, useContext, useState, ReactNode } from "react";
import CheckoutModal from "@/components/CheckoutModal";

interface CheckoutContextType {
  openCheckout: () => void;
  closeCheckout: () => void;
  isCheckoutOpen: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <CheckoutContext.Provider value={{ openCheckout, closeCheckout, isCheckoutOpen }}>
      {children}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} />
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};
