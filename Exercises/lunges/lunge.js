import { saveExerciseLog } from "../../exerciseLogger.js";

const params = new URLSearchParams(window.location.search);
const stopCount = parseInt(params.get("stopCount")) || Infinity; // Default to no limit if not provided
const redirectUrl = params.get("redirectUrl");

const video = document.getElementById('video'); // Hidden video element
const canvas = document.getElementById('output'); // Visible canvas
const ctx = canvas.getContext('2d');

let count = 0;
let position = "up"; // Start assuming the legs are fully extended
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
  detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
  });
  console.log("Pose detector loaded.");
}

// Function to calculate angle between three points
function calculateAngle(a, b, c) {
  a = [a.x, a.y];
  b = [b.x, b.y];
  c = [c.x, c.y];

  const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

// Function to process pose detection and count lunges
async function detectPose() {
  const poses = await detector.estimatePoses(video);

  // Clear the canvas and draw the video frame on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const rightKnee = keypoints.find((kp) => kp.name === "right_knee");
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");

    if (rightHip && rightKnee && rightAnkle) {
      // Calculate angle at the knee joint
      const angle = calculateAngle(rightHip, rightKnee, rightAnkle);

      // Display the angle on the screen
      ctx.font = "24px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`Angle: ${Math.round(angle)}`, 50, 50);

      // Lunge logic to count repetitions
      if (angle > 160) {  // Legs extended (standing position)
        if (position === "down") {
          count++;  // Increment lunge count
          position = "up";  // Update position to "up"
        }
      } else if (angle < 90 && position === "up") {  // Knees bent (lunging position)
        position = "down";  // Update position to "down"
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
          kp.x * canvas.width / video.videoWidth, 
          kp.y * canvas.height / video.videoHeight, 
          5, 
          0, 
          2 * Math.PI
        );
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    // Display the lunge count on the screen
    ctx.fillStyle = "green";
    ctx.fillText(`Lunges: ${count}`, 10, 30);
  }

  if (count >= stopCount) {
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    saveExerciseLog("Lunges", stopCount, elapsedTime);
        alert(`Lunges goal reached: ${count}`);
      
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

  // Dynamically set the canvas size
  const desiredWidth = 900;
  const desiredHeight = 600;
  canvas.width = desiredWidth;
  canvas.height = desiredHeight;

  await initializePoseDetector();
  detectPose();
}

main().catch(err => console.error('Error during initialization:', err));
