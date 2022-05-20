const link = window.location.href;
const aprobar = (idPubli, idUsuario) => {
    Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});
    let data = {idPublicacion: idPubli};
    axios.post(link, data, { withCredentials: true }).then(r => {
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Notify.success("Publicacion aprobada con exito");
        }
    }).catch(err => {
        const respuesta = err.response;
        if (respuesta.status == 401){
            Notiflix.Loading.remove();
            window.location.href = "/inicio";
        } 
           
        else if(respuesta.status == 500){ 
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Algo salio mal... Por favor contacte con la persona acargo.');
        }
        else if(respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Algo salio mal...', 'Intentelo de nuevo mas tarde', 'Entendido', () => {
                location.reload();
            });
        }
    });
    
    console.log("Se apobo el id: ", idPubli);
    console.log("USUARIO", idUsuario);
}
const denegar = (idPubli, idUsuario) => {
    Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});

    let data = {idPublicacion: idPubli};
    axios.delete(link, { data, withCredentials: true }).then(r => {
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Notify.success("Publicacion aprobada con exito");
        }
    }).catch(err => {
        console.log(err);
        const respuesta = err.response;
        if (respuesta.status == 401){
            Notiflix.Loading.remove();
            window.location.href = "/inicio";
        } 
           
        else if(respuesta.status == 500){ 
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Algo salio mal... Por favor contacte con la persona acargo.');
        }
        else if(respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Algo salio mal...', 'Intentelo de nuevo mas tarde', 'Entendido', () => {
                location.reload();
            });
        }
    });

    console.log("Se apobo el id: ", idPubli);
    console.log("USUARIO", idUsuario);
}
const bloquearUsuario = (idPubli, idUsuario) => {
    Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});

    let data = {idPublicacion: idPubli, idUsuario};
    axios.put(link, data, {withCredentials: true }).then(r => {
        if(r.status == 200){
            Notiflix.Loading.remove();
            Notiflix.Notify.success("Usuario bloqueado y publicacion eliminada correctamente!");
        }
    }).catch(err => {
        console.log(err);
        const respuesta = err.response;
        if (respuesta.status == 401){
            Notiflix.Loading.remove();
            window.location.href = "/inicio";
        } 
           
        else if(respuesta.status == 500){ 
            Notiflix.Loading.remove();
            Notiflix.Notify.failure('Algo salio mal... Por favor contacte con la persona acargo.');
        }
        else if(respuesta.status == 400){ 
            Notiflix.Loading.remove()
            Notiflix.Report.failure('Algo salio mal...', 'Intentelo de nuevo mas tarde', 'Entendido', () => {
                location.reload();
            });
        }
    });

    console.log("Se apobo el id: ", idPubli);
    console.log("USUARIO", idUsuario);
}