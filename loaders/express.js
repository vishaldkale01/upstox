const morgan = require("morgan")
const path = require("path");

module.exports = () =>{
app = express()
app.use(bodyParser.json())
// app.use(morgan('combined'))
dotenv.config();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use("/",require("../routes/index"))
}