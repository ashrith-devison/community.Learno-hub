/*
    * Author Ashrith Sai
    * created on 30/06/2024
    * Last modified on 01/07/2023 
*/
function validate(){
    const data = {
        username : $('#username').val(),
        password : $('#password').val()
    };

    fetch(envData.API_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(response => {
        if(!response.ok){
            return response.json();
        }
        return response.json();
    }).then(data => {
        fetch(data.redirectLink)
        .then(response => response.text())
        .then(outpage => {
            document.documentElement.innerHTML = outpage;
        });
    })
}