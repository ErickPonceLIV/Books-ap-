import Author from '../models/Author.js'
import Book from '../models/Book.js'

// CREATE
const createBook = async (req, res) => {
  const bookData = req.body
  // Validaciones
  // Validar que el body no venga vacio
  if (Object.keys(bookData).length === 0) {
    return res.status(400).json({ message: 'Body is empty' })
  }
  // Validar que authors sea un arreglo
  if (!Array.isArray(bookData.authors)) {
    return res.status(400).json({ message: 'Authors must be an array' })
  }
  // Validar que authors tenga al menos un autor
  if (bookData.authors.length === 0) {
    return res.status(400).json({ message: 'Authors must have at least one author' })
  }

  // Crear autores, uno por uno y esperar a que todos se hayan creado en la colección.
  try {
    const authorModels = await Promise.all(bookData.authors.map(async author => {
      // Si el autor ya existe, devolverlo; sino crearlo.
      const existingAuthor = await Author.findOne({ firstName: author.firstName, lastName: author.lastName, birthDate: author.birthDate })

      if (existingAuthor) {
        return existingAuthor
      }

      // Si el autor no existe, se crea uno nuevo.
      const newAuthor = new Author(author)
      return await Author.create(newAuthor)
    }))

    // Como ya guardamos a los autores, ya podemos asignarlos al libro. Y para ello necesitamos los ObjectID (_id) de los autores.
    bookData.authors = authorModels.map(author => author._id)

    // Crear el libro con los ids de los autores.
    const newBook = await Book.create(bookData)
    res.status(201).json(newBook)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// READ
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true }).populate('authors', 'firstName lastName bio birthDate -_id')
    // Validamos que no existan libros
    if (!books) {
      return res.status(404).json({ message: 'No books found' })
    }
    res.status(200).json(books)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
// Obtener un solo libro por ID
const getBookById = async (req, res) => {
  // Validamos que el ID se un ObjectId de mongoDB (24 caracteres alfanumericos en hexadecimal)
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }
  try {
    const book = await Book
      .find({ _id: req.params.bookId, isActive: true })
      .populate('authors', 'firstName lastName bio birthDate -_id')
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// UPDATE
const updateBook = async (req, res) => {
  if (!req.params.bookId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }
  try {
    const book = await Book
      .findByIdAndUpdate(req.params.bookId, req.body, { new: true })
      .populate('authors', 'firstName lastName bio birthDate -_id')
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE

export {
  createBook,
  getAllBooks,
  getBookById,
  updateBook
}
