import * as Constants from "../Constants";
import { AssetManager } from "./AssetManager";
import { Canvas } from './Canvas';
import { Skier } from "../Entities/Skier";
import { Rhino } from "../Entities/Rhino";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rect } from './Utils';

export class Game {
    gameWindow = null;
    seconds = 0;
    timerStarted = false;
    rhinoEnroute = false;
    timerInverval;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.rhino = new Rhino(-100, );
        this.obstacleManager = new ObstacleManager();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run() {
        this.canvas.clearCanvas();

        this.updateGameWindow();
        this.drawGameWindow();

        requestAnimationFrame(this.run.bind(this));
    }

    updateGameWindow() {
        // Clear timer interval if the skier was caught by the rhino.
        if (this.rhino.caughtSkier) clearInterval(this.timerInverval);

        // If the rhino is chasing the skier, then perform check for rhino to chase skier
        if (this.rhinoEnroute) this.rhino.checkRouteToSkier(this.skier, this.assetManager);
        this.skier.move();

        const previousGameWindow = this.gameWindow;
        this.calculateGameWindow();
       
        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        // Included caught skier boolean from rhino class for skier to update if caught
        this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager, this.rhino.caughtSkier);
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);
        this.skier.draw(this.canvas, this.assetManager);
        this.rhino.draw(this.canvas, this.assetManager);
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    handleKeyDown(event) {
        switch(event.which) {
            case Constants.KEYS.LEFT:
                if (!this.skier.activateJump && !this.skier.skierIsJumping) {
                    this.skier.turnLeft();
                    event.preventDefault();
                }
                break;
          case Constants.KEYS.RIGHT:
                if (!this.skier.activateJump && !this.skier.skierIsJumping) {
                    if (!this.timerStarted) this.initializeTimer();
                    this.skier.turnRight();
                    event.preventDefault();
                }
                break;
            case Constants.KEYS.UP:
                if (!this.skier.activateJump && !this.skier.skierIsJumping) {
                    this.skier.turnUp();
                    event.preventDefault();
                }
                break;
            case Constants.KEYS.DOWN:
                if (!this.skier.activateJump && !this.skier.skierIsJumping) {
                    if (!this.timerStarted) this.initializeTimer();
                    this.skier.turnDown();
                    event.preventDefault();
                } else {
                    // If the skier is in the air, allow down arrow presses to perform trick sequence
                    this.skier.performTrick();
                }
                break;
        }
    }

    // Initialize interval to start counting the seconds and minutes the skier has been travelling.
    initializeTimer() {
        const minutesLabel = document.getElementById('minutes'),
              secondsLabel = document.getElementById('seconds');

        this.timerStarted = true;

        let self = this;
        this.timerInverval = setInterval(function () {
            ++self.seconds; // Increment the class value for seconds travelled.

            // Get full seconds count to this point.
            // If 1.5 minutes have past, then update rhino position to start chasing.
            let minutesCount = parseInt(self.seconds / 60);
            let secondsCount = self.seconds % 60;
            if (secondsCount === 30 && minutesCount === 1) {
                const startingLine = {
                    x: self.skier.x + (Constants.GAME_WIDTH / 2),
                    y: self.skier.y
                };

                self.rhinoEnroute = true;
                self.rhino.x = startingLine.x;
                self.rhino.y = startingLine.y;
            }

            secondsLabel.innerHTML = self.getTime(self.seconds % 60);
            minutesLabel.innerHTML = self.getTime(parseInt(self.seconds / 60));
        }, 1000);
    }

    getTime(val) {
        let value = val.toString();

        if (value.length < 2)
            return "0" + value;
        else
            return value;
    }
}