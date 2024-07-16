const jwt = require('../../config/jwt');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { addMinutes, format } = require('date-fns');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const mongoose = require("mongoose");
const { mongo } = require('../../config/config')
const cheerio = require("cheerio");
const User = require("../models/user");
const UserApi = require("../models/user_api");
const UserLogin = require("../models/user_otp_login");
const UserTransaction = require("../models/user_api_transactions");
const crypto = require('crypto');

const { faker } = require('@faker-js/faker');
module.exports = {
    jwt,
    mongo,
    mongoose,
    axios,
    uuidv4,
    addMinutes,
    format,
    path,
    fs,
    fsp,
    cheerio,
    User,
    UserApi,
    UserLogin,
    UserTransaction,
    crypto, 
    faker,
  };