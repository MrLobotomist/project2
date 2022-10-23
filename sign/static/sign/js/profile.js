function saveData(){
    let d = document;
    let name = d.getElementById('name').value;
    let surname = d.getElementById('surname').value;
    let phone = d.getElementById('phone').value;
    console.log(name, surname, phone);
    sendQuery(name, surname, phone);
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