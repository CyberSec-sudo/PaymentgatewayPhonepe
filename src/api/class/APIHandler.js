

const {axios, UserApi, UserTransaction, mongoose} = require('../helper/includes')


class APIHandler {
	constructor(){
		//autoWithdrawal();
	}
	async addtransaction(data){
		const session = await mongoose.startSession();
		session.startTransaction();
		try {
			const {apikey, utrid} = data;

			const {merchantid, token, fingerprint, deviceFingerprint, email} = await UserApi.findOne({api_key: apikey}, {_id: 0, merchantid: 1, token: 1, deviceFingerprint: 1, fingerprint: 1, email: 1 }) 
			
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

			const check = await UserTransaction.findOne({utr: utrid}, {_id: 1})
			if(!check){
				const currentDateInKolkata = await this.getCurrentDate();
				const userData = {
					email: email,
					api_key: apikey,
					utr: response.data.utr,
					data: {
						name: response.data.customerDetails.userName,
						amount: response.data.amount / 100,
						utr: utrid,
						payment: response.data.paymentApp.paymentApp,
						time:response.data.transactionDate,
					},
					createdAt: currentDateInKolkata,
				}
				await new UserTransaction(userData).save({session});
				await session.commitTransaction();

			}
			return {
				message: !check ? "Transaction Added successfully": "Transaction Already Added",
				error: !check ? false: true,
				utr: response.data.utr,
				amount: response.data.amount / 100,
				name: response.data.customerDetails.userName,
				status: response.data.payResponseCode,
				payment: response.data.transactionDate,
				time: new Date(response.data.transactionDate).toLocaleString('en-AS', {
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric',
					hour12: true,
					timeZone: 'Asia/Kolkata',
				})
			};

			/*const {merchantid, token, email} = await UserApi.findOne({api_key: apikey}, {_id: 0, merchantid: 1, token: 1, email: 1}) 
			const currentDateInKolkata = await this.getCurrentDate();

			// Calculate the start date as 30 days before the current date
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
				const check = await UserTransaction.findOne({utr: utrid}, {_id: 1})
				const {amount, payerName: name, status, bankReferenceNo: utr, paymentTimestamp: time, payerHandle: payment} = transaction

				if(!check){
					const userData = {
						email: email,
						api_key: apikey,
						utr,
						data: {
							name: name,
							amount: amount,
							utr: utrid,
							payment: payment,
							time:time,
						},
						createdAt: currentDateInKolkata,
					}
					await new UserTransaction(userData).save({session});
					await session.commitTransaction();

				}
				return {
					message: !check ? "Transaction Added successfully": "Transaction Already Added",
					error: !check ? false: true,
					utr: utr,
					amount: amount,
					name: name,
					status: status,
					payment: payment,
					time: new Date(time).toLocaleString('en-AS', {
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
			await session.abortTransaction();
			console.error(err);
			throw new Error('Internal Server Error');
		}finally{
			await session.endSession();
		}
	}
	async autoWithdrawal(){
		setInterval(() => {
			console.log("true")
		}, 1000)
	}
	async getCurrentDate(){
		return new Date(new Date().toLocaleString('en-AS', {
			timeZone: 'Asia/Kolkata',
		}))
	}
	

}
exports.APIHandler = APIHandler;