import sqlite3
from models import Task

def get_connection():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    return connection

def get_tasks():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM tasks")
    rows = cursor.fetchall()

    connection.close()

    return [dict(row) for row in rows]

def get_task(task_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = cursor.fetchone()

    connection.close()

    if row is None:
        return None

    return dict(row)

def add_task(new_task: Task):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    INSERT INTO tasks (name, description, completed)
    VALUES (?, ?, ?)
    """, (new_task.name, new_task.description, new_task.completed))

    task_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return{
        "id": task_id,
        "name": new_task.name,
        "description": new_task.description,
        "completed": new_task.completed
    }

def update_task(task_id: int, updated_task: Task):
    connection=get_connection()
    cursor = connection.cursor()

    cursor.execute("""
    UPDATE tasks
    SET name = ?, description = ?, completed = ?
    WHERE id = ?
    """,
    (updated_task.name, updated_task.description, updated_task.completed, task_id))

    connection.commit()

    rowcount = cursor.rowcount

    connection.close()

    if rowcount == 0:
        return None

    return {
        "id": task_id,
        "name": updated_task.name,
        "description": updated_task.description,
        "completed": updated_task.completed 
    }

def delete_task(task_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM tasks
        WHERE id = ?
    """, (task_id,))

    connection.commit()

    rowcount = cursor.rowcount

    connection.close()

    if rowcount == 0:
        return None

    return "Task deleted successfully"

