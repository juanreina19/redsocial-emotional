// function loadPage(page) {
//     fetch(`pages/${page}.html`)
//         .then(res => res.text())
//         .then(html => {
//             document.getElementById("main-content").innerHTML = html;
//         })
//         .catch(err => console.error("Error cargando página:", err));
// }

// // Al abrir, cargamos Home por defecto
// document.addEventListener("DOMContentLoaded", () => {
//     loadPage("home");
// });

function loadPage(page) {
    fetch(`pages/${page}.html`)
        .then(res => res.text())
        .then(html => {
            document.getElementById("main-content").innerHTML = html;

            // Limpia el script anterior del DOM
            const oldScript = document.querySelector("#page-script");
            if (oldScript) {
                oldScript.remove();
            }

            const newScript = document.createElement("script");
            newScript.src = `js/${page}.js`;
            newScript.id = 'page-script';
            newScript.type = 'module'; // ¡Esto es clave!

            document.body.appendChild(newScript);
        })
        .catch(err => console.error("Error cargando página:", err));
}