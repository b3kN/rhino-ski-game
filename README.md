# Ceros Ski Code Challenge

Welcome to the Ceros Code Challenge - Ski Edition!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here: 
http://ceros-ski.herokuapp.com/  

Or deploy it locally by running:
```
npm install
npm run dev
```

There is no exact time limit on this challenge and we understand that everyone has varying levels of free time. We'd 
rather you take the time and produce a solution up to your ability than rush and turn in a suboptimal challenge. Please 
look through the requirements below and let us know when you will have something for us to look at. If anything is 
unclear, don't hesitate to reach out.

**Requirements**

* **Fix a bug:**

  There is a bug in the game. Well, at least one bug that we know of. Use the following bug report to debug the code
  and fix it.
  * Steps to Reproduce:
    1. Load the game
    1. Crash into an obstacle
    1. Press the left arrow key
  * Expected Result: The skier gets up and is facing to the left
  * Actual Result: Giant blizzard occurs causing the screen to turn completely white (or maybe the game just crashes!)
  
* **Write unit tests:**

  The base code has Jest, a unit testing framework, installed. Write some unit tests to ensure that the above mentioned
  bug does not come back.
  
* **Extend existing functionality:**

  We want to see your ability to extend upon a part of the game that already exists. Add in the ability for the skier to 
  jump. The asset file for jumps is already included. All you gotta do is make the guy jump. We even included some jump 
  trick assets if you wanted to get really fancy!
  * Have the skier jump by either pressing a key or use the ramp asset to have the skier jump whenever he hits a ramp.
  * The skier should be able to jump over some obstacles while in the air. 
    * Rocks can be jumped over
    * Trees can NOT be jumped over
  * Anything else you'd like to add to the skier's jumping ability, go for it!
   
* **Build something new:**

  Now it's time to add something completely new. In the original Ski Free game, if you skied for too long, 
  a yeti would chase you down and eat you. In Ceros Ski, we've provided assets for a Rhino to run after the skier, 
  catch him and eat him.
  * The Rhino should appear after a set amount of time or distance skied and chase the skier, using the running assets
    we've provided to animate the rhino.
  * If the rhino catches the skier, it's game over and the rhino should eat the skier. 

* **Documentation:**

  * Update this README file with your comments about your work; what was done, what wasn't, features added & known bugs.
  * Provide a way for us to view the completed code and run it, either locally or through a cloud provider
  
* **Be original:**  
  * This should go without saying but don’t copy someone else’s game implementation!

**Grading** 

Your challenge will be graded based upon the following:

* How well you've followed the instructions. Did you do everything we said you should do?
* The quality of your code. We have a high standard for code quality and we expect all code to be up to production 
  quality before it gets to code review. Is it clean, maintainable, unit-testable, and scalable?
* The design of your solution and your ability to solve complex problems through simple and easy to read solutions.
* The effectiveness of your unit tests. Your tests should properly cover the code and methods being tested.
* How well you document your solution. We want to know what you did and why you did it.

**Bonus**

*Note: You won’t be marked down for excluding any of this, it’s purely bonus.  If you’re really up against the clock, 
make sure you complete all of the listed requirements and to focus on writing clean, well organized, and well documented 
code before taking on any of the bonus.*

If you're having fun with this, feel free to add more to it. Here's some ideas or come up with your own. We love seeing 
how creative candidates get with this.
 
* Provide a way to reset the game once it's over
* Provide a way to pause and resume the game
* Add a score that increments as the skier skis further
* Increase the difficulty the longer the skier skis (increase speed, increase obstacle frequency, etc.)
* Deploy the game to a server so that we can play it without having to install it locally
* Write more unit tests for your code

We are looking forward to see what you come up with!

---

### Documentation of final solution
###### Provided by Nicholas 'b3kn' Bekeris

#### Bug Resolution
* Initial report of bug:
** Game crashes when the skier collides with obstacles and attempts to get up by facing left.
* Notes while researching bug:
** Current methods appear to attempt applying decremental factor to crash constant.
** Crashes because there is no direction/asset for -1 when trying to decrement from 0 (crash constant).
* How bug was fixed:
** Implemented "recoverCrash" property to determine when the skier has crashed and can reset stance.
** Updated functionality on move of skier that has collided to move skier to safe position while facing left.
*** Added functionality to move the skier to safe position "in front" of the obstacle.

#### New Implementations
* Ramp Jumping
** Implemented ramp obstacles that initiate a jump when skier rides over them.
** Jump allows for 90 seconds of airtime at 1.5x the original speed.
*** Increased speed gives skier possibility of evading the rhino enemy.
*** During this airtime, the skier will fly over all obstacles other than trees and tree clusters.
** Skier can perform tricks by pressing the down arrow key.
*** There is a set sequence of 5 stages that must be completed in order to land successfully.
*** Skier can land successfully by landing in the first or last position.
*** **NOTE** Skier can only perform the flip trick at the moment as nothing was implemented for spins.

* Rhino Enemy
** Spawns after the skier has been travelling for 1 minute and 30 seconds.
** Chases down the skier starting from the right side of the screen.
*** Rhino is initialized off screen and travels its way to the skier.
*** Rhino will be placed in line with the skier at their position and will quickly try to catch the skier.
*** Rhino has increased speed to try and chase down the skier quickly.
**** **NOTE** Ideally the skier would be able to gain speed to avoid being captured but time expired before reaching this point.
** When catching/colliding with the skier the rhino will lift and eat the skier with a sequence of actions.
*** Each action sequence stage is delay by 600ms to give animation appeal.
*** Rhino class will detect the position of skier and itself to determine the route/movements the rhino will take.

* Scoreboard/Timer display
** Implemented basic counting timer (interval) to calculate the minutes and seconds during current instance.
** Timer will start when the skier iniates travelling down the mountain/slope.
*** After 90 seconds have past, the timer will initiate the rhino's chase actions.
*** **NOTE** Would've liked to set up distance & style point systems with more time by calculating:
**** Style points for each trick completed & additional points for holding tricks to maximum airtime.
**** Distance points for travelling longer periods of time without crashing into obstacles.
**** Crashed tricks would be subtracted from style scores and potential points would be ignored.
**** Obstacle crashes would be subtracted from distance scores as well.

#### Development Reasoning
In the end the idea of this solution was to match the old-school style of the Ski Free game originally on Microsoft OS.

* Implemented "recoverCrash" in the Skier class
** This boolean is required for the skier to be able to recover from a crash by turning left.
** Based on the status of this value, the skier will be able to stand in front of collided obstacle without game crashing.
* Implemented "activateJump" in the Skier class
** This boolean is purely used to tell future methods to perform jump functionality after skier hits a ramp.
** Used to initialize "skierIsJumping" boolean.
* Implemented "skierIsJumping" in the Skier class
** This boolean is used as a determing factor for if the skier is in the air and can avoid short obstacles (rocks, ramps, etc).
** This is also used in the Game class to determine if the skier is able to perform flip tricks.
* Implemented "rhinoEnroute" in the Game class
** This boolean is used to initiate rhino chase and determine if the rhino is chasing at time of collision.
* Implemented "timerStarted" in the Game class
** This boolean is purely for initiating the time counter.
** **NOTE** Would've been used for score calcuations of distance travelled and acceleration of skier speed.
* Implemented "caughtSkier" in the Rhino class
** This boolean is essential for determining when the skier has been caught and when to proceed with feasting on skier.
** Shared through the Game class to the Skier class to dismiss the current skier asset and begin eating animations.
** It is also used to determine when the clock stops on the timer.

#### Missed Development Improvements
While working through this more finalized product it has come to my attention that several methods and instances could be refactored.
Particularly with the Entity extended classes the methods could be shared easier to provide better practiced development.

#### Known Issues / Buggy Instances
* Rhino can catch skier while the skier is in the air.

#### Deploying The Game
Runnig the npm install script will be required for all deployments:
``` npm install ```

###### Development
1. Run the script for dev deployment:
``` npm run dev ```

2. Access the webpacked development deployment at [localhost:8080](localhost:8080)

###### Production
1. Run the script for production build & deployment:
``` npm run build ```

2. Access the webpacked development deployment at your hosted domain or localhost.

#### Enjoy a Running Instance
Simply visit [localhost:8080](Coming Soon) to play a version of the game hosted on heroku!