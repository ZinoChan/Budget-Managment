import { HttpStatusCodes } from "@/constants";
import StatsService from "@/services/stats.service";
import { Request, Response, NextFunction } from "express";

class StatsController {
  private statsService: StatsService;

  constructor(statsService: StatsService) {
    this.statsService = statsService;
  }

  public getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user.id;
      const totalAccountBalance = await this.statsService.totalAccountBalance(
        userId
      );
      const totalTransactions = await this.statsService.totalTransactions(
        userId
      );
      const totalDeposit = await this.statsService.totalDeposit(userId);
      const totalWithdrawal = await this.statsService.totalWithdrawal(userId);
      const totalMonthlyTransaction =
        await this.statsService.totalMonthlyTransaction(userId);
      const totalSpendingsByCategory =
        await this.statsService.totalSpendingsByCategory(userId);

      res.status(HttpStatusCodes.OK).json({
        status: "success",
        message: "success",
        payload: {
          totalAccountBalance,
          totalTransactions,
          totalDeposit,
          totalWithdrawal,
          totalMonthlyTransaction,
          totalSpendingsByCategory,
        },
      });
    } catch (error) {
      console.log("get Stats Err: ", error);
      next(error);
    }
  };
}

export default StatsController;
