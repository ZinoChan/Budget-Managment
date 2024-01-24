import EnvelopeSidebar from "./components/EnvelopeSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-12 bg-light-100">
      <div>
        <div className="max-w-20 bg-light-50 h-full"></div>
      </div>
      <main className=" min-h-full col-span-11">
        <div className="grid grid-cols-4">
          <div className="col-span-3 pr-8 text-gray-800">{children}</div>
          <EnvelopeSidebar />
        </div>
      </main>
    </div>
  );
};

export default Layout;
