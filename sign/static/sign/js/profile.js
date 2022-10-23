function dataValidation(name, surname, phone){
    console.log(name, surname, phone);
    if(name.length < 3 || surname.length < 3 || phone.lenght < 16){
        alert('Введенные данные некорректны');
        return false;
    }
    return true;
}

function dictBuilder(){
    dict = {}
    for(let i = 0; i < arguments.length; i++){
        dict[i]=arguments[i];
    }
    return JSON.stringify(dict);
}

function hideOrder(){
    $('#order').modal('hide');
}

function saveData(){
    let d = document;
    let name = d.getElementById('name').value;
    let surname = d.getElementById('surname').value;
    let phone = d.getElementById('phone').value;
    if (dataValidation(name, surname, phone)){
        sendQuery('/save_data/', dictBuilder(name, surname, phone));
    }
}

async function sendQuery(url, args){
    let csrftoken = await document.querySelector('[name=csrfmiddlewaretoken]').value;
    let response = await fetch(url, {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        body: args
      });
    if (response.ok) {
        alert('Данные успешно сохранены');
    }
}

function sendOrder(){
    let d = document;
    let theme = d.getElementById('theme').value;
    let content = d.getElementById('content').value;
    if(orderValidation(theme, content)){
        sendQuery('/save_order/', dictBuilder(theme, content));
        hideOrder();
    }
}

function showOrder(){
    $('#order').modal('show');
}

function orderValidation(theme, content){
    if(theme.length<5 || content.lenght<10){
        alert('Введены некорректные данные');
        return false;
    }
    return true;    
}