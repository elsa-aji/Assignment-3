fetch('http://localhost:3000/api/employeelist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: "Jane Doe",
        position: "Developer",
        location: "Remote",
        salary: 85000
    })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));