from pydantic import BaseModel


class StickerBase(BaseModel):
    code: str
    name: str
    country: str
    group: str
    category: str = "player"


class StickerCreate(StickerBase):
    pass


class StickerResponse(StickerBase):
    id: int
    owned: bool
    quantity: int

    model_config = {"from_attributes": True}


class StickerUpdate(BaseModel):
    owned: bool | None = None
    quantity: int | None = None


class AlbumStats(BaseModel):
    total: int
    owned: int
    missing: int
    duplicates: int
    completion_percentage: float


class CountryProgress(BaseModel):
    country: str
    group: str
    total: int
    owned: int
    completion_percentage: float
