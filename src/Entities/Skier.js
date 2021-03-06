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
        this.x -= this.speed;
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
        this.x += this.speed;
    }

    moveSkierUp() {
        this.y -= this.speed;
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

    checkIfSkierHitObstacle(obstacleManager, assetManager, caught) {
        // If the skier has been caught by the rhino,
        // set direction to crash and remove the skier canvas image
        if (caught) {
            this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
            const asset = assetManager.getAsset(this.assetName);
            asset.src = '';
        // Else if the skier has not been caught by the rhino,
        // then get the bounds for the skier and perform checks for current skier status
        } else {
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
                    // If the obstacle touched is the jump ramp
                    if (obstacle.getAssetName() === Constants.SKIER_RAMP) {
                        // and if the skier is not crashed and is not already jumping,
                        // then set the direction for down-facing and reduce speed while in the air.
                        if (!this.recoverCrash && !this.skierIsJumping) {
                            // console.log('Skier has jumped! Reduce the speed by half for now.');
                            this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
                            this.speed *= 1.5;
                            this.activateJump = true;
                        }
                    }

                    // If the obstacle touched is a tree or tree cluster
                    if (obstacle.getAssetName() === Constants.TREE || obstacle.getAssetName() === Constants.TREE_CLUSTER) {
                        // and if the skier is current in the air,
                        // then reset the speed for when the skier gets back up,
                        // and deactivate all current jumping actions.
                        if (this.activateJump || this.skierIsJumping) {
                            // console.log('Skier crashed into tree while jumping!');
                            this.speed /= 1.5;
                            this.activateJump = false;
                            this.skierIsJumping = false;
                        }
                    }
                }

                // Return the value for collision regardless
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
    }

    performTrick() {
        // Find if the current trick is already activated
        let currentTrick = Object.keys(Constants.SKIER_JUMPING_ASSETS).find(key => Constants.SKIER_JUMPING_ASSETS[key] === this.assetName);
        // console.log('Current trick stage for skier jump: ' + currentTrick);

        // If the current trick is the not the final jumping/trick stage,
        // then update the asset for the next trick in the stage list.
        if (currentTrick < Constants.SKIER_JUMPING.STAGE_5) {
            let nextTrick = Number(currentTrick) + 1;
            // console.log('Update asset for next trick stage: ' + nextTrick);
            this.updateAsset(nextTrick);
        } else {
            // If the current trick is the final trick in sequence,
            // then update the asset to the first stage of jumping/trick sequence.

            // console.log('Skier completed trick sequence! Reset to first stage of jump.');
            this.updateAsset(Constants.SKIER_JUMPING.STAGE_1);
        }
    }

    performJump() {
        // console.log('Game has activated performJump action for skier.');

        // Perform jump action by setting that the skier is current jumping.
        this.activateJump = false;
        this.skierIsJumping = true;

        // Update the asset to the first stage of jumping/trick sequence.
        this.updateAsset(Constants.SKIER_JUMPING.STAGE_1);

        // Set a trigger to perform the actions when the skier lands from jumping.
        let self = this;
        setTimeout(function () {
            // If the skier has not crashed and is still jumping at the time of landing,
            // then reset speed and jumping action boolean for safe landing if airtime expires and skier is in final or first position of sequence.
            // Otherwise, set the position of skier to crash state since it was middle of trick.
            if (self.skierIsJumping) {
                // console.log('Skier airtime has ended, determine if they landed or crashed.');
                // console.log('Reset the speed of travel for the Skier.');
                self.skierIsJumping = false;
                self.speed /= 1.5;
          
                // console.log('Current display asset: ' + self.assetName);
                if (self.assetName === Constants.SKIER_JUMP.STAGE_1 || self.assetName === Constants.SKIER_JUMP.STAGE_5) {
                    // console.log('Skier is in initial jump or final trick stage. Land successfully and continue.');
                    self.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
                } else {
                    // console.log('Skier is in midst of a trick and crashed! oh no!');
                    self.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
                }
            }
        }, 1500);
    }
}