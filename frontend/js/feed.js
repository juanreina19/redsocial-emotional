const API_URL = "http://localhost:4000/api/posts";
const token = localStorage.getItem("token");

if (!token) {
  alert("Debes iniciar sesión primero");
  window.location.href = "auth.html";
}

// Colores para cada mood
const moodColors = {
  feliz: "0 4px 10px rgba(255, 223, 0, 0.6)",     // Amarillo
  triste: "0 4px 10px rgba(0, 123, 255, 0.6)",    // Azul
  enojado: "0 4px 10px rgba(255, 0, 0, 0.6)",     // Rojo
  neutral: "0 4px 10px rgba(128, 128, 128, 0.6)"   // Gris
};

// Función para crear una tarjeta de publicación
function createPostCard(post) {
  const boxShadow = moodColors[post.mood] || moodColors.neutral;
  return `
    <div class="post-card" style="box-shadow: ${boxShadow}">
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

    // Like
    document.querySelectorAll(".like-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const postId = btn.dataset.id;
        await fetch(`${API_URL}/${postId}/like`, {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` }
        });
        loadFeed();
      });
    });

    // Comentarios
    document.querySelectorAll(".comment-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.id;
        openCommentsModal(postId);
      });
    });

  } catch (error) {
    console.error(error);
    showToast("No se pudieron cargar las publicaciones", "error");
  }
}

// Modal de comentarios
async function openCommentsModal(postId) {
  const modal = document.getElementById("commentsModal");
  const modalContent = document.getElementById("commentsList");

  modal.style.display = "block";
  modalContent.innerHTML = "Cargando comentarios...";

  try {
    // Nuevo endpoint: obtener post por ID
    const res = await fetch(`${API_URL}/${postId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error al cargar los datos del post");

    const post = await res.json();

    // Renderizar comentarios
    if (!post.comments || post.comments.length === 0) {
      modalContent.innerHTML = "<p>No hay comentarios todavía.</p>";
    } else {
      modalContent.innerHTML = post.comments.map(c => `
        <div class="comment">
          <strong>@${c.author?.username || "Usuario desconocido"}</strong>: ${c.text}
        </div>
      `).join("");
    }

  } catch (error) {
    console.error(error);
    modalContent.innerHTML = "<p>Error al cargar comentarios.</p>";
  }
}

// Cerrar modal
document.getElementById("closeCommentsModal").addEventListener("click", () => {
  document.getElementById("commentsModal").style.display = "none";
});

// Publicar Post
document.getElementById("publishBtn").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value.trim();
  const mood = document.getElementById("moodSelect").value;

  if (!content) {
    alert("Escribe algo antes de publicar.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        content: content,
        mood: mood // lo enviamos junto con el contenido
      })
    });

    if (!res.ok) throw new Error("Error al publicar el post");

    const newPost = await res.json();
    console.log("Post publicado:", newPost);
    showToast("Post publicado", "success");

    // Limpia el campo de texto y el mood
    document.getElementById("postContent").value = "";
    document.getElementById("moodSelect").value = "";

    // Opcional: refrescar los posts en la pantalla
    loadFeed();

  } catch (error) {
    console.error(error);
    showToast("No se pudo publicar el post.", "error");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const suggestionsContainer = document.getElementById("suggestionsList");

  try {
    const res = await fetch("http://localhost:4000/api/users/suggestions", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Error al obtener sugerencias");

    const users = await res.json();

    suggestionsContainer.innerHTML = "";

    users.forEach(user => {
      const card = document.createElement("div");
      card.classList.add("suggestion-card");

      card.innerHTML = `
                <img src="${user.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}" alt="Avatar">
                <div class="suggestion-info">
                    <div class="suggestion-name">${user.username}</div>
                    <div class="suggestion-username">@${user.username}</div>
                </div>
                <button class="follow-btn" data-id="${user._id}">Seguir</button>
            `;

      suggestionsContainer.appendChild(card);
    });

    // Evento para seguir usuario
    document.querySelectorAll(".follow-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const userId = btn.dataset.id;

        try {
          const followRes = await fetch(`http://localhost:4000/api/users/${userId}/follow`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!followRes.ok) throw new Error("Error al seguir usuario");

          btn.textContent = "Siguiendo";
          btn.disabled = true;
        } catch (error) {
          console.error(error);
        }
      });
    });

  } catch (error) {
    console.error(error);
    suggestionsContainer.innerHTML = "<p>Error al cargar sugerencias</p>";
  }
});

loadFeed();
