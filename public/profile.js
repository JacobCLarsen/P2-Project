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

  const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage after login

  // Fetch the user's profile from the server
  function fetchProfile() {
    fetch(`/profile/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          userName.textContent = data.profile.name || "John Doe";
          userEmail.textContent = data.profile.email || "example@example.com";
          userBio.textContent = data.profile.bio || "This is a sample bio.";
          if (data.profile.profile_pic) {
            profileImg.src = data.profile.profile_pic;
          }
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }

  // Save the user's profile to the server
  saveProfileBtn.addEventListener("click", function () {
    const profileData = {
      userId,
      name: editName.value,
      email: editEmail.value,
      bio: editBio.value,
      profilePic: profileImg.src,
    };

    fetch("/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          userName.textContent = editName.value;
          userEmail.textContent = editEmail.value;
          userBio.textContent = editBio.value;
          editProfileForm.classList.add("hidden");
          console.log(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error saving profile:", error));
  });

  editProfileBtn.addEventListener("click", function () {
    editProfileForm.classList.remove("hidden");
    editName.value = userName.textContent;
    editEmail.value = userEmail.textContent;
    editBio.value = userBio.textContent;
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

  // Load the profile when the page is loaded
  document.addEventListener("DOMContentLoaded", fetchProfile);
});
