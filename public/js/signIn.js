const loginForm = document.getElementsByName('login')
const signInError = document.querySelector('.signin-error')
const requiredFieldError = document.getElementsByClassName('required-error')

loginForm[0]?.addEventListener('submit', async (e) => {
    e.preventDefault()

    const { action, method, email, password } = e.target

    if (signInError && signInError.textContent) {
        signInError.textContent = ''
    }

    if (email?.value && password?.value) {
            const response = await fetch(action, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email.value,
                    password: password.value 
                })
            })
            const auth = await response.json()
            const { error } = auth
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