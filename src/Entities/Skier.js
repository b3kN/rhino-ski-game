import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_LEFT;
    direction = Constants.SKIER_DIRECTIONS.LEFT;
    speed = Constants.SKIER_STARTING_SPEED;
    recoverCrash = false;
    activateJump = false;
    skierIsJumping = false;

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset(nextAsset) {
        if (nextAsset) {
            this.assetName = Constants.SKIER_JUMPING_ASSETS[nextAsset];
        } else {
            this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
        }
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

            if (intersectTwoRects(skierBounds, obstacleBounds)) {
                if (obstacle.getAssetName() === Constants.SKIER_RAMP) {
                    if (!this.recoverCrash && !this.skierIsJumping) {
                        console.log('Skier has jumped! Reduce the speed by half for now.');
                        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
                        this.speed /= 2;
                        this.activateJump = true;
                    }
                }

                if (obstacle.getAssetName() === Constants.TREE || obstacle.getAssetName() === Constants.TREE_CLUSTER) {
                    if (this.activateJump || this.skierIsJumping) {
                        console.log('Skier crashed into tree while jumping!');
                        this.speed *= 2;
                        this.activateJump = false;
                        this.skierIsJumping = false;
                    }
                }
            }

            return intersectTwoRects(skierBounds, obstacleBounds);
        });

        // If the recover crash boolean is set to false and collision was found,
        // then set the direction to the crash setting.
        if (!this.recoverCrash) {
            if (collision && !this.skierIsJumping) {
                if (this.activateJump)
                    this.performJump();
                else
                    this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
            }
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

    performTrick() {
        console.log('Current asset name: ' + this.assetName);
        let currentTrick = Object.keys(Constants.SKIER_JUMPING_ASSETS).find(key => Constants.SKIER_JUMPING_ASSETS[key] === this.assetName);
        console.log('Current trick stage for skier jump: ' + currentTrick);

        if (currentTrick < Constants.SKIER_JUMPING.STAGE_5) {
            let nextTrick = Number(currentTrick) + 1;
            console.log('Update asset for next trick stage: ' + nextTrick);
            this.updateAsset(nextTrick);
        } else {
            console.log('Skier completed trick sequence! Reset to first stage of jump.');
            this.updateAsset(Constants.SKIER_JUMPING.STAGE_1);
        }
    }

    performJump() {
      console.log('Game has activated performJump action for skier.');
        this.activateJump = false;
        this.skierIsJumping = true;
        this.updateAsset(Constants.SKIER_JUMPING.STAGE_1);

        let self = this;
        setTimeout(function () {
            if (self.skierIsJumping) {
                console.log('Skier airtime has ended, determine if they landed or crashed.');
                console.log('Reset the speed of travel for the Skier.');
                self.skierIsJumping = false;
                self.speed *= 2;
          
                console.log('Current display asset: ' + self.assetName);
                if (self.assetName === Constants.SKIER_JUMP.STAGE_1 || self.assetName === Constants.SKIER_JUMP.STAGE_5) {
                    console.log('Skier is in initial jump or final trick stage. Land successfully and continue.');
                    self.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
                } else {
                    console.log('Skier is in midst of a trick and crashed! oh no!');
                    self.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
                }
            }
        }, 1500);
    }
}