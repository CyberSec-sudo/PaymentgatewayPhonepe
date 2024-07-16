const register = async function(data) {
	try {
		const response = await fetch('/user/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const login = async function(data) {
	try {
		const response = await fetch('/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
            body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
const checkNumber = async function() {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/checkNumber', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const generateOtp = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/generateOtp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		    body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const verifyOtp = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/verifyOtp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
		    body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const deleteNum = async function() {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/deleteNum', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const fetchTransaction = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/fetchTransaction', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const utrChecker = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/utrChecker', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
const autoWithdrawal = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/autoWithdrawal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
const getAutoWithdrawal = async function() {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/getAutoWithdrawal', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
const getWithdrawalDetails = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/getWithdrawalDetails', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};

const getTotalBalance = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/getTotalBalance', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
const withdrawalAmount = async function(data) {
	try {
		const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt=')).split('=')[1];
		const response = await fetch('/user/withdrawalAmount', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(data)
		});
		return await response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
};
function logoutAndRedirect() {
	// Clear user session data (e.g., tokens stored in localStorage or cookies)
	document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Example for cookies

	// Redirect to the login page
	window.location.href = '/login';
}