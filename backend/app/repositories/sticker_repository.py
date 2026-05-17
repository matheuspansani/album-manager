from sqlalchemy import Integer, func
from sqlalchemy.orm import Session

from app.models.sticker import Sticker
from app.schemas.sticker import StickerCreate, StickerUpdate


class StickerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Sticker]:
        return self.db.query(Sticker).order_by(Sticker.group, Sticker.country, Sticker.code).all()

    def get_by_id(self, sticker_id: int) -> Sticker | None:
        return self.db.query(Sticker).filter(Sticker.id == sticker_id).first()

    def get_by_code(self, code: str) -> Sticker | None:
        return self.db.query(Sticker).filter(Sticker.code == code).first()

    def get_by_country(self, country: str) -> list[Sticker]:
        return self.db.query(Sticker).filter(Sticker.country == country).order_by(Sticker.code).all()

    def get_owned(self) -> list[Sticker]:
        return self.db.query(Sticker).filter(Sticker.owned.is_(True)).order_by(Sticker.code).all()

    def get_missing(self) -> list[Sticker]:
        return self.db.query(Sticker).filter(Sticker.owned.is_(False)).order_by(Sticker.code).all()

    def get_duplicates(self) -> list[Sticker]:
        return self.db.query(Sticker).filter(Sticker.quantity > 1).order_by(Sticker.code).all()

    def create(self, data: StickerCreate) -> Sticker:
        sticker = Sticker(**data.model_dump())
        self.db.add(sticker)
        self.db.commit()
        self.db.refresh(sticker)
        return sticker

    def bulk_create(self, stickers: list[StickerCreate]) -> int:
        objects = [Sticker(**s.model_dump()) for s in stickers]
        self.db.add_all(objects)
        self.db.commit()
        return len(objects)

    def update(self, sticker_id: int, data: StickerUpdate) -> Sticker | None:
        sticker = self.get_by_id(sticker_id)
        if not sticker:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(sticker, key, value)
        if "quantity" in update_data:
            sticker.owned = sticker.quantity > 0
        self.db.commit()
        self.db.refresh(sticker)
        return sticker

    def count_total(self) -> int:
        return self.db.query(func.count(Sticker.id)).scalar() or 0

    def count_owned(self) -> int:
        return self.db.query(func.count(Sticker.id)).filter(Sticker.owned.is_(True)).scalar() or 0

    def count_duplicates(self) -> int:
        return self.db.query(func.coalesce(func.sum(Sticker.quantity - 1), 0)).filter(Sticker.quantity > 1).scalar() or 0

    def get_country_stats(self) -> list[dict]:
        results = (
            self.db.query(
                Sticker.country,
                Sticker.group,
                func.count(Sticker.id).label("total"),
                func.sum(func.cast(Sticker.owned, Integer)).label("owned"),
            )
            .group_by(Sticker.country, Sticker.group)
            .order_by(Sticker.group, Sticker.country)
            .all()
        )
        return [
            {
                "country": r.country,
                "group": r.group,
                "total": r.total,
                "owned": int(r.owned or 0),
                "completion_percentage": round((int(r.owned or 0) / r.total) * 100, 1) if r.total > 0 else 0,
            }
            for r in results
        ]
