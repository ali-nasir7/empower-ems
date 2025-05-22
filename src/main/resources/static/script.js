const apiBase = "http://localhost:8080"; // Adjust your backend base URL here

const employeeForm = document.getElementById("employeeForm");
const employeeIdInput = document.getElementById("employeeId");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const messageDiv = document.getElementById("message");
const employeesTableBody = document.getElementById("employeesTableBody");
const resetBtn = document.getElementById("resetBtn");

// Load employees on page load
window.addEventListener("DOMContentLoaded", loadEmployees);

resetBtn.addEventListener("click", resetForm);

employeeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = employeeIdInput.value.trim();
  const employeeData = {
    id: id ? Number(id) : undefined,
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
  };

  try {
    if (id) {
      // Update existing employee
      const res = await fetch(`${apiBase}/employees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      const text = await res.text();
      showMessage(text, "green");
    } else {
      // Create new employee (note your POST endpoint is /employ)
      const res = await fetch(`${apiBase}/employ`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      const text = await res.text();
      showMessage(text, "green");
    }
    resetForm();
    loadEmployees();
  } catch (error) {
    showMessage("Error: " + error.message, "red");
  }
});

async function loadEmployees() {
  try {
    const res = await fetch(`${apiBase}/employees`);
    const employees = await res.json();

    employeesTableBody.innerHTML = "";

    employees.forEach((emp) => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-gray-100";

      tr.innerHTML = `
        <td class="border border-gray-300 px-4 py-2">${emp.id}</td>
        <td class="border border-gray-300 px-4 py-2">${emp.name}</td>
        <td class="border border-gray-300 px-4 py-2">${emp.phone}</td>
        <td class="border border-gray-300 px-4 py-2">${emp.email}</td>
        <td class="border border-gray-300 px-4 py-2 space-x-2">
          <button class="editBtn bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Edit</button>
          <button class="deleteBtn bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
        </td>
      `;

      // Edit button event
      tr.querySelector(".editBtn").addEventListener("click", () => {
        employeeIdInput.value = emp.id;
        nameInput.value = emp.name;
        phoneInput.value = emp.phone;
        emailInput.value = emp.email;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      // Delete button event
      tr.querySelector(".deleteBtn").addEventListener("click", async () => {
        if (confirm(`Are you sure you want to delete employee ID ${emp.id}?`)) {
          try {
            const res = await fetch(`${apiBase}/employees/${emp.id}`, {
              method: "DELETE",
            });
            const text = await res.text();
            showMessage(text, "green");
            loadEmployees();
          } catch (error) {
            showMessage("Delete failed: " + error.message, "red");
          }
        }
      });

      employeesTableBody.appendChild(tr);
    });
  } catch (error) {
    showMessage("Failed to load employees: " + error.message, "red");
  }
}

function resetForm() {
  employeeIdInput.value = "";
  employeeForm.reset();
  messageDiv.textContent = "";
}

function showMessage(msg, color) {
  messageDiv.textContent = msg;
  messageDiv.style.color = color;
  setTimeout(() => (messageDiv.textContent = ""), 3000);
}
