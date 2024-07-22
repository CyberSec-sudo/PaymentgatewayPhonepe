const {axios, User, UserApi} = require('./api/helper/includes')

// Your task logic here
const performTask = async () => {
    const users = await UserApi.find({});


    for(const {refreshToken, token, fingerprint, deviceFingerprint, email} of users){
        try {
            const checksum = (await axios.get(`${process.env.PHONEPE_URL}/api/refreshtokenhash`)).data;
            const headers = {
                'X-Refresh-Token': refreshToken,
                'X-Auth-Token': token,
                'X-App-Id': 'bd309814ea4c45078b9b25bd52a576de',
                'X-Merchant-Id': 'PHONEPEBUSINESS',
                'X-Source-Type': 'PB_APP',
                'X-Source-Platform': 'ANDROID',
                'X-Source-Locale': 'en',
                'X-Source-Version': '1290000416',
                'Fingerprint': fingerprint,
                'X-Device-Fingerprint': deviceFingerprint,
                'X-App-Version': '0.4.16',
                'X-Request-Sdk-Checksum': checksum,
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Encoding': 'gzip, deflate, br',
            };
            const response = (await axios.post("https://business-api.phonepe.com/apis/merchant-insights/v1/auth/refresh", {}, {headers})).data;
            //console.log(response)
            await UserApi.findOneAndUpdate({email: email}, {$set: {token: response.token, refreshToken: response.refreshToken}})
        } catch (error) {
            console.log(error)
        }
    }

    
}

module.exports = performTask
