const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const set = {
    resave: false,
    secret: 'mypas',
    saveUninitialized: true
};

const animeRoutes=require('./routes/anime')
const reviewRoutes=require('./routes/review');

app.use(session(set));
app.use(flash());
app.engine('ejs', engine);
const mongoose = require('mongoose');
const catchError = require('./utils/catcherr');
const methodOverride = require('method-override');
mongoose.connect('mongodb://localhost:27017/animeshop', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('コネクト成功');
    }).catch((err) => {
        console.log('コネクト失敗');
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const AppError = require('./utils/erro');

const papa = ((req, res, next) => {
    const { pass } = req.query;
    if (pass === 'yamada') {
        return next();
    };
    throw new AppError('パスワードを入れろ', 401);
});

app.use('/anime',animeRoutes);
app.use('/anime/:id/reviews',reviewRoutes);

app.get('/home', papa, (req, res) => {
    res.render('collect/home');
});


// 未定義のパスへのアクセス
app.all('*', (req, res, next) => {
    next(new AppError('ページがみつかりません', 404));
});

// エラーハンドリング
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = '何かエラーが発生しました';
    }
    res.status(status).render('xxx', { err });
});

// サーバーの起動
app.listen(3000, () => {
    console.log('ポート3945で待ち受け');
});

