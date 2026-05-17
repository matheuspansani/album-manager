from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.sticker import StickerResponse, StickerUpdate, AlbumStats, CountryProgress
from app.services.sticker_service import StickerService

router = APIRouter(prefix="/api/stickers", tags=["stickers"])


def get_service(db: Session = Depends(get_db)) -> StickerService:
    return StickerService(db)


@router.get("/", response_model=list[StickerResponse])
def list_stickers(service: StickerService = Depends(get_service)):
    return service.get_all_stickers()


@router.get("/stats", response_model=AlbumStats)
def get_stats(service: StickerService = Depends(get_service)):
    return service.get_stats()


@router.get("/progress", response_model=list[CountryProgress])
def get_progress(service: StickerService = Depends(get_service)):
    return service.get_country_progress()


@router.get("/owned", response_model=list[StickerResponse])
def list_owned(service: StickerService = Depends(get_service)):
    return service.get_owned_stickers()


@router.get("/missing", response_model=list[StickerResponse])
def list_missing(service: StickerService = Depends(get_service)):
    return service.get_missing_stickers()


@router.get("/duplicates", response_model=list[StickerResponse])
def list_duplicates(service: StickerService = Depends(get_service)):
    return service.get_duplicates()


@router.get("/country/{country}", response_model=list[StickerResponse])
def list_by_country(country: str, service: StickerService = Depends(get_service)):
    return service.get_stickers_by_country(country)


@router.get("/{sticker_id}", response_model=StickerResponse)
def get_sticker(sticker_id: int, service: StickerService = Depends(get_service)):
    sticker = service.get_sticker(sticker_id)
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker not found")
    return sticker


@router.patch("/{sticker_id}", response_model=StickerResponse)
def update_sticker(sticker_id: int, data: StickerUpdate, service: StickerService = Depends(get_service)):
    sticker = service.update_sticker(sticker_id, data)
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker not found")
    return sticker


@router.post("/toggle/{code}", response_model=StickerResponse)
def toggle_sticker(code: str, service: StickerService = Depends(get_service)):
    sticker = service.toggle_sticker_by_code(code.upper())
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker not found")
    return sticker


@router.post("/remove/{code}", response_model=StickerResponse)
def remove_sticker(code: str, service: StickerService = Depends(get_service)):
    sticker = service.remove_sticker_by_code(code.upper())
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker not found")
    return sticker


@router.post("/seed")
def seed_album(service: StickerService = Depends(get_service)):
    return service.seed_album()
