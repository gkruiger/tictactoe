// This class holds the state of the game
class TicTacToeGameState {
    constructor(board, player) {
        this.board = board;
        this.player = player;
        this.status = 'running';
    }

    // Getters/setters
    getBoard() { return this.board; }
    getPlayer() { return this.player; }
    getStatus() { return this.status; }
    getValue() { return this.value; }
    getMove() { return this.move; }
    setBoard(board) { this.board = board; }
    setPlayer(player) { this.player = player; }
    setStatus(status) { this.status = status; }
    setValue(value) { this.value = value; }
    setMove(move) { this.move = move; }

    // Input:   position on the board
    // Output:  true if position is empty, otherwise false
    positionIsEmpty(position) {
        return (this.board.charAt(position) == '-' ? true : false);
    }

    // Print the current gamestate to the console
    print() {
        let s = "";
        s += "Board:    " + this.board.substring(0, 1) + ' ' + this.board.substring(1, 2) + ' ' + this.board.substring(2, 3) + ' ' + '\n';
        s += "Board:    " + this.board.substring(3, 4) + ' ' + this.board.substring(4, 5) + ' ' + this.board.substring(5, 6) + ' ' + '\n';
        s += "Board:    " + this.board.substring(6, 7) + ' ' + this.board.substring(7, 8) + ' ' + this.board.substring(8, 9) + ' ' + '\n';
        s += "Player:   " + this.player + '\n';
        s += "Status:   " + this.status + '\n';
        s += "Move:     " + this.move + '\n';
        s += "Value:    " + this.value + '\n';
        console.log(s);
    }
}

// This class handles all the logic of the game
class TicTacToeGameStateEngine {
    constructor() {
        this.winningPatterns = [
            [0, 1, 2 ],
            [3, 4, 5 ],
            [6, 7, 8 ],
            [0, 3, 6 ],
            [1, 4, 7 ],
            [2, 5, 8 ],
            [0, 4, 8 ],
            [2, 4, 6 ]
        ];
    }

    // Output:  initial game state for tic-tac-toe: 9 empty fields and player X as the first player
    getInitialGameState() {
        return new TicTacToeGameState(
            '---------',
            'X',
            'running'
        )
    }

    // Input:   board and player 
    // Output:  all possible moves in the board as an array, if the game hasn't ended yet
    getAvailableMoves(ticTacToeGameState) {
        if(ticTacToeGameState.getStatus() == 'running') {
            let availableMoves = [];
            for(let i=0; i<9; i++) {
                if( ticTacToeGameState.positionIsEmpty(i) ) {
                    availableMoves.push(i);
                }
            }
            return availableMoves;
        }
    }

    // Input:   tic-tac-toe gamestate and position
    // Output:  tic-tac-toe gamestate with 
    //          - player in position
    //          - next player switched
    //          - status updated
    makeMove(state, position) {
        let newState = new TicTacToeGameState();
    
        // Set the current player at the given position on the board
        newState.setMove(position);
        newState.setBoard(state.getBoard().substring(0, position) + state.getPlayer() + state.getBoard().substring(position + 1) );
        
        // Switched the next player
        if (state.getPlayer() == 'X') {
            newState.setPlayer('O');
        } else {
            newState.setPlayer('X');
        }

        // Set status
        newState.setStatus(this.getStatus(newState));

        return newState;
    }

    // Input:   state
    // Output:  status (win-x, win-0, draw or running)
    getStatus(state) {
        // Check for win-x/win-o
        for ( var i = 0; i < this.winningPatterns.length; i++) {
            if ( 
                state.getBoard().charAt( this.winningPatterns[ i ][ 0 ] ) == state.getBoard().charAt( this.winningPatterns[ i ][ 1 ] ) &&
                state.getBoard().charAt( this.winningPatterns[ i ][ 1 ] ) == state.getBoard().charAt( this.winningPatterns[ i ][ 2 ] )
            ) {
                if ( state.getBoard().charAt( this.winningPatterns[ i ][ 0 ] ) != '-' ) {
                    if (state.getBoard().charAt( this.winningPatterns[ i ][ 0 ] ) == 'X') {
                        return 'win-x';
                    } else {
                        return 'win-o';
                    }
                }
            }
        }

        // Check for draw
        if (!/-/.test(state.getBoard())) { 
            return 'draw';
        }

        // No win-x/win-o, no draw, must be still running
        return 'running';
    }
    
    // Input:   state
    // Output:  value for this state
    setValue(state) {
        var value;
        switch(state.getStatus()) {
            case 'win-x': value = 512; break;
            case 'win-o': value = -512; break;
            case 'draw': value = 0; break;
            case 'running': value = 0; break;
        }
        state.setValue(value);
    }
}

// This class acts as a random player, making a random move each turn
class RandomPower{
    constructor() {
    }

    getBestMoveForGameState(ticTacToeGameState) {
        let move;
        do { 
            move = Math.floor((Math.random() * 9));
        } while(!ticTacToeGameState.positionIsEmpty(move));
        ticTacToeGameState.setMove(move);
        return ticTacToeGameState;
    }
    getBestMove(board, player) {
        return this.getBestMoveForGameState( 
            new TicTacToeGameState(board, player) 
        ).getMove();        
    }
}

// This class acts as a mighty brute force AI, making the best move possible each turn
class IntelligentForceAI {
    constructor() {
        this.ticTacToeGameEngine = new TicTacToeGameStateEngine();
        this.map = new Map();
    }

    // Input:   gamestate
    // Output:  gamestate including best move (move with the highest/lowest value for X/O).
    //          And yes, it's recursive :)
    getBestMoveForGameState(ticTacToeGameState) {
        if (ticTacToeGameState.getStatus() == 'running') {
            let availableMoves = this.ticTacToeGameEngine.getAvailableMoves(ticTacToeGameState);
            let value;
            let move;
            let newTicTacToeGameState = new TicTacToeGameState();
            ticTacToeGameState.getPlayer() == 'X' ? value = -Infinity : value = +Infinity;

            for (let m=0; m<availableMoves.length; m++) {               
                newTicTacToeGameState = this.getBestMoveForGameState( this.ticTacToeGameEngine.makeMove(ticTacToeGameState, availableMoves[m]) );               
                if (ticTacToeGameState.getPlayer() == 'X') {
                    if (newTicTacToeGameState.getValue() > value) {
                        value = newTicTacToeGameState.getValue();
                        move = availableMoves[m];
                    }
                } else {
                    if (newTicTacToeGameState.getValue() < value) {
                        value = newTicTacToeGameState.getValue();
                        move = availableMoves[m];
                    }                    
                }
            }

            ticTacToeGameState.setValue(value/2);
            ticTacToeGameState.setMove(move);
        } else {
            this.ticTacToeGameEngine.setValue(ticTacToeGameState);
        }
        return ticTacToeGameState;
    }

    getBestMove(board, player) {
        return this.getBestMoveForGameState( 
            new TicTacToeGameState(board, player) 
        ).getMove();        
    }
}

// This class runs the simulator using the engine and the random/AI class
class TicTacToeSimulator{
    constructor(numberOfGames, playerA, playerB) {
        this.numberOfGames = numberOfGames;
        this.playerA = playerA;
        this.playerB = playerB;
    }

    run() {
        let ticTacToeGameEngine = new TicTacToeGameStateEngine();
        let ticTacToeGameState;
        let move;
 
        let winX = 0;
        let winO = 0;
        let draw = 0;
 
        for(let i=0; i<this.numberOfGames; i++) {
            console.log('Game: ' + i + '/' + this.numberOfGames);
            ticTacToeGameState = ticTacToeGameEngine.getInitialGameState();
            while( ticTacToeGameState.getStatus() == 'running') {
                if( ticTacToeGameState.getPlayer() == 'X') {
                    move = this.playerA.getBestMove(ticTacToeGameState.getBoard(), ticTacToeGameState.getPlayer());
                } else {
                    move = this.playerB.getBestMove(ticTacToeGameState.getBoard(), ticTacToeGameState.getPlayer());
                }
                ticTacToeGameState = ticTacToeGameEngine.makeMove(ticTacToeGameState, move);
            }
            switch(ticTacToeGameState.getStatus()) {
                case 'win-x': winX++; break;
                case 'win-o': winO++; break;
                case 'draw': draw++; break;
            }
        }

        console.log('Win X : ' + winX);
        console.log('Win O : ' + winO);
        console.log('Draw  : ' + draw);
    }
}

// Run the simulator
ticTacToeSimulator = new TicTacToeSimulator(
    100,                        // Set the number of games you want to run
    new RandomPower(),          // Either choose new Randompower() or new IntelligentForceAI()
    new IntelligentForceAI()    // Either choose new Randompower() or new IntelligentForceAI()
);
ticTacToeSimulator.run();