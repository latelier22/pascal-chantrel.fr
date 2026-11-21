import Link from "next/link";
import Navbar from "../../NavBar";
import Footer from "../../Footer";

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto my-12 rounded-lg bg-white p-8">
        <h1 className="text-2xl font-bold">Cette fiche n’est plus au catalogue</h1>
        <p className="my-4">Retrouvez les appareils actuellement présentés dans le catalogue.</p>
        <Link href="/electromenager" className="font-semibold underline">Voir le catalogue</Link>
      </main>
      <Footer />
    </>
  );
}
