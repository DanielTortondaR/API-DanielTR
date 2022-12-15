// Autor: Daniel Tortonda Ruiz
const Rawg = "https://api.rawg.io/api/";
const key = "?key=3d41ce4f9c7747f09dfb46fe0e2e0052";
const cabecera = document.getElementById("header");
const columnaFiltros = document.getElementById("column-left");
const columnaCentral = document.getElementById("central");
const generosGeneral = document.getElementById("generos");
const plataformasGeneral = document.getElementById("plataformas");
let generosVisibles = false;
let plataformasVisibles = false;
let dataGeneros = null;
let dataPlataformas = null;
let page = 1;

//Genera los géneros desplegables
async function desplegarGeneros(){
    if(!generosVisibles){
        if(dataGeneros == null){
            let response = await fetch(`${Rawg}genres${key}`)
            dataGeneros = await response.json();
        }

        let generosMenu = document.createElement("form");
        generosMenu.id = "generosMenu";
        for(let x = 0; x < dataGeneros.count; x++){
            let genero = document.createElement("input");
            genero.id = `gen${x}`;
            genero.name = `gen${x}`;
            genero.value = dataGeneros.results[x].id;
            genero.type = "checkbox";
            console.log(genero);
            let etiqueta = document.createElement("label");
            etiqueta.setAttribute("for",`gen${x}`);
            etiqueta.innerText = dataGeneros.results[x].name;
            let salto = document.createElement("br");
            generosMenu.appendChild(genero);
            generosMenu.appendChild(etiqueta);
            generosMenu.appendChild(salto);
        }
        generosGeneral.appendChild(generosMenu);

        generosVisibles = true;
    }else{
        document.getElementById("generosMenu").remove();
        generosVisibles = false;
    }
}


//Genera los plataformas desplegables
async function desplegarPlataformas(){
    if(!plataformasVisibles){
        if(dataPlataformas == null){
            let response = await fetch(`${Rawg}platforms${key}`)
            dataPlataformas = await response.json();
        }
        

        let plataformasMenu = document.createElement("form");
        plataformasMenu.id = "plataformaMenu";
        for(let x = 0; x < 50; x++){
            let plataforma = document.createElement("input");
            plataforma.id = `pla${x}`;
            plataforma.name = `pla${x}`;
            plataforma.type = "checkbox";
            plataforma.value = dataPlataformas.results[x].id;
            console.log(plataforma.value);
            let etiqueta = document.createElement("label");
            etiqueta.setAttribute("for",`pla${x}`);
            etiqueta.innerText =  dataPlataformas.results[x].name;
            let salto = document.createElement("br");
            plataformasMenu.appendChild(plataforma);
            plataformasMenu.appendChild(etiqueta);
            plataformasMenu.appendChild(salto);
        }
        plataformasGeneral.appendChild(plataformasMenu);

        plataformasVisibles = true;
        
    }else{
        document.getElementById("plataformaMenu").remove();
        plataformasVisibles = false;
    }
}


async function inicio(direccion){
    console.log(direccion);
    let juegosTablero = document.createElement("div");
    juegosTablero.id = "juegosTablero";
    let response = await fetch(direccion)
    datajuegos = await response.json();
    
    for(let x=0; x<12; x++){
        let juego = document.createElement("div");
        juego.className = "juego";
        let imagenJuego = document.createElement("img");
        imagenJuego.className = "imagenJuego";
        imagenJuego.src = datajuegos.results[x].background_image;
        imagenJuego.addEventListener("click", function(){verJuego(datajuegos.results[x].name)} );
        let nombreJuego = document.createElement("h3");
        nombreJuego.className = "nombreJuego";
        nombreJuego.innerText = datajuegos.results[x].name;
        nombreJuego.addEventListener("click", function(){verJuego(datajuegos.results[x].name)});
        let salto = document.createElement("br");
        juego.appendChild(imagenJuego);
        juego.appendChild(nombreJuego);
        juegosTablero.appendChild(juego);
        if((x+1)%3==0) juegosTablero.appendChild(salto);
    }
    let mejores = document.createElement("h1");
    mejores.id = "mejor";
    mejores.innerText = "Mejor valorados";


    columnaCentral.appendChild(mejores);
    


    let paginacion = document.createElement("div");
    paginacion.id = "paginacion";

    if(datajuegos.previous != null){
        let prev = document.createElement("button");
        prev.innerText = "<--";
        prev.id = "previous";
        prev.addEventListener("click",function(){page--; borrar(); inicio(datajuegos.previous)})
        paginacion.appendChild(prev);
    }

    let pagina = document.createElement("p");
    pagina.id = "pagina";
    pagina.innerText = page;
    paginacion.appendChild(pagina);

    if(datajuegos.next != null){
        let next = document.createElement("button");
        next.innerText = "-->";
        next.id = "next";
        next.addEventListener("click",function(){page++; borrar(); inicio(datajuegos.next)})
        paginacion.appendChild(next);
    }
    juegosTablero.appendChild(paginacion);

    columnaCentral.appendChild(juegosTablero);

}


inicio(`${Rawg}games${key}&ordering=rating-released&page_size=12`);
verComentarios();


function buscarJuegos(){
    borrar(); 
    let buscador = document.getElementById("buscar").value;
    inicio(`${Rawg}games${key}&search=${buscador}&ordering=rating-released&page_size=12`);

}

function borrar(){
    document.getElementById("mejor").remove();
    if(document.getElementById("juegosTablero")!=null) document.getElementById("juegosTablero").remove();
    if(document.getElementById("datosJuego")){
        document.getElementById("datosJuego").remove();
        document.getElementById("imagenJuegoVer").remove();
    }
}

function aplicarFiltros(){
    let filtros="";
    let fitroGeneros = "";
    let filtroPlataformas = "";

    

    if(generosVisibles){
        for(let x = 0; x < dataGeneros.count; x++){
        let filtro = document.getElementById(`gen${x}`);
        
            if(filtro.checked){
                fitroGeneros = fitroGeneros.concat(filtro.value+",");
            }   
        }
    fitroGeneros = fitroGeneros.substring(0, fitroGeneros.length-1);
    console.log(fitroGeneros);
    }
    
    if(plataformasVisibles){
       for(let x=0; x<30; x++){
        let filtro = document.getElementById(`pla${x}`);
        
            if(filtro.checked){
                filtroPlataformas = filtroPlataformas.concat(filtro.value+",");
            }   
        }
    filtroPlataformas = filtroPlataformas.substring(0, filtroPlataformas.length-1);
    console.log(filtroPlataformas); 
    }
    if(fitroGeneros != ""){
        fitroGeneros = "&genres=".concat(fitroGeneros);
    }
    if(filtroPlataformas != ""){
        filtroPlataformas = "&platforms=".concat(filtroPlataformas);
    }
    filtros = fitroGeneros.concat(filtroPlataformas);

    borrar();

    inicio(`${Rawg}games${key}${filtros}&ordering=rating-released&page_size=12`)
    
}



async function verJuego(juegoVisto){

    document.getElementById("mejor").remove();
    if(document.getElementById("juegosTablero")!=null) document.getElementById("juegosTablero").remove();
    

    let response = await fetch(`${Rawg}games${key}&search=${juegoVisto}&page_size=1`)
    datajuegos = await response.json();
    
    nombreJuego = document.createElement("h1");
    nombreJuego.id = "mejor";
    nombreJuego.innerText = datajuegos.results[0].name;
    columnaCentral.appendChild(nombreJuego);
    console.log(`${Rawg}games${key}&search=${juegoVisto}&page_size=1`);

    let imagen = document.createElement("img");
    imagen.className = "imagenJuegoVer";
    imagen.id = "imagenJuegoVer";
    imagen.src = datajuegos.results[0].background_image;
    columnaCentral.appendChild(imagen);

    let datosJuego = document.createElement("div");
    datosJuego.id = "datosJuego";
    let texto = document.createElement("p")
    let parrafo = "Estreno:"+datajuegos.results[0].released;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Puntuación:"+datajuegos.results[0].rating;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Metacritic:"+datajuegos.results[0].metacritic;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Plataformas:"
    let plataformas = "";
    datajuegos.results[0].platforms.forEach(element => {
        plataformas = plataformas + element.platform.name + " ";
       
    });
    console.log(plataformas);
    texto.innerText = parrafo.concat(plataformas);
    datosJuego.appendChild(texto);
    

    let addFavorito = document.createElement("button")
    addFavorito.id = "addFavorito";
    addFavorito.addEventListener("click", function(){ addJuego(datajuegos.results[0].name)})
    addFavorito.innerText = "Add Favorito";
    datosJuego.appendChild(addFavorito);

    columnaCentral.appendChild(datosJuego);
    window.scroll(0, 0);

}


function addJuego(nombreJuego){
    let favoritos;
    console.log(nombreJuego);
    if(localStorage.getItem('listaFavoritos') == null){
        favoritos = [nombreJuego];

    }else{
        favoritos = localStorage.getItem("listaFavoritos");
        favoritos = JSON.parse(favoritos);
        favoritos.push(nombreJuego);
        favoritos = Array.from(new Set(favoritos));
    }
    favoritos = JSON.stringify(favoritos);
    localStorage.setItem("listaFavoritos", favoritos);
}



async function irFavoritos(){

    borrar();

    favoritos = JSON.parse(localStorage.getItem("listaFavoritos"));
    
     

    let juegosTablero = document.createElement("div");
    juegosTablero.id = "juegosTablero";
    
    
    let juegos =[];
    for(let x=0; x<favoritos.length; x++){
        let response = await fetch(`${Rawg}games${key}&search=${favoritos[x]}&page_size=1`);
        datajuegos = await response.json();
        juegos.push(datajuegos.results[0]);
    }
    console.log(juegos);
    for(let x=0; x<juegos.length; x++){    
        let juego = document.createElement("div");
        juego.className = "juego";
        let imagenJuego = document.createElement("img");
        imagenJuego.className = "imagenJuego";
        imagenJuego.src = juegos[x].background_image;
        imagenJuego.addEventListener("click", function(){verJuegoFav(juegos[x].name)} );
        let nombreJuego = document.createElement("h3");
        nombreJuego.className = "nombreJuego";
        nombreJuego.innerText = juegos[x].name;
        nombreJuego.addEventListener("click", function(){verJuegoFav(juegos[x].name)});
        let salto = document.createElement("br");
        juego.appendChild(imagenJuego);
        juego.appendChild(nombreJuego);
        juegosTablero.appendChild(juego);
    }
    let mejores = document.createElement("h1");
    mejores.id = "mejor";
    mejores.innerText = "Favoritos";



    columnaCentral.appendChild(mejores);
    columnaCentral.appendChild(juegosTablero);

}

async function verJuegoFav(juegoVisto){

    document.getElementById("mejor").remove();
    document.getElementById("juegosTablero").remove(); 

    let response = await fetch(`${Rawg}games${key}&search=${juegoVisto}&page_size=1`)
    datajuegos = await response.json();
    
    nombreJuego = document.createElement("h1");
    nombreJuego.id = "mejor";
    nombreJuego.innerText = datajuegos.results[0].name;
    columnaCentral.appendChild(nombreJuego);
    console.log(`${Rawg}games${key}&search=${juegoVisto}&page_size=1`);

    let imagen = document.createElement("img");
    imagen.className = "imagenJuegoVer";
    imagen.id = "imagenJuegoVer";
    imagen.src = datajuegos.results[0].background_image;
    columnaCentral.appendChild(imagen);

    let datosJuego = document.createElement("div");
    datosJuego.id = "datosJuego";
    let texto = document.createElement("p")
    let parrafo = "Estreno:"+datajuegos.results[0].released;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Puntuación:"+datajuegos.results[0].rating;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Metacritic:"+datajuegos.results[0].metacritic;
    texto.innerText = parrafo;
    datosJuego.appendChild(texto);
    texto = document.createElement("p")
    parrafo = "Plataformas:"
    let plataformas = "";
    datajuegos.results[0].platforms.forEach(element => {
        plataformas = plataformas + element.platform.name + " ";
       
    });
    console.log(plataformas);
    texto.innerText = parrafo.concat(plataformas);
    datosJuego.appendChild(texto);
    

    let addFavorito = document.createElement("button")
    addFavorito.id = "addFavorito";
    addFavorito.addEventListener("click", function(){ eliminarJuego(datajuegos.results[0].name)})
    addFavorito.innerText = "Eliminar Favorito";
    datosJuego.appendChild(addFavorito);

    columnaCentral.appendChild(datosJuego);

    window.scroll(0, 0);
}

function eliminarJuego(nombreJuego){
    let favoritos;

    favoritos = localStorage.getItem("listaFavoritos");
    favoritos = JSON.parse(favoritos);
    
    favoritos = favoritos.filter(juego => juego != nombreJuego);
    
    favoritos = JSON.stringify(favoritos);
    localStorage.setItem("listaFavoritos", favoritos);
    irFavoritos();
}


function verComentarios(){

let footer = document.getElementById("footer");

    if(localStorage.getItem("comentarios") != null){

       

        let comentarios = JSON.parse(localStorage.getItem("comentarios"));
        let coment = document.createElement("div");
        coment.id = "comentariosViejos"
        for(let x = 0; x < comentarios.length; x++){
            
            let cometarioViejo = document.createElement("div");
            cometarioViejo.className = "cometarioViejo";

            let textArea = document.createElement("textarea");
            textArea.id = "Com"+ x;
            textArea.className = "areaTextoViejo"
            textArea.setAttribute("readonly","readonly");
            textArea.value = comentarios[x];
            
            let bottonEliminarC = document.createElement("button");
            bottonEliminarC.id = "Pub"+ x;
            bottonEliminarC.innerText = "Eliminar";
            bottonEliminarC.addEventListener("click", function(){eliminarComentario(x)})

            cometarioViejo.appendChild(textArea);
            cometarioViejo.appendChild(bottonEliminarC);
            coment.appendChild(cometarioViejo);
            
            
        }
        console.log("ccccccccc");
        footer.appendChild(coment);
    }
    
}


function publicarComentario(){
    let nuevoComentario = document.getElementById("areaTextoNuevo");
    let comentarios;
    let viejo = document.getElementById("comentariosViejos");

    if(nuevoComentario.value != ""){
       if(localStorage.getItem("comentarios") != null){

            comentarios = localStorage.getItem("comentarios");
            comentarios = JSON.parse(comentarios);
            comentarios.push(nuevoComentario.value);

        }else{

            comentarios = [nuevoComentario.value];

        }
        comentarios = JSON.stringify(comentarios);
        console.log(nuevoComentario.value);
        localStorage.setItem("comentarios", comentarios); 
    }
    nuevoComentario.value = "";
    
    viejo.remove();
    verComentarios();

}

function eliminarComentario(idComentario){
    let viejo = document.getElementById("comentariosViejos");

    if(localStorage.getItem("comentarios") != null){

        comentarios = localStorage.getItem("comentarios");
        comentarios = JSON.parse(comentarios);
        let eliminado = comentarios.splice(idComentario, 1);
        comentarios = JSON.stringify(comentarios);
        localStorage.setItem("comentarios", comentarios);

        viejo.remove();
        verComentarios();
    }

}