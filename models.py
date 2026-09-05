from pydantic import BaseModel, field_validator


class Task(BaseModel):
    name: str
    description: str
    completed: bool

    @field_validator("name")
    def name_cannot_be_empty(cls, value: str):
        clean_value = value.strip()

        if clean_value == "":
            raise ValueError("name cannot be empty.")

        return clean_value

    @field_validator("description")
    def desc_cannot_be_empty(cls, value: str):
        clean_value = value.strip()

        if clean_value == "":
            raise ValueError("description cannot be empty.")

        return clean_value
