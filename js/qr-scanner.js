function onScanSuccess(decodedText) {

    let data

    try {
        data = JSON.parse(decodedText)
    }
    catch (err) {
        console.log("Invalid QR format")
        return
    }

    const now = Date.now()
    const qrAge = now - data.timestamp

    if (qrAge > 30000) {

        document.getElementById("scanStatus").innerText =
            "QR expired. Please scan the latest QR."

        return
    }

    const user = JSON.parse(localStorage.getItem("currentUser"))

    const attendance =
        JSON.parse(localStorage.getItem("attendance")) || []

    const alreadyMarked = attendance.find(a =>
        a.studentID === user.id &&
        a.sessionID === data.sessionID
    )

    if (alreadyMarked) {

        document.getElementById("scanStatus").innerText =
            "Attendance already marked."

        return
    }

    attendance.push({
        studentID: user.id,
        name: user.name,
        sessionID: data.sessionID,
        time: new Date().toLocaleTimeString()
    })

    localStorage.setItem("attendance", JSON.stringify(attendance))

    document.getElementById("scanStatus").innerText =
        "Attendance Marked Successfully!"
        html5QrCode.stop();

}


let html5QrCode = null;

function startScanner(){

    if(html5QrCode) return;

    html5QrCode = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {

        if(devices && devices.length){

            const cameraId = devices[0].id;

            html5QrCode.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: 250
                },
                onScanSuccess
            );

        }

    }).catch(err => {
        console.log("Camera error:", err);
    });

}

document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("startScanBtn");

    if(startBtn){
        startBtn.addEventListener("click", startScanner);
    }

});