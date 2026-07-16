// Studio owns the full viewport — no site chrome. Lenis smooth-scroll is
// disabled for /studio in components/SmoothScroll.tsx.
export const metadata = {
  title: "Raj Aangan Admin",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
