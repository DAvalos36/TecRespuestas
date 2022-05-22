const borrarPregunta = (id) => {
    const data = {id};
    const destino = "/preguntar";
    axios.delete(destino, {data, withCredentials: true }).then(r => {        
        console.log(r)
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Report.success(
                '¡Todo bien!',
                'Pregunta Eliminada correctamente',
                'Entendido!',
                () => {
                    location.reload();
                }
                );
            // window.location.href = "/inicio";
        }
    }).catch(err => {
        const respuesta = err.response;
        if (respuesta.status == 401){ 
            Notiflix.Loading.remove()
            Notiflix.Notify.failure('Necesitas iniciar sesion hacer esto.');
        }
        else if (respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Error', "Ocurrio un error al intentar eliminar la publicacion, intentelo mas tarde", "Entendido!");
        }
        else {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure("Ocurrio un error inesperado");
        }
    });
}