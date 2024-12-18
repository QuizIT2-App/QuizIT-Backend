const router = require('express').Router();
const {authAll, authLA, authAdmin} = require('./validation');
const {getFriends,getPending,getRequested,addFriend,deleteFriend} = require('../endpoints/friendEndpoints');
/**
 * @swagger
 * /self/friends:
 *   get:
 *     summary: get current friends
 *     description: This endpoint endpoints allows one to get ones friends.
 *     tags:
 *       - Friends
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
 *                     $ref: '#/components/schemas/user'
 *                   example:
 *                   - uuid: 1
 *                     displayName: maxi
 *                     distinguishedName: mmusterman
 *                     vorname: max
 *                     nachname: musterman
 *                     jahrgang: "1"
 *                     klasse: a
 *                     abteilung: HIT
 *                     punkte: 0
 *                     streak: 0
 *                     erstelldatum: "2024-12-12T13:57:01.000Z"
 *                     zuletztOn: "2024-12-12T13:57:01.000Z"
 *                     type: schueler
 *                   - uuid: 2
 *                     displayName: john_doe
 *                     distinguishedName: jdoe
 *                     vorname: john
 *                     nachname: doe
 *                     jahrgang: "2"
 *                     klasse: b
 *                     abteilung: HMB
 *                     punkte: 5
 *                     streak: 2
 *                     erstelldatum: "2024-12-10T11:22:33.000Z"
 *                     zuletztOn: "2024-12-12T15:22:33.000Z"
 *                     type: schueler
 *                   - uuid: 3
 *                     displayName: jane_doe
 *                     distinguishedName: jdoe123
 *                     vorname: Jane
 *                     nachname: doe
 *                     jahrgang: "3"
 *                     klasse: c
 *                     abteilung: HET
 *                     punkte: 10
 *                     streak: 3
 *                     erstelldatum: "2024-12-01T09:17:45.000Z"
 *                     zuletztOn: "2024-12-12T13:45:30.000Z"
 *                     type: lehrer
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
router.get('/self/friends', authAll, getFriends);
/**
 * @swagger
 * /self/friends/pending:
 *   get:
 *     summary: get pending friend requests
 *     description: This endpoint endpoints allows one to get ones pending friend requests.
 *     tags:
 *       - Friends
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
 *                     $ref: '#/components/schemas/user'
 *                   example:
 *                   - uuid: 1
 *                     displayName: tomi
 *                     distinguishedName: tturmabauer
 *                     vorname: thomas
 *                     nachname: turmbauer
 *                     jahrgang: "1"
 *                     klasse: a
 *                     abteilung: HIT
 *                     punkte: 0
 *                     streak: 0
 *                     erstelldatum: "2024-12-12T13:57:01.000Z"
 *                     zuletztOn: "2024-12-12T13:57:01.000Z"
 *                     type: schueler
 *                   - uuid: 2
 *                     displayName: spooky
 *                     distinguishedName: mtopf
 *                     vorname: markus
 *                     nachname: topf
 *                     jahrgang: "2"
 *                     klasse: b
 *                     abteilung: HMB
 *                     punkte: 5
 *                     streak: 2
 *                     erstelldatum: "2024-12-10T11:22:33.000Z"
 *                     zuletztOn: "2024-12-12T15:22:33.000Z"
 *                     type: schueler
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
router.get('/self/friends/pending', authAll, getPending);
/**
 * @swagger
 * /self/friends/requested:
 *   get:
 *     summary: get requested friend requests
 *     description: This endpoint endpoints allows one to get ones requested friend requests.
 *     tags:
 *       - Friends
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
 *                     $ref: '#/components/schemas/user'
 *                   example:
 *                   - uuid: 1
 *                     displayName: stefanDieBirne
 *                     distinguishedName: skran
 *                     vorname: stefan
 *                     nachname: kran
 *                     jahrgang: "1"
 *                     klasse: a
 *                     abteilung: HIT
 *                     punkte: 0
 *                     streak: 0
 *                     erstelldatum: "2024-12-12T13:57:01.000Z"
 *                     zuletztOn: "2024-12-12T13:57:01.000Z"
 *                     type: schueler
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
router.get('/self/friends/requested', authAll, getRequested);
/**
 * @swagger
 * /self/friends:
 *   post:
 *     summary: send friend request or accept
 *     description: This endpoint endpoints allows one to either accept a pending friend request or send a friend request to another user.
 *     tags:
 *       - Friends
 *     security:
 *       - Authorization: [schueler, lehrer, admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 32402
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
 *                   type: object
 *                   example: friend request successful
 *       400:
 *         description: BadRequestError
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
 *                   example: BadRequestError
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
router.post('/self/friends', authAll, addFriend);
/**
 * @swagger
 * /self/friends:
 *   delete:
 *     summary: remove a friend or deny request
 *     description: This endpoint endpoints allows one to either remove a friend or deny a pending friend request.
 *     tags:
 *       - Friends
 *     security:
 *       - Authorization: [schueler, lehrer, admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 32402
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
 *                   type: string
 *                   example: removed friend
 *       400:
 *         description: BadRequestError
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
 *                   example: BadRequestError
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
router.delete('/self/friends', authAll, deleteFriend);


module.exports = router;