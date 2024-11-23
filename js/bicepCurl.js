class BicepCurlDetector {
    constructor() {
        this.count = 0;
        this.position = "up";  // Start assuming the arm is fully extended
    }

    reset() {
        this.count = 0;
        this.position = "up";
    }

    detect(keypoints) {
        const rightShoulder = keypoints.find(kp => kp.name === "right_shoulder");
        const rightElbow = keypoints.find(kp => kp.name === "right_elbow");
        const rightWrist = keypoints.find(kp => kp.name === "right_wrist");

        if (rightShoulder && rightElbow && rightWrist) {
            const angle = calculateAngle(
                { x: rightShoulder.x, y: rightShoulder.y },
                { x: rightElbow.x, y: rightElbow.y },
                { x: rightWrist.x, y: rightWrist.y }
            );

            // Display the current angle and count
            displayAngleAndCount(angle, "Curls", this.count);

            // Bicep curl logic to count repetitions
            if (angle > 160) {  // Arm is fully extended
                if (this.position === "down") {
                    this.position = "up";  // Update position to "up"
                }
            } else if (angle < 30 && this.position === "up") {  // Arm is curled
                this.position = "down";  // Update position to "down"
                this.count += 1;
                console.log(`Bicep Curl Count: ${this.count}`);
            }
        }
    }
}

const bicepCurlDetector = new BicepCurlDetector();