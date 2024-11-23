class PushupDetector {
    constructor() {
        this.count = 0;
        this.position = "up";
    }

    reset() {
        this.count = 0;
        this.position = "up";
    }

    detect(keypoints) {
        const leftShoulder = keypoints.find(kp => kp.name === "left_shoulder");
        const leftElbow = keypoints.find(kp => kp.name === "left_elbow");
        const leftWrist = keypoints.find(kp => kp.name === "left_wrist");

        if (leftShoulder && leftElbow && leftWrist) {
            const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
            displayAngleAndCount(angle, "Push-ups", this.count);

            if (angle > 160) {
                if (this.position === "down") {
                    this.count++;
                    this.position = "up";
                }
            } else if (angle < 30 && this.position === "up") {
                this.position = "down";
            }
        }
    }
}

const pushupDetector = new PushupDetector();