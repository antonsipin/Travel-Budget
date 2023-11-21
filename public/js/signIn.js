const loginForm = document.getElementsByName('login')
const signInError = document.querySelector('.signin-error')
const requiredFieldError = document.getElementsByClassName('required-error')

loginForm[0]?.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (signInError && signInError.textContent) {
        signInError.textContent = ''
    }

    const loginData = new FormData(loginForm[0])
    const parseLogin = Object.fromEntries(loginData)
    const { email, password } = parseLogin

    if (email && password) {
            const response = await fetch('http://localhost:3100/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email,
                    password 
                })
            })
            const auth = await response.json()
            const { result, error } = auth
            if (response.status >= 400) {
                if (error === 'Missing Email or Password') {
                    for (let i = 0; i <= requiredFieldError.length; i++) {
                        requiredFieldError[i]?.insertAdjacentText('afterbegin', 'Required field')
                    }
                    
                    loginForm[0].reset()
                } else {
                    signInError.insertAdjacentText('afterbegin', `${error}`)
                    loginForm[0].reset()
                    if (requiredFieldError.length) {
                        for (let i = 0; i <= requiredFieldError.length; i++) {
                            if (requiredFieldError[i] && requiredFieldError[i].textContent) {
                                requiredFieldError[i].textContent = ''
                            }
                        }
                    }
                }
            } else if (response.status === 500) {
                signInError.insertAdjacentText('afterbegin', 'Something went wrong')
                loginForm[0].reset()
            } else if (response.status === 200) {
                window.location.replace('http://localhost:3100/account')
            }
    } else {
        for (let i = 0; i <= requiredFieldError.length; i++) {
            if (requiredFieldError[i] && !requiredFieldError[i].textContent) {
                requiredFieldError[i]?.insertAdjacentText('afterbegin', 'Required field')
            }
        }
        loginForm[0].reset()
    }
})