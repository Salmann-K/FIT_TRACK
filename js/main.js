let currentDetector = null;
let isDetecting = false;
let videoStream = null;

async function stopDetection() {
    isDetecting = false;
    
    // Stop video stream if it exists
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        video.srcObject = null;
    }
}

async function detectPose() {
    if (!detector || !currentDetector || !isDetecting) return;
    
    const poses = await detector.estimatePoses(video);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        currentDetector.detect(keypoints);
    }

    if (isDetecting) {
        requestAnimationFrame(detectPose);
    }
}

async function initializeExercise(exerciseType) {
    // Stop current detection if running
    await stopDetection();

    // Reset all detectors
    pushupDetector.reset();
    lungeDetector.reset();
    bicepCurlDetector.reset();

    // Set the appropriate detector
    switch(exerciseType) {
        case 'pushup':
            currentDetector = pushupDetector;
            break;
        case 'lunges':
            currentDetector = lungeDetector;
            break;
        case 'bicepCurl':
            currentDetector = bicepCurlDetector;
            break;
        case 'squat':
            currentDetector = squatDetector;
            break;
    }

    try {
        // Initialize camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoStream = stream;
        video.srcObject = stream;
        await new Promise((resolve) => video.onloadeddata = resolve);
        video.play();
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Initialize detector if not already done
        if (!detector) {
            await initializePoseDetector();
        }

        // Start detection
        isDetecting = true;
        detectPose();
        
    } catch (error) {
        console.error("Error initializing exercise:", error);
    }
}

// Clean up when the page is closed or refreshed
window.addEventListener('beforeunload', stopDetection);

// Event Listeners
document.getElementById('pushupButton').addEventListener('click', () => {
    initializeExercise('pushup');
});

document.getElementById('lungesButton').addEventListener('click', () => {
    initializeExercise('lunges');
});

document.getElementById('bicepCurlButton').addEventListener('click', () => {
    initializeExercise('bicepCurl');
});

document.getElementById('squatButton').addEventListener('click', () => {
    initializeExercise('squat');
});