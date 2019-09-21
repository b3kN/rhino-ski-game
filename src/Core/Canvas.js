export class Canvas {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    drawOffset = {
        x: 0,
        y: 0
    };
    ctx = null;

    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.createCanvas();
    }

    // Implement the scoreboard section to display the timer as the skier progresses.
    // NOTE: It would've been really fun to implement points here for style and distance, but my time expired.
    createScoreboard() {
        const scoreboard = document.createElement('div');
        scoreboard.id = "scoreboard";

        const timer = document.createElement('div');
        const timerLabel = document.createElement('label');
        const timerContent = document.createElement('span');
        const labelContent = document.createTextNode('Timer: ');
        const minutes = document.createElement('span');
        const minutesCt = document.createTextNode('00');
        const separator = document.createElement('span');
        const separatorText = document.createTextNode(':');
        const seconds = document.createElement('span');
        const secondsCt = document.createTextNode('00');

        timerLabel.appendChild(labelContent);

        minutes.id = "minutes";
        minutes.appendChild(minutesCt);

        separator.appendChild(separatorText);

        seconds.id = "seconds";
        seconds.appendChild(secondsCt);

        timerContent.appendChild(minutes);
        timerContent.appendChild(separator);
        timerContent.appendChild(seconds);
        timer.appendChild(timerLabel);
        timer.appendChild(timerContent);

        scoreboard.appendChild(timer);

        document.body.appendChild(scoreboard);
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = "skiCanvas";
        canvas.width = this.width * window.devicePixelRatio;
        canvas.height = this.height * window.devicePixelRatio;
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';

        this.ctx = canvas.getContext("2d");
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        document.body.appendChild(canvas);
        this.createScoreboard();
    }

    clearCanvas() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
    }

    setDrawOffset(x, y) {
        this.drawOffset.x = x;
        this.drawOffset.y = y;
    }

    drawImage(image, x, y, width, height) {
        x -= this.drawOffset.x;
        y -= this.drawOffset.y;

        this.ctx.drawImage(image, x, y, width, height);
    }
}