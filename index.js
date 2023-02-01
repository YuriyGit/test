const express = require('express')
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const PORT = process.env.PORT || 3000
const app = express()

class Book {
    constructor(id = uuid(), title = 'string', authors = 'string', favorite = 'string', fileCover = 'string', fileName = 'string') {

        {
            this.id = id
            this.title = title
            this.authors = authors
            this.favorite = favorite
            this.fileCover = fileCover
            this.fileName = fileName
        }
    }
}

async function getBookList() {
    return await new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, 'books'), (err, books) => {
            if (err) reject(err)
            console.log("books: ", books)//         !!!!!!!!!!
            resolve(books)//                        !!!!!!!!!!
        })
    })
}


app.post('/api/user/login', (req, res) => {
    res
        .status(201)
        .send({id: 1, mail: "test@mail.ru"})
})

app.get('/api/books', async (req, res) => {
    res.send(await getBookList())
})

app.post('/api/books', (req, res) => {
    // res.send('создаём книгу и возвращаем её же вместе с присвоенным ID')
    const book = new Book()
    res.send(`Book ${book}\n book id: ${book.id}`)
})

app.get('/api/books/:id', (req, res) => {
    res.send('получить книгу по ID \n получаем объект книги, если запись не найдена, вернём Code: 404')

})

app.put('/api/books/:id', (req, res) => {
    res.send('редактировать книгу по ID\n редактируем объект книги, если запись не найдена, вернём Code: 404')
})

app.delete('/api/books/:id', (req, res) => {
    res.send('удалить книгу по ID \n удаляем книгу и возвращаем ответ: \'ok\'')
})

app.listen(PORT, (err) => {
    err ? console.error(err) : console.log(`Server started on a port ${PORT}...`)
})
