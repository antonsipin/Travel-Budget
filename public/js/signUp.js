const registerForm = document.getElementsByName('signup')
const signUpError = document.querySelector('.signup-error')

registerForm[0]?.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (signUpError && signUpError.textContent) {
        signUpError.textContent = ''
    }

    const registerData = new FormData(registerForm[0])
    const parseRegisterData = Object.fromEntries(registerData)
    const { name, email, password } = parseRegisterData

    if (name && email && password) {
            const response = await fetch('http://localhost:3100/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name,
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