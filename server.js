const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb+srv://ShiroKuro:ZayVal11@shirokuro.31ethad.mongodb.net/?appName=ShiroKuro";

mongoose.connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));


// 1. Colección: consultas
const consultaSchema = new mongoose.Schema({
    _id: String,       // PET-901, PET-1234, etc.
    medico: String,    // Dante Escam, Marina Coral, etc.
    nombre: String,    // Apolo, Bolo, Copa, etc.
    fecha: String,     // DD/MM/YY
    hora: String,      // 10am, 3:30pm, etc.
    id_vet: String,    // VET-005, VET-002, etc.
    estado: String     // Pendiente, Completa
}, { versionKey: false });

const Consulta = mongoose.model('Consulta', consultaSchema, 'consultas');

// 2. Colección: consultorio 
const consultorioSchema = new mongoose.Schema({
    _id: String,       // VET-001, VET-002, etc.
    turno: String,     // Matutino, Vespertino, Nocturno
    horario: String,   // 9am - 2pm, etc.
    tel: String,       // Número telefónico largo
    vet: String        // Alistair Paws, Marina Coral, etc.
}, { versionKey: false });

const Consultorio = mongoose.model('Consultorio', consultorioSchema, 'consultorio');

// 3. Colección: duenos
const duenoSchema = new mongoose.Schema({
    _id: String,             // CL-0042, CL-12545, etc.
    nombre: String,          // Valeria Martinez, etc.
    direccion: String,       // Av. Insurgentes #123, etc.
    tel: String,             // Número telefónico
    email: String,           // val@gmail.com, etc.
    rfc: String,             // MASV850520, etc.
    nombre_mascota: String   // Apolo, Bola, Copo, etc.
}, { versionKey: false });

const Dueno = mongoose.model('Dueno', duenoSchema, 'duenos');

// 4. Colección: mascotas 
const mascotaSchema = new mongoose.Schema({
    _id: String,          // PET-9901, PET-1234, etc.
    nombre: String,       // Apolo, Bolo, Copo, etc.
    especie: String,      // Canino, Gato, Loro, Erizo, etc.
    raza: String,         // Golden Retriever, Persa, etc.
    fecha: String,        // Fecha de nacimiento DD/MM/YY
    sexo: String,         // M / H
    id_dueno: String,     // CL-0042, CL-12545, etc.
    caracteristicas: {    // Objeto incrustado {"color":"Dorado","peso":"41kg"}
        color: String,
        peso: String
    }
}, { versionKey: false });

const Mascota = mongoose.model('Mascota', mascotaSchema, 'mascotas');

// 5. Colección: medicos 
const medicoSchema = new mongoose.Schema({
    _id: String,            // VET-001, VET-002, etc.
    nombre: String,         // Dr. Alistair Paws, etc.
    especialidad: String,   // Cirugía, Dermatología, etc.
    turno: String,          // Matutino, Vespertino, Nocturno
    cedula: String,         // 12345-IMAG, etc.
    tel: String             // Número telefónico
}, { versionKey: false });

const Medico = mongoose.model('Medico', medicoSchema, 'medicos');

const mapearModelos = {
    'consultas': Consulta,
    'consultorio': Consultorio,
    'duenos': Dueno,
    'mascotas': Mascota,
    'medicos': Medico
};

app.get("/api", (req, res) => {
    res.json({ mensaje: "API de la veterinaria ShiroKuro" });
});

// GET: Obtener todos los registros de una colección
app.get('/api/:coleccion', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección veterinaria no encontrada" });

    try {
        const datos = await Modelo.find();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Insertar o actualizar documentos de la veterinaria
app.post('/api/:coleccion', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección veterinaria no encontrada" });

    try {
        const { _id } = req.body;
        const documento = await Modelo.findByIdAndUpdate(_id, req.body, { new: true, upsert: true });
        res.json({ mensaje: "Sincronizado correctamente en la base ShiroKuro", documento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Eliminar un registro veterinario por IDS
app.delete('/api/:coleccion/:id', async (req, res) => {
    const Modelo = mapearModelos[req.params.coleccion];
    if (!Modelo) return res.status(404).json({ error: "Colección veterinaria no encontrada" });

    try {
        await Modelo.findByIdAndDelete(req.params.id);
        res.json({ mensaje: `Registro ${req.params.id} eliminado correctamente.` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 🚀 ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend ShiroKuro activo en el puerto ${PORT}`);
});