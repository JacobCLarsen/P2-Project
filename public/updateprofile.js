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

      alert("Profile updated successfully!");
      console.log("Updated Profile:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(`Error updating profile: ${error.message}`);
    }
  });
