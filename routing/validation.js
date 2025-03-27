require("dotenv").config();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ldap = require("ldap");
const {
  getUserByDN,
  getUserByID,
  newUser,
  updateUser,
} = require("../db/userQueries");
const { returnHTML } = require("../utils/utils.js");

const env = process.env;
const jwt_key = crypto.randomBytes(32).toString("hex");

async function login(req, res) {
  let { username, password } = req.body;
  if (!username || !password)
    return returnHTML(res, 400, { error: "MissingCredentialsError" });

  if (env.DEBUG) {
    let token = jwt.sign(
      {
        id: parseInt(username),
      },
      jwt_key,
      { expiresIn: "8h" }
    );
    return returnHTML(res, 200, { data: { token: token } });
  } else {
    let daten;

    let client;

    try {
      client = await ldap.createClient({
        url: env.LDAP_URL,
      });

      client.on("error", (err) => {
        console.error("LDAP Client Error:", err);
        return returnHTML(res, 500, { error: err.name });
      });

      daten = await new Promise((resolve, reject) => {
        client.bind(env.LDAP_PREFIX + username, password, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      }).then(async () => {
        let searchOptions = {
          filter: `(&(mailNickname=${username})(objectClass=user))`,
          scope: "sub",
          attributes: [
            "mailNickname",
            "department",
            "employeeType",
            "sn",
            "givenName",
          ],
        };

        return await ldapSuche(client, searchOptions);
      });
    } catch (error) {
      return returnHTML(res, 401, { error: error.name });
    } finally {
      if (client) {
        await client.destroy((err) => {
          throw err;
        });
      }
    }

    if (!daten) return returnHTML(res, 401, { error: "InvalidLoginError" });

    let user = await getUserByDN(daten.mailNickname);

    let jg = daten.department.slice(0, 1);
    let kl = daten.department.slice(1, 2);
    let ab = daten.department.slice(2);

    if (!user) {
      let dn = daten.mailNickname;
      let vn = daten.givenName.split(" ")[0];
      let sn = daten.sn;
      let type = daten.employeeType;
      newUser(dn, dn, vn, sn, jg, kl, ab, type);
    } else {
      updateUser(user.uuid, { jahrgang: jg, klasse: kl, abteilung: ab });
    }

    user = await getUserByDN(daten.mailNickname);

    let token = jwt.sign(
      {
        id: user.uuid,
      },
      jwt_key,
      { expiresIn: "8h" }
    );

    return returnHTML(res, 200, { data: { token: token } });
  }
}

async function ldapSuche(client, searchOptions) {
  return new Promise((resolve, reject) => {
    client.search(env.LDAP_BASE_DN, searchOptions, (err, res) => {
      res.on("searchEntry", (entry) => {
        resolve(entry.object);
      });

      res.on("error", (err) => {
        reject(err);
      });

      res.on("end", () => {
        client.unbind();
      });
    });
  });
}

function authenticateRole(roles) {
  return (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token)
      return returnHTML(res, 400, { error: "MissingCredentialsError" });

    if (token.split(" ")[0] === "Bearer") token = token.split(" ")[1];

    jwt.verify(token, jwt_key, async (err, user) => {
      if (err) return returnHTML(res, 401, { error: err.name });

      //let role = (await getUserByID(user.id)).type;

      getUserByID(user.id, (error, results) => {
        if (error) {
          return returnHTML(res, 500, { error: error });
        }
        /* console.log(results);
        console.log(roles);
        console.log(results.type); */
        let role = results[0].type;
        if (!roles.includes(role))
          return returnHTML(res, 403, { error: "InsufficientPermissionsError" });
  
        req.user = user;
        next();
      });
    });
  };
}

module.exports = {
  login: login,
  authAll: authenticateRole(["schueler", "lehrer", "admin"]),
  authLA: authenticateRole(["lehrer", "admin"]),
  authAdmin: authenticateRole(["admin"]),
};
