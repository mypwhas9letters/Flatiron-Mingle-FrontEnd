class QuestionsAdapter {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api/v1/questions'
  }

  getUsers() {
    return fetch(this.baseUrl).then(response => response.json())
  }

  createQuestion(obj, userId) {
    const questionCreateParams = {
      method: 'POST',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({question:obj, user:userId})
    }
    return fetch(this.baseUrl, questionCreateParams).then(function(resp){
      return resp.json()})
  }

}
