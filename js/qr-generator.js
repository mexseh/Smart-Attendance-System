function generateQR(sessionID) {

    const qrContainer = document.getElementById("qrcode")

    const qrData = {
        sessionID: sessionID,
        timestamp: Date.now()
    }

    qrContainer.innerHTML = ""

    new QRCode(qrContainer, {
        text: JSON.stringify(qrData),
        width: 150,
        height: 150
    })

}