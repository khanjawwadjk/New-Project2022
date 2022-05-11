var express = require('express');
var router = express.Router();
var userController = require('../controller/userController')

/* GET users listing. */
router.get('/getusers', function(req, res) {
  userController.getUsers(req, res);
});

router.post('/login',(req, res)=>{
  userController.loginByEmail(req, res);
})

module.exports = router;
