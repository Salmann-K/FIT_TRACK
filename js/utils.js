// Common variables
let detector;
const video = document.getElementById('video');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

// Initialize pose detector
async function initializePoseDetector() {
    detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });
    console.log("Pose detector loaded.");
}

// Calculate angle between three points
function calculateAngle(a, b, c) {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}

// Display angle and count on canvas
function displayAngleAndCount(angle, exerciseType, count) {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Angle: ${Math.round(angle)}`, 50, 50);
    ctx.fillStyle = "green";
    ctx.fillText(`${exerciseType}: ${count}`, 10, 30);
}