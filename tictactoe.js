class TicTacToe {
    constructor( context ) {
        this.context = context;
        this.winner = '';
        this.player = 'X';
        this.resetGame();
    }

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

    positionIsEmpty( position ) {
        if( this.positions[ position ] == '-' ) {
            return true;
        } else {
            return false;
        }
    }

    setPlayerAtPosition( player, position ) {
        this.positions[ position ] = player;
        if( player == 'X' ) {
            this.drawX( position );
            this.isItXsTurn = false;
        } else {
            this.drawO( position );
            this.isItXsTurn = true;
        }

        this.checkGameState();
    }

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

        this.gameHasEnded = true;    
        this.winner = '';
        for ( var i = 0; i < this.positions.length; i++) {
            if ( this.positions[ i ] == '-' ) {
                this.gameHasEnded = false;
                break;    
            }
        }
        
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

        if (this.gameHasEnded) {
            let text = "";
            switch (this.winner) {
                case 'X': text = 'X heeft gewonnen. Klik om opnieuw te beginnen.'; break;
                case 'O': text = 'O heeft gewonnen. Klik om opnieuw te beginnen.'; break;
                case '': text = 'Gelijkspel. Klik om opnieuw te beginnen.'; break;
            }
            document.getElementById('tttmessage').innerHTML = text;
        }
    }

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
        document.getElementById('tttmessage').innerHTML = 'Plaats je ' + this.player + '.';
    }

    getBoard() {
        return this.positions.join('');
    }

    changePlayer() {
        this.player == 'X' ? this.player = 'O' : this.player = 'X';
        this.resetGame();
    }
}

document.onreadystatechange = function () {
    if (document.readyState === 'complete') {

        tttcanvas = document.getElementById('tttcanvas');
        tttcontext = tttcanvas.getContext('2d');
        ttt = new TicTacToe( tttcontext );
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

        button = document.getElementById('tttbutton');
        button.addEventListener('click', (e) => {
            ttt.changePlayer();
        });

    }
}
