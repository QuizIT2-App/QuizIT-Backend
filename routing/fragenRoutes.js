const router = require("express").Router();
const { authAll, authLA, authAdmin } = require("./validation");
const { getQuizes, getCurrentQuiz } = require("../endpoints/fragenEndpoints");

/**
 * @swagger
 * /question/currentquiz/:
 *   get:
 *     summary: get current quiz questions
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
 *                     type: object
 *                     properties:
 *                       runId:
 *                         type: integer
 *                         example: 200
 *                       question:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Was ist 1+1?"
 *                           type:
 *                             type: integer
 *                             example: 1
 *                           options:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 text:
 *                                   type: string
 *                               example:
 *                               - id: 1
 *                                 text: "1"
 *                               - id: 2
 *                                 text: "2"
 *                               - id: 3
 *                                 text: "3"
 *                               - id: 4
 *                                 text: "4"
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
router.get("/question/currentquiz/:type", authAll, getCurrentQuiz);

/**
 * @swagger
 * /question/{quizId}:
 *   get:
 *     summary: get own user
 *     description: This endpoint allows one to access all questions in a pool
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz.
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
router.get("/question/:id", authLA, getQuizes);


module.exports = router;
