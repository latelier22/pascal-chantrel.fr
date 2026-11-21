import FormContact from "../FormContact";
import HeaderSimple from "../headerSimple";
import { site } from "../site";
import styles from "../home.module.css";

export default function Contact() {
  return (
    <main>
      <HeaderSimple title="Contacter Pascal Chantrel" description="Une question sur un appareil ou une intervention à Loudéac ?" />
      <div className={`${styles.container} ${styles.contactLayout}`}>
        <aside className={styles.contactInfo} data-reveal>
          <h2>Nos coordonnées</h2>
          <a href={`tel:+33${site.portable.replaceAll(" ", "").slice(1)}`}>{site.portable}</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <p>{site.adresse}<br />{site.codePostal} Loudéac</p>
        </aside>
        <FormContact />
      </div>
    </main>
  );
}
