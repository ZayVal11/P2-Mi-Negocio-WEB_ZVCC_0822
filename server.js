const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// CADENA DE CONEXIÓN LARGA (Evita los bloqueos de DNS y puertos srv de tu proveedor de red)
const MONGO_URI = "mongodb://ShiroKuro:ZayVal11@shirokuro-shard-00-00.31ethad.mongodb.net:27017,shirokuro-shard-00-01.31ethad.mongodb.net:27017,shirokuro-shard-00-02.31ethad.mongodb.net:27017/ShiroKuro?ssl=true&replicaSet=atlas-139iio-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("==================================================");
        console.log("🚀 ¡CONEXIÓN ESTABLECIDA CON ÉXITO A MONGO DB ATLAS!");
        console.log("==================================================");
    })
    .catch(err => {
        console.log("==================================================");
        console.log("❌ ERROR CRÍTICO DE RED:", err.message);
        console.log("==================================================");
    });

// CONFIGURACIÓN DE MODELOS CON ESQUEMAS ADAPTADOS
const Consultorio = mongoose.model('Consultorio', new mongoose.Schema({
    _id: String, turno: String, horario: String, tel: String, vet: String
}, { collection: 'consultorios', versionKey: false }));

const Medico = mongoose.model('Medico', new mongoose.Schema({
    _id: String, nombre: String, especialidad: String, turno: String, cedula: String, tel: String
}, { collection: 'medicos', versionKey: false }));

const Mascota = mongoose.model('Mascota', new mongoose.Schema({
    _id: String, nombre: String, especie: String, raza: String, fecha: String, sexo: String, id_dueno: String,
    caracteristicas: { color: String, peso: String }
}, { collection: 'mascotas', versionKey: false }));

const Dueno = mongoose.model('Dueno', new mongoose.Schema({
    _id: String, nombre: String, direccion: String, tel: String, email: String, rfc: String, nombre_mascota: String
}, { collection: 'duenos', versionKey: false }));

const Consulta = mongoose.model('Consulta', new mongoose.Schema({
    _id: String, medico: String, nombre: String, fecha: String, hora: String, id_vet: String, estado: String
}, { collection: 'consultas', versionKey: false }));

// RUTAS API ENLAZADAS CON TU FRONTEND
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
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});