const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field, percentage) {
    this._field = field; 
    this._baseField = field.map(innerArray => [...innerArray]); 
    this._playerPosition = [0, 0]; 
    this._hatPosition = this.findHat();
    this._width = field[0].length; 
    this._height = field.length;  
    this._percentage = percentage
  }

  get field() {
    return this._field; 
  }

  get playerPosition() {
    return this._playerPosition; 
  }

  get hatPosition() {
    return this._hatPosition; 
  }

  findHat() {
    for (let i = 0; i < this._field.length; i++) {
        for (let j = 0; j < this._field[i].length; j++) {
            if (this._field[i][j] === hat) {
                return [j, i]; 
            }
        }
    }
  }

  print() {
    this._field.forEach(element => {
      console.log(element.join('')); 
    })
  }

  static generateField(width, height, percentage) {
    let field = []; 
    for (let i = 0; i < height; i++) {
        field[i] = []; 
        for (let j = 0; j < width; j++) {
            field[i][j] = Math.random() < percentage ? hole : fieldCharacter; 
        }
    }
    let hatPosition; 
    do {
        hatPosition = [Math.floor(Math.random()*width), Math.floor(Math.random()*height)]; 
    } while (hatPosition[0] === 0 && hatPosition[1] === 0);
    
    field[0][0] = pathCharacter;
    field[hatPosition[1]][hatPosition[0]] = hat; 
    return new Field(field, percentage); 
  }

  move(action) {
    switch (action) {
        case 'w': 
            this._playerPosition[1] -= 1; 
            break; 
        case 's': 
            this._playerPosition[1] += 1; 
            break; 
        case 'a': 
            this._playerPosition[0] -= 1; 
            break; 
        case 'd': 
            this._playerPosition[0] += 1; 
            break; 
        default: 
            console.log("Invalid move. Please enter 'up', 'down', 'left' or 'right'.");
    }
    if (this._playerPosition[0] >= 0 && this._playerPosition[0] < this._width && this._playerPosition[1] >= 0 && this._playerPosition[1] < this._height) {
        this._field[this._playerPosition[1]][this._playerPosition[0]] = pathCharacter; 
    }
  }

  evaluate() {
    if (this._playerPosition[0] < 0 || this._playerPosition[0] >= this._width || this._playerPosition[1] < 0 || this._playerPosition[1] >= this._height) {
        return "Lose"; 
    } else if (this._baseField[this._playerPosition[1]][this._playerPosition[0]] === hole) {
        return "Lose"; 
    } else if (this._baseField[this._playerPosition[1]][this._playerPosition[0]] === hat) {
        return "Win"
    } else {
        return "Ongoing"
    }
  }

  shuffle() {
    this._field = Field.generateField(this._width, this._height, this._percentage)._field; 
    this._baseField = this._field.map(innerArray => [...innerArray]); 
    this._playerPosition = [0, 0]; 
    this._hatPosition = this.findHat();
  }

  run() {
    console.clear(); 
    this.print(); 
    let status = "Ongoing"; 
    let playerAction; 
    while (status === "Ongoing") {
        playerAction = prompt('Please enter your next move! "w" for up; "s" for down; "a" for left; "d" for right; press "n" for restart.'); 
        if (playerAction !== "n") {
            this.move(playerAction); 
        } else {
            this.tryAgain(); 
        }
        console.clear(); 
        this.print(); 
        status = this.evaluate();  
    }
    if (status === "Win") {
        console.log('Congratulations you win! Press "N" to try again!'); 
    } else if (status === "Lose") {
        console.log('Sorry you lost. Press "N" to try again!'); 
    }
    this.tryAgain(); 
  }

  tryAgain() {
    let tryOrNot; 
    tryOrNot = prompt('Want to try again?'); 
    if (tryOrNot === "n") {
        this.shuffle(); 
        this.run(); 
    } else {
        process.exit(); 
    }
  }

}

const myField = Field.generateField(3, 4, 0.5);  

myField.run(); 