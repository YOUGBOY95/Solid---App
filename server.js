const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Configuration pour gérer le stockage avec Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Interface principale pour l'upload
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour gérer l'upload
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Fichier uploadé : ", req.file);

  // Rediriger vers la page pour voir les fichiers uploadés
  res.redirect("/files");
});

// Route pour afficher les fichiers uploadés
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.error("Erreur de lecture du répertoire", err);
      res.status(500).send("Erreur serveur");
      return;
    }

    // Construire le chemin complet pour chaque fichier
    const fileList = files.map(file => `/uploads/${file}`);
    res.render("files", { files: fileList });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
