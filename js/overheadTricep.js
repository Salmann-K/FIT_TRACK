class OverheadTricepExtensionDetector {
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
            displayAngleAndCount(angle, "Overhead Tricep Extension", this.count);

            if (angle < 60) {
                if (this.position === "up") {
                    this.count++;
                    this.position = "down";
                }
            } else if (angle > 120 && this.position === "down") {
                this.position = "up";
            }
        }
    }
}

const overheadTricepExtensionDetector = new OverheadTricepExtensionDetector();
