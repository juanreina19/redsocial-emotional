const API_URL = "http://localhost:4000/api";
const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "auth.html";
}

async function loadProfile() {
    try {
        // 1️⃣ Traer datos del perfil
        const resProfile = await fetch(`${API_URL}/users/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!resProfile.ok) throw new Error("Error al cargar perfil");

        const profile = await resProfile.json();

        document.getElementById("profileAvatar").src = profile.avatar || "https://www.w3schools.com/howto/img_avatar.png";
        document.getElementById("profileUsername").textContent = `@${profile.username}`;
        document.getElementById("profileBio").textContent = profile.bio || "";
        document.getElementById("followersCount").textContent = profile.followers?.length || 0;
        document.getElementById("followingCount").textContent = profile.following?.length || 0;

        // 2️⃣ Traer publicaciones del usuario
        const resPosts = await fetch(`${API_URL}/posts/mine`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!resPosts.ok) throw new Error("Error al cargar publicaciones");

        const posts = await resPosts.json();
        document.getElementById("postCount").textContent = posts.length;

        const postsGrid = document.getElementById("userPosts");
        postsGrid.innerHTML = posts.map(post => `
      <div>
        ${post.image ? `<img src="${post.image}" alt="post">` : `<div style="background:#eee;height:200px;"></div>`}
      </div>
    `).join("");

    } catch (error) {
        console.error(error);
        alert("No se pudo cargar el perfil");
    }
};

loadProfile();

const modal = document.getElementById("editProfileModal");
const editBtn = document.getElementById("editProfileBtn");
const closeBtn = document.querySelector(".close");
const editForm = document.getElementById("editProfileForm");
const avatarInput = document.getElementById("editAvatar");
const avatarPreview = document.getElementById("editAvatarPreview");

// Abrir modal y cargar datos
editBtn.addEventListener("click", () => {
    fetch(`${API_URL}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(user => {
            document.getElementById("editName").value = user.username || "";
            document.getElementById("editBio").value = user.bio || "";
            avatarInput.value = user.avatar || "";
            avatarPreview.src = user.avatar || "https://www.w3schools.com/howto/img_avatar.png";
        });

    modal.style.display = "block";
});

// Vista previa de avatar en tiempo real
avatarInput.addEventListener("input", () => {
    avatarPreview.src = avatarInput.value || "https://www.w3schools.com/howto/img_avatar.png";
});

// Cerrar modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };

// Guardar cambios
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
        username: document.getElementById("editName").value,
        bio: document.getElementById("editBio").value,
        avatar: avatarInput.value
    };

    const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        alert("Perfil actualizado");
        modal.style.display = "none";
        location.reload();
    } else {
        alert("Error al actualizar perfil");
    }
});