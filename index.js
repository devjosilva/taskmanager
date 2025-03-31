const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 
let tasks = [
  { id: 1, title: 'Aprender Docker', completed: false },
  { id: 2, title: 'Configurar Jenkins', completed: false },
  { id: 3, title: 'Implementar CI/CD', completed: false }
];


// Rutas
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  
  res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ message: 'El título es requerido' });
  }
  
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: newId, title, completed: false };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  
  tasks[taskIndex] = { 
    ...tasks[taskIndex], 
    ...(title && { title }), 
    ...(completed !== undefined && { completed }) 
  };
  
  res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Tarea no encontrada' });
  }
  
  const deletedTask = tasks[taskIndex];
  tasks = tasks.filter(t => t.id !== id);
  
  res.json(deletedTask);
});

// Ruta validacion
app.get('/', (req, res) => {
  res.json({ status: 'API funcionando correctamente' });
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
