#!/usr/bin/env python3
import argparse
import csv
import hashlib
import io
import json
import re
import tempfile
import unicodedata
from collections import Counter
from datetime import datetime
from decimal import Decimal, InvalidOperation
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlencode, urljoin, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
WORK = ROOT / ".stock-import"
CATALOGUE = ROOT / "app/products.json"
SOURCES = ROOT / "scripts/stock-image-sources.json"

LARGE = "Gros électroménager"
VIDEO = "Tv - Image - Son"
SMALL = "Petit-électroménager"
HOME = "Maison - Entretien"
FAMILIES = {
    "LALI": (LARGE, "Lave-linge"),
    "SECH": (LARGE, "Sèche-linge"),
    "LAVA": (LARGE, "Lave-vaisselle"),
    "LAVAE": (LARGE, "Lave-vaisselle"),
    "REFR": (LARGE, "Réfrigérateur"),
    "REFRE": (LARGE, "Réfrigérateur"),
    "CONG": (LARGE, "Congélateur"),
    "CUIS": (LARGE, "Cuisinière"),
    "TABL": (LARGE, "Plaque de cuisson"),
    "FOUR": (LARGE, "Four"),
    "MICO": (LARGE, "Micro-ondes"),
    "ENCA": (LARGE, "Encastrable"),
    "TELE": (VIDEO, "Téléviseur"),
    "HFCH": (VIDEO, "Chaîne Hi-Fi"),
    "HFES": (VIDEO, "Platine vinyle"),
    "SONO": (VIDEO, "Écran de projection"),
    "DEMOS": (VIDEO, "Décodeur satellite"),
    "BOUI": (SMALL, "Bouilloire"),
    "CAFE": (SMALL, "Cafetière filtre"),
    "CUIP": (SMALL, "Four posable"),
    "ASPI": (HOME, "Aspirateur"),
    "NETT": (HOME, "Nettoyeur"),
    "FRIT": (SMALL, "Friteuse"),
    "ROBO": (SMALL, "Robot de cuisine"),
}
BUILT_IN = {
    "HODE": "Hotte", "HON": "Hotte", "FO": "Four", "FOPY": "Four",
    "GR": "Four", "RF": "Réfrigérateur", "TNM": "Plaque de cuisson",
    "MO": "Micro-ondes",
}
SMALL_APPLIANCES = {
    "CAF": "Cafetière", "FERV": "Centrale vapeur", "FUGE": "Centrifugeuse",
    "MAP": "Machine à pain",
}
BRANDS = {
    "AIRLUX", "AMICA", "ASKO", "BEKO", "BOSCH", "BRANDT", "CALOR", "CANDY", "DYSON",
    "ELECTROLUX", "HAIER", "HISENSE", "INDESIT", "LG", "MIELE",
    "PHILIPS", "ROWENTA", "SAMSUNG", "SEB", "SEBO", "SIEMENS", "SONY",
    "THOMSON", "WHIRLPOOL",
}
PARTS = re.compile(
    r"\b(?:piece[s]? detachee[s]?|telecommande|filtre[s]? (?:pour|dyson)|"
    r"joint[s]?|charbon[s]? moteur|kit (?:de |d.)?(?:fixation|installation)|"
    r"poignee|clayette|carte electronique|courroie|sonde|accessoire[s]?|"
    r"ampoule|module de puissance|resistance|ustensile[s]?|sac[s]? aspirateur)\b"
)
MAX_IMAGE_BYTES = 8 * 1024 * 1024


def reference(value):
    return re.sub(r"\s+", "", value.upper())


def product_key(ref):
    return hashlib.sha256(ref.encode()).hexdigest()[:24]


def plain(value):
    return "".join(
        char for char in unicodedata.normalize("NFKD", value.lower())
        if not unicodedata.combining(char)
    )


def date(value):
    try:
        return datetime.strptime(value, "%d/%m/%Y").date()
    except ValueError:
        return None


def positive(value):
    try:
        number = Decimal(value.replace("\u00a0", "").replace(" ", "").replace(",", "."))
        return number.is_finite() and number > 0
    except InvalidOperation:
        return False


def read_stock(path):
    raw = path.read_bytes()
    try:
        content = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        content = raw.decode("cp1252")
    reader = csv.DictReader(io.StringIO(content, newline=""), delimiter=";")
    fields = {
        "Référence", "Marque", "Famille", "Sous-famille", "Désignation",
        "Prix public 1", "Stock final des 12 mois", "Date de création",
        "Date de mise à jour", "Libellé complet de la marque",
    }
    if not fields.issubset(reader.fieldnames or ()):
        raise ValueError("Colonnes manquantes : " + ", ".join(sorted(fields - set(reader.fieldnames or ()))))
    for row in reader:
        if None in row or any(row[field] is None for field in fields):
            raise ValueError(f"Ligne CSV invalide : {reader.line_num}")
        yield {field: row[field].strip() for field in fields}


def product_type(row):
    family, subfamily = row["Famille"].upper(), row["Sous-famille"].upper()
    if family == "PEME" and subfamily in SMALL_APPLIANCES:
        return SMALL, SMALL_APPLIANCES[subfamily]
    if family == "PEME" and plain(row["Désignation"]).startswith("centrale vapeur"):
        return SMALL, "Centrale vapeur"
    if family == "ENCA":
        if subfamily in BUILT_IN:
            return LARGE, BUILT_IN[subfamily]
        if plain(row["Désignation"]).startswith(("hotte ", "ilot oceane ")):
            return LARGE, "Hotte"
    if family == "AUDI":
        if plain(row["Désignation"]).startswith("lecteur dvd"):
            return VIDEO, "Lecteur DVD"
        if subfamily == "RR":
            return VIDEO, "Radio"
    if family == "CASQ" and subfamily == "SFIL":
        return VIDEO, "Casque sans fil"
    return FAMILIES.get(family)


def brand_for(row, previous, source):
    known = previous.get("nom_marque") or source.get("brand")
    if known:
        return known
    label = row["Libellé complet de la marque"].strip(" #")
    if label:
        return re.sub(r" (?:ENCASTRABLE|ENCAST\.|MENAGER|BRUN|TELE)$", "", label)
    words = re.findall(r"[A-Z0-9]+", row["Désignation"].upper())
    return next((word for word in words if word in BRANDS), "")


def image_extension(data):
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return ".png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return ".webp"
    raise ValueError("Format attendu : JPEG, PNG ou WebP")


def atomic_write(path, data, mode=0o600):
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as temporary:
        temp = Path(temporary.name)
        try:
            temporary.write(data)
            temporary.close()
            temp.chmod(mode)
            temp.replace(path)
        finally:
            temp.unlink(missing_ok=True)


class ProductMetadata(HTMLParser):
    image = ""

    def handle_starttag(self, tag, attrs):
        fields = dict(attrs)
        if tag == "meta" and fields.get("property") == "og:image":
            self.image = fields.get("content") or ""


def fetch(url, limit):
    if urlsplit(url).scheme != "https":
        raise ValueError("Une URL HTTPS est requise")
    request = Request(url, headers={"User-Agent": "CataloguePascal/1.0"})
    with urlopen(request, timeout=15) as response:
        if urlsplit(response.geturl()).scheme != "https":
            raise ValueError("Redirection hors HTTPS")
        data = response.read(limit + 1)
        if len(data) > limit:
            raise ValueError("Réponse trop volumineuse")
        return data, response.geturl()


def image_from_page(page, ref):
    data, final_url = fetch(page, 3 * 1024 * 1024)
    metadata = ProductMetadata()
    metadata.feed(data.decode("utf-8", errors="replace"))
    image = urljoin(final_url, metadata.image)
    model = re.escape(ref)
    if not metadata.image or not re.search(
        rf"(?<![A-Z0-9]){model}(?![A-Z0-9])", unquote(urlsplit(image).path).upper()
    ):
        raise ValueError("Aucun visuel identifié par référence exacte dans la fiche")
    return image


def image_for(ref, previous, source, legacy_images, download):
    old_path = previous.get("image-1", "")
    if old_path.startswith("/images/") and (PUBLIC / old_path.lstrip("/")).is_file():
        return old_path, ""
    if ref in legacy_images:
        return legacy_images[ref], ""

    key = product_key(ref)
    image_dir = PUBLIC / "images/stock"
    for extension in (".jpg", ".png", ".webp"):
        path = image_dir / (key + extension)
        if path.is_file():
            return "/images/stock/" + path.name, ""

    url, page = source.get("image"), source.get("page")
    if not download or not (url or page):
        return "", ""
    try:
        if not url:
            url = image_from_page(page, ref)
        data, _ = fetch(url, MAX_IMAGE_BYTES)
        path = image_dir / (key + image_extension(data))
        image_dir.mkdir(parents=True, exist_ok=True)
        atomic_write(path, data, mode=0o644)
        return "/images/stock/" + path.name, ""
    except (OSError, ValueError) as error:
        return "", str(error)


def write_csv(path, columns, rows):
    content = io.StringIO(newline="")
    writer = csv.DictWriter(content, fieldnames=columns, delimiter=";")
    writer.writeheader()
    for row in rows:
        writer.writerow({column: spreadsheet_text(row.get(column, "")) for column in columns})
    atomic_write(path, content.getvalue().encode("utf-8-sig"))


def spreadsheet_text(value):
    if isinstance(value, str) and value.lstrip().startswith(("=", "+", "-", "@", "\t", "\r")):
        return "'" + value
    return value


def main():
    parser = argparse.ArgumentParser(description="Prépare un catalogue depuis un export de stock.")
    parser.add_argument("export", type=Path)
    parser.add_argument("--limit", type=int, default=40)
    parser.add_argument("--download-images", action="store_true")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    if args.limit < 1:
        parser.error("--limit doit être positif")

    headers, *rows = json.loads(CATALOGUE.read_text())["data"]
    existing = {reference(row[1]): dict(zip(headers, row)) for row in rows}
    sources = json.loads(SOURCES.read_text())
    legacy_images = {}
    for path in sorted((PUBLIC / "images").glob("[0-9]*/*-1.*")):
        if path.is_file() and path.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"):
            legacy_images.setdefault(reference(path.stem[:-2]), "/" + path.relative_to(PUBLIC).as_posix())
    excluded = Counter()
    unmapped = Counter()
    candidates = {}
    total = 0
    for row in read_stock(args.export):
        total += 1
        ref = reference(row["Référence"])
        created = date(row["Date de création"])
        kind = product_type(row)
        if not positive(row["Stock final des 12 mois"]):
            excluded["stock non positif"] += 1
        elif not positive(row["Prix public 1"]) or not created or not ref or not row["Désignation"]:
            excluded["prix ou données manquantes"] += 1
        elif PARTS.search(plain(row["Désignation"])):
            excluded["pièces et accessoires détectés"] += 1
        elif not kind:
            excluded["famille ou sous-famille hors sélection"] += 1
            unmapped[(row["Famille"], row["Sous-famille"])] += 1
        else:
            updated = date(row["Date de mise à jour"]) or created
            if ref not in candidates or (created, updated) > candidates[ref][:2]:
                candidates[ref] = created, updated, kind, row

    ordered = sorted(candidates, key=lambda ref: (-candidates[ref][0].toordinal(), ref))
    products, image_tasks = [], []
    for ref in ordered[:args.limit]:
        _, _, (category, label), row = candidates[ref]
        previous, source = existing.get(ref, {}), sources.get(ref, {})
        image, error = image_for(ref, previous, source, legacy_images, args.download_images)
        brand = brand_for(row, previous, source)
        product = {
            "id": previous.get("id") or (Path(image).parent.name if re.match(r"/images/\d+/", image) else "stock-" + product_key(ref)),
            "ref_simple": row["Référence"],
            "Désignation": source.get("designation") or row["Désignation"],
            "nom_marque": brand,
            "Catégories": previous.get("Catégories") or category,
            "cat1": previous.get("cat1") or label,
            "cat2": previous.get("cat2") or "",
            "cat3": previous.get("cat3") or "",
            **{key: row[key] for key in ("Prix public 1", "Stock final des 12 mois", "Date de création", "Date de mise à jour")},
            "image-1": image,
        }
        products.append(product)
        if not image:
            search = urlencode({"q": f'{brand} "{row["Référence"]}" photo produit'.strip()})
            image_tasks.append({
                "Référence": row["Référence"], "Marque": brand, "Désignation": row["Désignation"],
                "Fiche": source.get("page", ""), "Recherche": "https://www.google.com/search?" + search,
                "Erreur": error,
            })

    if not products:
        raise ValueError("Aucun produit éligible. Le catalogue reste intact.")
    if len({product["id"] for product in products}) != len(products):
        raise ValueError("Des références partagent le même identifiant catalogue.")
    catalog = {"data": [headers, *[[product[key] for key in headers] for product in products]]}
    data = (json.dumps(catalog, ensure_ascii=False, indent=2) + "\n").encode()
    WORK.mkdir(exist_ok=True)
    atomic_write(WORK / "products.json", data)
    write_csv(WORK / "selection.csv", headers, products)
    write_csv(WORK / "images-manquantes.csv", ["Référence", "Marque", "Désignation", "Fiche", "Recherche", "Erreur"], image_tasks)
    report = {
        "lignes": total, "references_eligibles": len(candidates), "selection": len(products),
        "photos_manquantes": len(image_tasks), "marques_manquantes": sum(not p["nom_marque"] for p in products),
        "categories": dict(Counter(p["Catégories"] for p in products)), "exclusions": dict(excluded),
        "familles_hors_selection": [{"famille": f, "sous_famille": s, "lignes": n} for (f, s), n in unmapped.most_common()],
    }
    atomic_write(WORK / "rapport.json", (json.dumps(report, ensure_ascii=False, indent=2) + "\n").encode())
    if args.apply:
        atomic_write(CATALOGUE, data, mode=0o644)
    print(json.dumps({key: value for key, value in report.items() if key != "familles_hors_selection"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError) as error:
        raise SystemExit(str(error))
