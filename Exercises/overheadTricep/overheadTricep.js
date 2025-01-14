const video = document.getElementById("video"); // Hidden video element
const canvas = document.getElementById("output"); // Visible canvas
const ctx = canvas.getContext("2d");

let count = 0;
let position = null;
let detector;

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

// Function to process pose detection and count tricep extension reps
async function detectPose() {
  const poses = await detector.estimatePoses(video);

  // Clear the canvas and draw the video frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (poses.length > 0) {
    const keypoints = poses[0].keypoints;
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

    if (
      leftElbow && leftWrist &&
      rightElbow && rightWrist
    ) {
      // Calculate the angle between the upper arm and forearm (elbow to wrist)
      const leftElbowAngle = leftElbow.y - leftWrist.y;
      const rightElbowAngle = rightElbow.y - rightWrist.y;

      // Define thresholds for detecting "down" and "up" positions
      const downThreshold = 40; // Elbow is bent, arms close to the head
      const upThreshold = 5; // Elbow is fully extended, arms overhead

      // Detect tricep extension positions
      if (leftElbowAngle >= downThreshold && rightElbowAngle >= downThreshold) {
        position = "down"; // Elbows bent, hands near the head/neck
      }

      if (leftElbowAngle <= upThreshold && rightElbowAngle <= upThreshold && position === "down") {
        position = "up"; // Elbows extended overhead
        count++; // Increment the count for one completed rep
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

  // Display tricep extension rep count on the canvas
  ctx.font = "24px Arial";
  ctx.fillStyle = "green";
  ctx.fillText(`Tricep Extensions: ${count}`, 10, 30);

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
