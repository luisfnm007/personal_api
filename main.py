from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import database
from models import Task

app = FastAPI()

# ==================================
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def home():
    path = "templates/index.html"
    return FileResponse(path, media_type="text/html")


@app.get("/about")
def about():
    return {"name": "Fernando Personal API", "version": "0.1.0", "status": "learning"}


# ==================================


@app.post("/tasks/")
def add_task(task: Task):
    return database.add_task(task)


@app.get("/tasks/")
def get_tasks():
    return database.get_tasks()


@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    row = database.get_task(task_id)

    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return row


@app.put("/tasks/{task_id}")
def update_item(task_id: int, updated_task: Task):
    updated_row = database.update_task(task_id, updated_task)

    if updated_row is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_row


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    message = database.delete_task(task_id)

    if message is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": message}


# ===================================
