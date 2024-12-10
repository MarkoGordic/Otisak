import express from 'express';

const app = express();
const PORT = process.env.PORT || 7500;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
