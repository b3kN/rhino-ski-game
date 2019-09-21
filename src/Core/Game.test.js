import "babel-polyfill";
import { Skier } from '../Entities/Skier';
import { Obstacle } from '../Entities/Obstacles/Obstacle';
import { AssetManager } from '../Core/AssetManager';
import { ObstacleManager } from '../Entities/Obstacles/ObstacleManager';
import * as Constants from "../Constants";

describe('Test Game Usage', () => {
  let skier,
      obstacleManager,
      assetManager;

  beforeEach(() => {
    obstacleManager = new ObstacleManager();
    assetManager = new AssetManager();
    skier = new Skier(0, 0);

    Object.entries(Constants.ASSETS).forEach(function ([assetName]) {
      assetManager.loadedAssets[assetName] = { height: 2, width: 2 };
    });
  });

  test('Tree obstacle is loaded', () => {
    const obstacle = new Obstacle(0, 0);
    obstacle.assetName = Constants.TREE;
    obstacleManager.obstacles.push(obstacle);

    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);
  });

  test('Skier is initialized', () => {
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });

  test('Skier moves left', () => {
    skier.moveSkierLeft();
    expect(skier.x).toBe(-9);
  });

  test('Skier turns from left-face to left-down', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);
  });

  test('Skier turns from left-face to down-face', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  });


  test('Skier turns from left-face to down-face and moves', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);
  });

  test('Skier turns from left-face to right-down', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);
  });

  test('Skier turns from left-face to right-face', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);
  });

  test('Skier turns from left-face to right-face and moves', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.moveSkierRight();
    expect(skier.x).toBe(9);
  });

  test('Skier turns from right-face to right-down', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);
  });

  test('Skier turns from right-face to down-face', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  });

  test('Skier turns from right-face to down-face and moves', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);
  });

  test('Skier turns from right-face to left-down', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);
  });

  test('Skier turns from right-face to left-face', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });

  test('Skier turns from right-face to left-face and moves', () => {
    skier.setDirection(Constants.SKIER_DIRECTIONS.RIGHT);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);

    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);

    skier.moveSkierLeft();
    expect(skier.x).toBe(-9);
  });

  test('Skier turns from left-face directly to down-face', () => {
    skier.turnDown();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  });

  test('Skier has collided', () => {
    const obstacle = new Obstacle(0, 9);
    obstacle.assetName = Constants.TREE;
    obstacleManager.obstacles.push(obstacle);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);

    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
  });

  test('Skier turns left from collision', () => {
    const obstacle = new Obstacle(0, 9);
    obstacle.assetName = Constants.TREE;
    obstacleManager.obstacles.push(obstacle);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);

    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });

  test('Skier turns right from collision', () => {
    const obstacle = new Obstacle(0, 9);
    obstacle.assetName = Constants.TREE;
    obstacleManager.obstacles.push(obstacle);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);

    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);
  });

  test('Skier initiates a jump', () => {
    const obstacle = new Obstacle(0, 9);
    obstacle.assetName = Constants.SKIER_RAMP;
    obstacleManager.obstacles.push(obstacle);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);

    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.skierIsJumping).toBe(true);
  });

  test('Skier is jumping and crashes into tree', () => {
    const ramp = new Obstacle(0, 9);
    ramp.assetName = Constants.SKIER_RAMP;
    obstacleManager.obstacles.push(ramp);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);

    const tree = new Obstacle(0, 13.5);
    tree.assetName = Constants.SKIER_TREE;
    obstacleManager.obstacles.push(tree);
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(2);

    skier.moveSkierDown();
    expect(skier.y).toBe(9);

    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.skierIsJumping).toBe(true);

    skier.moveSkierDown();
    expect(skier.y).toBe(13.5);

    setTimeout(function () {
      skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
      expect(skier.recoverCrash).toBe(true);
    }, 250);
  });
});