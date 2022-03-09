const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


// Init Upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});
// used in traversy vid but not compatable with full stack junkie vid
// }).single('myImage');

// Check File type
function checkFileType(file, cb) {
    // allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    //check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);

    } else {
        cb('Error: Images only!');
    }
}

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.render('index'));
// upload method by traversy
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            // console.log(req.file);
            // can take info from req.file and submit to database
            // need to research how
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No file selected'
                });
            } else {
                res.render('index', {
                    msg: 'File uploaded',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});
// upload method by full stack
app.post('/single', upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send('Single File Uploaded');
});
// upload multiple by full stack
app.post('/multiple', upload.array('images', 3), (req, res) => {
    console.log(req.files);
    res.send('multiple files uploaded');
});
const port = 3000;

app.listen(port, () => console.log(`server started on port ${port}`));