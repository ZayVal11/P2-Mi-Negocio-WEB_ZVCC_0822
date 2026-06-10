const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Permite que tu index.html (aunque se abra como archivo local) consulte la API
app.use(cors());
app.use(express.json());

// ==========================================
// ⚠️ REEMPLAZA CON TU CADENA DE CONEXIÓN DE MONGODB ATLAS
// ==========================================
const MONGO_URI = "tu_cadena_de_conexion_de_mongodb_atlas_aqui";

mongoose.connect(MONGO_URI)
    .then(() => console.log("🚀 Conectado con éxito a MongoDB Atlas"))
    .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// ==========================================
// DEFINICIÓN DE MODELOS (Mapeados a tus colecciones)
// ==========================================

const Consultorio = mongoose.model('Consultorio', new mongoose.Schema({
    turno: String, horario: String, tel: String, vet: String
}, { collection: 'consultorios' }));

const Medico = mongoose.model('Medico', new mongoose.Schema({
    nombre: String, especialidad: String, turno: String, cedula: String, tel: String
}, { collection: 'medicos' }));

const Mascota = mongoose.model('Mascota', new mongoose.Schema({
    nombre: String, especie: String, raza: String, fecha: String, sexo: String, id_dueno: String,
    caracteristicas: { color: String, peso: String }
}, { collection: 'mascotas' }));

const Dueno = mongoose.model('Dueno', new mongoose.Schema({
    nombre: String, direccion: String, tel: String, email: String, rfc: String, nombre_mascota: String
}, { collection: 'duenos' }));

const Consulta = mongoose.model('Consulta', new mongoose.Schema({
    medico: String, nombre: String, fecha: String, hora: String, id_vet: String, estado: String
}, { collection: 'consultas' }));

// ==========================================
// RUTAS API (GET)
// ==========================================

app.get('/api/consultio', async (req, res) => {
    try { res.json(await Consultorio.find()); } catch (err) { res.status(500).json(err); }
});

app.get('/api/medicos', async (req, res) => {
    try { res.json(await Medico.find()); } catch (err) { res.status(500).json(err); }
});

app.get('/api/mascotas', async (req, res) => {
    try { res.json(await Mascota.find()); } catch (err) { res.status(500).json(err); }
});

app.get('/api/duenos', async (req, res) => {
    try { res.json(await Dueno.find()); } catch (err) { res.status(500).json(err); }
});

app.get('/api/consultas', async (req, res) => {
    try { res.json(await Consulta.find()); } catch (err) { res.status(500).json(err); }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});