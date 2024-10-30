import StoreProvider from "@/lib/StoreProvider";
import Home from "@/components/home/Home";

export default function HomePage() {
  return (
    <StoreProvider>
      <div className="bg-pr-bg">
        <Home />
      </div>
    </StoreProvider>
  );
}
