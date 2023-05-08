const express = require('express')
const {v4: uuid} = require("uuid");
const router = express.Router()
const fileMulter = require('../middleware/file')
const path = require('path')
const http = require('http')
const Book = require('../models/book')

function incr(bookID) {
    return fetch(`http://counter:3001/counter/${bookID}/incr`,
        {method: 'post'})
}

function dataBase(bookID) {
    const url = `http://counter:3001/counter/${bookID}`

    return new Promise((resolve, reject) => {
        http.get(url, (res) => {

            let data = ''
            res
                .on('data', (chunk) => data += chunk)
                .on('end', async () => {
                    let parseData = JSON.parse(data)
                    const book = await Book.findById(bookID)
                    book.views = parseData.cnt
                    console.log('dataBase book.views: ', book.views) //del
                    resolve()
                })

        }).on('error', (err) => {
            console.error(err)
            reject()
        })

    })
}
// class Book {
//     constructor(title = 'string', description = 'string', authors = 'string', favorite = true, fileCover = 'string', fileName = 'string', fileBook = "string", views = 0, id = uuid()) {
//         {
//             this.id = id
//             this.title = title
//             this.description = description
//             this.authors = authors
//             this.favorite = favorite
//             this.fileCover = fileCover
//             this.fileName = fileName
//             this.fileBook = fileBook
//             this.views = views
//         }
//     }
// }

// const store = {
//     books: [
//         {
//             id: '1',
//             title: "test.1",
//             description: "test.1",
//             authors: "test.1",
//             favorite: "test.1",
//             fileCover: "test.1",
//             fileName: "test.1",
//             fileBook: "test.1",
//             views: 0,
//         },
//         {
//             id: '2',
//             title: "test.2",
//             description: "test.2",
//             authors: "test.2",
//             favorite: "test.2",
//             fileCover: "test.2",
//             fileName: "test.2",
//             fileBook: "test.2",
//             views: 0,
//         },
//     ]
// }

router.post('/api/user/login', (req, res) => {
    res
        .status(201)
        .json({id: 1, mail: "test@mail.ru"})
})

router.post('/api/create', fileMulter.single('book'), async (req, res) => {
    const {title, description, author} = req.body
    const newBook = new Book({title, description, author})

    try {
        await newBook.save()
        res
            .status(201)
            .redirect('/api/books')

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.get('/api/create', (req, res) => {
    res.render("books/create", {
        title: "Новая книга",
        description: "Описание книги",
        author: "Автор книги",
    });
});

router.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find().select('-__v')
        res.render('books/index', {
            title: "Главная страница",
            books: books,
        })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

router.get('/api/books/:id', async (req, res) => {
    const {id} = req.params
    try {
        const book = await Book.findById(id).select('-__v')
        console.log('router.get book', book)

        await incr(book._id)
        await dataBase(book._id)
        console.log('router.get book.views', book.views)

        res.render('books/view', {
            title: book.title,
            description: book.description,
            views: book.views,
        })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

})

router.get('/api/update/:id', (req, res) => {
    const {books} = store
    const {id} = req.params
    const bookIndex = books.findIndex(book => book.id === id)

    if (bookIndex === -1) {
        res.redirect('/404')
    }

    res.render('books/update', {
        title: "Новая книга",
        description: "Описание книги",
        author: "Автор книги",
    })
})

router.put('/api/update/:id', fileMulter.single('book'), async (req, res) => {
    const {id} = req.params
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    try {
        await Book.findByIdAndUpdate(id, {title, description, authors, favorite, fileCover, fileName, fileBook})
        res.redirect(`/api/books/${id}`)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }

})

router.delete('/api/books/:id', async (req, res) => {
    const {id} = req.params
    try {
        await Book.deleteOne({_id: id})
        res.json(true)
        res.redirect('/api/books')
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }


})

router.get('/api/books/:id/download', (req, res) => {
    const {id} = req.params
    const {books} = store
    const bookIndex = books.findIndex(book => book.id === id)

    if (bookIndex === -1) {
        res
            .status(404)
            .redirect('/404')
    } else {
        const {fileName} = books[bookIndex]
        res.download(path.join(__dirname, 'books', fileName), fileName)
    }
})

module.exports = router
