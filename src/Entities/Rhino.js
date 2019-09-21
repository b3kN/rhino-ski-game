import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Rhino extends Entity {
    assetName = Constants.RHINO_DOWN;
    direction = Constants.RHINO_DIRECTIONS.RUN;
    speed = Constants.RHINO_STARTING_SPEED;
    caughtSkier = false; // Simple boolean to provide if the rhino caught the skier.

    constructor(x, y) {
        super(x, y);
    }

    setDirection(direction) {
        let tempAsset;

        // If the current direction for the rhino to travel is left or left-down,
        // then check if the current asset is the secondary run asset,
        // and set the new asset if it needs to alternate the assets for running animation
        if (direction === Constants.RHINO_DIRECTIONS.LEFT || direction === Constants.RHINO_DIRECTIONS.LEFT_DOWN) {
            if (this.direction === Constants.RHINO_DIRECTIONS.LEFT || this.direction === Constants.RHINO_DIRECTIONS.LEFT_DOWN) {
                tempAsset = this.assetName === Constants.RHINO_LEFT_RUN ? direction : Constants.RHINO_DIRECTIONS.LEFT_RUN;
            }
        }

        // Update the direction for the new direction regardless,
        // and perform the update asset functionality.
        this.direction = direction;
        this.updateAsset(tempAsset);
    }

    updateAsset(newAsset) {
      // If the current asset is found in the eating array,
      // then update the asset with the asset name from the eating array.
      if (Object.values(Constants.RHINO_EATING).indexOf(this.direction) > -1)
        this.assetName = Constants.RHINO_EATING_ASSETS[this.direction];
      else
        // If the asset is not in the eating sequence, 
        // then update the new asset name with the new provided asset if it is set.
        // Otherwise, set the current direction enum with the associated rhino directions asset.
        this.assetName = Constants.RHINO_DIRECTIONS_ASSETS[newAsset ? newAsset : this.direction];
    }

    moveRhino() {
        switch(this.direction) {
            case Constants.RHINO_DIRECTIONS.LEFT:
                this.moveRhinoLeft();
                break;
            case Constants.RHINO_DIRECTIONS.LEFT_DOWN:
                this.moveRhinoLeftDown();
                break;
            case Constants.RHINO_DIRECTIONS.DOWN:
                this.moveRhinoDown();
                break;
        }
    }

    moveRhinoLeft() {
        this.x -= Constants.RHINO_STARTING_SPEED;
    }

    moveRhinoLeftDown() {
        this.x -= this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.RHINO_DIAGONAL_SPEED_REDUCER;
    }

    moveRhinoDown() {
        this.y += this.speed;
    }

    checkRouteToSkier(skier, assetManger) {
        // If the skier has not been caught by the rhino,
        // then find the location of rhino with respect to the skier's current location,
        // and move the rhino accordingly.
        if (!this.caughtSkier) {
            const rhinoBounds = this.getBounds(this, assetManger);
            const skierBounds = this.getBounds(skier, assetManger);

            if (skierBounds.top > rhinoBounds.bottom) {
                if (skierBounds.right < rhinoBounds.left) {
                    this.setDirection(Constants.RHINO_DIRECTIONS.LEFT_DOWN);
                } else {
                    this.setDirection(Constants.RHINO_DIRECTIONS.DOWN);
                }
            } else {
                this.setDirection(Constants.RHINO_DIRECTIONS.LEFT);
            }

            // If the rhino has intersected with the skier,
            // then update the rhino directions to caught state,
            // and perform the action of eating the skier... gross!
            // Otherwise, perform the action for rhino to chase skier.
            if (intersectTwoRects(rhinoBounds, skierBounds)) {
                this.caughtSkier = true;
                this.setDirection(Constants.RHINO_DIRECTIONS.CAUGHT);
                this.eatSkier();
            } else {
                this.moveRhino();
            }
        }
    }

    eatSkier() {
        let nextStage = this.direction + 1;

        // If the current stage is found in the eating sequence,
        // and the current stage is not the final eating stage,
        // then update to the next stage in the sequence.
        // Otherwise, alternate between the last two stages to animate rhino victory dance
        if (Object.values(Constants.RHINO_EATING).indexOf(this.direction) > -1) {
            if (this.direction < Constants.RHINO_EATING.STAGE_5)
                this.setDirection(nextStage);
            else
              if (this.direction === Constants.RHINO_EATING.STAGE_5)
                  this.setDirection(nextStage - 2);
        }

        // Call the same function repetitively to update the items in the sequence.
        let self = this;
        setTimeout(function () {
            self.eatSkier();
        }, 600);
    }

    getBounds(target, assetManager) {
        const asset = assetManager.getAsset(target.assetName);
        const targetBounds = new Rect(
            target.x - asset.width / 2,
            target.y - asset.height / 2,
            target.x + asset.width / 2,
            target.y - asset.height / 4
      );

        return targetBounds;
    }
}