export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

const isPassword = value =>
  passwordRegex.test(value) ? "" : "Invalid password format"

export default isPassword
