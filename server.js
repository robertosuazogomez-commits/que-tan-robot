const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

let votes = [];
let roundNumber = 1;
let roundId = 1;
let history = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "estudiante.html"));
});

function calculateResults(values) {
  const distribution = Array(10).fill(0);

  values.forEach(vote => {
    distribution[vote - 1]++;
  });

  const average =
    values.length > 0
      ? values.reduce((sum, vote) => sum + vote, 0) / values.length
      : 0;

  return {
    total: values.length,
    average: Number(average.toFixed(1)),
    distribution
  };
}

app.get("/api/results", (req, res) => {
  res.json({
    ...calculateResults(votes),
    roundNumber,
    roundId,
    history
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    roundId,
    roundNumber
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
    success: true,
    roundId
  });
});

app.post("/api/new-round", (req, res) => {
  const current = calculateResults(votes);

  if (current.total > 0) {
    history.push({
      textNumber: roundNumber,
      total: current.total,
      average: current.average,
      distribution: current.distribution
    });
  }

  votes = [];
  roundNumber++;
  roundId++;

  res.json({
    success: true,
    roundNumber,
    roundId
  });
});

// Mantiene compatibilidad con la función anterior.
app.post("/api/reset", (req, res) => {
  votes = [];
  res.json({
    success: true,
    roundNumber,
    roundId
  });
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
