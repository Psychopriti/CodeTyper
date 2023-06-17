const paragraphs = [
    // Python
    [ 'def simulate_game(team1, team2):\n  rating1 = team1["rating"]\n  rating2 = team2["rating"]\n  probability = 1 / (1 + 10 ** ((rating2 - rating1) / 600))\n  return random.random() < probability',
    'for i in database:\n  personas = []\n  for clave in STR:\n    personas.append(int(i[clave]))\n  if personas == results:\n    print(i["name"])\n    sys.exit(0)\n  print("No match")',
    '@app.route("/register", methods=["GET", "POST"])\n  def register():\n    if request.method == "POST":\n      name = request.form.get("username")\n      contraseña = request.form.get("password")\n confirmacion = request.form.get("confirmation")' ,
    '@app.route("/login")\n def login():\n texto = request.args.get("texto")\n apellido = request.args.get("apellido")\n print(f"{texto} y {apellido}")\n return render_template("login.html") ',
    'with open(sys.argv[1]) as file:\n reader = csv.DictReader(file)\n for filas in reader: \n filas["rating"] = int(filas["rating"]) \n teams.append(filas) \n counts = {} \n for i in range(N):\n key = simulate_tournament(teams) \n if key in counts:\n counts[key] += 1'],

    // SQL
    [ 'SELECT AVG(energy) FROM songs\n JOIN artists ON artists.id = songs.artists_id\n WHERE artists.name = "Drake"\n SELECT AVG(energy) FROM songs\n WHERE artist_id IN\n (SELECT id FROM artists WHERE name  = "Drake")',
      'SELECT description FROM crime_scene_reports\n WHERE month  = 7 AND day = 28\n AND street  = "Humphrey Street";',
      'SELECT * FROM people\n JOIN phone_calls ON phone_calls.receiver  = people.phone_number\n WHERE year = 2021 AND month = 7 AND day = 28 AND duration <60\n ORDER BY duration;',
      'SELECT name\n FROM people\n JOIN passengers ON passengers.passport_number = people.passport_number\n JOIN flights ON flights.id  = passengers.flight_id\n WHERE flights.id  = 36;',
      '""" SELECT name, leaderboard.language, leaderboard.wpm,leaderboard.cpm, leaderboard.points\n FROM users\n JOIN leaderboard ON leaderboard.user_id = users.id\n WHERE leaderboard.language = :lenguaje\n ORDER BY leaderboard.points DESC LIMIT 5  """,\n lenguaje = lenguaje '],

    // JavaScript
    [ 'let opc = document.getElementsByClassName("opc")\n let opciones  = document.querySelectorAll(".opciones")\n let mensaje  = document.querySelector("#mensaje")\n let correcto  = document.querySelector("#correcto")',
      'if(user.value == "4"){\n user.style.backgroundColor = "green" mensaje2.innerHTML  =  "Correcto!"\n } else {\n user.style.backgroundColor = "red"\n mensaje2.innerHTML  = "Incorrecto!"\n }',
      'let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);\n wpm = wpm < 0 || !wpm || wpm === Infinity ? 0: wpm;',
      'formulario.addEventListener("submit",(e){\n e.preventDefault();\n let nombre = document.querySelector\n ("nombre").value;\n alert(nombre)\n }',
      'const typingText = document.querySelector(".typing-text p")\n const inpField = document.querySelector(".wrapper .input-field")\n const tryAgainBtn = document.querySelector(".content button")\n const timeTag = document.querySelector(".time span b")\n const mistakeTag = document.querySelector(".mistake span")' ],

    // C
    [ 'int main(void) {\n // variables de letras palabras y oraciones\n string texto = get_string("Ingrese su texto:");\n int letras = count_letters(texto);\n int palabras = count_words(texto);\n int oraciones = count_sentences(texto);',
      'int main(int argc, string argv[]) {\n // Check for invalid usage\n if (argc < 2){\n  printf("Usage: runoff [candidate ...]");\n  return 1;}' ,
      '#include <stdio.h>\n #include <stdlib.h> \n #include <stdint.h>\n #include <cs50.h>\n typedef uint8_t BYTE;\n int main(int argc, char *argv[]) {\n //code goes here}',
      'int main (void)\n {\n nodo * raiz = malloc(sizeof(nodo));\n raiz-> dato  =  1;\n nodo * nodo1 = malloc(sizeof(nodo));\n nodo1-> dato  =  2;\n nodo1-> siguiente  = NULL;\n raiz -> siguiente  = nodo1;',
      'while (table[i] != NULL)\n {\n node *temp = table[i]->next;\n free(table[i]);\n table[i] = temp;\n } '],


    //Machine Code
     ["01000011 01101111 01100100 01100101 01110100 01111001 01110000 01110010 01110011 00100000 01100101 01110011 00100000 01100111 01101111 01100100",
    "01100101 01110011 01110100 01101111 00100000 01100110 01110101 01100101 00100000 01100011 01110011 00110101 00110000",
    "01101000 01101111 01101100 01100001 00100000 01101101 01110101 01101110 01100100 01101111 00100000 01100100 01100101 00100000 01100011 01101111 01100100 01100101 01110100 01111001 01110000 01100101 01110010 01110011"]
];



//top momentos de mi vida XD //sirve para chequear que se paso el value del lenguaje que el usuario eligio
console.log(userLanguage);

//le puse otro nombre
const user_input = userLanguage

let name_language;

//variable que al final nos sevira para mandarlo al backend a traves del json request
if (user_input === "0") {
    name_language = "python";
} else if (user_input === "1") {
    name_language = "sql";
} else if (user_input === "2") {
    name_language = "javascript";
} else if (user_input === "3") {
    name_language = "c";
} else{
    name_language = "machine code";
}

//game end variable
let gameEnded = false;


//variables dentro del DOM necesarias para el juego
const typingText = document.querySelector(".typing-text p")
const inpField = document.querySelector(".wrapper .input-field")
const tryAgainBtn = document.querySelector(".content button")
const timeTag = document.querySelector(".time span b")
const mistakeTag = document.querySelector(".mistake span")
//here are the variables where the data is stored
const wpmTag = document.querySelector(".wpm span")
const cpmTag = document.querySelector(".cpm span")
const ptsTag = document.querySelector(".points span")

const audio = document.getElementById("myAudio")

//variables usadas para determinar el tiempo de los 60 segundos y el timer
let timer;
let maxTime = 60 ;
let timeLeft = maxTime;
let charIndex = mistakes = isTyping = 0;


//funcion que carga el texto que se le muestra al usuario
// el array paragraphs toma primero el numero de lenguaje que le user eligio y luego dentro de esa lista elige un numero random entre la longitud de la lista obviamente
//luego carga cada char de ese parrafo seleccionado
function loadParagraph() {
    // Obtener un índice aleatorio dentro del rango de los párrafos seleccionados por el usuario
    const ranIndex = Math.floor(Math.random() * paragraphs[user_input].length);

    // Limpiar el contenido HTML del elemento "typingText"
    typingText.innerHTML = "";

 // Dividir el párrafo en líneas
 const lines = paragraphs[user_input][ranIndex].split("\n");

 // Recorrer cada línea del párrafo
 lines.forEach(line => {
   // Crear un elemento "div" para representar una línea
   const lineDiv = document.createElement("div");

   // Dividir la línea en caracteres y agregar cada carácter dentro de un elemento "span"
   line.split("").forEach(char => {
     const span = document.createElement("span");
     span.textContent = char;
     lineDiv.appendChild(span);
   });

   // Agregar la línea al "typingText"
   typingText.appendChild(lineDiv);
 });

 // Establecer la clase "active" en el primer elemento "span" del "typingText"
 typingText.querySelector("span").classList.add("active");

    // Establecer la clase "active" en el primer elemento "span" del "typingText"
    typingText.querySelectorAll("span")[0].classList.add("active");

    // Agregar un evento para enfocar el campo de entrada al presionar cualquier tecla
    document.addEventListener("keydown", () => inpField.focus());

    // Agregar un evento para enfocar el campo de entrada al hacer clic en el "typingText"
    typingText.addEventListener("click", () => inpField.focus());
}




function initTyping() {
    // Obtener los elementos span que contienen los caracteres a escribir
    let characters = typingText.querySelectorAll("span");
    // Obtener el carácter tipeado en la posición actual
    let typedChar = inpField.value.split("")[charIndex];

    // Verificar si aún hay caracteres por escribir y hay tiempo restante
    if (charIndex < characters.length && timeLeft > 0) {
        // Iniciar el temporizador si aún no se ha iniciado
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        // Verificar si el carácter tipeado es nulo
        if (typedChar == null) {
            // Retroceder una posición en el índice de caracteres
            if (charIndex > 0) {
                charIndex--;
                // Verificar si el carácter anterior contiene la clase "incorrect"
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                // Remover las clases "correct" e "incorrect" del carácter anterior
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            // Verificar si el carácter actual coincide con el carácter tipeado
            if (characters[charIndex].innerText == typedChar) {
                // Agregar la clase "correct" al carácter actual
                characters[charIndex].classList.add("correct");
            } else {
                // Incrementar el contador de errores
                mistakes++;
                // Agregar la clase "incorrect" al carácter actual
                characters[charIndex].classList.add("incorrect");
            }
            // Avanzar una posición en el índice de caracteres
            charIndex++;
        }

        // Remover la clase "active" de todos los elementos span
        characters.forEach(span => span.classList.remove("active"));
        // Agregar la clase "active" al carácter actual
        characters[charIndex].classList.add("active");

        // Calcular las palabras por minuto (wpm)
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        // Verificar si wpm es menor a 0, nulo o infinito, y establecerlo en 0 en esos casos
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;


        // Calcular la precisión
        let totalCharacters = charIndex + mistakes;
        let accuracy = 100;
        if (totalCharacters > 0) {
            accuracy = (charIndex / totalCharacters) * 100;
        }

        // Actualizar el elemento HTML con el valor de wpm
        wpmTag.innerText = wpm;
        // Actualizar el elemento HTML con el número de errores
        mistakeTag.innerText = mistakes;
        // Actualizar el elemento HTML con el número de caracteres tipeados correctamente
        cpmTag.innerText = charIndex - mistakes;

        ptsTag.innerText = calculateAdjustedScore()

    }
}


function initTimer() {
    // Verificar si queda tiempo
    if (timeLeft > 0 && !gameEnded) {
        // Reducir el tiempo restante
        timeLeft--;
        // Actualizar el elemento HTML que muestra el tiempo restante
        timeTag.innerText = timeLeft;

        // Calcular las palabras por minuto (wpm)
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        // Actualizar el elemento HTML que muestra las palabras por minuto (wpm)
        wpmTag.innerText = wpm;
    } else {
        // Si no queda tiempo, detener el temporizador
        clearInterval(timer);
    }
}



//funcion que retorna los puntos
function calculateAdjustedScore() {
    // Obtener los valores necesarios para el cálculo
    const wpm = parseInt(wpmTag.innerText);
    const cpm = parseInt(cpmTag.innerText);
    const mistakes = parseInt(mistakeTag.innerText);

    // Calcular la precisión
    const accuracy = (cpm / (cpm + mistakes)) * 100;

    // Calcular el puntaje ajustado
    let adjustedScore = wpm * (accuracy / 100);

    adjustedScore = adjustedScore.toFixed(2);

    // Devolver el puntaje ajustado
    return adjustedScore;
  }



//esta funcion se ejecuta cuando el usuario le da al boton de reinciiar y ejecuta las acciones necesarias para reinciiar el juego
function resetGame() {
    loadParagraph();
    clearInterval(timer);
    playAudio();
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    ptsTag.innerText = 0;
    document.getElementById('rbtn').style.display = 'inline-block';


}

//funcion que manda los datos al sevidor para luego mandarlos a db
function sendStatsToServer() {
    // Obtener las estadísticas del juego
    const wpm = wpmTag.innerText; // Palabras por minuto (wpm)
    const cpm = cpmTag.innerText; // Caracteres por minuto (cpm)
    const lng = name_language; // Idioma del juego
    const err = mistakeTag.innerText; // Cantidad de errores
    const points = calculateAdjustedScore(); //puntos

    // Crear una instancia de XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/game", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Definir la función que se ejecutará cuando la respuesta del servidor esté lista
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            console.log("Stats sent successfully!"); // Mostrar un mensaje de éxito en la consola
        }
    };

    // Convertir los datos a formato JSON
    const data = JSON.stringify({ wpm: wpm, cpm: cpm, lng: lng, err: err, points: points});

    // Enviar los datos al servidor
    xhr.send(data);
}


// esta funcion solo cambia el display de el boton de fin de juego de none a block para que si aparezca
  function showEndGameButton() {
    document.getElementById('endGameBtn').style.display = 'block';
    document.getElementById('rbtn').style.display = 'none';
  }

  function checkGameEnd() {
    // Verificar si el tiempo ha expirado
    const timerExpired = timeLeft === 0;
    // Verificar si se han tipeado todos los caracteres
    const allCharactersTyped = charIndex === typingText.querySelectorAll("span").length;

    // Verificar si el temporizador ha expirado o se han tipeado todos los caracteres
    if (timerExpired || allCharactersTyped) {
        // Establecer gameEnded en true para indicar que el juego ha terminado
        gameEnded = true;
        // ejecuta la funcion que hace que se muestre el boton de fin de juego
        showEndGameButton();
    }
}


//lo unico que hace eta funcion es ejecutar todas las acciones que deben ocurrir una vez se acabo la ronda
function endGame() {
    // Verificar si el juego ha terminado
    if (gameEnded) {
        // Enviar estadísticas al servidor
        sendStatsToServer();
        // Restablecer el juego
        resetGame();
        // Establecer gameEnded en false para indicar que el juego no ha terminado
        gameEnded = false;
        // Ocultar el botón de fin del juego
        document.getElementById('endGameBtn').style.display = 'none';
        //parar conometro

    }
}

function stopAudio(){
    audio.pause();
    document.getElementById('on').style.display = 'inline-block';
    document.getElementById('off').style.display = 'none';
}

function playAudio(){
    audio.play();
    document.getElementById('off').style.display = 'inline-block';
    document.getElementById('on').style.display = 'none';

}

setInterval(checkGameEnd, 500); // esta parte lo que hace es ejeccuta la funcion checkGameEnd cada medio segundo para que cuando si sea se ejecute

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);