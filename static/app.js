const API_URL = "http://127.0.0.1:8000";
const dialog = document.getElementById("message-dialog");
const bttn_close = document.getElementById("bttn-close");
const dialog_message = document.getElementById("message-text");

async function getErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();

    if (Array.isArray(data.detail)) {
      return data.detail[0].msg;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

bttn_close.addEventListener("click", () => {
  dialog.close();
});

document
  .getElementById("task-form")
  .addEventListener("submit", async (event) => {
    const inputName = document.getElementById("name");
    const inputDesc = document.getElementById("description");

    event.preventDefault();

    const form = {
      name: inputName.value,
      description: inputDesc.value,
      completed: false,
    };

    try {
      //fetch returns an element of type Response, which contanins
      //general information of the API response (status,ok,headers)

      //await is used to indicate that the program will wait for
      //the API response
      const response = await fetch(`${API_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), //converts the form content to JSON format
      });

      if (!response.ok) {
        const message = await getErrorMessage(
          response,
          "Could not create the task."
        );
        throw new Error(message);
      }

      await loadTasks();
    } catch (error) {
      dialog_message.textContent = error.message;
      dialog.showModal();
    }
  });

async function loadTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks/`);

    if (!response.ok) {
      const message = await getErrorMessage(
        response,
        "Could not load tasks."
      );
      throw new Error(message);
    }

    //.json() returns the value (arr, string, number)
    // represented in JSON that comes from the API response body
    const tasks = await response.json(); //json represents an array in this case

    const tasksList = document.getElementById("tasks-list");
    tasksList.textContent = "";

    for (const task of tasks) {
    const item = document.createElement("li");
    item.className = task.completed ? "completed-task" : "pending-task";

    //"strong" gives the text importance by making it bold
    //and tells the browser that the content is urgent
    const name = document.createElement("strong");
    name.textContent = task.name;
    item.appendChild(name);

    const desc = document.createElement("p");
    desc.textContent = task.description;
    item.appendChild(desc);

    const taskActions = document.createElement("div");
    taskActions.className = "task-actions";

    const delete_bttn = document.createElement("button");
    delete_bttn.type = "button";
    delete_bttn.textContent = "Delete";
    delete_bttn.className = "delete-button";

    if (!task.completed) {
      const completed_bttn = document.createElement("button");
      completed_bttn.type = "button";
      completed_bttn.textContent = "Mark completed";

      completed_bttn.addEventListener("click", async () => {
        try {
          const response = await fetch(`${API_URL}/tasks/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: task.name,
              description: task.description,
              completed: true,
            }),
          });

          if (!response.ok) {
            const message = await getErrorMessage(
              response,
              "Could not complete the task."
            );
            throw new Error(message);
          }

          await loadTasks();
        } catch (error) {
          dialog_message.textContent = error.message;
          dialog.showModal();
        }
      });
      taskActions.appendChild(completed_bttn);
    }

    delete_bttn.addEventListener("click", async () => {
      try {
        const response = await fetch(`${API_URL}/tasks/${task.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const message = await getErrorMessage(
            response,
            "Could not delete the task."
          );
          throw new Error(message);
        }

        await loadTasks();
      } catch (error) {
        dialog_message.textContent = error.message;
        dialog.showModal();
      }
    });

    taskActions.appendChild(delete_bttn);
    item.appendChild(taskActions);
      tasksList.appendChild(item);
    }
  } catch (error) {
    dialog_message.textContent =
      error instanceof TypeError
        ? "Could not connect to the API. Check that the server is running."
        : error.message;
    dialog.showModal();
  }
}

loadTasks();
