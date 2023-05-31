// Importar las bibliotecas y módulos necesarios
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors')
const app = express();
const PORT = 4000;
app.use(cors({
  origin: '*'
}));
// Configurar el middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta de autenticación
app.post("/login", async (req, res) => {
  try {
    // Obtener el correo electrónico y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    
    // Simulando la consulta a la base de datos
    const user = {
      userID: '2121335',
      tipo: 'USER',
      name: 'Apri',
      picture: '/placeholders/profile-photo.jpg',
      email: 'example@example.com',
      passwordHash: '$2b$10$YtKdF4rI3JZMUvVXMzjJOO4ONH71y.b.FYkve6Tl.qIRcAj3DE2Iu' // Contraseña: "password"
    };

    // Verificar la contraseña proporcionada
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar el token de autenticación
    const token = jwt.sign({ userID: user.userID }, "secreto", { expiresIn: "1h" });

    // Enviar la respuesta con el token y los datos del usuario
    return res.json({
      token,
      userID: user.userID,
      tipo: user.tipo,
      name: user.name,
      picture: user.picture
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ error: "Token de autenticación no proporcionado" });
  }

  jwt.verify(token, "secreto", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token de autenticación inválido" });
    }

    req.user = user;
    next();
  });
};

// Ruta protegida que requiere autenticación
app.get("/home", authenticateToken, (req, res) => {
  
  res.json({ message: "Bienvenido a la página de inicio" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
