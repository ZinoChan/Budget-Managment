"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import GoogleSignInButton from "../github-auth-button";
import { useToast } from "../ui/use-toast";

const formSchema = z
  .object({
    username: z.string().min(3, { message: "Username is too short" }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z.string().min(8, { message: "Password is too short" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password is too short" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { toast } = useToast();

  const onSubmit = async (data: UserFormValue) => {
    // setLoading(true);
    try {
      const response = await fetch("http://localhost:4002/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
        toast({
          variant: "destructive",
          title: "Failed to Sign up.",
          description: "failed to sign up",
        });
      }

      const responseData = await response.json();
      if (responseData.status === "fail") {
        toast({
          variant: "destructive",
          title: "Failed to Sign up.",
          description: responseData?.message || responseData.errors[0].message,
        });
      } else {
        toast({
          title: "Success",
          description: responseData?.message,
        });
      }
      console.log(responseData);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Create Account
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
      {/* <GoogleSignInButton /> */}
    </>
  );
}
