const comentar = (e, f) => {
    e.preventDefault();
    Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});
    const comentario = f[0].value;

    const data = {comentario};
    const destino = f.action + "/responder";

    axios.post(destino, data, {withCredentials: true }).then(r => {        
        console.log(r)
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Report.success(
                '¡Todo bien!',
                'Comentario agregado correctamente',
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
            Notiflix.Notify.failure('Necesitas iniciar sesion para responder.');
        }
        else if (respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Error', "Ocurrio un error con su comentario, intentelo mas tarde", "Entendido!");
        }
        else {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure("Ocurrio un error inesperado");
        }
    })
};

const borrarComentario = (id) => {
    const data = {idRes: id};
    const destino = window.location.href + "/borrar";
    axios.delete(destino, {data, withCredentials: true }).then(r => {        
        console.log(r)
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Report.success(
                '¡Todo bien!',
                'Comentario Eliminado correctamente',
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
            Notiflix.Notify.failure('Necesitas iniciar sesion para hacer esto.');
        }
        else if (respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Error', "Ocurrio un error al eliminar su comentario, intentelo mas tarde", "Entendido!");
        }
        else {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure("Ocurrio un error inesperado");
        }
    });
}