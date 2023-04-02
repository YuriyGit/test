const express = require('express')
const {v4: uuid} = require("uuid");
const router = express.Router()
const fileMulter = require('../middleware/file')
const path = require('path')
const http = require('http')

function incr(bookID) {
    fetch(`http://counter:3001/counter/${bookID}/incr`,
        {method: 'post'})
}

 function dataBase(bookID) {
    const url = `http://counter:3001/counter/${bookID}`

     http.get(url, (res) => {
        let data = ''

        res
            .on('data', (chunk) => data += chunk)
            .on('end', () => {
                let parseData = JSON.parse(data);
                const {books} = store;
                const bookIndex  = books.findIndex(book => book.id === bookID)
                books[bookIndex].views = parseData.cnt
            })
    }).on('error', (err) => {
        console.error(err)
    })
}

class Book {
    constructor(title = 'string', description = 'string', authors = 'string', favorite = true, fileCover = 'string', fileName = 'string', fileBook = "string", views = 0, id = uuid()) {
        {
            this.id = id
            this.title = title
            this.description = description
            this.authors = authors
            this.favorite = favorite
            this.fileCover = fileCover
            this.fileName = fileName
            this.fileBook = fileBook
            this.views = views
        }
    }
}

const store = {
    books: [{
        id: '1',
        title: "test.1",
        description: "test.1",
        authors: "test.1",
        favorite: "test.1",
        fileCover: "test.1",
        fileName: "test.1",
        fileBook: "test.1",
        views: 0
    },
        {
            id: '2',
            title: "test.2",
            description: "test.2",
            authors: "test.2",
            favorite: "test.2",
            fileCover: "test.2",
            fileName: "test.2",
            fileBook: "test.2",
            views: 0
        },
    ]
}

router.post('/api/user/login', (req, res) => {
    res
        .status(201)
        .json({id: 1, mail: "test@mail.ru"})
})

router.post('/api/create',
    fileMulter.single('book'),
    (req, res) => {
        const {title, description, authors} = req.body
        const book = new Book(title, description, authors)
        const {books} = store
        books.push(book)

        res
            .status(201)
            .redirect('/api/books')
    })

router.get('/api/create', (req, res) => {
    res.render("books/create", {
        title: "Новая книга",
        description: "Описание книги",
        author: "Автор книги",
    });
});

router.get('/api/books', (req, res) => {
    const {books} = store
    res.render('books/index', {
        title: "Главная страница",
        books: books,
    })
})

router.get('/api/books/:id', (req, res) => {
    const {id} = req.params
    const {books} = store
    const bookID = books.findIndex(book => book.id === id)

    if (bookID === -1) {
        res.redirect('/404')
    }

    dataBase(books[bookID].id)

    console.log('books[bookID].views: ', books[bookID].views, __filename)
    res.render('books/view', {
        title: books[bookID].title,
        description: books[bookID].description,
        view: books[bookID].views,
    })
    incr(books[bookID].id)
})

router.get('/api/update/:id', (req, res) => {
    const {books} = store
    const {id} = req.params
    const bookID = books.findIndex(book => book.id === id)

    if (bookID === -1) {
        res.redirect('/404')
    }

    res.render('books/update', {
        title: "Новая книга",
        description: "Описание книги",
        author: "Автор книги",
    })
})

router.post('/api/update/:id',
    fileMulter.single('book'),
    (req, res) => {
        const {books} = store
        const {id} = req.params
        const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
        const bookID = books.findIndex(book => book.id === id)

        if (bookID === -1) {
            res.redirect('/404')
        }

        books[bookID] = {
            ...books[bookID],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook,
        }
        res.redirect(`/api/books/${id}`)

    })

router.delete('/api/books/:id', (req, res) => {
    const {books} = store
    const {id} = req.params
    const bookID = books.findIndex(book => book.id === id)
    if (bookID === -1) {
        res.redirect('/404')
    }
    books.splice(bookID, 1)
    res.redirect('/api/books')

})

router.get('/api/books/:id/download', (req, res) => {
    const {id} = req.params
    const {books} = store
    const bookID = books.findIndex(book => book.id === id)
    if (bookID !== -1) {
        const {fileName} = books[bookID]
        res.download(path.join(__dirname, 'books', fileName), fileName)
    } else {
        res
            .status(404)
            .json({errorCode: 404, errorMsg: 'not found'})
    }
})

module.exports = router