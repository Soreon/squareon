/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert*/

'use strict';

var c = document.getElementById("main-canvas"),
    b = document.getElementById("generate-button"),
    s = document.getElementById("solve-button"),
    h = document.getElementById("height"),
    w = document.getElementById("width"),
    ctx = c.getContext("2d"),
    origin_squaro_x = 20,
    origin_squaro_y = 20,
    ball_container_radius = 5,
    cell_size = 35,
    number_of_cell_x = 6,
    number_of_cell_y = 6,
    ball_grid = [],
    number_grid = [];

function clearCanvas() {
    ctx.clearRect(0, 0, c.width, c.height);
}

function drawLines(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawCircle(ox, oy, radius, stroke) {
    ctx.beginPath();
    ctx.arc(ox, oy, radius, 0, Math.PI * 2, true);
    if (stroke) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
}

function drawText(ox, oy, text, color) {
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, ox, oy);
    ctx.fillStyle = "#000000";
}


// Récupère la valeur haut-gauche de la case i, j
function getHG(i, j) { return ball_grid[i][j]; }

// Récupère la valeur haut-droite de la case i, j
function getHD(i, j) { return ball_grid[i][j + 1]; }

// Récupère la valeur bas-droite de la case i, j
function getBD(i, j) { return ball_grid[i + 1][j + 1]; }

// Récupère la valeur bas-gauche de la case i, j
function getBG(i, j) { return ball_grid[i + 1][j]; }

// Initialise la valeur haut-gauche de la case i, j
function setHG(i, j, value) {
    if (ball_grid[i][j] === 2 || ball_grid[i][j] === value) {
        ball_grid[i][j] = value;
    } else {
        console.error("Erreur setHG en " + i + "," + j + " : " + value);
    }
}

// Initialise la valeur haut-droite de la case i, j
function setHD(i, j, value) {
    if (ball_grid[i][j + 1] === 2 || ball_grid[i][j + 1] === value) {
        ball_grid[i][j + 1] = value;
    } else {
        console.error("Erreur setHD en " + i + "," + j + " : " + value);
    }
}

// Initialise la valeur bas-droite de la case i, j
function setBD(i, j, value) {
    if (ball_grid[i + 1][j + 1] === 2 || ball_grid[i + 1][j + 1] === value) {
        ball_grid[i + 1][j + 1] = value;
    } else {
        console.error("Erreur setBD en " + i + "," + j + " : " + value);
    }
}

// Initialise la valeur bas-gauche de la case i, j
function setBG(i, j, value) {
    if (ball_grid[i + 1][j] === 2 || ball_grid[i + 1][j] === value) {
        ball_grid[i + 1][j] = value;
    } else {
        console.error("Erreur setBG en " + i + "," + j + " : " + value);
    }
}

function drawGrid(number_of_cell_x, number_of_cell_y) {
    var i, j, angle, x1, y1, x2, y2;
    clearCanvas();
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            switch (ball_grid[i][j]) {
            case 0:
                drawCircle(origin_squaro_x + (j * cell_size), origin_squaro_y + (i * cell_size), ball_container_radius, true);
                break;
            case 1:
                drawCircle(origin_squaro_x + (j * cell_size), origin_squaro_y + (i * cell_size), ball_container_radius, false);
                break;
            case 2:
                drawCircle(origin_squaro_x + (j * cell_size), origin_squaro_y + (i * cell_size), ball_container_radius, true);
                x1 = origin_squaro_x + (j * cell_size) + ball_container_radius * Math.cos(3 * Math.PI / 4);
                y1 = origin_squaro_y + (i * cell_size) + ball_container_radius * Math.sin(3 * Math.PI / 4);
                x2 = origin_squaro_x + (j * cell_size) + ball_container_radius * Math.cos(-Math.PI / 4);
                y2 = origin_squaro_y + (i * cell_size) + ball_container_radius * Math.sin(-Math.PI / 4);
                drawLines(x1, y1, x2, y2);
                x1 = origin_squaro_x + (j * cell_size) + ball_container_radius * Math.cos(Math.PI / 4);
                y1 = origin_squaro_y + (i * cell_size) + ball_container_radius * Math.sin(Math.PI / 4);
                x2 = origin_squaro_x + (j * cell_size) + ball_container_radius * Math.cos(-3 * Math.PI / 4);
                y2 = origin_squaro_y + (i * cell_size) + ball_container_radius * Math.sin(-3 * Math.PI / 4);
                drawLines(x1, y1, x2, y2);
                break;
            }
            if (j < number_of_cell_x) {
                drawLines(origin_squaro_x + ball_container_radius + (j * cell_size), origin_squaro_y + (i * cell_size), origin_squaro_x - ball_container_radius + ((j + 1) * cell_size), origin_squaro_x + (i * cell_size));
            }
            if (i < number_of_cell_y) {
                drawLines(origin_squaro_x + (j * cell_size), origin_squaro_y + ball_container_radius + (i * cell_size), origin_squaro_x + (j * cell_size), origin_squaro_x - ball_container_radius + ((i + 1) * cell_size));
            }
            if (j < number_of_cell_x && i < number_of_cell_y) {
                drawText(origin_squaro_x + (j * cell_size) + (cell_size / 2), origin_squaro_x + (i * cell_size) + (cell_size / 2), number_grid[i][j], (number_grid[i][j] === ((ball_grid[i][j] === 1 ? 1 : 0) + (ball_grid[i + 1][j] === 1 ? 1 : 0) + (ball_grid[i][j + 1] === 1 ? 1 : 0) + (ball_grid[i + 1][j + 1] === 1 ? 1 : 0))) ? "" : "#FF0000");
            }
        }
    }
}

function initBallGrid(number_of_cell_x, number_of_cell_y) {
    var i, j;
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        ball_grid[i] = [];
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            ball_grid[i][j] = 0;
        }
    }
}

function initBallGridUnsure(number_of_cell_x, number_of_cell_y) {
    var i, j;
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        ball_grid[i] = [];
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            ball_grid[i][j] = 2;
        }
    }
}

function initNumberGrid(number_of_cell_x, number_of_cell_y) {
    var i, j;
    for (i = 0; i < number_of_cell_y; i = i + 1) {
        number_grid[i] = [];
        for (j = 0; j < number_of_cell_x; j = j + 1) {
            number_grid[i][j] = 0;
        }
    }
}


function isValid() {
    var i, j;
    for (i = 0; i < number_of_cell_y; i = i + 1) {
        for (j = 0; j < number_of_cell_x; j = j + 1) {
            if (number_grid[i][j] !== (getHD(i, j) === 1 ? 1 : 0) + (getBD(i, j) === 1 ? 1 : 0) + (getHG(i, j) === 1 ? 1 : 0) + (getBG(i, j) === 1 ? 1 : 0)) {
                return false;
            }
            if (getHD(i, j) === 2) { return false; }
            if (getBD(i, j) === 2) { return false; }
            if (getHG(i, j) === 2) { return false; }
            if (getBG(i, j) === 2) { return false; }
        }
    }
    return true;
}

function setBallState(event) {
    var rect = c.getBoundingClientRect(),
        x = event.clientX - rect.left,
        y = event.clientY - rect.top,
        i,
        j;
    
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            if ((x < origin_squaro_x + (j * cell_size) + ball_container_radius) && (x > origin_squaro_x + (j * cell_size) - ball_container_radius) && (y < origin_squaro_y + (i * cell_size) + ball_container_radius) && (y > origin_squaro_y + (i * cell_size) - ball_container_radius)) {
                switch (ball_grid[i][j]) {
                case 0:
                    ball_grid[i][j] = 2;
                    break;
                case 1:
                    ball_grid[i][j] = 0;
                    break;
                case 2:
                    ball_grid[i][j] = 1;
                    break;
                }
                
                clearCanvas();
                drawGrid(number_of_cell_x, number_of_cell_y);
            }
        }
    }
    if (isValid()) {
        alert("Bien joué !");
    }
}

function generateRandomGrid(number_of_cell_x, number_of_cell_y) {
    var i, j;
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            ball_grid[i][j] = Math.round(Math.random());
        }
    }
    for (i = 0; i < number_of_cell_y; i = i + 1) {
        for (j = 0; j < number_of_cell_x; j = j + 1) {
            number_grid[i][j] = (getHD(i, j) === 1 ? 1 : 0) + (getBD(i, j) === 1 ? 1 : 0) + (getHG(i, j) === 1 ? 1 : 0) + (getBG(i, j) === 1 ? 1 : 0);
        }
    }
    initBallGrid(number_of_cell_x, number_of_cell_y);
}

// Permet de tester la configuration d'une case
function testConfiguration(i, j, hg, hd, bd, bg) {
    return getHG(i, j) === hg && getHD(i, j) === hd && getBD(i, j) === bd && getBG(i, j) === bg;
}

function setConfiguration(i, j, hg, hd, bd, bg) {
    if (getHG(i, j) !== hg && getHG(i, j) !== 2) {
        console.error("Erreur setConfiguration HG en " + i + "," + j + " : " + hg + "," + hd + "," + bd + "," + bg);
        return false;
    } else {
        setHG(i, j, hg);
    }
    
    if (getHD(i, j) !== hd && getHD(i, j) !== 2) {
        console.error("Erreur setConfiguration HD en " + i + "," + j + " : " + hg + "," + hd + "," + bd + "," + bg);
        return false;
    } else {
        setHD(i, j, hd);
    }
    
    if (getBD(i, j) !== bd && getBD(i, j) !== 2) {
        console.error("Erreur setConfiguration BD en " + i + "," + j + " : " + hg + "," + hd + "," + bd + "," + bg);
        return false;
    } else {
        setBD(i, j, bd);
    }
    
    if (getBG(i, j) !== bg && getBG(i, j) !== 2) {
        console.error("Erreur setConfiguration BG en " + i + "," + j + " : " + hg + "," + hd + "," + bd + "," + bg);
        return false;
    } else {
        setBG(i, j, bg);
    }
}

function rule4(i, j) {
    setHD(i, j, 1);
    setHG(i, j, 1);
    setBD(i, j, 1);
    setBG(i, j, 1);
}

function rule4_2(i, j) {
    var i_min_value,
        i_max_value,
        j_min_value,
        j_max_value;
    
    if (i === 0) { i_min_value = 0; } else { i_min_value = i - 1; }
    if (i === number_of_cell_y - 1) { i_max_value = number_of_cell_y - 1; } else { i_max_value = i + 1; }
    if (j === 0) { j_min_value = 0; } else { j_min_value = j - 1; }
    if (j === number_of_cell_x - 1) { j_max_value = number_of_cell_x - 1; } else { j_max_value = j + 1; }
    
    // En haut
    if (number_grid[i_min_value][j] === 2) {
        setHD(i_min_value, j, 0);
        setHG(i_min_value, j, 0);
    }
    
    // En bas
    if (number_grid[i_max_value][j] === 2) {
        setBD(i_max_value, j, 0);
        setBG(i_max_value, j, 0);
    }
    
    // A gauche
    if (number_grid[i][j_min_value] === 2) {
        setHG(i, j_min_value, 0);
        setBG(i, j_min_value, 0);
    }
    
    // A droite
    if (number_grid[i][j_max_value] === 2) {
        setHD(i, j_max_value, 0);
        setBD(i, j_max_value, 0);
    }
}

function rule0(i, j) {
    setHD(i, j, 0);
    setHG(i, j, 0);
    setBD(i, j, 0);
    setBG(i, j, 0);
}

function rule0_2(i, j) {
    var i_min_value,
        i_max_value,
        j_min_value,
        j_max_value;
    
    if (i === 0) { i_min_value = 0; } else { i_min_value = i - 1; }
    if (i === number_of_cell_y - 1) { i_max_value = number_of_cell_y - 1; } else { i_max_value = i + 1; }
    if (j === 0) { j_min_value = 0; } else { j_min_value = j - 1; }
    if (j === number_of_cell_x - 1) { j_max_value = number_of_cell_x - 1; } else { j_max_value = j + 1; }
    
    // En haut
    if (number_grid[i_min_value][j] === 2) {
        setHD(i_min_value, j, 1);
        setHG(i_min_value, j, 1);
    }
    
    // En bas
    if (number_grid[i_max_value][j] === 2) {
        setBD(i_max_value, j, 1);
        setBG(i_max_value, j, 1);
    }
    
    // A gauche
    if (number_grid[i][j_min_value] === 2) {
        setHG(i, j_min_value, 1);
        setBG(i, j_min_value, 1);
    }
    
    // A droite
    if (number_grid[i][j_max_value] === 2) {
        setHD(i, j_max_value, 1);
        setBD(i, j_max_value, 1);
    }
}

function rule1_4(i, j) {
    var i_min_value,
        i_max_value,
        j_min_value,
        j_max_value;
    
    if (i === 0) { i_min_value = 0; } else { i_min_value = i - 1; }
    if (i === number_of_cell_y - 1) { i_max_value = number_of_cell_y - 1; } else { i_max_value = i + 1; }
    if (j === 0) { j_min_value = 0; } else { j_min_value = j - 1; }
    if (j === number_of_cell_x - 1) { j_max_value = number_of_cell_x - 1; } else { j_max_value = j + 1; }
    
    // En haut à gauche
    if (number_grid[i_min_value][j_min_value] === 4) {
        setHD(i, j, 0);
        setBD(i, j, 0);
        setBG(i, j, 0);
    }
    
    // En haut à droite
    if (number_grid[i_min_value][j_max_value] === 4) {
        setHG(i, j, 0);
        setBD(i, j, 0);
        setBG(i, j, 0);
    }
    
    // En bas à droite
    if (number_grid[i_max_value][j_max_value] === 4) {
        setHG(i, j, 0);
        setHD(i, j, 0);
        setBG(i, j, 0);
    }
    
    // En bas à gauche
    if (number_grid[i_max_value][j_min_value] === 4) {
        setHG(i, j, 0);
        setHD(i, j, 0);
        setBD(i, j, 0);
    }
}

function rule1_3(i, j) {
    var i_min_value,
        i_max_value,
        j_min_value,
        j_max_value;
    
    if (i === 0) { i_min_value = 0; } else { i_min_value = i - 1; }
    if (i === number_of_cell_y - 1) { i_max_value = number_of_cell_y - 1; } else { i_max_value = i + 1; }
    if (j === 0) { j_min_value = 0; } else { j_min_value = j - 1; }
    if (j === number_of_cell_x - 1) { j_max_value = number_of_cell_x - 1; } else { j_max_value = j + 1; }
    
    // En haut
    if (number_grid[i_min_value][j] === 3) {
        setHD(i_min_value, j, 1);
        setHG(i_min_value, j, 1);
        
        setBD(i, j, 0);
        setBG(i, j, 0);
    }
    
    // En bas
    if (number_grid[i_max_value][j] === 3) {
        setBD(i_max_value, j, 1);
        setBG(i_max_value, j, 1);
        
        setHD(i, j, 0);
        setHG(i, j, 0);
    }
    
    // A gauche
    if (number_grid[i][j_min_value] === 3) {
        setHG(i, j_min_value, 1);
        setBG(i, j_min_value, 1);
        
        setHD(i, j, 0);
        setBD(i, j, 0);
    }
    
    // A droite
    if (number_grid[i][j_max_value] === 3) {
        setHD(i, j_max_value, 1);
        setBD(i, j_max_value, 1);
        
        setHG(i, j, 0);
        setBG(i, j, 0);
    }
}

// Vérifie qu'une case 1 est en position de résolution certaine
function rule1Sure(i, j) {
    var result = false;
    if (testConfiguration(i, j, 0, 0, 0, 2)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 0, 1, 2)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 0, 2, 0)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 0, 2, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 1, 0, 2)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 0, 1, 2, 0)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 0, 1, 2, 2)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 0, 2, 0, 0)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 0, 2, 0, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 0)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 2)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 2, 2, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 0, 0, 2)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 0)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 2)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 0, 0)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 0, 2)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 2, 0)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 2, 2)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 0, 0)) { setConfiguration(i, j, 1, 0, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 0, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 0, 1, 0)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 1, 2)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 2, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 0)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 2)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 2, 0)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 2, 2)) { setConfiguration(i, j, 0, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 0, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 2, 1, 0)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 1, 2)) { setConfiguration(i, j, 0, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 2, 1)) { setConfiguration(i, j, 0, 0, 0, 1); result = true; }
    return result;
}

// Vérifie qu'une case 2 est en position de résolution certaine
function rule2Sure(i, j) {
    var result = false;
    if (testConfiguration(i, j, 0, 0, 1, 2)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 0, 2, 1)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 0, 2, 2)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 1, 0, 2)) { setConfiguration(i, j, 0, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 1, 1, 2)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 1, 2, 0)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 1, 2, 1)) { setConfiguration(i, j, 0, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 0, 1)) { setConfiguration(i, j, 0, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 0)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 1)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 2, 0)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 0, 0, 2)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 0, 1, 2)) { setConfiguration(i, j, 1, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 0)) { setConfiguration(i, j, 1, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 1)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 1, 0, 2)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 1, 2, 0)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 1, 2, 2)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 0, 0)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 0, 1)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 2, 1, 0)) { setConfiguration(i, j, 1, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 2, 1)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 0, 0, 1)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 0, 0, 2)) { setConfiguration(i, j, 1, 0, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 0, 1, 0)) { setConfiguration(i, j, 1, 0, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 1, 1)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 0)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 1)) { setConfiguration(i, j, 0, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 1, 0)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 1, 2)) { setConfiguration(i, j, 0, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 0, 0)) { setConfiguration(i, j, 1, 1, 0, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 1, 1)) { setConfiguration(i, j, 0, 0, 1, 1); result = true; }
    return result;
}

// Vérifie qu'une case 3 est en position de résolution certaine
function rule3Sure(i, j) {
    var result = false;
    if (testConfiguration(i, j, 0, 1, 1, 2)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 1, 2, 1)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 1)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 1, 2)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 0, 2, 2, 2)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 1, 0, 1, 2)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 1)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 1, 0, 2, 2)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 1, 1, 0, 2)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 1, 1, 2)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 1, 2, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 1, 2, 1)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 2, 0, 1)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 1, 2, 1, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 1, 2, 1, 1)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 1, 2, 2, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 0, 1, 1)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 2, 0, 2, 2)) { setConfiguration(i, j, 1, 0, 1, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 1)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 0, 2)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 1, 1, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 1, 1, 1)) { setConfiguration(i, j, 0, 1, 1, 1); result = true; }
    if (testConfiguration(i, j, 2, 2, 0, 2)) { setConfiguration(i, j, 1, 1, 0, 1); result = true; }
    if (testConfiguration(i, j, 2, 2, 1, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    if (testConfiguration(i, j, 2, 2, 2, 0)) { setConfiguration(i, j, 1, 1, 1, 0); result = true; }
    return result;
}

function getUnsureBalls() {
    var i, j, arr = [];
    for (i = 0; i <= number_of_cell_y; i = i + 1) {
        for (j = 0; j <= number_of_cell_x; j = j + 1) {
            if (ball_grid[i][j] === 2) {
                arr[arr.length] = {i: i, j: j};
            }
        }
    }
    return arr;
}

var unsure_mode = false;

// Dans le cas de tablea complexe, on tente la résolution empirique.
// Le mode actuel est inéfficace. On teste toutes les combinaisons possible.
// Il faudrait Valider une case uncertaine et tester si la résolution passe.
function empiricalSolve() {
    var loop_num, i, j, stop = false, unsure, item, item2, ui, uj, ui2, uj2;
    for (loop_num = 0; !stop; loop_num = loop_num + 1) {
        stop = true;
        for (i = 0; i < number_of_cell_y; i = i + 1) {
            for (j = 0; j < number_of_cell_x; j = j + 1) {
                if (number_grid[i][j] === 1) {
                    if (rule1Sure(i, j) === true) {
                        stop = false;
                    }
                }
                if (number_grid[i][j] === 2) {
                    if (rule2Sure(i, j) === true) {
                        stop = false;
                    }
                }
                if (number_grid[i][j] === 3) {
                    if (rule3Sure(i, j) === true) {
                        stop = false;
                    }
                }
            }
        }
    }
    
    drawGrid(number_of_cell_x, number_of_cell_y);
    if (isValid()) {
        return true;
    } else {
        if (getUnsureBalls().length === 0) {
            return false;
        } else {
            console.log("Test empirique Interne");
            unsure = getUnsureBalls();
            for (item = 0; item < unsure.length; item = item + 1) {
                ui = unsure[item].i;
                uj = unsure[item].j;
                ball_grid[ui][uj] = 0;
                if (empiricalSolve()) {
                    return true;
                } else {
                    for (item2 = 0; item2 < unsure.length; item2 = item2 + 1) {
                        ui2 = unsure[item2].i;
                        uj2 = unsure[item2].j;
                        ball_grid[ui2][uj2] = 2;
                    }
                }
                ball_grid[ui][uj] = 1;
                if (empiricalSolve()) {
                    return true;
                } else {
                    for (item2 = 0; item2 < unsure.length; item2 = item2 + 1) {
                        ui2 = unsure[item2].i;
                        uj2 = unsure[item2].j;
                        ball_grid[ui2][uj2] = 2;
                    }
                }
                ball_grid[ui][uj] = 2;
            }
            return false;
        }
    }
}


function solve() {
    initBallGridUnsure(number_of_cell_x, number_of_cell_y);
    var i, j, item, item2, unsure, ui, uj, ui2, uj2,
        stop = false,
        loop_num,
        start = new Date().getTime(),
        time,
        end;
    
    for (i = 0; i < number_of_cell_y; i = i + 1) {
        for (j = 0; j < number_of_cell_x; j = j + 1) {
            if (number_grid[i][j] === 4) {
                rule4(i, j);
                rule4_2(i, j);
            }
            if (number_grid[i][j] === 0) {
                rule0(i, j);
                rule0_2(i, j);
            }
            if (number_grid[i][j] === 1) {
                rule1_4(i, j);
                rule1_3(i, j);
            }
        }
    }
    
    for (loop_num = 0; !stop; loop_num = loop_num + 1) {
        stop = true;
        for (i = 0; i < number_of_cell_y; i = i + 1) {
            for (j = 0; j < number_of_cell_x; j = j + 1) {
                if (number_grid[i][j] === 1) {
                    if (rule1Sure(i, j) === true) {
                        stop = false;
                    }
                }
                if (number_grid[i][j] === 2) {
                    if (rule2Sure(i, j) === true) {
                        stop = false;
                    }
                }
                if (number_grid[i][j] === 3) {
                    if (rule3Sure(i, j) === true) {
                        stop = false;
                    }
                }
            }
        }
    }
    
    if (isValid()) {
        end = new Date().getTime();
        time = end - start;
        console.log("Résolution terminée avec succés en " + time + " ms");
    } else {
        unsure_mode = true;
        console.log("Test empirique");
        unsure = getUnsureBalls();
        for (item = 0; item < unsure.length; item = item + 1) {
            ui = unsure[item].i;
            uj = unsure[item].j;
            ball_grid[ui][uj] = 0;
            if (empiricalSolve()) {
                end = new Date().getTime();
                time = end - start;
                console.log("Résolution terminée avec succés en " + time + " ms");
                unsure_mode = false;
                return true;
            } else {
                for (item2 = 0; item2 < unsure.length; item2 = item2 + 1) {
                    ui2 = unsure[item2].i;
                    uj2 = unsure[item2].j;
                    ball_grid[ui2][uj2] = 2;
                }
            }
            ball_grid[ui][uj] = 1;
            if (empiricalSolve()) {
                end = new Date().getTime();
                time = end - start;
                console.log("Résolution terminée avec succés en " + time + " ms");
                unsure_mode = false;
                return true;
            } else {
                for (item2 = 0; item2 < unsure.length; item2 = item2 + 1) {
                    ui2 = unsure[item2].i;
                    uj2 = unsure[item2].j;
                    ball_grid[ui2][uj2] = 2;
                }
            }
            ball_grid[ui][uj] = 2;
        }
        console.log("Aucune solution trouvée ?!");
        return false;
    }
}
c.addEventListener('click', setBallState);
b.addEventListener('click', function (event) {
    generateRandomGrid(number_of_cell_x, number_of_cell_y);
    drawGrid(number_of_cell_x, number_of_cell_y);
});
s.addEventListener('click', function (event) {
    solve();
    drawGrid(number_of_cell_x, number_of_cell_y);
});
h.oninput = function (event) {
    number_of_cell_y = h.value;
    initBallGrid(number_of_cell_x, number_of_cell_y);
    initNumberGrid(number_of_cell_x, number_of_cell_y);
    generateRandomGrid(number_of_cell_x, number_of_cell_y);
    drawGrid(number_of_cell_x, number_of_cell_y);
};
w.oninput = function (event) {
    number_of_cell_x = w.value;
    initBallGrid(number_of_cell_x, number_of_cell_y);
    initNumberGrid(number_of_cell_x, number_of_cell_y);
    generateRandomGrid(number_of_cell_x, number_of_cell_y);
    drawGrid(number_of_cell_x, number_of_cell_y);
};


initBallGrid(number_of_cell_x, number_of_cell_y);
initNumberGrid(number_of_cell_x, number_of_cell_y);
generateRandomGrid(number_of_cell_x, number_of_cell_y);
drawGrid(number_of_cell_x, number_of_cell_y);