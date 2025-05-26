const userCardContainer = document.getElementById("user-container");
const userEditForm = document.getElementById("edit-form");
const userEditFields = {
  name: document.getElementById("edit-name"),
  username: document.getElementById("edit-username"),
  phone: document.getElementById("edit-phone"),
  website: document.getElementById("edit-website"),
  email: document.getElementById("edit-email"),
};
const loadingIndicator = document.getElementById("loader");
let selectedUserIndex = null;
let userList = [];

function showLoader() {
  loadingIndicator.classList.add("active");
}

function hideLoader() {
  loadingIndicator.classList.remove("active");
}

async function getUsers() {
  try {
    showLoader();
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    userList = await response.json();
    renderUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    hideLoader();
  }
}

function renderUsers() {
  userCardContainer.innerHTML = "";
  userList.forEach((user, index) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");
    userCard.innerHTML = `
            <div class="card-header">${user.name}</div>
            <div class="card-username">@${user.username}</div>
            <div class="card-body">
                <div class="card-section"><span>phone</span><strong>${user.phone}</strong></div>
                <div class="card-section"><span>website</span><strong>${user.website}</strong></div>
                <div class="card-section"><span>email</span><strong>${user.email}</strong></div>
            </div>
            <div class="card-actions">
                <button class="edit-btn" onclick="editUser(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteUser(${index})">Delete</button>
            </div>
        `;
    userCardContainer.appendChild(userCard);
  });
}

function editUser(index) {
  selectedUserIndex = index;
  const user = userList[index];
  userEditFields.name.value = user.name;
  userEditFields.username.value = user.username;
  userEditFields.phone.value = user.phone;
  userEditFields.website.value = user.website;
  userEditFields.email.value = user.email;
  userEditForm.classList.remove("hidden");
  userEditForm.classList.add("show");
}

document.getElementById("save-button").addEventListener("click", async () => {
  if (selectedUserIndex !== null) {
    showLoader();
    const updatedUser = {
      name: userEditFields.name.value,
      username: userEditFields.username.value,
      phone: userEditFields.phone.value,
      website: userEditFields.website.value,
      email: userEditFields.email.value,
    };
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${selectedUserIndex + 1}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );
      if (response.ok) {
        userList[selectedUserIndex] = updatedUser;
        renderUsers();
        userEditForm.classList.add("hidden");
        userEditForm.classList.remove("show");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      hideLoader();
    }
  }
});

async function deleteUser(index) {
  showLoader();
  const userCard = userCardContainer.children[index];
  userCard.classList.add("fade-out");
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${index + 1}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      userList.splice(index, 1);
      renderUsers();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  } finally {
    hideLoader();
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && selectedUserIndex !== null) {
    document.getElementById("save-button").click();
  }
});
// dont watch here! try it yourself :))
document.querySelector('.easter-egg').addEventListener('click', function() {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
});

getUsers();