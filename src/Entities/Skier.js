import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;
    direction = Constants.SKIER_DIRECTIONS.DOWN;
    speed = Constants.SKIER_STARTING_SPEED;
    recoverCrash = false;

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    move() {
        switch(this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    turnLeft() {
        // Perform check to see if the skier has crashed
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            // If skier has crashed, set boolean for recovering skier after crash,
            // and set the direction to expected left-face direction
            this.recoverCrash = true;
            this.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
        } else {
            // If the skier has not crashed at this point and direction is set to left-face,
            // then move the skier left in position.
            // Otherwise, update set direction one step to left.
            if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) 
                this.moveSkierLeft();
            else
                this.setDirection(this.direction - 1);
        }
    }

    turnRight() {
        // Perform check to see if the skier has crashed
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            // If skier has crashed, set boolean for recovering skier after crash,
            // and set the direction to expected right-face direction
            this.recoverCrash = true;
            this.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
        } else {
            // If the skier has not crashed at this point and direction is set to right-face,
            // then move the skier right in position.
            // Otherwise, update set direction one step to right.
            if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT)
                this.moveSkierRight();
            else
                this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        if(this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
    }

    turnDown() {
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const collision = obstacleManager.getObstacles().find((obstacle) => {
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        // If the recover crash boolean is set to false and collision was found,
        // then set the direction to the crash setting.
        if (!this.recoverCrash) {
            if (collision) this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
        } else {
            // If the recover crash boolean is set to true and collision was found,
            // reset the recover crash boolean to false to allow user input.
            // Otherwise, move skier down until it has cleared the obstacle.
            if (!collision)
                this.recoverCrash = false;
            else 
                this.moveSkierDown();
        }
    }
}