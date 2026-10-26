import { HomeCinematic } from "@/components/HomeCinematic";

export default function HomePage() {
  return (
    <section
      className="home-cinematic relative -mb-[calc(5.75rem+env(safe-area-inset-bottom,0px))] flex h-[calc(100dvh-3.75rem)] flex-col overflow-hidden lg:mb-0"
    >
      <HomeCinematic />
    </section>
  );
}
