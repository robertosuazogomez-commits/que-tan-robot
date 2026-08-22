const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let votes = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/results", (req, res) => {
  const distribution = Array(10).fill(0);

  votes.forEach(vote => {
    distribution[vote - 1]++;
  });

  const average =
    votes.length > 0
      ? votes.reduce((sum, vote) => sum + vote, 0) / votes.length
      : 0;

  res.json({
    total: votes.length,
    average: Number(average.toFixed(1)),
    distribution
  });
});

app.post("/api/vote", (req, res) => {
  const value = Number(req.body.value);

  if (!Number.isInteger(value) || value < 1 || value > 10) {
    return res.status(400).json({
      error: "La respuesta debe ser un número entre 1 y 10."
    });
  }

  votes.push(value);

  res.json({
    success: true
  });
});

app.post("/api/reset", (req, res) => {
  votes = [];

  res.json({
    success: true
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
