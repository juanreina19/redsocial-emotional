// URL base de tu API (cámbiala si es diferente)
const API_URL = "http://localhost:4000/api";

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
        alert("Inicio de sesión exitoso");
        window.location.href = "index.html"; // Redirige al feed
    } else {
        alert("Credenciales inválidas");
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
        alert("Registro exitoso, ahora inicia sesión");
    } else {
        alert("Error al registrarse");
    }
});
