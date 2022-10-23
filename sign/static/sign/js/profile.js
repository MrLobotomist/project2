function dataValidation(name, surname, phone){
    console.log(name, surname, phone);
    if(name.length < 3 || surname.length < 3 || phone.lenght < 16){
        alert('Введенные данные некорректны');
        return false;
    }
    return true;
}

function saveData(){
    let d = document;
    let name = d.getElementById('name').value;
    let surname = d.getElementById('surname').value;
    let phone = d.getElementById('phone').value;
    if (dataValidation(name, surname, phone)){
        sendQuery(name, surname, phone);
    }
}

async function sendQuery(){
    let csrftoken = await document.querySelector('[name=csrfmiddlewaretoken]').value;
    let response = await fetch('/save_data/', {
        method: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        body: JSON.stringify(arguments)
      });
    if (response.ok) {
        alert('Контактные данные сохранены');
    }
}