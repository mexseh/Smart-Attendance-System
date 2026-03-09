document.addEventListener("DOMContentLoaded", () => {

    const teacher = JSON.parse(localStorage.getItem("currentUser"))

    if (teacher) {
        const teacherName = document.getElementById("teacherName")
        if(teacherName){
            teacherName.innerText = teacher.name
        }
    }

    // logout

    const logoutBtn = document.getElementById("logoutBtn")

    if(logoutBtn){
        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("currentUser")
            window.location.href = "../auth/login.html"

        })
    }

    // end session button

    const endBtn = document.getElementById("endSessionBtn")

    if(endBtn){
        endBtn.addEventListener("click", endSession)
    }

    /* -------------------------
       DEFAULT DASHBOARD STATE
    -------------------------- */

    const session = JSON.parse(localStorage.getItem("currentSession"))

    /* -------------------------
    RESET SESSION IF PAGE REFRESHED
    -------------------------- */

    if(session){

        localStorage.removeItem("currentSession")
        localStorage.removeItem("attendance")

        // reset UI immediately
        const classDisplay = document.getElementById("sessionClass")
        const subjectDisplay = document.getElementById("sessionSubject")
        const presentDisplay = document.getElementById("sessionPresent")
        const totalDisplay = document.getElementById("sessionTotal")
        const statusDisplay = document.getElementById("sessionStatus")
        const qrTimer = document.getElementById("qrTimer")

        if(classDisplay) classDisplay.innerText = "---"
        if(subjectDisplay) subjectDisplay.innerText = "---"
        if(presentDisplay) presentDisplay.innerText = "0"
        if(totalDisplay) totalDisplay.innerText = "0"
        if(statusDisplay) statusDisplay.innerText = "Session Inactive"
        if(qrTimer) qrTimer.innerText = "0"

    }

    /* --------------------------
        DEFAULT VALUES
    -----------------------------*/
    if(!session){

        const classDisplay = document.getElementById("sessionClass")
        const subjectDisplay = document.getElementById("sessionSubject")
        const presentDisplay = document.getElementById("sessionPresent")
        const totalDisplay = document.getElementById("sessionTotal")
        const statusDisplay = document.getElementById("sessionStatus")
        const qrTimer = document.getElementById("qrTimer")

        if(classDisplay) classDisplay.innerText = "---"
        if(subjectDisplay) subjectDisplay.innerText = "---"

        if(presentDisplay) presentDisplay.innerText = "0"
        if(totalDisplay) totalDisplay.innerText = "0"

        if(statusDisplay) statusDisplay.innerText = "Session Inactive"

        if(qrTimer) qrTimer.innerText = "0"

        /* -------------------------
           DEFAULT DASHBOARD CARDS
        -------------------------- */

        const totalCard = document.getElementById("totalStudents")
        const presentCard = document.getElementById("presentCount")
        const absentCard = document.getElementById("absentCount")
        const rateCard = document.getElementById("attendanceRate")

        if(totalCard) totalCard.innerText = "---"
        if(presentCard) presentCard.innerText = "---"
        if(absentCard) absentCard.innerText = "---"
        if(rateCard) rateCard.innerText = "---"

        /* -------------------------
           CLEAR MANUAL ATTENDANCE LIST
        -------------------------- */

        const dropdown = document.getElementById("studentSelect")

        if(dropdown){
            dropdown.innerHTML = '<option>Select Student</option>'
        }

    }

})


/* ---------------------------
    Live Entries
------------------------------*/

function addLiveEntry(studentName, time){

    const container = document.getElementById("liveEntries")

    if(!container) return

    const entry = document.createElement("div")

    entry.classList.add("live-entry")

    entry.innerHTML = `✔️ ${studentName} | Present | ${time}`

    entry.style.padding = "6px 0"
    entry.style.borderBottom = "1px solid #eee"

    container.prepend(entry)

}

let liveEntryTracker = new Set()

/* -------------------------
   Session TABLE UPDATE
-------------------------- */

function updateAttendanceTable() {

    const session = JSON.parse(localStorage.getItem("currentSession"))
    const attendance = JSON.parse(localStorage.getItem("attendance")) || []

    if(!session) return

    const sessionAttendance = attendance.filter(a =>
        a.sessionID === session.sessionID
    )

    sessionAttendance.forEach(student => {

        const row = document.getElementById("student-" + student.studentID)

        if(row){

            const statusCell = row.children[2]
            const timeCell = row.children[3]

            statusCell.innerText = "Present"
            statusCell.classList.remove("absent")
            statusCell.classList.add("present")

            timeCell.innerText = student.time

            // LIVE ENTRY SYSTEM
            if(!liveEntryTracker.has(student.studentID)){

                addLiveEntry(student.name, student.time)

                liveEntryTracker.add(student.studentID)

            }

        }

    })

    const presentCount = document.getElementById("sessionPresent")

    if(presentCount){
        presentCount.innerText = sessionAttendance.length
    }


    /* -------------------------
     UPDATE DASHBOARD CARDS
    -------------------------- */

    const totalStudents = document.querySelectorAll("#attendanceTable tr").length
    const presentStudents = sessionAttendance.length
    const absentStudents = totalStudents - presentStudents

    const totalCard = document.getElementById("totalStudents")
    const presentCard = document.getElementById("presentCount")
    const absentCard = document.getElementById("absentCount")
    const rateCard = document.getElementById("attendanceRate")

    if(totalCard) totalCard.innerText = totalStudents
    if(presentCard) presentCard.innerText = presentStudents
    if(absentCard) absentCard.innerText = absentStudents

    if(rateCard && totalStudents > 0){
        const rate = Math.round((presentStudents / totalStudents) * 100)
        rateCard.innerText = rate + "%"
    }

}



/* -------------------------
   AUTO REFRESH TABLE
-------------------------- */

setInterval(() => {

    const session = JSON.parse(localStorage.getItem("currentSession"))

    if(session){
        updateAttendanceTable()
    }

}, 1000)



/* -------------------------
   END SESSION
-------------------------- */

async function endSession(){

    const session = JSON.parse(localStorage.getItem("currentSession"))

    if(!session) return

    /* -------------------------
       STOP QR SYSTEM
    -------------------------- */

    if(typeof qrInterval !== "undefined" && qrInterval){
        clearInterval(qrInterval)
        qrInterval = null
    }

    const qrContainer = document.getElementById("qrcode")

    if(qrContainer){
        qrContainer.innerHTML = ""
    }

    const qrTimer = document.getElementById("qrTimer")

    if(qrTimer){
        qrTimer.innerText = "0"
    }

    /* -------------------------
       SAVE ATTENDANCE
    -------------------------- */

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || []

    const res = await fetch("../data/students.json")
    const students = await res.json()

    const sessionAttendance =
        attendance.filter(a => a.sessionID === session.sessionID)

    const finalAttendance = students.map(student => {

        const present = sessionAttendance.find(a =>
            a.studentID === student.id
        )

        return {
            studentID: student.id,
            name: student.name,
            status: present ? "Present" : "Absent"
        }

    })

    saveAttendanceHistory(session, finalAttendance)

    /* -------------------------
   CLEAR ATTENDANCE TABLE
    -------------------------- */

    const table = document.getElementById("attendanceTable")

    if(table){
        table.innerHTML = ""
    }

    /* -------------------------
    CLEAR MANUAL ATTENDANCE DROPDOWN
    -------------------------- */
    const dropdown = document.getElementById("studentSelect")

    if(dropdown){
        dropdown.innerHTML = '<option value="">Select Student</option>'
    }
        

    /* -------------------------
       CLEAR CURRENT SESSION
    -------------------------- */

    localStorage.removeItem("currentSession")

    /* -------------------------
    RESET SESSION INFO
    -------------------------- */

    const classDisplay = document.getElementById("sessionClass")
    const subjectDisplay = document.getElementById("sessionSubject")
    const presentDisplay = document.getElementById("sessionPresent")
    const totalDisplay = document.getElementById("sessionTotal")
    const status = document.getElementById("sessionStatus")

    if(classDisplay) classDisplay.innerText = "---"
    if(subjectDisplay) subjectDisplay.innerText = "---"

    if(presentDisplay) presentDisplay.innerText = "0"
    if(totalDisplay) totalDisplay.innerText = "0"
    if(status) status.innerText = "Session Inactive"



    /* -------------------------
    RESET DASHBOARD CARDS
    -------------------------- */

    const totalCard = document.getElementById("totalStudents")
    const presentCard = document.getElementById("presentCount")
    const absentCard = document.getElementById("absentCount")
    const rateCard = document.getElementById("attendanceRate")

    if(totalCard) totalCard.innerText = "---"
    if(presentCard) presentCard.innerText = "---"
    if(absentCard) absentCard.innerText = "---"
    if(rateCard) rateCard.innerText = "---"


    /* -------------------------
    CLEAR LIVE ENTRIES
    -------------------------- */

    const liveEntries = document.getElementById("liveEntries")

    if(liveEntries){
        liveEntries.innerHTML = ""
    }
}



/* -------------------------
   SAVE ATTENDANCE HISTORY
-------------------------- */

function saveAttendanceHistory(session, records){

    const history =
        JSON.parse(localStorage.getItem("attendanceHistory")) || []

    history.push({
        sessionID: session.sessionID,
        class: session.class,
        subject: session.subject,
        date: session.date,
        records: records
    })

    localStorage.setItem(
        "attendanceHistory",
        JSON.stringify(history)
    )

    showNotification("Session saved successfully")

}

/* -------------------------
   MANUAL ATTENDANCE
-------------------------- */

const manualBtn = document.getElementById("manualAttendanceBtn")

if(manualBtn){

    manualBtn.addEventListener("click", () => {

        const dropdown = document.getElementById("studentSelect")
        const studentID = dropdown.value

        if(!studentID || studentID === "Select Student"){
            showNotification("Please select a student")
            return
        }

        const session = JSON.parse(localStorage.getItem("currentSession"))

        if(!session){
            alert("No active session")
            return
        }

        let attendance =
            JSON.parse(localStorage.getItem("attendance")) || []

        const alreadyMarked = attendance.find(a =>
            a.studentID === studentID &&
            a.sessionID === session.sessionID
        )

        if(alreadyMarked){
            alert("Student already marked present")
            return
        }

        const studentName =
            dropdown.options[dropdown.selectedIndex].text.split(" (")[0]

        attendance.push({
            studentID: studentID,
            name: studentName,
            sessionID: session.sessionID,
            time: new Date().toLocaleTimeString()
        })

        localStorage.setItem("attendance", JSON.stringify(attendance))

    })

}



/*---------------------------------
    NOTIFICATION CENTERRRRRRRR
-----------------------------------*/
function showNotification(message, type="info"){

    const container = document.getElementById("notificationContainer")

    const note = document.createElement("div")

    note.classList.add("notification")

    if(type === "success") note.classList.add("success")
    if(type === "error") note.classList.add("error")

    note.innerText = message

    container.appendChild(note)

    setTimeout(()=>{
        note.remove()
    },3000)

}