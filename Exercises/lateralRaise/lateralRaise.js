import { saveExerciseLog } from "../../exerciseLogger.js";

const params = new URLSearchParams(window.location.search);
const stopCount = parseInt(params.get("stopCount")) || Infinity; // Default to no limit if not provided
const redirectUrl = params.get("redirectUrl");

const video = document.getElementById("video"); // Hidden video element
const canvas = document.getElementById("output"); // Visible canvas
const ctx = canvas.getContext("2d");

let count = 0;
let position = null;
let detector;
let startTime=null;

// Function to set up the camera
async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadeddata = () => resolve(video);
  });
}

// Function to initialize the pose detector
async function initializePoseDetector() {
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    }
  );
  console.log("Pose detector loaded.");
}

// Function to process pose detection and count lateral raises
async function detectPose() {
  const poses = await detector.estimatePoses(video);

  // Clear the canvas and draw the video frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

    if (leftShoulder && leftWrist && rightShoulder && rightWrist) {
      const leftRaise = leftWrist.y - leftShoulder.y;
      const rightRaise = rightWrist.y - rightShoulder.y;

      // Detect lateral raise positions
      if (leftRaise >= 30 && rightRaise >= 30) {
        position = "down"; // Hands are near hips
      }

      if (leftRaise <= 5 && rightRaise <= 5 && position === "down") {
        position = "up"; // Hands are at shoulder height
        count++;
      }

      if(count==1){
        startTime=Date.now;
      }
    }

    // Draw keypoints
    keypoints.forEach((kp) => {
      if (kp.score > 0.5) {
        ctx.beginPath();
        ctx.arc(
          (kp.x * canvas.width) / video.videoWidth,
          (kp.y * canvas.height) / video.videoHeight,
          5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });
  }

  // Display lateral raise count on the canvas
  ctx.font = "24px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText(`Lateral Raises: ${count}`, 10, 30);

  if (count >= stopCount) {
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    saveExerciseLog("Lateral Raise", stopCount, elapsedTime);
        alert(`Lateral Raise goal reached: ${count}`);
      
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000); // 5 seconds delay before redirection
        }
      
        return;// Stop further detection
  }

  requestAnimationFrame(detectPose);
}

// Main function to initialize and start everything
async function main() {
  await setupCamera();
  video.play();

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  await initializePoseDetector();
  detectPose();
}

main();
