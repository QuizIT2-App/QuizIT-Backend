const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getQuizes} = require("../endpoints/fragenEndpoints");
/**
 * @swagger
 * /question/{quizId}:
 *   get:
 *     summary: get own user
 *     description: This endpoint allows one to access all questions in a pool
 *     tags:
 *       - Question
 *     security:
 *       - Authorization: [schueler, lehrer, admin]
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/question'
 *                   example:
 *
 *
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
 *         description: JsonWebTokenError
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
 *                   example: JsonWebTokenError
 *       403:
 *         description: InsufficientPermissionsError
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
 *                   example: InsufficientPermissionsError
 */
router.get('/question/:id', authLA, getQuizes);

module.exports = router;