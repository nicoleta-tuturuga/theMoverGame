const MOVEMENT_DISTANCE = 25;

class Player {
    constructor(obstacles) {
        this.element = document.querySelector(".player");
        this.left = 0;
        this.top = 0;
        this.obstacles = obstacles;
        this.score = 3;

        this.initMovement();
    }

    _isOutOfBoundry() {

        if (this.left < 0) {
            console.log("you're out"); //for left
            return true;
        }

        if (this.left > 1000 - 25) {
            console.log("you're out"); //for right
            return true;
        }

        if (this.top < 0) {
            console.log("you're out"); //for top
            return true;
        }

        if (this.top > 500 - 25) {
            console.log("you're out"); //for down
            return true;
        }

        return false;
    }

    moveLeft() {
        this.left = this.left - MOVEMENT_DISTANCE;
        this.updateLocation();
        if (this._isOutOfBoundry() === true) {
            this.left = this.left + MOVEMENT_DISTANCE;
            this.updateLocation();
        };

        if (this.seeIfOverlap() === true) {
            this.left = this.left + MOVEMENT_DISTANCE;
            this.updateLives();
            this.updateLocation();
        };
    }

    moveRight() {
        this.left = this.left + MOVEMENT_DISTANCE;
        this.updateLocation();
        if (this._isOutOfBoundry() === true) {
            this.left = this.left - MOVEMENT_DISTANCE;
            this.updateLocation();
        };

        if (this.seeIfOverlap() === true) {
            this.left = this.left - MOVEMENT_DISTANCE;
            this.updateLives();
            this.updateLocation();
        };
    }

    moveDown() {
        this.top = this.top + MOVEMENT_DISTANCE;
        this.updateLocation();
        if (this._isOutOfBoundry() === true) {
            this.top = this.top - MOVEMENT_DISTANCE;
            this.updateLocation();
        };

        if (this.seeIfOverlap() === true) {
            this.top = this.top - MOVEMENT_DISTANCE;
            this.updateLives();
            this.updateLocation();
        };
    }

    moveUp() {
        this.top = this.top - MOVEMENT_DISTANCE;
        this.updateLocation();
        if (this._isOutOfBoundry() === true) {
            this.top = this.top + MOVEMENT_DISTANCE;
            this.updateLocation();
        };

        if (this.seeIfOverlap() === true) {
            this.top = this.top + MOVEMENT_DISTANCE;
            this.updateLives();
            this.updateLocation();
        };
    }

    updateLocation() {
        this.element.style.top = this.top + "px";
        this.element.style.left = this.left + "px";
    }

    initMovement() {
        document.addEventListener("keydown", this._movePlayer.bind(this))
    }

    _movePlayer(event) {

        switch (event.key) {
            case "ArrowRight": {
                this.moveRight();
                break;
            }
            case "ArrowLeft": {
                this.moveLeft();
                break;
            }
            case "ArrowUp": {
                this.moveUp();
                break;
            }
            case "ArrowDown": {
                this.moveDown();
                break;
            }
        }
    }

    seeIfOverlap() {

        var playerRect = this.element.getBoundingClientRect();
        for (var i = 0; i < this.obstacles.length; i++) {
            var obstacleRect = this.obstacles[i].getObstacleRect();
            var overlap = !(playerRect.right <= obstacleRect.left ||
                playerRect.left >= obstacleRect.right ||
                playerRect.bottom <= obstacleRect.top ||
                playerRect.top >= obstacleRect.bottom);

            if (overlap === true) {
                console.log("overlap!");
                console.log("player rect is " + playerRect);
                console.log(obstacleRect);
                return true;
            }
        }
        return false;
    }

    resetPlayerPosition() {
        this.element.style.top = 0 + "px";
        this.element.style.left = 0 + "px";

        this.top = 0;
        this.left = 0;

        this.score = 3;
    }

    updateLives() {
        var leftLives = document.querySelector("span");
        var gameOver = false;
        this.score--;
        if (this.score === 0) {
            gameOver = true;
            alert("you are dead. Game over! Try again!");
            this.resetPlayerPosition();
        }
        leftLives.innerText = this.score;
    }

}



class Obstacle {
    constructor(height, left, bottom) {
        this.height = height;
        this.left = left;
        this.bottom = bottom;

        this._createObstacle();
        this.getObstacleRect();
        this.updateObstaclePosition();
        this.addNewObstacles();

    }

    _createObstacle(height, left, bottom) {
        this.obstaclesContainer = document.querySelector(".obstaclesContainer");
        this.obstacle = document.createElement("div");
        this.obstacle.classList.add("obstacle");
        this.obstaclesContainer.appendChild(this.obstacle);

        this.obstacle.style.height = this.height + "px";
        this.obstacle.style.left = this.left + "px";
        this.obstacle.style.bottom = this.bottom + "px";

    }

    getObstacleRect() {
        var obstacleRect = this.obstacle.getBoundingClientRect();
        console.log(obstacleRect);
        return obstacleRect;
    }

    updateObstaclePosition() {
        this.left = this.left - 2;
        console.log("obstacle: " + this.obstacle)
        this.obstacle.style.left = this.left + "px";
    }

    addNewObstacles() {
        if (this.left < 0) {
            this.obstaclesContainer.removeChild(this.obstacle);
            return true;
        }
        return false;
    }
}



class Game {
    constructor() {

        var obsUp_1 = new Obstacle(350, 200);
        var obsUp_2 = new Obstacle(250, 375);
        var obsUp_3 = new Obstacle(225, 675);
        var obsUp_4 = new Obstacle(150, 850);
        var obsDown_1 = new Obstacle(50, 275, 0);
        var obsDown_2 = new Obstacle(350, 525, 0);
        var obsDown_3 = new Obstacle(75, 750, 0);
        var obsDown_4 = new Obstacle(300, 925, 0);

        this.obstacles = [
            obsUp_1, obsUp_2, obsUp_3, obsUp_4, obsDown_1, obsDown_2, obsDown_3, obsDown_4
        ]

        this.player = new Player(this.obstacles);

        setInterval(this.setIntervalForObs.bind(this), 40);

    }

    setIntervalForObs() {
        for (var i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].updateObstaclePosition();
            if (this.obstacles[i].addNewObstacles() === true) {
                this.obstacles.splice(i, 1);
                if (this.obstacles[i].bottom === 0) {
                    this.obstacles.push(new Obstacle(Math.random() * 350, 925, 0));
                } else {
                    this.obstacles.push(new Obstacle(Math.random() * 350, 850));
                }
            }
        }
    }
}

var game = new Game();