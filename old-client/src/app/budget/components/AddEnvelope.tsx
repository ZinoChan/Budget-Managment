"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { envelopeSchema } from "@/schemas";
import { DialogClose } from "@/components/ui/dialog";
export function AddEnvelopeForm({
  setDialogOpen,
}: {
  setDialogOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof envelopeSchema>>({
    resolver: zodResolver(envelopeSchema),
    defaultValues: {
      title: "",
      initialAmount: 0,
      currentBalance: 0,
      color: "",
      image: "",
    },
  });

  function onSubmit(values: z.infer<typeof envelopeSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(values);
    setDialogOpen(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Envelope Title</FormLabel>
              <FormControl>
                <Input placeholder="Education" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="initialAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Envelope Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Envelope Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>color hex</FormLabel>
                <FormControl>
                  <Input placeholder="#ff0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>svg image</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex space-x-2 mt-4">
          <Button type="submit">Submit</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}
