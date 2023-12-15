
  /* ELIMINA USUARIOS INACTIVOS */
const deleteInactiveUsersButton = document.querySelector('.delete-inactive-users');

deleteInactiveUsersButton.addEventListener('click', async () => {
  /* REALIZA SOLICITUD POST AL endpoint /api/users PARA ELIMINAR USUARIOS INACTIVOS */
  try {
    const response = await fetch('/api/users', {
      method: 'DELETE',
    });
    
    if (response.ok) {
      /* SI LA ELIMINACION FUE EXITOSA, RECARGA LA PAG Y ACTUALIZ
      LISTA D USUARIOS */
      location.reload();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ops!',
        text: 'No tiene privilegios para eliminar usuarios 😢',
    });    }
  } catch (error) {
    console.error('Error al enviar la solicitud de eliminación', error);
  }
});