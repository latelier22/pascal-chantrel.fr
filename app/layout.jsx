import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import "./page.module.css";
import { site } from "./site";
import ScrollReveal from "./ScrollReveal";
import styles from "./home.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({ children }) {
  const telephone = `tel:+33${site.portable.replaceAll(" ", "").slice(1)}`;
  return (
    <html lang="fr">
      <body className={`${inter.className} ${styles.site}`}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link className={styles.logo} href="/" aria-label="Pascal Chantrel, accueil">
              <Image src="/images/logo-banniere.png" width={749} height={189} alt="Pascal Chantrel" priority />
            </Link>
            <nav aria-label="Navigation principale" className={styles.navigation}>
              <Link href="/electromenager">Électroménager</Link>
              <Link href="/antennes-tv">Antennes TV</Link>
              <Link href="/ramonage">Ramonage</Link>
            </nav>
            <a className={styles.phone} href={telephone}>{site.portable}</a>
          </div>
        </header>
        <div className={styles.pageBody}>{children}</div>
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
              <strong>Pascal Chantrel</strong>
              <p>{site.adresse}, {site.codePostal} Loudéac</p>
              <p>SIRET {site.SIRET}</p>
            </div>
            <div className={styles.footerLinks}>
              <a href={telephone}>{site.portable}</a>
              <Link href="/contact">Formulaire de contact</Link>
              <a href={site.facebook}>Facebook</a>
            </div>
          </div>
        </footer>
        <ScrollReveal />
      </body>
    </html>
  );
}
