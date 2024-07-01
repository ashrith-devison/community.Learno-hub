function profile_view(data){
    console.log(data);
    content = "";
    content += `
    <div class="profile">
        <table>
            <thead>
                <tr>
                    <th>username</th>
                    <th>registerid</th>
                    <th>role</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${data.username}</td>
                    <td>${data.registerid}<td>
                    <td>${data.role}</td>
                </tr>
            </tbody>
        </table>
    </div>`;
    $('#content').html(content);
}

function fetch_profile(){
    const data = {
        username : 'Mallikajaan'
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