const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getAllQuizzes, getQuizzes, getSubQuizzes, startQuiz, getAnswers} = require("../endpoints/quizEndpoints");
/**
 * @swagger
 * /quiz:
 *   get:
 *     summary: get own user
 *     description: This endpoint allows one to access all top level pools
 *     tags:
 *       - Quiz
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/quiz'
 *                   example:
 *                     - id: 1
 *                       title: 'Mathematik'
 *                       description: 'Ein Fragenpool für das Fach Mathematik'
 *                       sub: null
 *                     - id: 2
 *                       title: 'Deutsch'
 *                       description: 'Ein Fragenpool für das Fach Deutsch'
 *                       sub: null
 *                     - id: 3
 *                       title: 'Englisch'
 *                       description: 'Ein Fragenpool für das Fach Englisch'
 *                       sub: null
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
router.get('/quiz', authAll, getQuizzes);
/**
 * @swagger
 * /quiz/{id}:
 *   get:
 *     summary: get own user
 *     description: This endpoint allows one to access quiz's lower in the hierarchy
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz.
 *     tags:
 *       - Quiz
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
 *                     $ref: '#/components/schemas/quiz'
 *                   example:
 *                     - id: 4
 *                       title: 'AM 1'
 *                       description: 'Ein Fragenpool für das Fach Mathematik 1 Jahrgang'
 *                       sub: 1
 *                     - id: 5
 *                       title: 'AM 2'
 *                       description: 'Ein Fragenpool für das Fach Mathematik 2 Jahrgang'
 *                       sub: 1
 *                     - id: 6
 *                       title: 'AM 3'
 *                       description: 'Ein Fragenpool für das Fach Mathematik 3 Jahrgang'
 *                       sub: 1
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
router.get('/quiz/:id', authAll, getSubQuizzes);
/**
 * @swagger
 * /startQuiz/{id}:
 *   get:
 *     summary: start quiz
 *     description: This endpoint allows one to start a quiz
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the quiz.
 *     tags:
 *       - Quiz
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
 *                   type: integer
 *                   example: 4
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
router.post('/startQuiz/:id', authAll, startQuiz);

router.get('/getAnswers', authAll, getAnswers);

router.get('/getAllQuizzes', authAll, getAllQuizzes);

module.exports = router;