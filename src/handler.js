const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  try {
    const {
      name, year, author, summary, publisher,
      pageCount, readPage, reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    books.push(newBook);

    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  } catch (error) {
    return h.response({ msg: error.message }).code(500);
  }
};

const getAllBooksHandler = (request, h) => {
  try {
    const formattedBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));

    const response = {
      status: 'success',
      data: {
        books: formattedBooks,
      },
    };

    return h.response(response).code(200);
  } catch (error) {
    return h.response({ msg: error.message }).code(500);
  }
};

const getBookByIDHandler = (request, h) => {
  try {
    const { id } = request.params;

    const book = books.find((b) => b.id === id);

    if (!book) {
      return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      }).code(404);
    }

    const response = {
      status: 'success',
      data: {
        book,
      },
    };

    return h.response(response).code(200);
  } catch (error) {
    return h.response({ msg: error.message }).code(500);
  }
};

const updateBookHandler = (request, h) => {
  try {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();

    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    }

    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }

    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  } catch (error) {
    return h.response({ msg: error.message }).code(500);
  }
};

const deleteBookHandler = (request, h) => {
  try {
    const { id } = request.params;
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      }).code(404);
    }

    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  } catch (error) {
    return h.response({ msg: error.message }).code(500);
  }
};

module.exports = {
  addBooksHandler,
  deleteBookHandler,
  updateBookHandler,
  getAllBooksHandler,
  getBookByIDHandler,
};
