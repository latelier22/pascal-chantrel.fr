import styles from "./home.module.css";

export default function HeaderSimple({ title, description }) {
  return (
    <header className={`${styles.container} ${styles.pageHeader}`}>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
