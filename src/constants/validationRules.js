export const signInRules = {
	username: {required: true, minLength: 4,maxLength: 20,regex: "", error:"", type:"string"}, 
	email: {}, 
	password: {} 
}