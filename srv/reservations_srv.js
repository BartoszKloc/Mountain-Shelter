const cds = require("@sap/cds")
const { Clients } = cds.entities("app.interactions")

module.exports = srv => {
    // srv.on("READ", "Clients", async (req, res) => {
    //     const { SELECT } = cds.ql(req);
    //     const result = await SELECT.from(Clients).where({ SecondName: "Stosik" });
    //     return result;
    // });
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
    })
};