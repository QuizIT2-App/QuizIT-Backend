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
    let client;
    try {
        client = ldap.createClient({
            url: env.LDAP_URL,
        });

        let searchOptions = {
            filter: `(&(mailNickname=${username})(objectClass=user))`,
            scope: "sub",
            attributes: ["mailNickname", "department", "employeeType", "sn", "givenName"],
        };

        await client.bind("tgm\\"+username, password, (err) => {
            if(err)console.log(err)});

        daten = await ldapSuche(client, searchOptions);
        console.log('Search results:', daten);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.unbind();
    }

    if(!daten) return res.status(401).send('Login ungültig');

    let user = (await userDN(username))[0];
    console.log(user);
    let jg = daten.department.slice(0,1);
    let kl = daten.department.slice(1,2);
    let ab = daten.department.slice(2);

    if (user.length === 0) {
        let dn = daten.mailNickname;
        let vn = daten.givenName.split(" ")[0];
        let sn = daten.sn;
        let type = daten.employeeType;
        newUser(dn, dn, vn, sn, jg, kl, ab, type);
        user = (await userDN(username))[0];
    } else {
        updateUser(user.uuid, jg, kl, ab);
    }

    const token = jwt.sign(
        { username: user.distinguishedName, role: user.type }, jwt_key,
        { expiresIn: '4h' }
    );

    return res.status(200).send("Login Successful: "+token);
}

async function ldapSuche(client, searchOptions) {
    return new Promise((resolve, reject) => {
        let daten;
        client.search(env.LDAP_BASE_DN, searchOptions, (err, res) => {
            if (err) {return reject(err);}

            res.on('searchEntry', (entry) => {
                daten = entry.object;
            });

            res.on('end', () => {
                resolve(daten);
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
                return res.status(401).send('Unzureichende Berechtigungen.');

            req.role = user;
            next();
        });
    }
}



module.exports = { login: login, auth: authenticateRole,


}