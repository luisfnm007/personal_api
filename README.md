# Personal API

A personal API and small web interface to centralize information from my digital life and, eventually, provide useful context to an AI agent.

This is also a hands-on learning project: I started from scratch with nearly every part of the stack, including Python, APIs, databases, HTML, and CSS.

It currently supports creating, viewing, completing, and deleting tasks stored in a SQLite database.

## Technologies

- Python
- FastAPI
- SQLite
- HTML, CSS & JavaScript

## Current features

- Create tasks from the web interface
- View tasks
- Mark tasks as completed
- Delete tasks

## Run the project

```bash
uvicorn main:app --reload
```

Then open `http://127.0.0.1:8000` in your browser.

The interactive API documentation is available at `http://127.0.0.1:8000/docs`.
