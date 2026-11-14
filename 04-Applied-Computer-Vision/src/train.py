import argparse
from pathlib import Path

from ultralytics import YOLO


def main() -> None:
    parser = argparse.ArgumentParser(description="Treino local do detector experimental de água sobre via.")
    parser.add_argument("--data", default="data/dataset.yaml")
    parser.add_argument("--weights", required=True, help="arquivo local de pesos-base previamente aprovado")
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--imgsz", type=int, default=640)
    parser.add_argument("--project", default="runs/gs")
    args = parser.parse_args()

    data = Path(args.data)
    weights = Path(args.weights)
    if not data.is_file():
        raise FileNotFoundError(f"Arquivo de configuração ausente: {data}")
    if not weights.is_file():
        raise FileNotFoundError(f"Pesos locais ausentes: {weights}")
    if args.epochs < 1 or args.imgsz < 64:
        raise ValueError("epochs deve ser positivo e imgsz pelo menos 64")

    model = YOLO(str(weights))
    result = model.train(
        data=str(data),
        epochs=args.epochs,
        imgsz=args.imgsz,
        project=args.project,
        name="water-on-road",
        seed=42,
        deterministic=True,
        exist_ok=False,
        plots=True,
        save=True,
    )
    print(f"Treinamento concluído; evidências em {result.save_dir}")


if __name__ == "__main__":
    main()
