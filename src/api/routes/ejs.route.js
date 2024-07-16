const express = require('express')
const router = express.Router()
const tokenCheckEjs = require('../middlewares/tokenCheckEjs');


router.get('/', tokenCheckEjs, (req, res) => res.render('index'))
router.get('/index', (req, res) => res.redirect('/'));

router.route('/register').get((req, res) => {
  res.render('register');  
  /*if (res.locals.status) {
      res.render('register');
    } else {
      res.redirect('/');
    }*/
  });
  
  router.route('/login').get((req, res) => {
    res.render('login');  

    });

  router.route('/dashboard').get(tokenCheckEjs,  (req, res) => {
    if (res.locals.status) {
        res.render('dashboard', {status: res.locals.statususer});
      } else {
        res.redirect('/login');
      }
  });
  router.route('/transactions').get(tokenCheckEjs,  (req, res) => {
    if (res.locals.status) {
        res.render('transaction');
      } else {
        res.redirect('/login');
      }
  });
  router.route('/checker').get(tokenCheckEjs,  (req, res) => {
    if (res.locals.status) {
        res.render('transaction-checker');
      } else {
        res.redirect('/login');
      }
  });
  router.route('/settings').get(tokenCheckEjs,  (req, res) => {
    if (res.locals.status) {
        res.render('settings');
      } else {
        res.redirect('/login');
      }
  });
  router.route('/withdraw').get(tokenCheckEjs,  (req, res) => {
    if (res.locals.status) {
        res.render('withdraw');
      } else {
        res.redirect('/login');
      }
  });
module.exports = router
