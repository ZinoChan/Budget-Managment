import BreadCrumb from "@/components/breadcrumb";
import { TransactionTable } from "@/components/tables/transaction-tables/transaction-table";
import { formatDateString } from "@/helpers";
import { cookies } from "next/headers";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];
async function fetchTransactions(access_token: any) {
  try {
    const response = await fetch("http://localhost:4002/api/v1/transactions", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const transactions = await response.json();
    return transactions;
  } catch (error) {
    console.error("An error occurred while fetching the stats:", error);
  }
}
export default async function page() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const transactions = await fetchTransactions(access_token?.value);
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <TransactionTable
          data={transactions.payload.map(
            (t: any) => ({...t, date: formatDateString(t.date)})
          )}
        />
      </div>
    </>
  );
}
