const currentUser = JSON.parse(localStorage.getItem("currentUser"))

document.getElementById("studentName").innerText = currentUser.name


/* -------------------------
   LOAD STUDENT STATS
-------------------------- */

function loadStudentStats(){

    const history = JSON.parse(localStorage.getItem("attendanceHistory")) || []

    let totalClasses = 0
    let attended = 0
    let missed = 0

    history.forEach(session => {

        if(session.class !== currentUser.class) return

        const record = session.records.find(
            r => r.studentID === currentUser.id
        )

        if(record){

            totalClasses++

            if(record.status === "Present"){
                attended++
            } else {
                missed++
            }

        }

    })

    const attendancePercent =
        totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0


    document.getElementById("attendancePercent").innerText =
        attendancePercent + "%"

    document.getElementById("classesAttended").innerText =
        attended

    document.getElementById("classesMissed").innerText =
        missed

}


/* -------------------------
   LOAD RECENT ATTENDANCE
-------------------------- */

function loadRecentAttendance(){

    const history = JSON.parse(localStorage.getItem("attendanceHistory")) || []
    const table = document.getElementById("attendanceTable")

    table.innerHTML = ""

    let count = 0

    history
    .filter(session => session.class === currentUser.class)
    .reverse()
    .slice(0,5)
    .forEach(session => {

        const record = session.records.find(
            r => r.studentID === currentUser.id
        )

        if(record){

            count++

            const row = `
            <tr>
                <td>${session.subject}</td>
                <td>${session.date}</td>
                <td class="${record.status === "Present" ? "present" : "absent"}">
                    ${record.status}
                </td>
                <td>${record.time ? record.time : "-"}</td>
            </tr>
            `

            table.insertAdjacentHTML("beforeend", row)

        }

    })

    if(count === 0){
        table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;padding:20px;color:#888;">
                No recent attendance records
            </td>
        </tr>
        `
    }

}


/* -------------------------
   BUTTON ACTIONS
-------------------------- */

document.getElementById("scanBtn").addEventListener("click", () => {
    window.location.href = "scan.html"
})

document.getElementById("attendanceBtn").addEventListener("click", () => {
    window.location.href = "attendance.html"
})

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("currentUser")
    window.location.href = "../auth/login.html"

})


/* -------------------------
   PAGE LOAD
-------------------------- */

loadStudentStats()
loadRecentAttendance()