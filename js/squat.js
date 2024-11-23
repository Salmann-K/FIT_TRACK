class SquatDetector {
    constructor() {
        this.count = 0;
        this.position = "standing"; // Start in standing position
    }

    reset() {
        this.count = 0;
        this.position = "standing";
    }

    detect(keypoints) {
        const leftHip = keypoints.find(kp => kp.name === "left_hip");
        const rightHip = keypoints.find(kp => kp.name === "right_hip");
        const leftKnee = keypoints.find(kp => kp.name === "left_knee");

        // Ensure all keypoints are detected before proceeding
        if (leftHip && rightHip && leftKnee) {
            const angle = calculateAngle(leftHip, rightHip, leftKnee); // Calculate knee angle
            displayAngleAndCount(angle, "Squats", this.count);

            // Check for squat position and avoid double counting
            if (angle > 160) {
                // If angle is above 160 degrees, user is in standing position
                if (this.position === "down") {
                    this.count++; // Count the squat when transitioning from down to standing
                    this.position = "standing"; // Set position back to standing
                }
            } else if (angle < 90 && this.position === "standing") {
                // When the angle is below 90 degrees, user is in down position
                this.position = "down"; // Set position to down when squat is performed
            }
        }
    }
}

function displayAngleAndCount(angle, exerciseName, count) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`${exerciseName} Angle: ${Math.round(angle)}`, 50, 50);
    ctx.fillText(`${exerciseName}: ${count}`, 10, 30);
}

async function detectPose() {
    const poses = await detector.estimatePoses(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw video frame

    if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        squatDetector.detect(keypoints); // Use the SquatDetector class to process keypoints
    }

    requestAnimationFrame(detectPose); // Keep detecting poses in the next frame
}

async function mainSquat() {
    await setupCamera(); // Initialize camera
    video.play(); // Start video feed
    canvas.width = 900; // Set canvas width
    canvas.height = 600; // Set canvas height
    await initializePoseDetector(); // Initialize pose detection
    detectPose(); // Start pose detection
}

// Initialize the SquatDetector class
const squatDetector = new SquatDetector();
