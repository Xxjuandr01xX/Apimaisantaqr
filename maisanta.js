let url         = window.location.href;

if (url.indexOf('?') < 0) {

    alert("Acceso no autorizado");
    window.location.href = "https://www.google.com.ve";

}else{
    let var_param = window.location.href.split('?')[1].split('&');
    let var_user    = var_param[1].split("=");

}
