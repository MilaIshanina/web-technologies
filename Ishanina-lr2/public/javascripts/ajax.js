
function all_books(button) {
    let id = 'all_books';
    let title = "library";
    callAjaxGet(id, (response)=>{
        let array_id = JSON.parse(response)
        for (id of array_id){
            let cur_th  =document.getElementById(id)
            cur_th.style.visibility = "visible"
        }
    });
}

function in_lib(button) {
    let id = 'in_lib';
    let title = "library";
    callAjaxGet(id, (response) => {
        let array_id = JSON.parse(response);
        for(id of array_id.vis) {
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "visible";
        }
        for(id of array_id.unvis) {
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "hidden";
        }
    });

}
function date_return(button) {
    let id = 'date_return';
    let title = "library";
    callAjaxGet(id, (response)=>{
        let array_id = JSON.parse(response);
        for(id of array_id.vis) {
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "visible";
        }
        for(id of array_id.unvis) {
            let cur_th = document.getElementById(id);
            cur_th.style.visibility = "hidden";
        }
    })
}

function  callAjaxGet(id, callback) {//вызывает запрос у сервера и получает в ответ список нужных книг
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200)
            callback(this.responseText);
    };
    xhttp.open("GET",`/book/${id}`,true);
    xhttp.send();

}