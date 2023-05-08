const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
const port = process.env.PORT || 3000;
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port, () => {
   console.log('Server is up!');
});