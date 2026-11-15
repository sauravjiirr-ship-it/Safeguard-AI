let drowsiness = 0;
let distraction = 0;
let emergencyActive = false;


// SPEED

function updateSpeed() {

    document.getElementById("speed").innerText =
        document.getElementById("speedSlider").value;

    analyzeSafety();
}


// COLLISION

function updateCollision() {

    document.getElementById("collision").innerText =
        document.getElementById("collisionSlider").value;

    analyzeSafety();
}


// DROWSINESS

function toggleDrowsiness() {

    drowsiness = drowsiness === 0 ? 1 : 0;

    const status =
        document.getElementById("drowsinessStatus");

    if (drowsiness) {

        status.innerText = "⚠️ DROWSY";
        status.style.color = "#ff4d5a";

        speakWarning(
            "Warning! Driver drowsiness detected."
        );

    } else {

        status.innerText = "SAFE";
        status.style.color = "#61ff9a";
    }

    analyzeSafety();
}


// DISTRACTION

function toggleDistraction() {

    distraction = distraction === 0 ? 1 : 0;

    const status =
        document.getElementById("distractionStatus");

    if (distraction) {

        status.innerText = "⚠️ DISTRACTED";
        status.style.color = "#ff4d5a";

        speakWarning(
            "Warning! Driver distraction detected."
        );

    } else {

        status.innerText = "ATTENTIVE";
        status.style.color = "#61ff9a";
    }

    analyzeSafety();
}


// START SYSTEM

function startSystem() {

    speakWarning(
        "Safeguard AI safety monitoring activated."
    );

    analyzeSafety();
}


// AI ANALYSIS

async function analyzeSafety() {

    const speed =
        Number(document.getElementById("speedSlider").value);

    const collisionRisk =
        Number(document.getElementById("collisionSlider").value);

    try {

        const response = await fetch("/api/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                speed: speed,

                drowsiness: drowsiness,

                distraction: distraction,

                collisionRisk: collisionRisk

            })
        });

        const data = await response.json();

        document.getElementById("score").innerText =
            data.score;

        document.getElementById("riskLevel").innerText =
            data.risk + " RISK";

        document.getElementById("message").innerText =
            data.message;


        const circle =
            document.querySelector(".risk-circle");

        const risk =
            document.getElementById("riskLevel");


        if (data.risk === "HIGH") {

            risk.style.color = "#ff4d5a";

            circle.style.borderColor = "#ff4d5a";

            circle.style.boxShadow =
                "0 0 35px #ff4d5a";

            speakWarning(
                "High accident risk detected. Please slow down."
            );


            if (collisionRisk >= 80) {

                activateEmergency();
            }


        } else if (data.risk === "MEDIUM") {

            risk.style.color = "#ffd166";

            circle.style.borderColor = "#ffd166";

            circle.style.boxShadow =
                "0 0 25px #ffd166";


        } else {

            risk.style.color = "#61ff9a";

            circle.style.borderColor = "#61ff9a";

            circle.style.boxShadow =
                "0 0 20px #61ff9a";
        }


    } catch (error) {

        console.log(
            "Backend connection error:",
            error
        );

        document.getElementById("message").innerText =
            "Backend connection error.";
    }
}


// VOICE

function speakWarning(text) {

    if ("speechSynthesis" in window) {

        window.speechSynthesis.cancel();

        const voice =
            new SpeechSynthesisUtterance(text);

        voice.rate = 1;

        voice.pitch = 1;

        window.speechSynthesis.speak(voice);
    }
}


// EMERGENCY BUTTON

function emergencyAlert() {

    activateEmergency();
}


// EMERGENCY SYSTEM

function activateEmergency() {

    if (emergencyActive) return;

    emergencyActive = true;

    const panel =
        document.querySelector(".emergency-panel");

    const indicator =
        document.getElementById(
            "emergencyIndicator"
        );

    const message =
        document.getElementById(
            "emergencyMessage"
        );


    panel.classList.add("emergency-active");

    indicator.style.color = "#ff4d5a";

    message.innerText =
        "🚨 EMERGENCY MODE ACTIVE";


    speakWarning(
        "Emergency alert activated. Please stay calm."
    );


    // Browser location

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(

            function(position) {

                const lat =
                    position.coords.latitude;

                const lon =
                    position.coords.longitude;


                document.getElementById(
                    "locationBox"
                ).innerText =

                    "📍 Location detected: " +

                    lat.toFixed(5) +
                    ", " +
                    lon.toFixed(5);
            },


            function() {

                document.getElementById(
                    "locationBox"
                ).innerText =

                    "📍 Location permission not granted.";
            }
        );

    } else {

        document.getElementById(
            "locationBox"
        ).innerText =

            "📍 Location unavailable.";
    }
}


// ACCIDENT SIMULATION

function simulateAccident() {

    const indicator =
        document.getElementById(
            "emergencyIndicator"
        );

    const message =
        document.getElementById(
            "emergencyMessage"
        );


    indicator.style.color = "#ff4d5a";

    message.innerText =
        "🚨 POSSIBLE ACCIDENT DETECTED!";


    speakWarning(
        "Warning! Possible accident detected. Emergency mode activated."
    );


    setTimeout(function() {

        activateEmergency();

    }, 1500);
}
// ---------------- HACKATHON DEMO MODE ----------------

function startDemoMode() {

    emergencyActive = false;

    const emergencyPanel =
        document.querySelector(".emergency-panel");

    emergencyPanel.classList.remove("emergency-active");

    const speedSlider =
        document.getElementById("speedSlider");

    const collisionSlider =
        document.getElementById("collisionSlider");

    const drowsinessStatus =
        document.getElementById("drowsinessStatus");

    const distractionStatus =
        document.getElementById("distractionStatus");


    // STEP 1 - SAFE

    speedSlider.value = 40;
    collisionSlider.value = 10;

    drowsiness = 0;
    distraction = 0;

    updateSpeed();
    updateCollision();

    speakWarning(
        "Demo started. Driving condition is safe."
    );


    // STEP 2 - MEDIUM RISK

    setTimeout(function () {

        speedSlider.value = 90;
        collisionSlider.value = 55;

        updateSpeed();
        updateCollision();

        speakWarning(
            "Medium risk detected. Driver should be careful."
        );

    }, 4000);


    // STEP 3 - HIGH RISK

    setTimeout(function () {

        speedSlider.value = 120;
        collisionSlider.value = 85;

        drowsiness = 1;
        distraction = 1;

        drowsinessStatus.innerText =
            "⚠️ DROWSY";

        drowsinessStatus.style.color =
            "#ff4d5a";

        distractionStatus.innerText =
            "⚠️ DISTRACTED";

        distractionStatus.style.color =
            "#ff4d5a";

        updateSpeed();
        updateCollision();

        speakWarning(
            "High accident risk detected."
        );

    }, 8000);


    // STEP 4 - EMERGENCY

    setTimeout(function () {

        simulateAccident();

    }, 12000);
}