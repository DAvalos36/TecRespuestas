const re = /^[\w-\.]+@(itparral.edu.mx|parral.tecnm.mx)$/;

const iniciar = (e, f) => {
    e.preventDefault();

    if(!re.test(f[0].value)){
        Notiflix.Report.failure("Problema con el correo!", "Solo se pueden utilizar correos institucionales. (@itparral.edu.mx o @parral.tecnm.mx)", "Entendido!");
    }
    else {
        const data = {}
        data.correo = f[0].value;
        data.pass = f[1].value;
    
        axios.post(f.action, data, {withCredentials: true }).then(r => {
            Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});
            
            console.log(r)
            if(r.status == 200){
                window.location.href = "/inicio";
            }
        }).catch(err => {
            const respuesta = err.response;
            if (respuesta.status == 400 && respuesta.data.msj !== undefined){ 
                Notiflix.Loading.remove()
                Notiflix.Notify.failure('Usuario o contraseña incorrectos!');
            }
        })
    }

}

const crear = (e,f) =>{
    e.preventDefault();
    const data = {};
    data.nombre = f[0].value;
    data.apellido = f[1].value;
    data.correo = f[2].value;
    data.pass = f[3].value;
    // data

    if(!re.test(data.correo)){
        Notiflix.Report.failure("Problema con el correo!", "Solo se pueden utilizar correos institucionales. (@itparral.edu.mx o @parral.tecnm.mx)", "Entendido!");
    }
    else {
        axios.post(f.action, data, { withCredentials: true }).then(r => {
            Notiflix.Loading.pulse("Cargando...", {svgColor: "#1266F1"});
            console.log(r)
            if(r.status == 200){
                Notiflix.Loading.remove();
                Notiflix.Notify.success("Usuario creado, ahora puedes iniciar sesion!");
                f.reset();
            }
        }).catch(err => {
            const respuesta = err.response;
            if (respuesta.status == 409){
                Notiflix.Loading.remove()
                Notiflix.Report.failure("Error al registrarse", '¡Este correo ya se encuentra registrado!', "Ok");
            } 
               
            else if(respuesta.status == 400){ 
                Notiflix.Loading.remove()
                Notiflix.Notify.failure('Algo salio mal...');
            }
        });
    }

    
}