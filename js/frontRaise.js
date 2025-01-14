class FrontRaiseDetector {
    constructor() {
        this.count = 0;
        this.position = "down";
    }

    reset() {
        this.count = 0;
        this.position = "down";
    }

    detect(keypoints) {
        const leftShoulder = keypoints.find(kp => kp.name === "left_shoulder");
        const leftElbow = keypoints.find(kp => kp.name === "left_elbow");
        const leftWrist = keypoints.find(kp => kp.name === "left_wrist");

        if (leftShoulder && leftElbow && leftWrist) {
            const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
            displayAngleAndCount(angle, "Front Raise", this.count);

            if (angle > 90) {
                if (this.position === "down") {
                    this.count++;
                    this.position = "up";
                }
            } else if (angle < 20 && this.position === "up") {
                this.position = "down";
            }
        }
    }
}

const frontRaiseDetector = new FrontRaiseDetector();
