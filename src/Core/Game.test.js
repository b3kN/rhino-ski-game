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

    const obstacle = new Obstacle(0, 0);
    obstacle.assetName = Constants.TREE;
    obstacleManager.obstacles.push(obstacle);

    Object.entries(Constants.ASSETS).forEach(function ([assetName]) {
      assetManager.loadedAssets[assetName] = { height: 2, width: 2 };
    });
  });

  test('Tree obstacle is loaded', () => {
    expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(1);
  });

  test('Skier is initialized', () => {
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.DOWN);
  });

  test('Skier turns left', () => {
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);
  });

  test('Skier turns full left', () => {
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT_DOWN);
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });

  test('Skier turns right', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);
  });

  test('Skier turns full right', () => {
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT_DOWN);
    skier.turnRight();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.RIGHT);
  });

  test('Skier has collided', () => {
    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
  });

  test('Skier turns left from collision', () => {
    skier.checkIfSkierHitObstacle(obstacleManager, assetManager);
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.CRASH);
    skier.turnLeft();
    expect(skier.direction).toBe(Constants.SKIER_DIRECTIONS.LEFT);
  });
});