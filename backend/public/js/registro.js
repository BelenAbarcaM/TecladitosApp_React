const btnGuardar = document.getElementById('btn-guardar');

btnGuardar.addEventListener('click', async () => {

  const usuario = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    clave: document.getElementById('clave').value,
  };

  // Enviar via fetch al servidor
  const resp = await fetch('/api/registro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usuario)
  });

  const data = await resp.json();
  console.log('Usuario guardado en servidor:', data);
  alert('Usuario registrado correctamente. Ahora puede iniciar sesión.');
});