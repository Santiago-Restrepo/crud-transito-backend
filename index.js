const app = require("./app");
require("./clients/postgres");
app.listen(app.get('port'))
console.log('server on port', app.get('port'))