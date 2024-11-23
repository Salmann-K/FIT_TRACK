class LungeDetector {
    constructor() {
        this.count = 0;
        this.position = "up";
    }

    reset() {
        this.count = 0;
        this.position = "up";
    }

    detect(keypoints) {
        const leftHip = keypoints.find(kp => kp.name === "left_hip");
        const leftKnee = keypoints.find(kp => kp.name === "left_knee");
        const leftAnkle = keypoints.find(kp => kp.name === "left_ankle");

        if (leftHip && leftKnee && leftAnkle) {
            const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
            displayAngleAndCount(angle, "Lunges", this.count);

            if (angle > 160) {
                if (this.position === "down") {
                    this.count++;
                    this.position = "up";
                }
            } else if (angle < 90 && this.position === "up") {
                this.position = "down";
            }
        }
    }
}

const lungeDetector = new LungeDetector();