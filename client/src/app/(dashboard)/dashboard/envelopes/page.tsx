import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/envelope-tables/columns";
import { EnvelopeTable } from "@/components/tables/envelope-tables/envelope-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
async function fetchEnvelopes(access_token: any) {
  try {
    const response = await fetch("http://localhost:4002/api/v1/envelopes", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const envelopes = await response.json();
    return envelopes;
  } catch (error) {
    console.error("An error occurred while fetching the envelopes:", error);
  }
}

const breadcrumbItems = [{ title: "Envelopes", link: "/dashboard/envelopes" }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
  //     (country ? `&search=${country}` : "")
  // );
  // const employeeRes = await res.json();
  // const totalUsers = employeeRes.total_users; //1000
  // const pageCount = Math.ceil(totalUsers / pageLimit);
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const envelopes = await fetchEnvelopes(access_token?.value);

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Envelopes (${23})`}
            description="Manage employees (Server side table functionalities.)"
          />

          <Link
            href={"/dashboard/envelopes/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />

        <EnvelopeTable
          searchKey="country"
          data={envelopes?.payload || []}
          pageNo={page}
          columns={columns}
          // totalUsers={23}
          pageCount={1}
        />
      </div>
    </>
  );
}
