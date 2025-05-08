document.addEventListener("DOMContentLoaded", function () {
  const userName = document.getElementById("userName");
  const userScore = document.getElementById("userScore");
  const userEmail = document.getElementById("userEmail");
  const userBio = document.getElementById("userBio");
  const profileImg = document.getElementById("profileImg");

  const editProfileBtn = document.getElementById("editProfileBtn");
  const editProfileForm = document.getElementById("editProfileForm");
  const editName = document.getElementById("editName");
  const editEmail = document.getElementById("editEmail");
  const editBio = document.getElementById("editBio");
  const saveProfileBtn = document.getElementById("saveProfileBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  const uploadProfilePic = document.getElementById("uploadProfilePic");
  const changeProfilePicBtn = document.getElementById("changeProfilePicBtn");

  async function fetchData() {
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token); // Debug log

      const response = await fetch("profile-data", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status); // Debug log

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status: ${response.status}`
        );
      }

      if (data.success) {
        console.log("Profile loaded successfully:", data.user);
        loadProfile(data.user);
      } else {
        throw new Error(data.message || "Failed to load profile data");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      alert(`Error loading profile: ${error.message}`);
    }
  }

  fetchData(); //Call the function to fetch data when the page loads

  async function loadProfile(user) {
    userName.textContent = user.username;
    userScore.textContent = user.score;
    userEmail.textContent = user.email;
    userBio.textContent = user.bio;
    userTasks.textContent = user.tasks;

    editName.value = user.username;
    editEmail.value = user.email;
    editBio.textContent = user.bio;

    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      profileImg.src = storedProfilePic;
    }
  }

  editProfileBtn.addEventListener("click", function () {
    if (editProfileForm.classList.contains("hidden")) {
      editProfileForm.classList.remove("hidden");
    } else {
      editProfileForm.classList.add("hidden");
    }
  });

  saveProfileBtn.addEventListener("click", function () {
    editProfileForm.classList.add("hidden");
  });

  cancelEditBtn.addEventListener("click", function () {
    editProfileForm.classList.add("hidden");
  });

  changeProfilePicBtn.addEventListener("click", function () {
    uploadProfilePic.click(); //Open file input dialog
  });

  uploadProfilePic.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImg.src = e.target.result;
        localStorage.setItem("profilePic", e.target.result); //Store image as Base64
      };
      reader.readAsDataURL(file);
    }
  });
});

document
  .getElementById("saveProfileBtn")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    const updatedData = {
      username: document.getElementById("editName").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      bio: document.getElementById("editBio").value.trim(),
    };

    try {
      const response = await fetch("profile-update", {
        method: "PUT", // Updating user data
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      console.log("Updated Profile:", data);
      location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
    }
  });
