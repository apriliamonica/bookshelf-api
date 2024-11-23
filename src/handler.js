const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading,
      };
     
      notes.push(newBook);
    
      const isSuccess = books.filter((book) => book.id === id).length > 0;
      if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            noteId: id,
          },
        });
        response.code(201);
        return response;
      }
     
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;

};

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
      books,
    },
  });

  const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];
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
        const { bookId} = request.params;
       
        const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        const updatedAt = new Date().toISOString();
       
        const index = books.findIndex((book) => book.id === id);
       
        if (index !== -1) {
            books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading
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

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler};