const app = require('express')();
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send({
        Hello: 'World!'
    })
});

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)