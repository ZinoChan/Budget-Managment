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

import { AddEnvelopeForm } from "./AddEnvelope";
import { Plus } from "lucide-react";
import { useState } from "react";

export function AddEnvelopeBtn() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant="outline">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>Add Envelope</DialogTitle>
          <DialogDescription>
            add your budget envelope and submit.
          </DialogDescription>
        </DialogHeader>
        <AddEnvelopeForm setDialogOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
