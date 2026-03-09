// const startBtn = document.getElementById("startSessionBtn")

// let qrTime = 30
// let qrInterval = null

// startBtn.addEventListener("click", startSession)


// function startSession(){

//     const className = document.getElementById("classSelect").value
//     const subject = document.getElementById("subjectSelect").value

//     const sessionID = "SESSION_" + Date.now()

//     const session = {
//         sessionID,
//         class: className,
//         subject: subject,
//         startTime: new Date().toLocaleTimeString(),
//         date: new Date().toLocaleDateString()
//     }

//     // save new session
//     localStorage.setItem("currentSession", JSON.stringify(session))

//     // clear previous session attendance
//     localStorage.removeItem("attendance")

//     // reset live entries panel
//     const liveEntries = document.getElementById("liveEntries")
//     if(liveEntries){
//         liveEntries.innerHTML = ""
//     }

//     // reset present counter
//     const presentCount = document.getElementById("sessionPresent")
//     if(presentCount){
//         presentCount.innerText = "0"
//     }

//     // reset live entry tracker (from teacher-dashboard.js)
//     if(typeof liveEntryTracker !== "undefined"){
//         liveEntryTracker = new Set()
//     }

//     displaySession(session)

//     loadStudentsForSession(className)

//     startQRSystem(session.sessionID)
// }


// function displaySession(session){

//     document.getElementById("sessionClass").innerText = session.class
//     document.getElementById("sessionSubject").innerText = session.subject

// }


// function startQRSystem(sessionID){

//     // generate first QR
//     generateQR(sessionID)

//     qrTime = 30
//     document.getElementById("qrTimer").innerText = qrTime

//     if(qrInterval){
//         clearInterval(qrInterval)
//     }

//     qrInterval = setInterval(() => {

//         qrTime--

//         document.getElementById("qrTimer").innerText = qrTime

//         if(qrTime === 0){

//             generateQR(sessionID)

//             qrTime = 30
//         }

//     }, 1000)

// }


// // new part

// async function loadStudentsForSession(className){

//     console.log("Loading students for class:", className)

//     const res = await fetch("../data/students.json")
//     const students = await res.json()

//     console.log("Dropdown class:", className)
//     console.log("All students:", students)

//     const classStudents = students.filter(
//         student => student.class.trim() === className.trim()
//     )

//     console.log("Filtered students:", classStudents)

//     const table = document.querySelector("#attendanceTable")

//     console.log("loading table..")
//     table.innerHTML = ""

//     classStudents.forEach(student => {

//         const row = `
//         <tr id="student-${student.id}">
//             <td>${student.name}</td>
//             <td>${student.id}</td>
//             <td class="status absent">Absent</td>
//             <td>-</td>
//         </tr>
//         `
//         table.insertAdjacentHTML("beforeend", row)

//     })

// }









const startBtn = document.getElementById("startSessionBtn")

let qrTime = 30
let qrInterval = null

startBtn.addEventListener("click", startSession)


function startSession(){

    const className = document.getElementById("classSelect").value
    const subject = document.getElementById("subjectSelect").value

    const sessionID = "SESSION_" + Date.now()

    const session = {
        sessionID,
        class: className,
        subject: subject,
        startTime: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
    }

    // save session
    localStorage.setItem("currentSession", JSON.stringify(session))

    // clear previous attendance
    localStorage.removeItem("attendance")

    // reset live entries
    const liveEntries = document.getElementById("liveEntries")
    if(liveEntries){
        liveEntries.innerHTML = ""
    }

    // reset present counter
    const presentCount = document.getElementById("sessionPresent")
    if(presentCount){
        presentCount.innerText = "0"
    }

    // reset tracker
    if(typeof liveEntryTracker !== "undefined"){
        liveEntryTracker = new Set()
    }

    displaySession(session)

    loadStudentsForSession(className)

    startQRSystem(session.sessionID)


    // session active or inactive
    const status = document.getElementById("sessionStatus")

    if(status){
        status.innerText = "Session Active"
    }

}


function displaySession(session){

    document.getElementById("sessionClass").innerText = session.class
    document.getElementById("sessionSubject").innerText = session.subject

}


function startQRSystem(sessionID){

    generateQR(sessionID)

    qrTime = 30
    document.getElementById("qrTimer").innerText = qrTime

    if(qrInterval){
        clearInterval(qrInterval)
    }

    qrInterval = setInterval(() => {

        qrTime--

        document.getElementById("qrTimer").innerText = qrTime

        if(qrTime === 0){

            generateQR(sessionID)

            qrTime = 30
        }

    }, 1000)

}


/* -------------------------
   LOAD STUDENTS
-------------------------- */

async function loadStudentsForSession(className){

    const res = await fetch("../data/students.json")
    const students = await res.json()

    const classStudents = students.filter(
        student => student.class.trim() === className.trim()
    )

    const table = document.querySelector("#attendanceTable")

    table.innerHTML = ""

    classStudents.forEach(student => {

        const row = `
        <tr id="student-${student.id}">
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td class="status absent">Absent</td>
            <td>-</td>
        </tr>
        `

        table.insertAdjacentHTML("beforeend", row)

    })

    /* -------------------------
       UPDATE TOTAL STUDENTS
    -------------------------- */

    const totalStudents = classStudents.length

    const totalDisplay = document.getElementById("sessionTotal")

    if(totalDisplay){
        totalDisplay.innerText = totalStudents
    }

    /* -------------------------
       POPULATE MANUAL ATTENDANCE DROPDOWN
    -------------------------- */

    const dropdown = document.getElementById("studentSelect")

    if(dropdown){

        dropdown.innerHTML = '<option value="">Select Student</option>'

        classStudents.forEach(student => {

            const option = document.createElement("option")

            option.value = student.id
            option.textContent = `${student.name} (${student.id})`

            dropdown.appendChild(option)

        })

    }

}