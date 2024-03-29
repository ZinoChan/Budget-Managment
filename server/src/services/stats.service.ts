import EnvelopeRepository from "@/repositories/envelopeRepository";
import TransactionRepository from "@/repositories/transactionRepository";

class StatsService {
  private envelopeRepository: EnvelopeRepository;
  private transactionRepository: TransactionRepository;

  constructor(
    envelopeRepository: EnvelopeRepository,
    transactionRepository: TransactionRepository
  ) {
    this.envelopeRepository = envelopeRepository;
    this.transactionRepository = transactionRepository;
  }

  async totalAccountBalance(userId: string) {
    const userEnvelopes = await this.envelopeRepository.getUserEnvelopes({
      userId,
    });

    const totalBalance = userEnvelopes.reduce(
      (acc, envelope) => acc + envelope.currentBalance,
      0
    );
    return { totalBalance, numberOfEnvelopes: userEnvelopes.length };
  }

  async totalTransactions(userId: string) {
    const userTransactions =
      await this.transactionRepository.getUserTransactions({
        userId,
      });
    const totalTransactions = userTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    return { totalTransactions, numberOfTransactions: userTransactions.length };
  }

  async totalDeposit(userId: string) {
    const userTransactions =
      await this.transactionRepository.getUserTransactions({
        userId,
        transactionType: "DEPOSIT",
      });
    const totalDeposit = userTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    return { totalDeposit, numberOfDeposit: userTransactions.length };
  }

  async totalWithdrawal(userId: string) {
    const userTransactions =
      await this.transactionRepository.getUserTransactions({
        userId,
        transactionType: "WITHDRAW",
      });
    const totalWithdrawal = userTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    return { totalWithdrawal, numberOfWithdrawal: userTransactions.length };
  }

  async totalPurchase(userId: string) {
    const userTransactions =
      await this.transactionRepository.getUserTransactions({
        userId,
        transactionType: "PURCHASE",
      });
    const totalPurchase = userTransactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    return { totalPurchase, numberOfPurchase: userTransactions.length };
  }

  async totalMonthlyTransaction(
    userId: string,
    year = new Date().getFullYear()
  ) {
    const monthlyCounts = [];
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      const userTransactions =
        await this.transactionRepository.getUserTransactions({
          userId,
          date: {
            gte: startDate,
            lt: endDate,
          },
          transactionType: {
            in: ["PURCHASE", "WITHDRAW"],
          },
        });

      monthlyCounts.push({
        month: startDate.toLocaleString("default", { month: "long" }),
        count: userTransactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        ),
      });
    }
    return { [year]: { data: monthlyCounts } };
  }

  totalSpendingsByCategory = async (userId: string) => {
    const spendingByCategory =
      await this.transactionRepository.getGroupedTransaction(
        ["categoryTitle"],
        {
          userId,
          transactionType: {
            in: ["PURCHASE", "WITHDRAW"],
          },
        },

        { amount: true }
      );
    return spendingByCategory;
  };
}

export default StatsService;
