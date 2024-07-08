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
            console.log(response);
        }
        return response.json();
    }).then(data => {
        fetch(data.redirectLink)
        .then(response => response.text())
        .then(outpage => {
            document.documentElement.innerHTML = outpage;
            sessionStorage.setItem('token', data.token);
            loadScriptinPage(outpage);
            history.replaceState({}, null, "/client/home/home.html");
        });
    })
}

function loadScriptinPage(content, callback) {
    var temp = document.createElement('div');
    temp.innerHTML = content;
    var scripts = temp.querySelectorAll('script[src]');
    scripts.forEach(scriptElement => {
        var src = scriptElement.getAttribute('src');

        var newScript = document.createElement('script');
        newScript.src = src;
        newScript.onload = () => {
            console.log(`Script loaded: ${newScript.src}`);
            if (callback) callback();
        };
        document.getElementById('script-record').appendChild(newScript);
    });
}