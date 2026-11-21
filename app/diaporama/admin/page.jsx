import SlideshowEditor from "./SlideshowEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Diaporama du magasin", robots: { index: false, follow: false } };

export default function SlideshowAdmin() {
  return <SlideshowEditor />;
}
