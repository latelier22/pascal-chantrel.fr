export const site = {
  title: "Pascal CHANTREL",
  description: "Pascal CHANTREL - Antennes TV - ELECTROMENAGER- 07 61 24 06 29",
  societe: "Pascal CHANTREL",
  SIRET: "78905489700028",
  contact: "Pascal CHANTREL",
  portable: "07 61 24 06 29",
  fixe:"02 30 96 34 22",
  adresse: "27 rue Lavergne",
  codePostal: "22600",
  ville: "LOUDEAC",
  email: "contact@pascal-chantrel.fr",
  logo: { url: "images/logo-barre-du-haut.png", alt: "logo Pascal CHANTREL" },
  Logo: { url: "images/logo-banniere.png", alt: "logo Pascal CHANTREL" },
  facebook: "https://www.facebook.com/profile.php?id=61556770660190"
};

export const menuItems = [
  { label: "Accueil", route: "/" },
  { label: "Contact", route: "/contact" },
];

export const cards = [
  {
    title: "RAVALEMENT",
    text: "",
    button: "Détail",
    buttonColor: "bg-gold-500",
    link: "/ravalement",
    url: "peinture-mur-exterieur.png",
    alt: "",
  },

];

export const cards2 = [
  {
    title: "NETTOYAGE",
    text: "",
    button: "",
    buttonColor: "bg-gold-500",
    link: "/nettoyage",
    url: "realisations-13.jpeg",
    alt: "",
  },
];

export const sections = [
  {
    title: "Qui sommes-nous?",
    body: "Fort de notre expérience de plus de 30 ans..."},
  {
    title: " NOS SAVOIRS FAIRE",
    body: (
      <ul className="list-disc pl-4">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    ),
  },
];

export const listesActions = [
  {
    title: "CHANGEMENT D'ENSEIGNE",
    subTitle: "Ce n'est plus Pulsat, mais ça reste Pascal CHANTREL!",
    photo: { url: "cartevisitepoursite.png", alt: "" },
    actions: [],
  },
 
];

export const Pages = {
  entretien: {
    title: "Entretien",
    description: "",
    photos: [
      { url: "entretien-1.png", alt: "gallery" },
      { url: "entretien-2.png", alt: "gallery" },
      { url: "entretien-3.png", alt: "gallery" },
      { url: "entretien-4.png", alt: "gallery" },
    ],
    sections: [
      {
        title: "NOS SAVOIR FAIRE :",
        body: (
          <ul className="list-disc text-gold-400 pl-4">
            <li></li>
          </ul>
        ),
      },
    ],
    cards: [],
  },
};
