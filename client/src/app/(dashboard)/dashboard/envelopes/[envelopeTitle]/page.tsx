import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import { cookies } from "next/headers";
import React from "react";

async function fetchEnvelope(envelopeTitle: string, access_token: any) {
  try {
    const response = await fetch(
      `http://localhost:4002/api/v1/envelopes/${envelopeTitle}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const envelope = await response.json();
    return envelope;
  } catch (error) {
    console.error("An error occurred while fetching the envelope:", error);
  }
}

export default async function Page({
  params,
}: {
  params: { envelopeTitle: string };
}) {
  const breadcrumbItems = [
    { title: "Envelope", link: "/dashboard/envelopes" },
    { title: "Update", link: "/dashboard/envelopes" },
  ];

  const access_token = cookies().get("access_token");
  const envelope = await fetchEnvelope(
    params.envelopeTitle,
    access_token?.value
  );
  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ProductForm
        // categories={[
        //   { _id: "shirts", name: "shirts" },
        //   { _id: "pants", name: "pants" },
        // ]}
        initialData={envelope?.payload}
        key={null}
      />
    </div>
  );
}
