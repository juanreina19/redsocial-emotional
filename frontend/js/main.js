// URL base de tu API (cámbiala si es diferente)
const API_URL = "http://localhost:4000/api";

const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

function showForm(show, hide) {
    hide.classList.remove("active");
    setTimeout(() => {
        hide.style.display = "none";
        show.style.display = "flex";
        setTimeout(() => show.classList.add("active"), 10);
    }, 300); // Tiempo de transición
}

showRegister.addEventListener("click", (e) => {
    e.preventDefault();
    showForm(registerContainer, loginContainer);
});

showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    showForm(loginContainer, registerContainer);
});

// Show Alert
function showToast(message, type = "info") {
    const icons = {
        success: "✅",
        error: "❌",
        info: "ℹ️",
        warning: "⚠️"
    };

    const container = document.getElementById("toastContainer");

    // Crear toast
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Icono
    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.textContent = icons[type] || "ℹ️";

    // Mensaje
    const text = document.createElement("span");
    text.textContent = message;

    // Añadir al toast
    toast.appendChild(icon);
    toast.appendChild(text);

    // Agregar al contenedor
    container.appendChild(toast);

    // Eliminar después de la animación
    setTimeout(() => {
        toast.remove();
    }, 3500);
}



// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token); // Guarda el token JWT
        showToast("Inicio de sesión exitoso", "success");
        setTimeout(() => {
            window.location.href = "index.html"; // Redirige al feed
        }, 1000);

    } else {
        showToast("Credenciales inválidas", "warning");
    }
});


// REGISTRO
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    if (res.ok) {
        showToast("Registro exitoso, ahora inicia sesión", "success");
        setTimeout(() => {
            window.location.href = "auth.html";
        }, 1500)
    } else {
        const errorData = await res.json();
        showToast(errorData.msg || "Error en el registro", "error");
    }
});
