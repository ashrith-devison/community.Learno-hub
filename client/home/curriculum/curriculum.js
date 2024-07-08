function fetch_curriculum(){
    const data = {
        token : sessionStorage.getItem('token'),
        semester : $('#semester-code').val()
    };
    fetch(envData.API_URL + '/registration/viewcourses', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        if(data.error){
            Swal.fire({
                icon: 'error',
                title: data.message,
                showConfirmButton: false,
                timer: 2000
            });
            const tablebody = document.getElementById('curriculumTable').getElementsByTagName('tbody')[0];
            tablebody.innerHTML = '';
            const row = tablebody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 3;
            cell.style.textAlign = 'center';
            cell.textContent = data.message;
            $('#registered-credits').html(0);
            $('#semester').html($('#semester-code').val());
            return;
        }
        load_curriculum(data);

    })
    .catch(err => console.log(err));
}

function load_curriculum(courses){
    if(courses){
        fetch('/client/home/curriculum/curriculum.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
            const table = document.getElementById('curriculumTable');
            const tbody = table.getElementsByTagName('tbody')[0];
    
            let credits = 0;
            courses.map(course => {
                let newRow = tbody.insertRow();
    
                let coursecode = newRow.insertCell(0);
                coursecode.textContent = course.coursecode;

                let coursename = newRow.insertCell(1);
                coursename.textContent = course.coursename;
    
                let credithours = newRow.insertCell(2);
                credithours.textContent = course.credithours;
                credits += course.credithours;
    
            });
    
            $('#registered-credits').html(credits);
            $('#semester').html(courses[0].semester);
            $('#semester-code').val(courses[0].semester);
        });  
    }
    else{
        fetch('/client/home/curriculum/curriculum.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
    }

}