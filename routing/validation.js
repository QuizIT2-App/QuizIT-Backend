require('dotenv').config();
const env = process.env;
const jwt_key = env.JWT_KEY;
const jwt = require('jsonwebtoken');
const ldap = require('ldap');
const {userDN,newUser, updateUser} = require('../db/queries');


async function login(req, res, next) {
    let { username, password } = req.body;
    if(!username || !password) return res.status(400).send('Login daten fehlen');

    let daten;

    try {
        let client = ldap.createClient({
            url: env.LDAP_URL,
        });

        daten = await new Promise((resolve, reject) => {
            client.bind("tgm\\"+username, password, (err,res) => {
                if(err)
                    reject(err);
                resolve(res);
            });
        }).then(async () => {
            let searchOptions = {
                filter: `(&(mailNickname=${username})(objectClass=user))`,
                scope: "sub",
                attributes: ["mailNickname", "department", "employeeType", "sn", "givenName"],
            };

            return await ldapSuche(client, searchOptions);
        });

    } catch (error) {
        return res.status(401).json({
            success: -1,
            error: error.name,
        });
    }

    if(!daten) return res.status(401).send('Login ungültig');

    let user = (await userDN(daten.mailNickname))[0];
    console.log(user);
    let jg = daten.department.slice(0,1);
    let kl = daten.department.slice(1,2);
    let ab = daten.department.slice(2);

    if (!user) {
        let dn = daten.mailNickname;
        let vn = daten.givenName.split(" ")[0];
        let sn = daten.sn;
        let type = daten.employeeType;
        newUser(dn, dn, vn, sn, jg, kl, ab, type);
    } else {
        updateUser(user.uuid, jg, kl, ab);
    }
    user = (await userDN(daten.mailNickname))[0];

    const token = jwt.sign(
        { vn: user.vn, username: user.distinguishedName, role: user.type }, jwt_key,
        { expiresIn: '8h' }
    );

    return res.status(200).json({
        success: 0,
        error: "",
        data: {
            token: token,
        }
    });
}

async function ldapSuche(client, searchOptions) {
    return new Promise((resolve, reject) => {
        client.search(env.LDAP_BASE_DN, searchOptions, (err, res) => {

            res.on('searchEntry', (entry) => {
                resolve(entry.object);
            });

            res.on('error', (err) => {
                reject(err);
            })

            res.on('end', () => {
                client.unbind();
            });
        });

    });
}


function authenticateRole (roles) {
    return (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(400).send("Fehlender Token");

        jwt.verify(token, env.JWT_KEY, (err, user) => {
            if (err) return res.status(401).send(err.message);

            if (!roles.includes(user.role))
                return res.status(403).send('Unzureichende Berechtigungen.');

            req.role = user;
            next();
        });
    }
}



module.exports = { login: login, auth: authenticateRole,


}