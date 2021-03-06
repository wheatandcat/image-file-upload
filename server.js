"use strict"

const express = require("express")
const app = express()
const fs = require("fs")
const bodyParser = require("body-parser")
const multer = require("multer")
const sharp = require("sharp")
const uuid = require("uuid/v1")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ dest: "./tmp/" }).single("file"))

app.get("/up.html", (req, res) => {
  res.sendFile(__dirname + "/" + "up.html")
})

app.get("/images/:file", async (req, res) => {
  try {
    let data = await fs.readFileSync(`./upload/${req.params.file}`)
    await res.set("Content-Type", "image/jpeg")
    await res.send(data)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.post("/file_upload", async (req, res) => {
  let data = await fs.readFileSync(req.file.path)

  const { size } = req.query

  const fileName = `${uuid()}.jpg`

  try {
    await sharp(data)
      .rotate()
      .resize(Number(size) || 120)
      .background("white")
      .jpeg()
      .toFile(`./upload/${fileName}`)

    return res.end(
      JSON.stringify({
        message: "Success!",
        filename: fileName,
      })
    )
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.listen(5000)
