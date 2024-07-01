function fetch_curriculum(){
    const data = {
        category : 'UE'
    };
    fetch(envData.API_URL + '/curriculum/query', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        const curriculum = document.getElementById('content');
        curriculum.innerHTML = '';
        data.forEach(course => {
            const courseDiv = document.createElement('div');
            courseDiv.classList.add('course');
            courseDiv.innerHTML = `
                <h4>${course.CourseName}</h4>
                <p>${course.CourseCode}</p>
                <p>${course.CreditHours} Credit Hours</p>
            `;
            curriculum.appendChild(courseDiv);
        });
    }).catch(err => console.log(err));
}