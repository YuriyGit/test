const express = require('express')
const {v4: uuid} = require("uuid");
const router = express.Router()
const fileMulter = require('../middleware/file')
const path = require('path')
const http = require('http')
const Book = require('../models/book')
const {json} = require("express");

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
        const counterViews = book.views + 1
        const update = {
            views: counterViews,
        }
        await Book.findByIdAndUpdate(id, update)

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

router.get('/api/update/:id', async (req, res) => {
    const {id} = req.params
    try {
        const book = await Book.findById(id).select('-__v')

        res.render('books/update', {
            title: book.title,
            description: book.description,
            author: book.author,
        })
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
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
    console.log('id:', typeof id, id)
    try {
        await Book.deleteOne({_id: id})
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
