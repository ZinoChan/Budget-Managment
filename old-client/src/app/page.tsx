import BarChartComponent from "./budget/components/bars";
import Auth from "./components/Auth";

export default function Home() {
  return (
    <main className="bg-slate-50 min-h-screen flex items-center ">
      <div className="max-w-lg mx-auto w-full">
        {/* <Auth /> */}
        <BarChartComponent />
      </div>
    </main>
  );
}
