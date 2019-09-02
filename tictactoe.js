// This class handles the graphical part
class TicTacToe {
    constructor( context, language ) {
        this.context = context;
        this.language = language;
        this.winner = '';
        this.player = 'X';
        this.resetGame();
    }

    // Draws the 2 vertical and 2 horizontal lines
    drawGrid() {
        this.context.clearRect(0, 0, 300, 300);
        this.context.lineWidth = 5;
        this.context.beginPath();
        this.context.moveTo(100, 0);
        this.context.lineTo(100, 300);
        this.context.moveTo(200, 0);
        this.context.lineTo(200, 300);
        this.context.moveTo(0, 100);
        this.context.lineTo(300, 100);
        this.context.moveTo(0, 200);
        this.context.lineTo(300, 200);
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        this.context.closePath();
    }

    // Input: position on the board (0..9)
    // Ouput: true of position is empty, false otherwise
    positionIsEmpty( position ) {
        if( this.positions[ position ] == '-' ) {
            return true;
        } else {
            return false;
        }
    }

    // Sets a player (X or O) at the given position
    setPlayerAtPosition( player, position ) {
        // Place the player
        this.positions[ position ] = player;
        if( player == 'X' ) {
            this.drawX( position );
            this.isItXsTurn = false;
        } else {
            this.drawO( position );
            this.isItXsTurn = true;
        }

        // Check for win/loose/draw
        this.checkGameState();
    }

    // Draws an X at the given position
    drawX( position ) {
        var cellX = position%3;
        var cellY = Math.floor(position/3 )
        var i = 0, dx, dy;
        this.context.beginPath();
        for (i = 0; i < 2; i++) {
            dx = (cellX * 100) + 10 + (80*i);
            dy = (cellY * 100) + 10;
            this.context.moveTo(dx, dy);
            dx = (cellX * 100) + 90 - (80*i);
            dy = (cellY * 100) + 90;
            this.context.lineTo(dx, dy);
        }
        this.context.strokeStyle = '#3333ff';
        this.context.stroke();
        this.context.closePath();
    }

    // Draws an O at the given positon
    drawO( position ) {
        var cellX = position%3;
        var cellY = Math.floor(position/3 )
        this.context.beginPath();
        this.context.arc(
            cellX*100 + 50, 
            cellY*100 + 50, 
            40, 
            0, 
            Math.PI * 2, 
            false
        );
        this.context.strokeStyle = '#ff3333';
        this.context.stroke();
        this.context.closePath();
    }


    checkGameState() {
        // All possible ways of winning the game
        var winningPatterns = [
            [0, 1, 2 ],
            [3, 4, 5 ],
            [6, 7, 8 ],
            [0, 3, 6 ],
            [1, 4, 7 ],
            [2, 5, 8 ],
            [0, 4, 8 ],
            [2, 4, 6 ]
        ];

        // Check if there are no positions to fill anymore
        this.gameHasEnded = true;    
        this.winner = '';
        for ( var i = 0; i < this.positions.length; i++) {
            if ( this.positions[ i ] == '-' ) {
                this.gameHasEnded = false;
                break;    
            }
        }
        
        // Check all winning patterns for a match
        for ( var i = 0; i < winningPatterns.length; i++) {
            if ( 
                this.positions[ winningPatterns[ i ][ 0 ] ] == this.positions[ winningPatterns[ i ][ 1 ] ] &&
                this.positions[ winningPatterns[ i ][ 1 ] ] == this.positions[ winningPatterns[ i ][ 2 ] ]
            ) {
                if ( this.positions[ winningPatterns[ i ][ 0 ] ] != '-' ) {
                    this.gameHasEnded = true;
                    this.drawWin( winningPatterns[ i ][ 0 ], winningPatterns[ i ][ 2 ] );
                    this.winner = this.positions[ winningPatterns[ i ][ 0 ] ];
                }
            }
        }

        // Adjust info message based
        if (this.gameHasEnded) {
            let text = "";
            if (this.language == 'EN') {
                switch (this.winner) {
                    case 'X': text = 'X won. Click to start again.'; break;
                    case 'O': text = 'O won. Click to start again'; break;
                    case '': text = 'A draw. Click to start again.'; break;
                }
            } else {
                switch (this.winner) {
                    case 'X': text = 'X heeft gewonnen. Klik om opnieuw te beginnen.'; break;
                    case 'O': text = 'O heeft gewonnen. Klik om opnieuw te beginnen.'; break;
                    case '': text = 'Gelijkspel. Klik om opnieuw te beginnen.'; break;
                }
            }
            document.getElementById('tttmessage').innerHTML = text;
        }
    }

    // Draws a line marking the winning pattern
    drawWin( posA, posB ) {
        var posAX = posA%3 *100+50;
        var posAY = Math.floor( posA/3 )*100+50
        var posBX = posB%3*100+50;
        var posBY = Math.floor( posB/3 )*100+50

        this.context.beginPath();
        this.context.moveTo(posAX, posAY);
        this.context.lineTo(posBX, posBY);

        this.context.strokeStyle = '#33ff33';
        this.context.stroke();
        this.context.closePath();
    }

    // Resets the game (o rly?)
    resetGame() {
        this.positions = [ 
            '-', '-', '-', 
            '-', '-', '-', 
            '-', '-', '-'
        ];
        this.drawGrid();
        this.isItXsTurn = true;
        this.gameHasEnded = false;
        if (this.player == 'O') {
            let move = new IntelligentForceAI().getBestMove(ttt.getBoard(), 'X');
            this.setPlayerAtPosition( 'X', move );    
        }
        if (this.language == "EN") {
            document.getElementById('tttmessage').innerHTML = 'Place your ' + this.player + '.';
        } else {
            document.getElementById('tttmessage').innerHTML = 'Plaats je ' + this.player + '.';
        }
    }

    // Returns the board a a string
    getBoard() {
        return this.positions.join('');
    }

    // Makes the player O instead of X and vice versa
    changePlayer() {
        this.player == 'X' ? this.player = 'O' : this.player = 'X';
        this.resetGame();
    }
}

// Handling the events
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {

        // Initialize instance
        tttcanvas = document.getElementById('tttcanvas');
        tttcontext = tttcanvas.getContext('2d');
        ttt = new TicTacToe( tttcontext, 'EN' ); // Change this to NL if you want the Dutch version

        if (ttt.language == 'EN') {
            document.getElementById('tttbutton').innerHTML = 'Change O/X';
        } else {
            document.getElementById('tttbutton').innerHTML = 'Wissel O/X';
        }

        // Handling clicks on the board
        tttcanvas.addEventListener('click', (e) => {
            x = e.offsetX / 100 | 0;
            y = e.offsetY / 100 | 0;
            clickedPosition = x + y*3;

            if( ttt.gameHasEnded ) {
                ttt.resetGame();
            } else {
                if( ttt.isItXsTurn && ttt.player == 'X') {
                    if( ttt.positionIsEmpty( clickedPosition ) ) {
                        ttt.setPlayerAtPosition( 'X', clickedPosition );
                        if( !ttt.gameHasEnded ) {
                            move = new IntelligentForceAI().getBestMove(ttt.getBoard(), 'O');
                            ttt.setPlayerAtPosition( 'O', move );    
                        }
                    } 
                }
                if( !ttt.isItXsTurn && ttt.player == 'O') {
                    if( ttt.positionIsEmpty( clickedPosition ) ) {
                        ttt.setPlayerAtPosition( 'O', clickedPosition );
                        if( !ttt.gameHasEnded ) {
                            move = new IntelligentForceAI().getBestMove(ttt.getBoard(), 'X');
                            ttt.setPlayerAtPosition( 'X', move );    
                        }
                    } 
                }
            }
        });

        // Handling clicks on the change O/X button
        button = document.getElementById('tttbutton');
        button.addEventListener('click', (e) => {
            ttt.changePlayer();
        });

    }
}
