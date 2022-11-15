const cds = require("@sap/cds");
const { Clients } = cds.entities("app.interactions");
const { Reservations } = cds.entities("app.interactions");

module.exports = srv => {
    srv.on("CREATE", "Clients", async (req, res) => {
        let returnData = await cds.transaction(req).run(INSERT.into(Clients).entries({
            FirstName: req.data.FirstName,
            SecondName: req.data.SecondName,
            PhoneNumber: req.data.PhoneNumber,
            email: req.data.email
        })).then((resolve, reject) => {
            console.log("resolve: ", resolve);
            console.log("reject: ", reject);

            if (typeof resolve !== "undefined") {
                return req.data;
            } else {
                req.error(409, "Record Not Found");
            }
        }).catch(err => {
            console.log(err);
            req.error(500, "Error in Updating Record");
        });
        console.log("Before End", returnData);
        return returnData;
    }),
        srv.on("delete", async (req, res) => {
            const result = await DELETE.from(Clients).where({ ID: req.data.msg });
            return result;
        }),
        srv.on("getVacancy", async (req, res) => {
            const result = await SELECT.from(Reservations).innerjoin.where({ dateSTART: req.data.dateStart });
            return result;
        }),
        srv.on("updateClient", async (req, res) => {
            const result = await UPDATE(Clients).with({
                FirstName: req.data.FirstName,
                SecondName: req.data.SecondName,
                PhoneNumber: req.data.PhoneNumber,
                email: req.data.email
            }).where({ ID: req.data.ID });
            console.log(result);
        })
}; 