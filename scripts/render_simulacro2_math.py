from pathlib import Path

import pdfplumber


SOURCE_DIR = Path(
    r"C:\Users\cmoli\OneDrive - VIRTUAL PLANET\VIRTUAL PLANET\S.A.T TRAINING"
)
OUTPUT_DIR = Path(
    r"C:\Users\cmoli\OneDrive\Documentos\New project\sat-math-simulacro\app\public\math\simulacro2"
)

MODULES = {
    1: SOURCE_DIR / "SIMULACRO 2 MATH módulo 1.pdf",
    2: SOURCE_DIR / "SIMULACRO 2 MATH módulo 2.pdf",
}

QUESTION_COUNT = 22
RESOLUTION = 180


def find_question_labels(page):
    labels = []
    for word in page.extract_words(x_tolerance=1, y_tolerance=3):
        text = word["text"].strip().rstrip(".")
        if not text.isdigit():
            continue

        number = int(text)
        if number < 1 or number > 25:
            continue

        chars = [
            char
            for char in page.chars
            if char["x0"] >= word["x0"] - 0.5
            and char["x1"] <= word["x1"] + 0.5
            and char["top"] >= word["top"] - 0.5
            and char["bottom"] <= word["bottom"] + 0.5
        ]
        if not chars:
            continue

        if not all(
            isinstance(char.get("non_stroking_color"), tuple)
            and len(char["non_stroking_color"]) == 4
            and char["non_stroking_color"][-1] == 0.0
            for char in chars
        ):
            continue

        x0 = word["x0"]
        if x0 < 90:
            column = "left"
        elif 300 <= x0 <= 360:
            column = "right"
        else:
            continue

        labels.append(
            {
                "number": number,
                "column": column,
                "top": word["top"],
                "bottom": word["bottom"],
            }
        )

    unique = {}
    for label in labels:
        key = (label["number"], label["column"])
        if key not in unique or label["top"] < unique[key]["top"]:
            unique[key] = label

    return sorted(unique.values(), key=lambda item: (item["top"], item["column"]))


def crop_box_for_label(page, label, labels):
    if label["column"] == "left":
        left, right = 32, page.width / 2 - 7
    else:
        left, right = page.width / 2 + 7, page.width - 32

    same_column_next = [
        item
        for item in labels
        if item["column"] == label["column"] and item["top"] > label["top"] + 4
    ]

    top = max(0, label["top"] - 8)
    bottom = min(page.height - 28, same_column_next[0]["top"] - 10) if same_column_next else page.height - 28

    return (left, top, right, bottom)


def render_module(module_id, pdf_path):
    module_dir = OUTPUT_DIR / f"module{module_id}"
    module_dir.mkdir(parents=True, exist_ok=True)

    with pdfplumber.open(pdf_path) as pdf:
        found = {}
        for page_index, page in enumerate(pdf.pages, start=1):
            labels = find_question_labels(page)
            for label in labels:
                number = label["number"]
                if number > QUESTION_COUNT or number in found:
                    continue

                cropped = page.crop(crop_box_for_label(page, label, labels))
                image = cropped.to_image(resolution=RESOLUTION).original
                out_path = module_dir / f"q{number:02d}.png"
                image.save(out_path)
                found[number] = page_index

    missing = [number for number in range(1, QUESTION_COUNT + 1) if number not in found]
    if missing:
        raise RuntimeError(f"Module {module_id} missing question crops: {missing}")

    print(f"Module {module_id}: rendered {len(found)} question images")


def main():
    for module_id, pdf_path in MODULES.items():
        render_module(module_id, pdf_path)


if __name__ == "__main__":
    main()
