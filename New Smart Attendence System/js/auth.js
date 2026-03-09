const loginForm = document.getElementById("loginForm")

loginForm.addEventListener("submit", async function(e){

e.preventDefault()

const id = document.getElementById("userID").value
const password = document.getElementById("password").value
const role = document.getElementById("role").value

let users = []

// fetch data depending on role
if(role === "teacher"){
    
    const res = await fetch("../data/teachers.json")
    users = await res.json()

}
else{

    const res = await fetch("../data/students.json")
    users = await res.json()

}

// find matching user
const user = users.find(u => u.id === id && u.password === password)

if(user){

localStorage.setItem("currentUser", JSON.stringify(user))

if(user.role === "teacher"){
    window.location.href = "../teacher/dashboard.html"
}
else{
    window.location.href = "../student/dashboard.html"
}

}
else{

document.getElementById("errorMessage").innerText = "Invalid credentials"

}

})