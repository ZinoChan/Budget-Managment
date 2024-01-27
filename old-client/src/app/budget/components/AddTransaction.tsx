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
import { DialogClose } from "@/components/ui/dialog";
import { TransactionType, transactionSchema } from "@/schemas";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectContent, SelectGroup } from "@radix-ui/react-select";
export function AddTransactionForm({
  setDialogOpen,
}: {
  setDialogOpen: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      transactionType: TransactionType.PURCHASE,
      category: "",
      description: "",
      color: "",
      image: "",
      date: "",
    },
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    // ✅ This will be type-safe and validated.
    console.log(values);
    setDialogOpen(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Amount</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trasnsaction Description</FormLabel>
              <FormControl>
                <Textarea placeholder="your description here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="category" {...field} />
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
                <FormLabel>Transaction type</FormLabel>
                <FormControl>
                  <Select {...field} name="transactionType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Transaction Type" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectGroup className="bg-white">
                        <SelectLabel>Transaction Type</SelectLabel>
                        {Object.values(TransactionType).map(
                          (type: string | TransactionType) => (
                            <SelectItem
                              className="w-full"
                              key={type}
                              value={`${type}`}
                            >
                              {type}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
