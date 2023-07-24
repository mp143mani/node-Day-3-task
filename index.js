const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const userRouter = require('./routes/user');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Mentor and Student Assigning API!');
});

app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
