from sqlalchemy import Boolean, Column, Integer, String
from app.database import Base


class Sticker(Base):
    __tablename__ = "stickers"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    group = Column(String, nullable=False)
    category = Column(String, nullable=False, default="player")
    owned = Column(Boolean, default=False)
    quantity = Column(Integer, default=0)
