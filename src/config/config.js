const DB_MONGO_URI = process.env.DB_MONGO_URI || 'mongodb://127.0.0.1:27017/';


const PORT = process.env.PORT || '3333';
const jwtSecret = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4NTIxNDI3NSwiaWF0IjoxNjg1MjE0Mjc1fQ.LNonOHGQoFrKVpu57arwQl6Mzl_IvPUGy_0G5yUZcec';
const sessionSecret = process.env.SESSION_SECRET || 'u5WJ93f%Ns2';




module.exports = {
    mongo: {
        uri: DB_MONGO_URI,
    },
    port: PORT,
    jwtSecret,
    sessionSecret,
};
