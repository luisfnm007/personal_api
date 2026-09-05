const API_URL = "http://127.0.0.1:8000";
const dialog = document.getElementById("message-dialog");
const bttn_close = document.getElementById("bttn-close");
const dialog_message = document.getElementById("message-text");

bttn_close.addEventListener("click", () => {
  dialog.close();
});

document
  .getElementById("task-form")
  .addEventListener("submit", async (event) => {
    const inputName = document.getElementById("name");
    const inputDesc = document.getElementById("description");

    event.preventDefault();

    if (inputName.value.trim() === "") {
      dialog_message.textContent = "Enter a name.";
      inputName.focus();
      dialog.showModal();
      return;
    }

    if (inputDesc.value.trim() === "") {
      dialog_message.textContent = "Enter a description.";
      inputDesc.focus();
      dialog.showModal();
      return;
    }

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
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      dialog_message.textContent = "Task created successfully.";
      dialog.showModal();
      loadTasks();
    } catch (error) {
      dialog_message.textContent = "Error while sending data.";
      dialog.showModal();
    }
  });

async function loadTasks() {
  const response = await fetch(`${API_URL}/tasks/`);

  if (!response.ok) {
    throw new Error("Could not load tasks");
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
          throw new Error("Could not complete task");
        }

        loadTasks();
      });
      taskActions.appendChild(completed_bttn);
    }

    delete_bttn.addEventListener("click", async () => {
      const response = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Can't delete task.");
      }

      loadTasks();
    });

    taskActions.appendChild(delete_bttn);
    item.appendChild(taskActions);
    tasksList.appendChild(item);
  }
}

loadTasks();
