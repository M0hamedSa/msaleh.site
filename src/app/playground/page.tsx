import type { Metadata } from "next";

import { Desktop } from "@/components/playground/desktop";

export const metadata: Metadata = {
  title: "Playground · Mohamed Saleh",
  description: "A desktop to play with: drag the windows around.",
};

// Linked from the footer only, away from the paths a recruiter follows.
export default function PlaygroundPage() {
  return (
    <main>
      <Desktop />
    </main>
  );
}
