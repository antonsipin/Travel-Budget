const registerForm = document.getElementsByName('signup')
const signUpError = document.querySelector('.signup-error')

registerForm[0]?.addEventListener('submit', async (e) => {
    e.preventDefault()

    const { action, method, name, email, password } = e.target

    if (signUpError && signUpError.textContent) {
        signUpError.textContent = ''
    }

    if (name?.value && email?.value && password?.value) {
            const response = await fetch(action, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: name.value,
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
                    
                    registerForm[0].reset()
                } else {
                    signUpError.insertAdjacentText('afterbegin', `${error}`)
                    registerForm[0].reset()
                    if (requiredFieldError.length) {
                        for (let i = 0; i <= requiredFieldError.length; i++) {
                            if (requiredFieldError[i] && requiredFieldError[i].textContent) {
                                requiredFieldError[i].textContent = ''
                            }
                        }
                    }
                }
            } else if (response.status === 500) {
                signUpError.insertAdjacentText('afterbegin', 'Something went wrong')
                registerForm[0].reset()
            } else if (response.status === 200) {
                window.location.replace('http://localhost:3100/account')
            }
    } else {
        for (let i = 0; i <= requiredFieldError.length; i++) {
            if (requiredFieldError[i] && !requiredFieldError[i].textContent) {
                requiredFieldError[i]?.insertAdjacentText('afterbegin', 'Required field')
            }
        }
        registerForm[0].reset()
    }
})