require('dotenv').config();
const jwt = require('jsonwebtoken');
const ldap = require('ldap');
const {getUserByDN,newUser, updateUser} = require('../db/userQueries');
const {returnHTML} = require('../utils/utils.js');

const env = process.env;
const jwt_key = env.JWT_KEY;

async function login(req, res) {
    let { username, password } = req.body;
    if(!username || !password)
        return returnHTML(res,400,{error:"MissingCredentialsError"})

    let daten;

    try {
        let client = ldap.createClient({
            url: env.LDAP_URL,
        });

        daten = await new Promise((resolve, reject) => {
            client.bind(env.LDAP_PREFIX+username, password, (err,res) => {
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
        return returnHTML(res,401,{error: error.name})
    }

    if(!daten)
        return returnHTML(res,401,{error:"InvalidLoginError"})


    let user = await getUserByDN(daten.mailNickname);
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
        updateUser(user.uuid, {jahrgang: jg, klasse: kl, abteilung: ab});
    }

    user = await getUserByDN(daten.mailNickname);

    let token = jwt.sign({
            id: user.uuid,
            role: user.type,

        }, jwt_key,
        { expiresIn: '8h' }
    );

    return returnHTML(res,200,{data:{token:token}})
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
        if (!token) return returnHTML(res,400, {error: "MissingCredentialsError"});

        jwt.verify(token, env.JWT_KEY, (err, user) => {
            if (err) return returnHTML(res,401, {error: err.name});

            if (!roles.includes(user.role))
                return returnHTML(res,403,{error: "InsufficientPermissionsError"
        });

            req.token = user;
            next();
        });
    }
}



module.exports = { login: login, auth: authenticateRole,


}