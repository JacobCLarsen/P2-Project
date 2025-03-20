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

  function loadProfile() {
    const storedName = localStorage.getItem("profileName") || "John Pork";
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

  // Fetch and log profile data from the server
  fetch("/profiles")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (data.profiles.length === 0) {
          console.warn("No profiles found in the database.");
        } else {
          console.log("Profile data:", data.profiles);
        }
      } else {
        console.error("Failed to fetch profile data:", data.error);
      }
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });

  loadProfile();
});
