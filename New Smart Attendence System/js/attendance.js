// THIS FILE IS FOR ATTENDANCE.HTML!!!!!! NOT AN ATTENDANCE MANAGER !!! 

const currentUser = JSON.parse(localStorage.getItem("currentUser"))

const history = JSON.parse(localStorage.getItem("attendanceHistory")) || []

const table = document.getElementById("attendanceTable")

const subjectFilter = document.getElementById("subjectFilter")


/* -------------------------
   LOAD SUBJECTS
-------------------------- */

function loadSubjects(){

    const subjects = new Set()

    history.forEach(session => {
        subjects.add(session.subject)
    })

    subjects.forEach(subject => {

        const option = document.createElement("option")

        option.value = subject
        option.textContent = subject

        subjectFilter.appendChild(option)

    })

}


function loadAttendance(){

    // const history = JSON.parse(localStorage.getItem("attendanceHistory")) || []

    const filter = subjectFilter.value

    table.innerHTML = ""

    let total = 0
    let present = 0
    let absent = 0


    history.slice().reverse().forEach(session => {

        if(session.class !== currentUser.class) return

        if(filter !== "all" && session.subject !== filter) return

        const record = session.records.find(
            r => r.studentID === currentUser.id
        )

        if(record){

            total++

            if(record.status === "Present"){
                present++
            }else{
                absent++
            }

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


    /* -------------------------
       EMPTY STATE
    -------------------------- */

    if(total === 0){

        table.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;padding:20px;">
                No attendance records found
            </td>
        </tr>
        `

    }


    /* -------------------------
       UPDATE STATS
    -------------------------- */

    const percent = total > 0 ? Math.round((present/total)*100) : 0

    document.getElementById("attendancePercent").innerText = percent + "%"
    document.getElementById("classesAttended").innerText = present
    document.getElementById("classesMissed").innerText = absent

}


/* -------------------------
   EVENTS
-------------------------- */

subjectFilter.addEventListener("change", loadAttendance)

document.getElementById("backBtn")
.addEventListener("click", () => {

    window.location.href = "dashboard.html"

})


/* -------------------------
   INIT
-------------------------- */

loadSubjects()
loadAttendance()