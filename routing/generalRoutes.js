const router = require('express').Router();
const {authAll, authLA, authAdmin, login} = require('./validation');

const {serve, setup} = require('../endpoints/swagger');
const {join} = require("node:path");

/**
 * @swagger
 * /:
 *   get:
 *     summary: our index page
 *     description: This endpoint returns a simple index page featuring links to relevant sites such as our documentation and examples, as well as an introduction to our project, team and status.
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../endpoints', 'index.html'));
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: a login request
 *     description: This endpoint accepts simple login requests and potentially returns a key.
 *     tags:
 *       - General
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: mmusterman
 *               password:
 *                 type: string
 *                 example: pass123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: MissingCredentialsError
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: MissingCredentialsError
 *       401:
 *         description: InvalidCredentialsError
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: InvalidCredentialsError
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/login', login);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: our documentation page
 *     description: This endpoint contains our documentation using swagger.
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: Success
 */
router.use('/api', serve, setup);




module.exports = router;