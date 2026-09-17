const btnGuardar = document.getElementById('btn-guardar');

btnGuardar.addEventListener('click', async () => {

  const usuario = {
    email: document.getElementById('email').value,
    clave: document.getElementById('clave').value,
  };

  // Enviar via fetch al servidor
  const resp = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  });

  const data = await resp.json();
  console.log('Respuesta:', data);

  if (data.error != undefined) {
    alert(data.error);
  } else {
    alert('Usuario logueado correctamente. Redirigiendo a la página principal.');
    localStorage.setItem("token", data.token);
    location.href = "index.html";
  }
});