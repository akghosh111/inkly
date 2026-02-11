import express from "express"

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})