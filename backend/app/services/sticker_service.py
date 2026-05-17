import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.repositories.sticker_repository import StickerRepository
from app.schemas.sticker import AlbumStats, StickerCreate, StickerUpdate

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "stickers.json"


class StickerService:
    def __init__(self, db: Session):
        self.repository = StickerRepository(db)

    def get_all_stickers(self):
        return self.repository.get_all()

    def get_sticker(self, sticker_id: int):
        return self.repository.get_by_id(sticker_id)

    def get_stickers_by_country(self, country: str):
        return self.repository.get_by_country(country)

    def get_owned_stickers(self):
        return self.repository.get_owned()

    def get_missing_stickers(self):
        return self.repository.get_missing()

    def get_duplicates(self):
        return self.repository.get_duplicates()

    def create_sticker(self, data: StickerCreate):
        return self.repository.create(data)

    def seed_album(self):
        if self.repository.count_total() > 0:
            return {"message": "Álbum já populado", "count": self.repository.count_total()}
        stickers = _load_stickers_from_json()
        count = self.repository.bulk_create(stickers)
        return {"message": "Álbum populado com sucesso", "count": count}

    def update_sticker(self, sticker_id: int, data: StickerUpdate):
        return self.repository.update(sticker_id, data)

    def toggle_sticker_by_code(self, code: str):
        sticker = self.repository.get_by_code(code)
        if not sticker:
            return None
        if sticker.owned:
            new_quantity = sticker.quantity + 1
        else:
            new_quantity = 1
        return self.repository.update(sticker.id, StickerUpdate(quantity=new_quantity, owned=True))

    def remove_sticker_by_code(self, code: str):
        sticker = self.repository.get_by_code(code)
        if not sticker:
            return None
        new_quantity = max(0, sticker.quantity - 1)
        return self.repository.update(sticker.id, StickerUpdate(quantity=new_quantity))

    def get_stats(self) -> AlbumStats:
        total = self.repository.count_total()
        owned = self.repository.count_owned()
        missing = total - owned
        duplicates = self.repository.count_duplicates()
        pct = round((owned / total) * 100, 1) if total > 0 else 0
        return AlbumStats(
            total=total,
            owned=owned,
            missing=missing,
            duplicates=duplicates,
            completion_percentage=pct,
        )

    def get_country_progress(self):
        return self.repository.get_country_stats()


def _load_stickers_from_json() -> list[StickerCreate]:
    with open(DATA_FILE, encoding="utf-8") as f:
        raw = json.load(f)
    return [
        StickerCreate(
            code=s["code"],
            name=s["name"],
            country=s["country"],
            group=s["group"],
            category=s["category"],
        )
        for s in raw
    ]
