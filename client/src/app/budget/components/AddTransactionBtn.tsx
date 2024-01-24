"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { useState } from "react";
import { AddTransactionForm } from "./AddTransaction";

export function AddTransactionBtn() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="link">
          <Plus size={16} />
          <span>Add Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
          <DialogDescription>
            add your gaming envelope transaciton and submit.
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm setDialogOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
