const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARES
app.use(cors()); // Permite que index.html se comunique con el servidor desde puertos diferentes
app.use(express.json()); // Permite recibir datos en formato JSON

// 2. CONEXIÓN A MONGODB ATLAS
// REEMPLAZA esta URL por tu propia cadena de conexión de MongoDB Atlas
const MONGO_URI = "tu_cadena_de_conexion_de_mongodb_atlas_aqui";

mongoose.connect(MONGO_URI)
    .then(() => console.log("¡Conexión exitosa a MongoDB Atlas!"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

// 3. DEFINICIÓN DE ESQUEMAS Y MODELOS (Basados en las colecciones de tu app)

// Modelo Consultorios
const ConsultorioSchema = new mongoose.Schema({
    turno: String,
    horario: String,
    tel: String,
    vet: String
}, { collection: 'consultorios' }); // Especifica el nombre exacto de la colección en Atlas
const Consultorio = mongoose.model('Consultorio', ConsultorioSchema);

// Modelo Médicos
const MedicoSchema = new mongoose.Schema({
    nombre: String,
    especialidad: String,
    turno: String,
    cedula: String,
    tel: String
}, { collection: 'medicos' });
const Medico = mongoose.model('Medico', MedicoSchema);

// Modelo Mascotas
const MascotaSchema = new mongoose.Schema({
    nombre: String,
    especie: String,
    raza: String,
    fecha: String,
    sexo: String,
    id_dueno: String,
    caracteristicas: {
        color: String,
        peso: String,
        tamano: String,
        complexion: String,
        alimentacion: String
    }
}, { collection: 'mascotas' });
const Mascota = mongoose.model('Mascota', MascotaSchema);

// Modelo Dueños
const DuenoSchema = new mongoose.Schema({
    nombre: String,
    direccion: String,
    tel: String,
    email: String,
    rfc: String,
    nombre_mascota: String
}, { collection: 'duenos' });
const Dueno = mongoose.model('Dueno', DuenoSchema);

// Modelo Consultas
const ConsultaSchema = new mongoose.Schema({
    medico: String,
    nombre: String,
    fecha: String,
    hora: String,
    id_vet: String,
    estado: String
}, { collection: 'consultas' });
const Consulta = mongoose.model('Consulta', ConsultaSchema);


// 4. RUTAS DE LA API (GET para leer datos y renderizarlos en las tablas)

app.get('/api/consultio', async (req, res) => {
    try {
        const datos = await Consultorio.find();
        res.json(datos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/medicos', async (req, res) => {
    try {
        const datos = await Medico.find();
        res.json(datos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/mascotas', async (req, res) => {
    try {
        const datos = await Mascota.find();
        res.json(datos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/duenos', async (req, res) => {
    try {
        const datos = await Dueno.find();
        res.json(datos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/consultas', async (req, res) => {
    try {
        const datos = await Consulta.find();
        res.json(datos);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. ENCENDER EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});