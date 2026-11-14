import argparse
from pathlib import Path

from ultralytics import YOLO


def main() -> None:
    parser = argparse.ArgumentParser(description="Demonstração de candidatos visuais, não de alertas oficiais.")
    parser.add_argument("--weights", required=True)
    parser.add_argument("--source", required=True, help="imagem ou vídeo local autorizado")
    parser.add_argument("--output", default="runs/detect")
    parser.add_argument("--confidence", type=float, default=0.4)
    args = parser.parse_args()

    weights, source = Path(args.weights), Path(args.source)
    if not weights.is_file() or not source.is_file():
        raise FileNotFoundError("Informe arquivo de pesos e mídia locais existentes")
    if not 0 <= args.confidence <= 1:
        raise ValueError("confidence precisa estar entre 0 e 1")
    model = YOLO(str(weights))
    results = model.predict(
        source=str(source),
        conf=args.confidence,
        save=True,
        project=args.output,
        name="water-on-road",
        exist_ok=False,
    )
    print(f"Candidatos: {sum(len(result.boxes) for result in results)}; revisar antes de qualquer uso.")


if __name__ == "__main__":
    main()
