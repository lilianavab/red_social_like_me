import express from 'express';
const app = express();
console.clear()
// Creación de variables de entorno
import { fileURLToPath } from 'url'
import { dirname } from "path";

// Variables que me permiten mostrar el path donde estoy en el proyecto
const __filename = fileURLToPath( import.meta.url )
const __dirname = dirname( __filename )

// Importamos nuestras consultas
import {
    insertarPost,
    mostrarPosts,
    actualizarLike
  
} from './consultas.js'

// Creamos nuestro Meddleware para trae un objeto json
app.use(express.json());

app.get('/', (req, res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.post('/post', async(req, res) => {
    try {
        const response = await insertarPost( req.body )
        res.status(200).json( {respuesta : 'OKEY', data:response.rows, rowCount:response.rowCount} )
    } catch (error) {
        console.error('Error al realizar el insert de datos', error)
    }
})

app.put('/post', async( req, res) => {
    try {
        console.log('Salida de post query-->',  req.query.id )
        const response = await actualizarLike( req.query.id  )
        res.status(200).json( { respuesta : 'OKEY', data:response } )
    } catch (error) {
        console.error('Error al realizar la actualización del like:', error)
    }
})

app.get('/posts', async(req, res) => {
    try {
        const response = await mostrarPosts()
        res.status(200).json( response.rows )
    } catch (error) {
        console.error('Error al realizar el insert de datos', error)
    }
})

app.listen(3000, () => console.log( 'Server arriba en el puerto 3000'))