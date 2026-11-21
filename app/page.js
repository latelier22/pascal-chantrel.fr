import Image from "next/image";
import Link from "next/link";
import getProducts from "./getProducts";
import HomeCatalogue from "./HomeCatalogue";
import HomeHeroVisual from "./HomeHeroVisual";
import styles from "./home.module.css";

export const metadata = {
  title: "Pascal Chantrel · Électroménager, antennes TV et ramonage à Loudéac",
  description: "Découvrez le catalogue d’électroménager et TV de Pascal Chantrel, ainsi que ses services d’antennes et de ramonage à Loudéac et aux alentours.",
};

const services = [
  {
    title: "Antennes TV",
    description: "Installation et dépannage d’antennes TNT et de paraboles.",
    href: "/antennes-tv",
    image: "/images/antennestv-2.jpg",
    tone: "green",
  },
  {
    title: "Ramonage",
    description: "Entretien de vos conduits de cheminée et de poêle.",
    href: "/ramonage",
    image: "/images/ramonage-1.png",
    tone: "brown",
  },
];

const priceFormatter = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

export default async function Home() {
  const products = (await getProducts()).map((product) => ({
    id: product.id,
    reference: product.ref_simple,
    category: product["Catégories"],
    brand: product.nom_marque,
    type: product.cat1,
    description: product["Désignation"],
    image: product["image-1"],
    price: priceFormatter.format(Number(product["Prix public 1"].replace(",", "."))),
  }));
  return (
      <main className={styles.container}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroContent}>
            <p className={styles.location}>Loudéac et ses alentours</p>
            <h1 id="home-title">Électroménager<br /> <em>&amp; services</em></h1>
            <p>De l’équipement de la maison à l’entretien de votre cheminée, contactez Pascal Chantrel à Loudéac.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href="#catalogue">Explorer le catalogue</a>
              <Link className={styles.secondary} href="/contact">Nous contacter</Link>
            </div>
          </div>
          <HomeHeroVisual />
        </section>

        <HomeCatalogue products={products} />

        <section data-reveal className={styles.services} aria-labelledby="services-title">
          <h2 id="services-title">Nos interventions à Loudéac</h2>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <Link key={service.href} href={service.href} className={`${styles.service} ${styles[service.tone]}`}>
                <Image src={service.image} fill sizes="(max-width: 640px) 100vw, 560px" alt="" />
                <div className={styles.serviceCopy}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

  );
}
