import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Transaction } from "@/constants/data";
import { formatDateString } from "@/helpers";

export function RecentTransactions({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <div className="space-y-8">
      {transactions.length > 0
        ? transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center">
              {/* <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar> */}
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {transaction.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateString(transaction.date)}
                </p>
              </div>
              <div className="ml-auto font-medium">
                {transaction.transactionType === "DEPOSIT" ? "+" : "-"}$
                {transaction.amount}
              </div>
            </div>
          ))
        : "No transactions yet."}
    </div>
  );
}
