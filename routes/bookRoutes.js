import express from 'express'
import { createBook, getAllBooks, getBookById, updateBookbyId, deleteBookById } from '../controllers/bookController.js'

const bookRoutes = express.Router()

// Rutas de libros
bookRoutes.post('/', createBook)
bookRoutes.get('/', getAllBooks)
bookRoutes.get('/:id', getBookById)
bookRoutes.patch('/:id', updateBookbyId)
bookRoutes.delete('/:id', deleteBookById)

export default bookRoutes
