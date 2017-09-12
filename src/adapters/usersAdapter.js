class UsersAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/users'
  }

  getUsers() {
    return fetch(this.baseUrl).then(response => response.json())
  }

  createUser(name) {
    const userCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      name: JSON.stringify({name})
    }
    return fetch(this.baseUrl, userCreateParams).then(resp => resp.json())
  }

}
