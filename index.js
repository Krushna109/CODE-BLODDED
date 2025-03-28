// Connect to WebSocket server
const socket = io("http://localhost:5000"); // If backend runs on a different port, change this

// Check if WebSocket is connected
socket.on("connect", () => {
    console.log("✅ Connected to WebSocket Server");
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket Server");
});

// SOS Button Click Event
document.getElementById("sosButton").addEventListener("click", () => {
    console.log("🚨 SOS Button Clicked!");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            console.log("📍 Location:", location);

            // Send SOS alert to the backend
            socket.emit("sos-alert", { message: "Help Needed!", location });

            alert("🚨 SOS Sent!");
        }, (error) => {
            console.error("❌ Location Error:", error);
            alert("⚠️ Location access denied or unavailable!");
        });
    } else {
        alert("⚠️ Geolocation not supported by your browser!");
    }
});

// Listen for SOS alerts
socket.on("alert-received", (data) => {
    console.log("🔔 SOS Alert Received:", data);

    // Update the UI
    const alertList = document.getElementById("alertList");
    const li = document.createElement("li");
    li.innerText = `${data.message} at Lat: ${data.location.lat}, Lng: ${data.location.lng}`;
    alertList.appendChild(li);
});

// AI-Based Voice Distress Detection
document.getElementById("voiceDetectionButton").addEventListener("click", async () => {
    console.log("🎤 Starting voice recognition...");

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = () => {
        console.log("🎙 Voice recognition started...");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("🗣 Detected Speech:", transcript);

        const distressPhrases = ["help", "i need help", "save me"];
        if (distressPhrases.some((phrase) => transcript.includes(phrase))) {
            socket.emit("sos-alert", { message: "Help Needed (Voice Detected)!" });
            alert("🚨 Distress detected! SOS Sent!");
        }
    };

    recognition.onerror = (event) => {
        console.error("❌ Speech Recognition Error:", event.error);
    };

    recognition.start();
});
