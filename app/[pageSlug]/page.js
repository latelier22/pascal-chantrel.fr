import { notFound } from "next/navigation";
import HeaderSimple from "../headerSimple";
import Cards from "../Cards";
import MyLightBox from "../MyLightBox";
import { Pages } from "../site";
import styles from "../home.module.css";

export default async function ServicePage({ params }) {
  const { pageSlug } = await params;
  const page = Object.hasOwn(Pages, pageSlug) ? Pages[pageSlug] : null;
  if (!page) notFound();
  return (
    <main>
      <HeaderSimple title={page.title} description={page.description} />
      <div className={styles.container}>
        {page.photos?.length > 0 && <div data-reveal><MyLightBox photos={page.photos} /></div>}
        {page.sections?.map((section) => (
          <section key={section.title} className={styles.serviceArticle} data-reveal>
            <h2>{section.title}</h2>
            <div>{section.body}</div>
          </section>
        ))}
        {page.cards?.length > 0 && <Cards cards={page.cards} />}
      </div>
    </main>
  );
}
