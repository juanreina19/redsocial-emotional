const API_URL = "http://localhost:4000/api/posts"; // Ajusta a tu backend
const token = localStorage.getItem("token");

if (!token) {
    alert("Debes iniciar sesión primero");
    window.location.href = "auth.html";
}

// Función para crear una tarjeta de publicación
function createPostCard(post) {
    return `
    <div class="post-card">
      <div class="card-header">
        <img src="${post.author.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}" alt="avatar">
        <div class="info">
          <span class="username">@${post.author.username}</span>
          <span class="time">${new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>
      <div class="card-content">
        ${post.content}
      </div>
      <div class="card-footer">
        <button class="like-btn" data-id="${post._id}">
          ❤️ ${post.likes.length}
        </button>
        <button class="comment-btn" data-id="${post._id}">💬 ${post.comments.length}</button>
      </div>
    </div>
  `;
}

// Cargar publicaciones del backend
async function loadFeed() {
    try {
        const res = await fetch(`${API_URL}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Error al cargar publicaciones");

        const posts = await res.json();
        const feedContainer = document.getElementById("feedContainer");

        feedContainer.innerHTML = posts.map(createPostCard).join("");

        // Eventos para dar like
        document.querySelectorAll(".like-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const postId = btn.dataset.id;
                await fetch(`${API_URL}/${postId}/like`, {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                loadFeed(); // Recargar para actualizar contador
            });
        });

    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las publicaciones");
    }
}

loadFeed();
