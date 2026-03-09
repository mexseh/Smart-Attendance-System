const user = JSON.parse(localStorage.getItem("currentUser"))

if (!user) {
    window.location.href = "../auth/login.html"
}


// check if page is inside student folder
if (window.location.pathname.includes("/student/")) {

    if (user.role !== "student") {

        alert("Only students can access this page")

        window.location.href = "../auth/login.html"
    }

}


// check if page is inside teacher folder
if (window.location.pathname.includes("/teacher/")) {

    if (user.role !== "teacher") {

        alert("Only teachers can access this page")

        window.location.href = "../auth/login.html"
    }

}