"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";

interface TradeConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "buy" | "sell";
  asset: string;
  assetName: string;
  amount: number;
  price: number;
  currentHolding?: number;
  cashBalance?: number;
}

export function TradeConfirmation({
  open,
  onClose,
  onConfirm,
  type,
  asset,
  assetName,
  amount,
  price,
  currentHolding = 0,
  cashBalance = 0,
}: TradeConfirmationProps) {
  const totalCost = amount * price;
  const isBuy = type === "buy";
  const canExecute = isBuy ? cashBalance >= totalCost : currentHolding >= amount;

  const newHolding = isBuy
    ? currentHolding + amount
    : Math.max(0, currentHolding - amount);
  const newCash = isBuy ? cashBalance - totalCost : cashBalance + totalCost;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Confirm Trade
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {/* Trade Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isBuy
                  ? "bg-gradient-to-br from-green-400 to-emerald-600"
                  : "bg-gradient-to-br from-red-400 to-rose-600"
              }`}
            >
              {isBuy ? (
                <TrendingUp className="h-10 w-10 text-white" />
              ) : (
                <TrendingDown className="h-10 w-10 text-white" />
              )}
            </div>
          </motion.div>

          {/* Trade Details */}
          <div className="text-center space-y-2 mb-6">
            <p className="text-lg font-medium text-muted-foreground">
              {isBuy ? "Buying" : "Selling"}
            </p>
            <p className="text-3xl font-bold">
              {amount.toFixed(4)} {asset.toUpperCase()}
            </p>
            <p className="text-lg text-muted-foreground">{assetName}</p>
          </div>

          {/* Price Details */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per unit</span>
              <span className="font-medium">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-medium">{amount.toFixed(4)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-medium">
                  {isBuy ? "Total Cost" : "Total Proceeds"}
                </span>
                <span
                  className={`text-xl font-bold ${
                    isBuy ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isBuy ? "-" : "+"}${totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Balance Preview */}
          <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              After this trade:
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cash Balance</p>
                <p className="font-semibold">${newCash.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{asset.toUpperCase()} Holdings</p>
                <p className="font-semibold">{newHolding.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Warning if can't execute */}
          {!canExecute && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2"
            >
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {isBuy
                  ? "Insufficient cash balance for this trade"
                  : "Insufficient holdings to sell this amount"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!canExecute}
            className={`flex-1 gap-2 ${
              isBuy
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <CheckCircle className="h-4 w-4" />
            Confirm {isBuy ? "Buy" : "Sell"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

