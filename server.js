const express = require("express");
const session = require("express-session");
const path = require("path");
const http = require("http"); // 📌 Faltaba importar esto
const WebSocket = require("ws");

const setupWebSocket = require("./config/websocket"); // Importar el WebSocket


const app = express();
const server = http.createServer(app); // Crear servidor HTTP
const wss = setupWebSocket(server); // Llamar a la función y pasar el servidor HTTP

const ventanillaRoutes = require("./routes/ventanillaRoute");
const usuarioRoutes = require("./routes/usuarioRoute");
const tramiteRoutes = require("./routes/tramiteRoute");
const kioskoRoutes = require("./routes/kioskoRoute");


// 📌 Configurar sesiones antes de definir las rutas
app.use(
  session({
    secret: "d8Nv9mL/SqMg6X+6G5A3HzbqzC8lXp7l", // Usa una clave fuerte
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Cambia a `true` si usas HTTPS
  })
);

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "assets")));

// Middleware para manejar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar el motor de vistas como EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ruta de inicio
app.get("/", (req, res) => {
  res.render("index"); // Esto buscará "views/index.ejs"
});

// 📌 Middleware de autenticación y autorización para /Admin/*
app.get("/Admin/*", (req, res, next) => {
  if (!req.session.id_cred) {
    return res.redirect("/"); // Si no hay sesión, redirigir al login
  }
  if (req.session.id_rol != "4") {
    return res.sendFile(path.join(__dirname, "views", "viewError", "acceso_denegado.html"));
  }
  next(); // Si pasa ambas validaciones, continúa a la ruta solicitada
});

app.get("/Recpcionista/*", (req, res, next) => {
  if (!req.session.id_cred) {
    return res.redirect("/"); // Si no hay sesión, redirigir al login
  }  
  if (req.session.id_rol != "2") {
    return res.sendFile(path.join(__dirname, "views", "viewError", "acceso_denegado.html"));
  }
  next(); // Si pasa ambas validaciones, continúa a la ruta solicitada
});

app.get("/Encargado/*", (req, res, next) => {
  if (!req.session.id_cred) {
    return res.redirect("/"); // Si no hay sesión, redirigir al login
  }  
  if (req.session.id_rol != "3") {
    return res.sendFile(path.join(__dirname, "views", "viewError", "acceso_denegado.html"));
  }
  next(); // Si pasa ambas validaciones, continúa a la ruta solicitada
});


app.get("/UsuPerfil/", (req, res, next) => {
  if (!req.session.id_cred) {
    return res.redirect("/"); // Si no hay sesión, redirigir al login
  }
  next(); // Si pasa ambas validaciones, continúa a la ruta solicitada
});

// Rutas de vistas ADMIN
app.get("/Admin/UsuHomeAministrador", (req, res) => {
  res.render("Admin/UsuHomeAministrador/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/Admin/MntUsuario", (req, res) => {
  res.render("Admin/MntUsuario/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/Admin/MntVentanilla", (req, res) => {
  res.render("Admin/MntVentanilla/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/Admin/MntTramite", (req, res) => {
  res.render("Admin/MntTramite/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/UsuPerfil", (req, res) => {
  res.render("UsuPerfil/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});



/// RUTAS DE VISTAS RECEPCIONISTAS


// Rutas de vistas
app.get("/Recpcionista/GstTurnos", (req, res) => {
  res.render("Recpcionista/GstTurnos/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/Recpcionista/UsuHome", (req, res) => {
  res.render("Recpcionista/UsuHome/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

// RUTAS DE VISTAS PANTALLA CIUDADANO
app.get("/Ciudadano/Kiosco", (req, res) => {
  res.render("Ciudadano/Kiosco/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});

app.get("/Ciudadano/Pantalla", (req, res) => {
  res.render("Ciudadano/Pantalla/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});


///// ENCARGADO O JEFE DE AREA

app.get("/Encargado/UsuHome", (req, res) => {
  res.render("Encargado/UsuHome/index", { 
    id_rol: req.session.id_rol, 
    id_cred: req.session.id_cred,
    per_nom: req.session.per_nom,
    per_ape_pa: req.session.per_ape_pa,
    per_ape_ma: req.session.per_ape_ma
  });
});






// 📌 Ruta de login con sesión corregida
app.get("/login", (req, res) => {
  const mensaje = req.session.mensaje || "";
  const tipoAlerta = req.session.tipoAlerta || "danger";

  // Limpiar el mensaje después de renderizar la vista
  req.session.mensaje = null;
  req.session.tipoAlerta = null;

  res.render("login", { mensaje, tipoAlerta });
});

// Rutas de la API

app.use("/usuario", usuarioRoutes);
app.use("/tramite", tramiteRoutes);
app.use("/ventanilla", ventanillaRoutes);
app.use("/kiosko", kioskoRoutes);



// Página de error 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "viewError", "error.html"));
});

// 📌 Levantar el servidor correctamente con WebSockets
const PORT = process.env.PORT || 3000;

const IP = "localhost";


server.listen(PORT, () => {
const IP = "localhost";
  console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});
