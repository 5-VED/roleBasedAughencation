const router = require('express').Router();
const { userRegister, userLogin } = require('../Utils/Auth');

//Users registeration route
router.post("/register-user", async (req, res) => {
    await userRegister(req.body, 'user', res);
})

//Admin registeration route
router.post("/register-admin", async (req, res) => {
    await userRegister(req.body, 'admin', res);
})

//Super Admin registeration route
router.post("/register-super-admin", async (req, res) => {
    await userRegister(req.body, 'super-admin', res);
})
    
//Users Login route
router.post("/login-user", async (req, res) => {
    await userLogin(req.body, "user", res)
})

//Admin Login route
router.post("/login-admin", async (req, res) => {
    await userLogin(req.body, "admin", res)
});

//Super Admin Login route
router.post("/login-super-admin", async (req, res) => {
    await userLogin(req.body, "super-admin", res)
});

//Profile route
router.get('profile', async (req, res) => {
});

//Users Protected route
router.post("/user-protected", async (req, res) => {
});

//Admin Protected route
router.post("/admin-protected", async (req, res) => {
});

//Super Protected route
router.post("/super-admin-protected", async (req, res) => {
});

module.exports = router;