document.addEventListener("DOMContentLoaded", function () {
  const userName = document.getElementById("userName");
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

      const response = await fetch("profile", {
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
    const storedName = user.username;
    const storedEmail =
      localStorage.getItem("profileEmail") || "johnpork@example.com";
    const storedBio =
      localStorage.getItem("profileBio") || "This is a sample bio.";

    userName.textContent = storedName;
    userEmail.textContent = storedEmail;
    userBio.textContent = storedBio;

    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      profileImg.src = storedProfilePic;
    }
  }

  editProfileBtn.addEventListener("click", function () {
    editProfileForm.classList.remove("hidden");
    editName.value = userName.textContent;
    editEmail.value = userEmail.textContent;
    editBio.value = userBio.textContent;
  });

  saveProfileBtn.addEventListener("click", function () {
    localStorage.setItem("profileName", editName.value);
    localStorage.setItem("profileEmail", editEmail.value);
    localStorage.setItem("profileBio", editBio.value);

    userName.textContent = editName.value;
    userEmail.textContent = editEmail.value;
    userBio.textContent = editBio.value;

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
