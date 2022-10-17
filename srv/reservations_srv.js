const cds = require("@sap/cds")
const { Clients } = cds.entities("app.interactions")

module.exports = srv => {
    // srv.on("f", (req,res) => {
    //     return req.data.msg;
    // });
    // srv.on("READ", "Clients", async (req, res) => {
    //     const { SELECT } = cds.ql(req);
    //     const result = await SELECT.from(Clients).where({ SecondName: "Stosik" });
    //     return result;
    // })
};