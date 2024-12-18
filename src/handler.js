const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
      };

      if (!name) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
      }

      if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
      }
     
      books.push(newBook);
      const isSuccess = books.filter((book) => book.id === id).length > 0;
      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
      }
     
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(400);
      return response;

};

const getAllBooksHandler = (request, h) => 
{ 
  let filtered = books;
  if (request.query.name) {
    const nameQuery = request.query.name.toLowerCase();
    filtered = filtered.filter(({ name }) => name.toLowerCase().includes(nameQuery));
  }
  
  if (request.query.reading) {
    filtered = filtered.filter(({ reading }) => reading === (request.query.reading === '1'));
  }
  
  if ('finished' in request.query) {
    const isFinished = request.query.finished === '1';
    filtered = filtered.filter(({ readPage, pageCount }) => isFinished === (readPage === pageCount));
  }
  
  const response = h.response({
    status: 'success',
    data: {
      books: filtered.map(({ id, name, publisher }) =>({ id, name, publisher })
    ),
    },
  });
  response.code(200);
  return response;
};

  const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((n) => n.id === bookId)[0];
    if (book !== undefined) {
        return {
          status: 'success',
          data: {
            book,
          },
        };
      }
     
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    };

    const editBookByIdHandler = (request, h) => {
        const { bookId } = request.params;
       
        const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        const updatedAt = new Date().toISOString();

        if (!name) {
          const response = h.response({ 
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
          });
          response.code(400);
          return response;
        }

        if (readPage > pageCount) {
          const response = h.response({ 
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
          });
          response.code(400);
          return response;
        }
       
        const index = books.findIndex((book) => book.id === bookId);
       
        if (index !== -1) {
            books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
          };
       
          const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
          });
          response.code(200);
          return response;
        }
       
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
      };


      const deleteBookByIdHandler = (request, h) => {
        const { bookId: id } = request.params;
       
        const index = books.findIndex((book) => book.id === id);
       
        if (index !== -1) {
          books.splice(index, 1);
          const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
          });
          response.code(200);
          return response;
        }
       
      const response = h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
      };

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};