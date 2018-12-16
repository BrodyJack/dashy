import express from 'express';
import routes from './routes';

const port = 3001; // 3000 used for create-react-app
let app = express();

// api router
app.use('/api', routes());

app.listen(port, () => console.log(`Example app listening on port ${port}!!!`));
