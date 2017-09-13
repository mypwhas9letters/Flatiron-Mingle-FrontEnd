class QuestionsAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/questions'
  }

  getUsers() {
    return fetch(this.baseUrl).then(response => response.json())
  }

  createQuestion(obj) {
    const questionCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify(obj)
    }
    return fetch(this.baseUrl, questionCreateParams).then(resp => resp.json())
  }

}
