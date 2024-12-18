const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getFriendsRanking,getClassRanking,getDepartmentRanking} = require("../endpoints/rankingEndpoints");

/**
 * @swagger
 * /self/friendsRanking:
 *   get:
 *     summary: friend rankings
 *     description: This endpoint see ones ranking compared to ones friends.
 *     tags:
 *       - Rankings
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
 *                     $ref: '#/components/schemas/rankingElement'
 *                   example:
 *                     - uuid: 1
 *                       name: 'user1'
 *                       punkte: 200
 *                       isme: true
 *                     - uuid: 3
 *                       name: 'user2'
 *                       punkte: 150
 *                       isme: false
 *                     - uuid: 2
 *                       name: 'user3'
 *                       punkte: 100
 *                       isme: false
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
router.get('/self/friendsRanking', authAll, getFriendsRanking);
/**
 * @swagger
 * /self/classRanking:
 *   get:
 *     summary: class rankings
 *     description: This endpoint see ones ranking compared other users in ones class.
 *     tags:
 *       - Rankings
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
 *                     $ref: '#/components/schemas/rankingElement'
 *                   example:
 *                     - uuid: 1
 *                       name: 'user1'
 *                       punkte: 200
 *                       isme: true
 *                     - uuid: 3
 *                       name: 'user2'
 *                       punkte: 150
 *                       isme: false
 *                     - uuid: 2
 *                       name: 'user3'
 *                       punkte: 100
 *                       isme: false
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
router.get('/self/classRanking', authAll, getClassRanking);
/**
 * @swagger
 * /self/departmentRanking:
 *   get:
 *     summary: department rankings
 *     description: This endpoint see ones ranking compared other users in ones department.
 *     tags:
 *       - Rankings
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
 *                     $ref: '#/components/schemas/rankingElement'
 *                   example:
 *                     - uuid: 1
 *                       name: 'user1'
 *                       punkte: 200
 *                       isme: true
 *                     - uuid: 3
 *                       name: 'user2'
 *                       punkte: 150
 *                       isme: false
 *                     - uuid: 2
 *                       name: 'user3'
 *                       punkte: 100
 *                       isme: false
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
router.get('/self/departmentRanking', authAll, getDepartmentRanking)


module.exports = router;