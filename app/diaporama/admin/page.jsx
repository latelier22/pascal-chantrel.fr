import catalogueSlides from "../catalogueSlides";
import SlideshowEditor from "./SlideshowEditor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Diaporama du magasin", robots: { index: false, follow: false } };

export default async function SlideshowAdmin() {
  return <SlideshowEditor catalogue={await catalogueSlides(true)} />;
}
