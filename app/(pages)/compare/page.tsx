import ComparePage from './components/ComparePage';

export const metadata = {
  title: "Compare Districts",
  description: "Compare district-level employment and fund utilization insights.",
};

export default function Page() {
  // This is a Server Component (no "use client" at top).
  // It can export metadata and still render the client component ComparePage.
  return <ComparePage />;
}