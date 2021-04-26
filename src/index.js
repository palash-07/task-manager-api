const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
// Loading routes
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
    console.log('Server is up on PORT',PORT)
})

