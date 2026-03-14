from pydantic import BaseModel
from typing import List

class TechStackSchema(BaseModel):
    languages: List[str]
    frameworks: List[str]
    databases: List[str]
    cloud: List[str]