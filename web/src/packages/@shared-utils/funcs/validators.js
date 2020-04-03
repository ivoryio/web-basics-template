/* eslint no-control-regex: 0 */
export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
export const urlRegex = /(https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/

export const required = value => {
  switch (typeof value) {
    case "string":
      return !value || !value.trim().length ? "Required" : ""
    case "object":
      if (value instanceof File) return ""
      return value == null || !Object.keys(value).length ? "Required" : ""
    default:
      break
  }
}

export const requiredBool = value =>
  !value || !value.trim().length ? true : ""

export const emailFormat = value =>
  emailRegex.test(value) ? "" : "Invalid email address format"

export const passwordFormat = value =>
  passwordRegex.test(value) ? "" : "Invalid password format"

export const passwordLength = value =>
  value.trim().length < 6
    ? "Password must contain a minimum of 6 characters"
    : ""
export const verificationCodeFormat = value =>
  /\b\d{6}\b/.test(value) ? "" : "Invalid verification code format"

export const urlFormat = value =>
  urlRegex.test(value) ? "" : "Invalid URL format"

export const positiveValue = value =>
  value > 0 ? "" : "Value must be positive number"
