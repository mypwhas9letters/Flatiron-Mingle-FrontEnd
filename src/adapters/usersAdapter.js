class UsersAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/users'
  }

  getUsers() {
    return fetch(this.baseUrl).then(response => response.json())
  }

  createUser(name, age, gender) {
    const userCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({name: name, age:age, gender:gender})
    }
    return fetch(this.baseUrl, userCreateParams).then(resp => resp.json())
  }

}
