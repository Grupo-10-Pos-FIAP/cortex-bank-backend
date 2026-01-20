class User {
  constructor({ _id, username, email, password }) {
    this.username = username
    this.email = email
    this.password = password
    this.id = _id
  }

  isValid() {
    if (!this.username || !this.email || !this.password) {
      return false
    }
    
    return this.isPasswordStrong(this.password)
  }

  isPasswordStrong(password) {
    if (!password || password.length < 8) {
      return false
    }

    const hasLetter = /[a-zA-Z]/.test(password)
    if (!hasLetter) {
      return false
    }

    const hasNumber = /[0-9]/.test(password)
    if (!hasNumber) {
      return false
    }
    
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    if (!hasSpecialChar) {
      return false
    }

    return true
  }
}

module.exports = User