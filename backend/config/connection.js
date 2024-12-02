const { connect } = require("mongoose");

async function connectDB() {
  connect(process.env.DATABASE_URL).then((data) => {
    console.log(`Mongodb connected with server ${data.connection.host}`);
  });
}

module.exports = connectDB;
