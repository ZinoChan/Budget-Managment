"use client";
import React, { useEffect } from "react";
import { redirect, useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const VerifyEmail: React.FC = () => {
  const { verificationCode } = useParams<{ verificationCode?: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:4002/api/v1/auth/verifyemail/${verificationCode}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        if (responseData.status === "fail") {
          toast({
            variant: "destructive",
            title: "error.",
            description:
              responseData?.message || responseData.errors[0].message,
          });
        } else {
          toast({
            title: "Success",
            description: responseData?.message,
          });
        }
        console.log(responseData);
        console.log("logged in");
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    if (verificationCode) {
      fetchData();
    }
  }, [verificationCode]);

  return <div>verifiying your email</div>;
};

export default VerifyEmail;
