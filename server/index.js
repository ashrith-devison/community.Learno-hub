const app = require('./server');
const connectDB = require('./db/index');

connectDB().then(()=> {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log(err);
})