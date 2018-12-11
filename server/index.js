const app = require('express')();
const port = 3001 // 3000 used for create-react-app

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))