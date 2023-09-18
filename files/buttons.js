//  <script src="buttons.js"></script>

function editTask() {
    console.log("editTask()")
    const textfieldinput = document.getElementById("textfield").value;

    fetch("'/todo/:taskID'", { //url korrigieren
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(textfieldinput)
        })

        .then (async response => {
            if (!response.ok){
            console.log("Process error for adding data.")
            }
            const test = await response.json();
            const updatedResource = JSON.parse(test)

            let updatedText = document.getElementById("textfield");
            updatedText.placeholder = updatedResource;

            console.log("Resource added successfully.")
        })
        .catch (error => {
        console.error("Network error: ", error)
        })
}
    
window.onload = function () {
    document.getElementById("editBtn").addEventListener("click", () => editTask());
    // document.getElementById("editBtn").addEventListener("click", () => deleteTask());
    // document.getElementById("editBtn").addEventListener("click", () => saveTask());
};
