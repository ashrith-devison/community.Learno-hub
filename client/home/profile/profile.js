function profile_view(data){
    console.log(data);
    fetch('/client/home/profile/profile.html')
    .then(response => response.text())
    .then(content => {  
        $('#content').html(content);
        $('#name').html(data.username);
        $('#email').html(data.Email);
        $('#phone').html(data.Contact);
        $('#father-name').html(data.FatherName);
        $('#father-phone').html(data.FatherContact);
        $('#mother-name').html(data.MotherName);
        $('#mother-phone').html(data.MotherContact);
        $('#address').html(data.Address);
        $('#role').html(data.role);
        $('#register-id').html(data.registerid);

    })
}

function fetch_profile(){
    const data = {
        token : sessionStorage.getItem('token')
    }
    fetch(envData.API_URL + '/student/profile', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(data)
    }).then(response => {
        if(!response.ok){
            console.log(response);
        }
        return response.json();
    }).then(content =>{
        console.log(content);
        profile_view(content);
    })
}