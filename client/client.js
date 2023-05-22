let btn = document.getElementById('login-btn')
btn.addEventListener('click', function (event) {
    event.preventDefault();
    CreateUser();
})

function CreateUser() {
    // post data
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        body: JSON.stringify({
            username: document.getElementById('userName').value,
            password: document.getElementById('password').value,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) =>response.json())
        .then((json) => {
            console.log('json......', json);

        });
};


const signinFormBtn = document.getElementById('signInForm');
const usernameInput = document.getElementById('singnInUserName');
const passwordInput = document.getElementById('singnInPassword');
const loginForm = document.getElementById('login-form');


signinFormBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  console.log(usernameInput.value);
  console.log(passwordInput.value);

  const username = usernameInput.value;
  const password = passwordInput.value;
  console.log('pppppppppppppppp', password);

  const response = await fetch('http://localhost:3000/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.message);
    const successMessage = document.getElementById('success');
    successMessage.textContent = 'Sign-in successful';
    loginForm.reset();
  } else if (response.status === 401) {
    console.log('Invalid username or password');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'Invalid username or password';
  } else {
    console.log('An error occurred');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = 'An error occurred';
  }
});
