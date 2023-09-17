function editTask(editButton) {
    const listItem = editButton.parentElement;
    const taskName = listItem.textContent;
    const newTaskName = prompt("Edit task:", taskName); // Prompt the user for a new task name
  
    if (newTaskName !== null) {
      // Update the task text if the user didn't cancel the prompt
      listItem.textContent = newTaskName;
      // Implement the PUT request to the server to update the task
      updateTaskOnServer(taskName, newTaskName);
    }
  }
   
async function updateTaskOnServer(oldTaskName, newTaskName) {
    const response = await fetch(`/todo/${encodeURIComponent(oldTaskName)}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ newTaskName }),
    })
        .then(response => {
            if (!response.ok){
                throw new Error("Update not accomplished")
            }})
            console.log("Task updated successfully.")
        .catch(error => {
            console.error("Network error: ",error)
        })
};

    
window.onload = function () {
    document.getElementById("editBtn").addEventListener("click", () => editTask());
};