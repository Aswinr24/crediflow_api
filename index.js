const express = require('express')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const methodoverride = require('method-override')
const cors = require('cors')
const lighthouse = require('@lighthouse-web3/sdk')
require('dotenv').config()

const app = express()
app.use(cors())
const port = 8080

app.use(express.static(path.join(__dirname, '/')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodoverride('_method'))

const API_KEY = process.env.LIGHTHOUSE_API_KEY
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

const upload = multer({ dest: uploadsDir })

app.get('/', (req, res) => {
  res.send('Home!')
})

app.post('/uploadDocument', upload.single('file'), async (req, res) => {
  const file = req.file
  console.log(file)
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const filePath = file.path
  try {
    const uploadResponse = await lighthouse.upload(filePath, API_KEY)
    console.log(uploadResponse)
    res.json({ uploadResponse })
  } catch (error) {
    console.log(error)
  }
})

app.post('/uploadText', async (req, res) => {
  console.log(req.body)
  const text = req.body.text
  let text2
  try {
    const parsedText = JSON.parse(text)
    text2 = JSON.stringify(parsedText)
  } catch (e) {
    text2 = text
  }
  const name = req.body.name
  try {
    const uploadResponse = await lighthouse.uploadText(text2, API_KEY, name)
    console.log(uploadResponse)
    res.json({ uploadResponse })
  } catch (error) {
    console.log(error)
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
