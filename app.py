from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, make_response
from flask_session import Session
from helpers import  apology, login_required
from werkzeug.security import check_password_hash, generate_password_hash
import datetime
import random
# send_attachment.py
# import necessary packages

import email as email_module
import smtplib





app = Flask(__name__)
if __name__ == '__main__':
    app.run(debug=True)

db = SQL("sqlite:///codetyper.db")

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)





@app.route("/",methods=["GET", "POST"])
def index():
    if request.method == "GET":
        return render_template("index.html")



@app.route("/login",methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return render_template("login.html")
    else:
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE name = :name",
                         name = request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/pregame")



@app.route("/register",methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name =  request.form.get("username")
        contraseña = request.form.get("password")
        confirmacion  = request.form.get("confirmation")
        correo = request.form.get("email")

        if not name or not contraseña or not confirmacion or not correo:
            return apology("Rellene todos los campos", 400)
        if contraseña != confirmacion:
            return apology("Las contraseñas ingresadas no coinciden", 400)
        hash = generate_password_hash(
            contraseña, method='pbkdf2:sha256', salt_length=8)

        #chequea si el usuario ya esta tomado
        check = db.execute("""SELECT * FROM users WHERE name = :name  """, name = name)

        if len(check) >0:
            print(check)
            return apology("El usuario ya esta tomado", 400)

        #chequea si el correo ya esta tomado
        check_email = db.execute("""SELECT * FROM users WHERE email = :email  """, email = correo)

        if len(check_email) >0:
            print(check_email)
            return apology("Ya hay una cuenta con este correo", 400)

        email_content = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Code Typers!</title>
  <style>
    /* Add any custom styling here */


    body {
      font-family: Arial, sans-serif;


    }
    .container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background: linear-gradient(25deg, #000000, #007bff);


}

.logo {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(25deg, #000000, #007bff);
}

.logo h1 {
  color: #000000;
  margin: 0;
  font-size: 24px;
  background: linear-gradient(25deg, #000000, #007bff);

}

.content {
  margin-top: 30px;
  text-decoration: bold;
  color: #ffffff;
  padding: 0 20px;

}

.content p {
  margin-bottom: 16px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
}

.signature {
  margin-top: 40px;
  text-align: right;

}

.signature p {
  margin: 0;
  text-decoration: bold;
  font-size: medium;
}
</style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>¡Bienvenido a Code Typer!</h1>
    </div>
    <div class="content">
      <p>Estimado, Codetyper</p>
      <p>¡Gracias por registrarte en Code Typers, el juego definitivo de mecanografía para entusiastas del código!</p>
      <p>Con Code Typers, podrás mejorar tus habilidades de programación mientras te diviertes y compites con otros jugadores.</p>
      <p>Prepárate para poner a prueba tu velocidad y precisión en la mecanografía al escribir líneas de código en diferentes lenguajes de programación.</p>
      <p>
      </p>
      <p>Esperamos que disfrutes jugando a Code Typers. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
      <p>¡Feliz codetyping!</p>
      <div class="signature">
        <p>El equipo de CodeTyper</p>
      </div>
    </div>
  </div>
</body>
</html>


"""
        msg = email_module.message.Message()
        msg['Subject'] = 'Bienvenido/a a CodeTyper!'
        msg['From'] = 'codetyperproject@gmail.com'
        msg['To'] = correo
        password = "grjrzarvrdrgipfd"
        msg.add_header('Content-Type', 'text/html')
        msg.set_payload(email_content, 'utf-8')  # Set the encoding to 'utf-8'

        s = smtplib.SMTP('smtp.gmail.com: 587')
        s.starttls()

        # Login Credentials for sending the mail
        s.login(msg['From'], password)

        # Encode the message as UTF-8 before sending
        s.sendmail(msg['From'], [msg['To']], msg.as_bytes())



        db.execute(
            """INSERT INTO users (name, hash, email) VALUES(:name,:hash,:email)""", name=name, hash=hash, email=correo)

        id = db.execute(
            """SELECT id FROM users WHERE name = :name  """, name=name)
        session["user_id"] = id[0]["id"]

        return redirect("/login")
    else:
        return render_template("register.html")

@app.route("/logout")
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return redirect("/")



@app.route("/pregame",methods=["GET", "POST"])
@login_required
def pregame():
    if request.method == "GET":
        user_id = session["user_id"]
        user_search = db.execute("""SELECT name FROM users WHERE id = :user""", user = user_id)
        user = user_search[0]["name"]
        return render_template("pregame.html", user = user)

    lenguaje = request.form.get("lenguaje")
    audio = request.form.get("audio")

    if not lenguaje :
        return apology("Elige un lenguaje para continuar")

    if not audio:
        return apology("Elige un genero de musica para continuar")

    lenguajes  = {
        "0": "Python",
        "1": "SQL",
        "2": "Javascript",
        "3": "C",
        "4": "Machine Code"
    }
    if lenguaje == "5":
        return apology("XD no hay Scratch")

    user_language = lenguajes[lenguaje]

    songs = [
        ['/static/lofi.mp3','/static/lofi2.mp3','/static/lofi3.mp3','/static/lofi4.mp3','/static/lofi5.mp3'],
        ['/static/hardstyle.mp3','/static/hardstyle2.mp3','/static/hardstyle3.mp3','/static/hardstyle4.mp3','/static/hardstyle5.mp3']
    ]

    song_index = random.randint(0,len(songs[int(audio)])-1)

    user_song = songs[int(audio)][song_index]

    return render_template('game.html', lenguaje  = user_language, user_selection = lenguaje, user_song = user_song )




@app.route("/game",methods=["GET", "POST"])
@login_required
def game():
    if request.method  == "GET":
        return render_template("game.html")

    #preparamos las variables para el registro
    user_id = session["user_id"]

    current_date = datetime.datetime.now()
    formatted_date = current_date.strftime("%Y-%m-%d-%H-%M")

    data = request.get_json()
    lenguaje  = data["lng"]
    wpm = data["wpm"]
    cpm = data["cpm"]
    mistakes = data["err"]
    points = data["points"]

    db.execute("""INSERT INTO leaderboard (user_id, wpm,language, date, cpm, mistakes, points)
                VALUES(:iduser, :wpm, :language, :date, :cpm, :mistakes, :points)""",
                   iduser=user_id, wpm=wpm, language=lenguaje, date=formatted_date,cpm = cpm, mistakes = mistakes, points=points)

    return render_template('pregame.html')




@app.route("/profile",methods=["GET", "POST"])
@login_required
def profile():
    #obtenemos el total de juegos jugados por el usuario
    user_id = session["user_id"]
    games_played = db.execute("""SELECT COUNT(user_id) FROM leaderboard WHERE user_id = :user_id""", user_id = user_id)

    #obtenemos el total de suma de user_wpms  lo usamos para luego sacar el promedio del usuario
    user_wpms =  db.execute("""SELECT wpm FROM leaderboard WHERE user_id =:user_id""", user_id = user_id)

    sum = 0
    for wpm in user_wpms:
        sum += int(wpm["wpm"])
    #evitar division por 0
    if sum != 0:
        average = sum / len(user_wpms)
    else:
        average = 0

    #promedio de puntos

    user_points =  db.execute("""SELECT points FROM leaderboard WHERE user_id =:user_id""", user_id = user_id)

    sum_points = 0
    for points in user_points:
        sum_points += float(points["points"])
    if sum_points != 0:
        average_points = sum_points / len(user_points)
    else:
        average_points = 0

    #buscamos el lenguaje que mas juega el usuario
    fav = db.execute(""" SELECT language, COUNT(*) FROM leaderboard WHERE user_id = :user GROUP BY language ORDER BY COUNT(*) DESC LIMIT 1""", user = user_id)

    if len(fav) == 0:
        lenguaje_fav = "N/A"
    else:
        lenguaje_fav = fav[0]["language"]

    #le mostramos las ultimas 5 partidas al usuario con sus stats

    last_games = db.execute(""" SELECT * FROM leaderboard WHERE user_id  = :user_id ORDER BY date DESC LIMIT 5 """ ,user_id = user_id)

    user_search = db.execute("""SELECT name FROM users WHERE id = :user""", user = user_id)
    user = user_search[0]["name"]

    user_total_points = db.execute(""" SELECT SUM(points) FROM leaderboard  WHERE user_id = :user """,user = user_id)
    totalpoints = user_total_points[0]["SUM(points)"]

    return render_template("profile.html",totalpoints = round(totalpoints,2),user=user, juegos= games_played[0]["COUNT(user_id)"],average = round(average,2), lenguaje_fav =lenguaje_fav, lastgames = last_games, average_points = round(average_points,2))
    



@app.route("/leaderboard",methods=["GET", "POST"])
@login_required
def leaderboard():
    if request.method == "GET":
        return render_template("leaderboard.html")

    lenguaje = request.form.get('lenguaje')
    print(lenguaje)
    top = db.execute(""" SELECT name, leaderboard.language, leaderboard.wpm,leaderboard.cpm, leaderboard.points
                FROM users
                JOIN leaderboard ON leaderboard.user_id = users.id
                WHERE leaderboard.language = :lenguaje
                ORDER BY leaderboard.points DESC LIMIT 5  """,
                lenguaje = lenguaje
                )
    return render_template("leaderboard.html", top = top)



@app.route("/color",methods=["GET", "POST"])
@login_required
def color():
    if request.method == "GET":
        return render_template("color.html")
    color1 = request.form.get('color1')
    color2 = request.form.get('color2')

    flash(color1, 'color1')  # Almacena color1 como mensaje flash
    flash(color2, 'color2')  # Almacena color2 como mensaje flash
    return render_template("color.html",color1=color1 , color2 =color2)


@app.route("/info")
@login_required
def info():
    return render_template("info.html")
