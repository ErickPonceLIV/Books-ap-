import express from 'express'
import { createBook, getAllBooks, getBookById, updateBookbyId } from '../controllers/bookController.js'

const bookRoutes = express.Router()

// Rutas de libros
bookRoutes.post('/', createBook)
bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:id', getBookById)
bookRoutes.patch('/:id', updateBookbyId)

export default bookRoutes
