const WPAPI = require("wpapi");
var wp = new WPAPI({
    endpoint: "https://wp.nyu.edu/mcc014f18_tw_miniarchive/wp-json",
    // transport: {
    //     get: (wpreq, callback) => {
    //         return WPAPI.transport.get(wpreq, callback).withCredentials();
    //     }
    // }
});

// POST not possible: CORS not allowed & nonce unavailable
