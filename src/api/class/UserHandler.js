const {jwt, axios, uuidv4, cheerio, User, UserApi, UserLogin, UserTransaction, crypto, faker} = require('../helper/includes')

class UserHandler {
	constructor(bearer) {
		this.email = this.getEmail(bearer);    
	}
	
	async register(data, res) {
		try {
			const {email, password } = data.user;

			const user = await User.findOne({email, password})
			if(user){
				return {error: true, message: "User Already Registered"}

			}
		  await new User({email, password}).save();
		  const token = jwt.generateToken({ email: email });
		  res.cookie('jwt', token);
		  return {error: false, message: "Registered Successfully"}
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	  }

	  async login(data, res) {
		try {
			const {email, password } = data;
			const user = await User.findOne({email, password})
			if(user){
				const token = jwt.generateToken({ email: email });
				res.cookie('jwt', token);
				return {error: false, message: "Login Success"}
			}
		  return {error: true, message: "Wrong Password or Email"}
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	  }
	 async checkNumber(){
		try {
			const email = await this.email;
			const checkNumber = await UserApi.findOne({email}, {api_key: 1, name: 1, number: 1});
			if(!checkNumber) return {error: false, message: "Link Your Mobile Number", linked: false}
			return {error: false, message:"Number Linked", linked: true, userData: {
				apikey: checkNumber.api_key,
				name: checkNumber.name,
				number: checkNumber.number
	
			}}
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	 }
	 async generateRandomHex(length) {
		return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
	}
	
	
	// Function to generate a device fingerprint
	async generateRandomDevice() {
		const brand = faker.helpers.arrayElement([
			"Samsung",
			"Apple",
			"Huawei",
			"Xiaomi",
			"Oppo",
			"Vivo",
			"Motorola",
			"Nokia",
			"Sony",
			"LG"
		]); // Random device manufacturer
		const model = faker.helpers.arrayElement([
			"Galaxy S21",
			"iPhone 12",
			"P40 Pro",
			"Mi 11",
			"Reno5",
			"V21",
			"Moto G10",
			"7.2",
			"Xperia 1 II",
			"G8 ThinQ"
		]); // Random device model
		return `${brand} ${model}`;
	}
	async generateRandomDeviceIdentifier() {
		const segment1 = await this.generateRandomHex(32); // 32 hex characters
		const segment2 = await this.generateRandomHex(32); // 32 hex characters
		const deviceIdentifier = await this.generateRandomDevice(); // Random device identifier
		const segment3 = await this.generateRandomHex(32); // 32 hex characters
		
		return `${segment1}.${segment2}.${deviceIdentifier}.${segment3}`;
	}
async generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

async generateDeviceFingerprint() {
    const randomString = await this.generateRandomString(16); // Adjust length as needed
    const base64Encoded = Buffer.from(randomString).toString('base64');
    return randomString + '-' + base64Encoded;
}
	 async generateOtp(data){

		try {
			const number = data.number;
			const email = await this.email;
			const userData = {
				type: 'OTP',
				phoneNumber: number,
				deviceFingerprint: await this.generateDeviceFingerprint(),
			};
			const checksum = (await axios.get(`${process.env.PHONEPE_URL}/api/numberhash?number=${userData.phoneNumber}&device=${userData.deviceFingerprint}`)).data;
			const fingerprint = await this.generateRandomDeviceIdentifier();
			const headers = {
				'X-App-Id': 'bd309814ea4c45078b9b25bd52a576de',
				'X-Merchant-Id': 'PHONEPEBUSINESS',
				'X-Source-Type': 'PB_APP',
				'X-Source-Platform': 'ANDROID',
				'X-Source-Locale': 'en',
				'X-Source-Version': '1290000416',
				'Fingerprint': fingerprint,
				'X-Device-Fingerprint': userData.deviceFingerprint,
				'X-App-Version': '0.4.16',
				'X-Request-Sdk-Checksum': checksum,
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Encoding': 'gzip, deflate, br',
			};
			const response = (await axios.post(`https://business-api.phonepe.com/apis/merchant-insights/v3/auth/sendOtp`, userData, {headers})).data
			await UserLogin.deleteMany({email});
			const otpData = {
				email: email,
				number: userData.phoneNumber,
				fingerprint: fingerprint,
				deviceFingerprint: userData.deviceFingerprint,
				token: response.token,
			}
			await new UserLogin(otpData).save();
			return {error: false, message: "OTP Sent"}
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	 }

	 async verifyOtp(data){
		try {
			const otp = data.otp;
			const email = await this.email;
			const otpData = await UserLogin.findOne({email})
			if(!otpData) return {error: true, message: "No Number Present"};

			const userResponseData = {
				type: "OTP",
				deviceFingerprint: otpData.deviceFingerprint,
				otp: otp,
				token: otpData.token,
				phoneNumber: otpData.number,
			  };
			const checksum = (await axios.get(`${process.env.PHONEPE_URL}/api/otphash?number=${userResponseData.phoneNumber}&device=${userResponseData.deviceFingerprint}&otp=${userResponseData.otp}&token=${userResponseData.token}`)).data;
			const headers = {
				'X-App-Id': 'bd309814ea4c45078b9b25bd52a576de',
				'X-Merchant-Id': 'PHONEPEBUSINESS',
				'X-Source-Type': 'PB_APP',
				'X-Source-Platform': 'ANDROID',
				'X-Source-Locale': 'en',
				'X-Source-Version': '1290000416',
				'Fingerprint': otpData.fingerprint,
				'X-Device-Fingerprint': userResponseData.deviceFingerprint,
				'X-App-Version': '0.4.16',
				'X-Request-Sdk-Checksum': checksum,
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Encoding': 'gzip, deflate, br',
			};
			const response = (await axios.post('https://business-api.phonepe.com/apis/merchant-insights/v3/auth/login', userResponseData, {headers})).data

			const checksum2 = (await axios.get(`${process.env.PHONEPE_URL}/api/customhash?path=/apis/merchant-onboarding/v1/stores`)).data;

			const headers2 = {
				'Authorization': response.token,
				'X-App-Id': 'bd309814ea4c45078b9b25bd52a576de',
				'X-Merchant-Id': 'PHONEPEBUSINESS',
				'X-Source-Type': 'PB_APP',
				'X-Source-Platform': 'ANDROID',
				'X-Source-Locale': 'en',
				'X-Source-Version': '1290000416',
				'Fingerprint': otpData.fingerprint,
				'X-Device-Fingerprint': userResponseData.deviceFingerprint,
				'X-App-Version': '0.4.16',
				'X-Request-Sdk-Checksum': checksum2,
				'Content-Type': 'application/json; charset=utf-8',
				'Accept-Encoding': 'gzip, deflate, br',
			};
			const response2 = (await axios.get('https://business-api.phonepe.com/apis/merchant-onboarding/v1/stores', { headers: headers2 })).data;
			const apikey = uuidv4().replace(/-/g, '');
			const userData = {
				email: email,
				token: response.token,
				refreshToken: response.refreshToken,
				api_key: apikey,
				name: response2.data.storeListingResponses[0].displayName || "User",
				merchantid: response.groupValue,
				storeId: response2.data.storeListingResponses[0].storeId,
				number: otpData.number,
				fingerprint:otpData.fingerprint,
				deviceFingerprint: userResponseData.deviceFingerprint,
			}
			await new UserApi(userData).save();

			  return {error: false, message: "OTP Verified"}
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}

	 }

	 async deleteNum(){
		try {
			const email = await this.email;
			await UserApi.deleteOne({email})
			return {error: false, message: "Number Deleted Successfully"};
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	 }
8
	 async fetchTransaction(data){
		const date = data.date;
		const email = await this.email;

		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		
		const endDate = new Date(date);
		endDate.setHours(23, 59, 59, 999);

		const transactions = await UserTransaction.find({email, createdAt: {
			$gt: startDate,
			$lt: endDate,
		  }}, {_id: 0}).sort({createdAt: -1}).lean();
		const trasnactionsarr = [];
		transactions.forEach(async ({data: {name, amount, utr, payment, time}, createdAt}) => {
			trasnactionsarr.push({
				name: name,
				amount: amount,
				utr: utr,
				payment:payment,
				payment_time: new Date(parseInt(time)).toLocaleString('en-AS',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Kolkata'}),
				transaction_time: new Date(createdAt).toLocaleString('en-us',{weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true}),  
				  
			})
		})
		return trasnactionsarr;

	 }
	 async getCurrentDate(){
		return new Date(new Date().toLocaleString('en-AS', {
			timeZone: 'Asia/Kolkata',
		}))
	}
	 async utrChecker(data){
		try {
			const {utrid} = data;
			if(!utrid) return {message:"Please Enter UTR ID"}
			const email = await this.email;
			const {merchantid, token, fingerprint, deviceFingerprint} = await UserApi.findOne({email}, {_id: 0, merchantid: 1, token: 1, deviceFingerprint: 1, fingerprint: 1 }) 
			
			const checksum = (await axios.get(`${process.env.PHONEPE_URL}/api/specifictransactionhash?utr=${utrid}&merchant=${merchantid}`)).data;

			const headers = {
				'Authorization': token,
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
			const userResponseData = {
				transactionId: utrid,
				merchantIds: [merchantid],
				transactionTypeFilters:["FORWARD_AND_REFUND_TRANSACTION"]
			  };

			const response = (await axios.post('https://business-api.phonepe.com/apis/merchant-insights/v3/transactions/details', userResponseData, {headers})).data;


			if(response.success){
				return {
					message: "Transaction retrieved successfully",
					error: false,
					utr: response.data.utr,
					amount: response.data.amount,
					name: response.data.customerDetails.userName,
					payment: response.data.paymentApp.paymentApp,
					payment_time: new Date(response.data.transactionDate).toLocaleString('en-AS', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						hour12: true,
						timeZone: 'Asia/Kolkata',
					})
				};
			}
			/*const currentDateInKolkata = await this.getCurrentDate();

			const startDate = new Date(currentDateInKolkata);
			startDate.setDate(startDate.getDate() - 30);
			startDate.setHours(0, 0, 0, 0);
			
			const endDate = new Date(currentDateInKolkata);
			endDate.setHours(23, 59, 59, 999);
			const headers = {
				"token": token
			};
			
			const {data: {transactions}} = (await axios.get(`https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions?module=PAYMENT_QR&merchantId=${merchantid}&sDate=${startDate.getTime()}&eDate=${endDate.getTime()}`, { headers})).data;

			const transaction = transactions.find(item => item.bankReferenceNo == utrid);
			if(transaction){
				const {amount, payerName: name, status, bankReferenceNo: utr, paymentTimestamp: time, payerHandle: payment} = transaction

				return {
					message: "Transaction retrieved successfully",
					error: false,
					utr: utr,
					amount: amount,
					name: name,
					payment: payment,
					payment_time: new Date(time).toLocaleString('en-AS', {
						hour: 'numeric',
						minute: 'numeric',
						second: 'numeric',
						hour12: true,
						timeZone: 'Asia/Kolkata',
					})
				};
			}*/
			return {
                message: "Transaction not found",
                error: true
            };
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async getEmail(bearer) {
		try {
			const token = bearer?.slice(7)?.toString()
			if (!token) return null;
			return jwt.verifyToken(token).email;
		} catch (err) {
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async autoWithdrawal(data){
		try{
			const email = await this.email;
			const amount = data.amount;
			const status = data.status;
			if(!amount || amount == '0' && status == true) return {error: true, message: "Please Enter valid Amount"}
			const user = await User.findOneAndUpdate({email}, {$set: { amount, auto_withdrawal: status }});
			if(!user) return {error: true, message: "Error Occured"}
			return {error: false, message: "Auto Withdarwal Enabled or Disabled"};
		}catch(err){
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async getAutoWithdrawal(){
		try{
			const email = await this.email;
			const user = await User.findOne({email}, {amount: 1, auto_withdrawal: 1});

			return{
				error: false,
				message: "Fetched Successfully",
				status: user.auto_withdrawal,
				amount: user.amount,
			}
		}catch(err){
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async getWithdrawalDetails(data){
		try{
			const date = data.date;
			const email = await this.email;
			const {token} = await UserApi.findOne({email}, {_id: 0, token: 1}) ;
			const headers = {
				"token": token
			};
			const startDate = new Date(date);
			startDate.setHours(0, 0, 0, 0);
			
			const endDate = new Date(date);
			endDate.setHours(23, 59, 59, 999);
			const response = (await axios.get(`https://api-deposit.bharatpe.in/bharatpe-account/v1/txn/account-txn?sDate=${startDate.getTime()}&eDate=${endDate.getTime()}`, {headers})).data;
			return {error: false, message: response.message, data: {
				totalBalance: response.data.total_balance,
				totalAdition: response.data.total_addition,
				totalWithdrawal: response.data.total_withdrawal,
				openingBalance: response.data.opening_balance,
				closingBalance: response.data.closing_balance,
				totalInterest: response.data.total_interest_added,
				closingBalanceTime: new Date(response.data.closing_balance_time).toLocaleString('en-AS',{weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true}),
				withdrawalStatement: response.data.statement_details,
			}};
		}catch(err){
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async getTotalBalance(){
		try{
			const email = await this.email;
			const {token} = await UserApi.findOne({email}, {_id: 0, token: 1});
			const headers = {
				"token": token
			};
			const response = (await axios.get('https://api-deposit.bharatpe.in/bharatpe-account/v1/withdraw/total-balance?is_p2p=false', {headers})).data;
			return {error: false, message: response.message, data: {
				totalBalance: response.data.total_balance,
				totalWithdrawalBalance: response.data.total_withdraw_able_balance,
				totalAmountHold: response.data.total_hold_amount
			}};
		}catch(err){
			console.error(err)
			throw new Error('Internal Server Error');
		}
	}
	async withdrawalAmount(data){
		try{
			const email = await this.email;
			const amount = data.amount;
			const {token} = await UserApi.findOne({email}, {_id: 0, token: 1});
			const headers = {
				"token": token
			};
			const response = (await axios.post('https://api-deposit.bharatpe.in/bharatpe-account/v1/withdraw/confirm', {"meta":{},"payload":{"amount":amount,"enable_auto_settle":false,"payout_type":null,"p2p":false,"withdraw_type":"NEFT_BANK_TRANSFER"}} ,{headers})).data;
			if(!response.success && response.status_code != '201') return {error: true, message: response.message}
			return {error: false, message: 'Withdrawal Success'};
		}catch(err){

		}
	}
}
exports.UserHandler = UserHandler;