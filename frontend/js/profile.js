const API_URL = "http://localhost:4000/api";

// Verificar si el usuario está logueado
const token = localStorage.getItem("token");
if (!token) {
    showToast("Debes iniciar sesión", "warning");
    window.location.href = "login.html";
}

// Función para obtener el perfil del usuario
async function getProfile() {
    try {
        const res = await fetch(`${API_URL}/users/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("No se pudo obtener el perfil");
        }

        const user = await res.json();

        // Mostrar datos en el HTML
        document.getElementById("avatar").src = user.avatar || 'https://www.w3schools.com/howto/img_avatar.png';
        document.getElementById("username").textContent = user.username;
        document.getElementById("bio").textContent = user.bio || "Sin biografía aún";

    } catch (error) {
        console.error(error);
        showToast("Error al cargar el perfil", "error");
    }
}

// Función para obtener las publicaciones del usuario
async function getUserPosts() {
    try {
        const res = await fetch(`${API_URL}/posts/mine`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("No se pudieron obtener las publicaciones");
        }

        const posts = await res.json();
        const postsContainer = document.getElementById("posts");

        postsContainer.innerHTML = "";

        posts.forEach(post => {
            const div = document.createElement("div");
            div.classList.add("post");
            div.innerHTML = `<p>${post.content}</p>`;
            postsContainer.appendChild(div);
        });

    } catch (error) {
        console.error(error);
    }
};

// Ejecutar al cargar la página
getProfile();
getUserPosts();
