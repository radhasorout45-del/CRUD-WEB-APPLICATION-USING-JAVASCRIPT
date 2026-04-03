let users = [];
let filtered = [];
let editIndex = null;

// FETCH USERS
async function fetchUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await res.json();

  users = data.map(u => ({
    name: u.name,
    id: u.id,
    address: u.address.city,
    designation: "Employee"
  }));

  filtered = [...users];
  render();
}

// RENDER TABLE
function render() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  filtered.forEach((u, i) => {
    tbody.innerHTML += `
      <tr>
        <td contenteditable onblur="update(${i}, 'name', this.innerText)">${u.name}</td>
        <td>${u.id}</td>
        <td contenteditable onblur="update(${i}, 'address', this.innerText)">${u.address}</td>
        <td contenteditable onblur="update(${i}, 'designation', this.innerText)">${u.designation}</td>
        <td>
          <button class="view" onclick="viewUser(${i})">View</button>
          <button class="edit" onclick="editUser(${i})">Edit</button>
          <button class="delete" onclick="deleteUser(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// SAVE / UPDATE
function saveUser() {
  const u = {
    name: name.value,
    id: id.value,
    address: address.value,
    designation: designation.value
  };

  if (!u.name || !u.id) {
    showToast("Name & ID required");
    return;
  }

  if (editIndex !== null) {
    filtered[editIndex] = u;
    users = [...filtered];
    editIndex = null;
    showToast("User Updated");
  } else {
    users.push(u);
    showToast("User Added");
  }

  filtered = [...users];
  render();
  resetForm();
}

// EDIT
function editUser(i) {
  const u = filtered[i];

  name.value = u.name;
  id.value = u.id;
  address.value = u.address;
  designation.value = u.designation;

  editIndex = i;
  showToast("Editing...");
}

// INLINE UPDATE
function update(i, field, value) {
  filtered[i][field] = value;
  showToast("Updated");
}

// DELETE
function deleteUser(i) {
  if (confirm("Delete this user?")) {
    filtered.splice(i, 1);
    users = [...filtered];
    render();
    showToast("Deleted");
  }
}

// VIEW MODAL
function viewUser(i) {
  const u = filtered[i];

  document.getElementById("viewData").innerHTML = `
    <b>Name:</b> ${u.name}<br>
    <b>ID:</b> ${u.id}<br>
    <b>Address:</b> ${u.address}<br>
    <b>Designation:</b> ${u.designation}
  `;

  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// SEARCH
function searchUser(q) {
  filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase())
  );
  render();
}

// RESET
function resetForm() {
  document.querySelectorAll("input").forEach(i => i.value="");
  editIndex = null;
}

// TOAST
function showToast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";
  setTimeout(() => t.style.display = "none", 2000);
}

// INIT
fetchUsers();