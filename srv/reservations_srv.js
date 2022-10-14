const cds = require("@sap/cds")
const { Clients } = cds.entities("app.interactions")

module.exports = srv =>{
    // srv.on("f", (req,res) => {
    //     return req.data.msg;
    // });
    srv.on("READ", "Clients", (req, res) => {
        const { SELECT } = cds.ql(req);
        const result = SELECT.from(Clients);
        return result;
    })
};