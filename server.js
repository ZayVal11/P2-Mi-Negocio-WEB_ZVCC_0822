const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


// ==========================================
// 1. CONEXIÓN A MONGODB ATLAS
// ==========================================
// Cadena de conexión limpia apuntando a tu base de datos 'ShiroKuro'
const mongoURI = 'mongodb+srv://ShiroKuro:ZayVal11@shirokuro.31ethad.mongodb.net/ShiroKuro?retryWrites=true&w=majority&appName=ShiroKuro';


mongoose.connect(mongoURI)
    .then(() => {
        console.log('======================================================');
        console.log('✅ ¡CONECTADO CON ÉXITO A MONGODB ATLAS EN LA NUBE!');
        console.log("YA PRENDIO TÚ, MIRA NOMAS ESTE TRABAJO CUACHE");
        console.log('======================================================');
    })
    .catch(err => {
        console.error('❌ NO PRENDIO TÚ, NO JALA TLACUA :', err.message);
    });


// ==========================================
// 2. MODELOS CON LOS NOMBRES EXACTOS DE TU ATLAS
// ==========================================


// --- Consultorios ---
const consultorioSchema = new mongoose.Schema({
    _id: String,
    turno: String,
    horario: String,
    tel: String,
    vet: String
}, { versionKey: false });
const Consultorio = mongoose.model('Consultorio', consultorioSchema, 'consultorio');


// --- Médicos (Apuntando a la colección con acento que tiene tus 10 registros) ---
const medicoSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    especialidad: String,
    turno: String,
    cedula: String,
    tel: String
}, { versionKey: false });
const Medico = mongoose.model('Medico', medicoSchema, 'médicos');


// --- Mascotas ---
const mascotaSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    especie: String,
    raza: String,
    fecha: String,
    sexo: String,
    id_dueno: String,
    caracteristicas: {
        color: String,
        peso: String
    }
}, { versionKey: false });
const Mascota = mongoose.model('Mascota', mascotaSchema, 'mascotas');


// --- Dueños ---
const duenoSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    direccion: String,
    tel: String,
    email: String,
    rfc: String,
    nombre_mascota: String
}, { versionKey: false });
const Dueno = mongoose.model('Dueno', duenoSchema, 'duenos');


// --- Consultas ---
const consultaSchema = new mongoose.Schema({
    _id: String,
    nombre: String,
    fecha: String,
    hora: String,
    id_vet: String,
    estado: String,
    medico: String
}, { versionKey: false });
const Consulta = mongoose.model('Consulta', consultaSchema, 'consultas');


// ==========================================
// 3. CONTROLADORES DE DATOS
// ==========================================
const obtenerRegistros = async (Modelo, res) => {
    try {
        const documentos = await Modelo.find();
        res.status(200).json(documentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const guardarRegistro = async (Modelo, req, res) => {
    try {
        const datos = req.body;
        const documento = await Modelo.findOneAndUpdate(
            { _id: datos._id },
            datos,
            { new: true, upsert: true }
        );
        res.status(200).json(documento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const eliminarRegistro = async (Modelo, req, res) => {
    try {
        await Modelo.findByIdAndDelete(req.params.id);
        res.status(200).json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ==========================================
// 4. RUTAS (ENDPOINTS PARA EL INDEX.HTML)
// ==========================================
app.get('/api/consultio', (req, res) => obtenerRegistros(Consultorio, res));
app.post('/api/consultio', (req, res) => guardarRegistro(Consultorio, req, res));
app.delete('/api/consultio/:id', (req, res) => eliminarRegistro(Consultorio, req, res));


app.get('/api/medicos', (req, res) => obtenerRegistros(Medico, res));
app.post('/api/medicos', (req, res) => guardarRegistro(Medico, req, res));
app.delete('/api/medicos/:id', (req, res) => eliminarRegistro(Medico, req, res));


app.get('/api/mascotas', (req, res) => obtenerRegistros(Mascota, res));
app.post('/api/mascotas', (req, res) => guardarRegistro(Mascota, req, res));
app.delete('/api/mascotas/:id', (req, res) => eliminarRegistro(Mascota, req, res));


app.get('/api/duenos', (req, res) => obtenerRegistros(Dueno, res));
app.post('/api/duenos', (req, res) => guardarRegistro(Dueno, req, res));
app.delete('/api/duenos/:id', (req, res) => eliminarRegistro(Dueno, req, res));


app.get('/api/consultas', (req, res) => obtenerRegistros(Consulta, res));
app.post('/api/consultas', (req, res) => guardarRegistro(Consulta, req, res));
app.delete('/api/consultas/:id', (req, res) => eliminarRegistro(Consulta, req, res));


// ==========================================
// 5. ARRANCAR EN PUERTO 3000
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Shirokuro corriendo en http://localhost:${PORT}`);
});



