import Filters from "./components/Filters";
import TransactionCard from "./components/TransactionCard";
import { CardsStats } from "./components/stats";

export default function Budget() {
  return (
    <section className="">
      <header className="py-4">
        <h1 className="text-3xl font-bold">Kakeibo</h1>
      </header>
      <CardsStats />
      <div className="mt-8">
        <Filters />
        <div>
          <TransactionCard />
          <TransactionCard />
          <TransactionCard />
          <TransactionCard />
        </div>
      </div>
    </section>
  );
}
