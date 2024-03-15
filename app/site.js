export const site = {
  title: "Pascal CHANTREL",
  description: "Pascal CHANTREL - Antennes TV - ELECTROMENAGER- 07 61 24 06 29",
  societe: "Pascal CHANTREL",
  SIRET: "78905489700028",
  contact: "Pascal CHANTREL",
  portable: "07 61 24 06 29",
  fixe: "02 30 96 34 22",
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
  { label: "Electroménager", route: "/electromenager" },
  { label: "Antennes TV", route: "/antennes-tv" },
  { label: "Ramonage", route: "ramonage" },
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
    body: "Fort de notre expérience de plus de 30 ans..."
  },
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
  "electromenager": {
    title: "Electroménager",
    description: "",
    photos: [],
  },
  "antennes-tv": {
    title: "Antennes tv",
    description: "",
    photos: [
      { url: "antennestv-1.jpg", alt: "gallery" },
      { url: "antennestv-2.jpg", alt: "gallery" },
      { url: "antennestv-3.jpg", alt: "gallery" },
      { url: "antennestv-4.jpg", alt: "gallery" },
    ],
    sections: [
      {
        title: "NOS SAVOIR FAIRE :",
        body: (
          <>
            <p>Pascal CHANTREL propose un service maîtrisé depuis des années dans le domaine des Antenne TV/TNT ou Parabole à Loudéac et ses alentours.</p>
            <p>*Entreprise agrée</p>
            <p>Garantie décennale.</p>
            <br />
            <p>Nous prenons en charge l’installation ou le remplacement d’antenne hertzienne (râteau) et d’antenne parabolique satellite (parabole) tout comme leurs dépannages.</p>

            <p>Des tests seront par la suite réalisés afin d&apos;éprouver le bon fonctionnement de notre installation :</p>

            <ul className="list-disc ml-8">
              <li>Mesure du gain/puissance d&apos;antenne (dB).</li>
              <li>Contrôle de la qualité.</li>
              <li>Raccordements à vos téléviseurs.</li>
              <li>Paramétrage des chaînes numériques terrestres et satellites.</li>
            </ul>

            <br />
            <p>Vous souhaitez regarder Be In Sports, Canal +, Canal Sat ou toute autre chaîne ou source HDMI dans n&apos;importe quelles pièces de votre habitation ?</p>

            <p>Pascal CHANTREL a la solution!</p>
            <br />
            <p>A l&apos;aide d&apos;un appareil, les chaînes de votre décodeur principales (ou n&apos;importe quelle source HDMI) seront retransmises sur toute votre installation TV.</p>
            <br />
            <p>Nous contacter pour plus d&apos;informations !</p>
          </>
        ),
      },
    ],
    cards: [],
  },
  ramonage: {
    title: "Ramonage",
    description: "",
    photos: [
      { url: "ramonage-1.png", alt: "gallery" },
      { url: "ramonage-2.png", alt: "gallery" },
      { url: "ramonage-3.png", alt: "gallery" },
      { url: "ramonage-4.png", alt: "gallery" },
    ],
    sections: [
    
      {
        title: "RAMONAGE :",
        body: (
        
          <>
    <h1>Activité de Ramonage à Loudéac et ses Alentours</h1>
    <p>Nous sommes spécialisés dans le ramonage depuis plus de 10 ans à Loudéac et ses alentours.</p>

    <h2>Services Réguliers</h2>
    <br/>
    <ul className="list-disc pl-4">
        <li>Ramonage régulier des cheminées, poêles et chaudières.</li>
        <li>Nettoyage des conduits de fumée pour garantir leur bon fonctionnement.</li>
        <li>Inspection des appareils de chauffage pour prévenir les risques d'incendie.</li>
    </ul>

    </>

        ),
      },
      {
        title: "ASSURANCES :",
        body: (
        
          <>

    <h2>Lien avec les Assurances</h2>
    <p>Nos services de ramonage sont en conformité avec les exigences des compagnies d'assurance, ce qui garantit la couverture en cas de sinistre.</p>
    <br/>
    <h2>Types d'Appareils</h2>
    <p>Nous intervenons sur divers types d'appareils :</p>
    <ul>
        <li>Cheminées traditionnelles</li>
        <li>Poêles à bois</li>
        <li>Poêles à granulés</li>
        <li>Chaudières à gaz ou fioul</li>
        <li>Inserts</li>
        <li>Cuisinières</li>
        <li>...</li>
    </ul>

</>



        ),
      },
      {
        title: "QUALITE DU TRAVAIL :",
        body: (
        
          <>

    
    <h2>Qualité du Travail</h2>
    <p>Nous nous engageons à fournir un travail de qualité :</p>
    <ul>
        <li>Ramonage professionnel et minutieux.</li>
        <li>Respect des normes de sécurité en vigueur.</li>
        <li>Intervention rapide et efficace.</li>
        <li>Conseils personnalisés pour optimiser l'utilisation de vos appareils de chauffage.</li>
    </ul>
<br/>
    <p>N'hésitez pas à nous contacter pour bénéficier de nos services de ramonage fiables et professionnels.</p>
</>



        ),
      },
      
    ],
    cards: [],
  },
};
