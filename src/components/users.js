class Users {
  constructor() {
    this.users = []
    this.initBindingsAndEventListeners()
    this.adapter = new UsersAdapter()
    this.fetchAndLoadUsers()
    this.sampleQuestions = ["Do you like to read?", "Do you like the outdoors?", "Do you like animals?", "Do you watch Game of Thrones?","Are you OK with alcohol?"]

  }

  initBindingsAndEventListeners() {
    this.usersForm = document.getElementById('sign-in-create-form')
    this.userInput = document.getElementById('new-user-body')
    this.usersNode = document.getElementById('users-container')
    this.usersForm.addEventListener('submit',this.handleAddUser.bind(this))
  }

  fetchAndLoadUsers() {
    this.adapter.getUsers()
      .then( usersJSON => usersJSON.forEach( user => this.users.push( new User(user) )))
      .then( this.render.bind(this) )
      .catch( () => alert('The server does not appear to be running') )
  }

  handleAddUser() {
    event.preventDefault()
    const newName = this.userInput.value
    let x = []
    this.users.forEach(user => x.push(user.name))
    if (x.includes(newName)){
      console.log("render show page ");
      // render show page
    }else{
      this.renderNewForm(newName)
    }
  }

  renderNewForm(newName){
    let signInPage = document.getElementById('sign-in-page')
    event.target.parentElement.style.backgroundImage = "url('')"
    signInPage.innerHTML = `<form> </form>`
    let questionString = ""
    for (let i = 0; i<this.sampleQuestions.length; i++){
      questionString += `${i+1}. ${this.sampleQuestions[i]}:<br> <input type='radio' name='${this.sampleQuestions[i]}' value="Yes">Yes <input type='radio' name='${this.sampleQuestions[i]}'  value="No">No<br>`
    }
    signInPage.innerHTML = `${newName}<form name="${newName}" id="newUserAnswers">${questionString}<input type="submit" value="Find your match"></form>`
    const submitNewUser = document.getElementById('newUserAnswers')

    submitNewUser.addEventListener("submit", this.handleFormFilled.bind(this))
  }

  handleFormFilled(newName){
    event.preventDefault()
    const ans = document.getElementById('newUserAnswers')
    var params = []
    for( var i=0; i< ans.elements.length; i++ ){
      if(ans.elements[i].checked === true){
        var ques = ans.elements[i].name;
        var answer = ans.elements[i].value;
        params.push({
          body: ques,
          answer: answer
        });
      }
    }

    // create user and associate questions with user
    const newUser = this.adapter.createUser(ans.name)
      .then( (userJSON) => {
        let u = new User(userJSON)
        this.users.push(u)
         console.log(1);
        return u
      })
      .then(user => {
        const questionPromise = Promise.resolve()
        for(let i in params){
          questionPromise.then(() =>{
          user.questions.adapter.createQuestion(params[i], user.id)})
          questionPromise.then(function(resp){
            let newQ = new Question(resp.body, resp.answer)
            user.questions.questions.push(newQ)

          })

          //
          // const q = user.questions.adapter.createQuestion(params[i], user.id)
          // q.then(function(resp){
          //   let newQ = new Question(resp.body, resp.answer)
          //   user.questions.questions.push(newQ)

          //})
        }
        questionPromise.then( () => {
          // this.users = []
          // this.fetchAndLoadUsers();
          this.renderShowPage(this.users[this.users.length -1])})

      })
  }


  // handleDeleteUser() {
  //   if (event.target.dataset.action === 'delete-' && event.target.parentElement.classList.contains("user-element")) {
  //     const userId = event.target.parentElement.dataset.userid
  //     this.adapter.deleteUser(userId)
  //     .then( resp => this.removeDeletedUser(resp) )
  //   }
  // }

  // removeDeletedUser(deleteResponse) {
  //   this.users = this.users.filter( user => user.id !== deleteResponse.userId )
  //   this.render()
  // }

  renderShowPage(user){
    let signInPage = document.getElementById('sign-in-page')

    let template = `<ul>`
    for(let i in this.users){
      template += `<li>${this.users[i].name}</li>`
    }
    signInPage.innerHTML = template + `</ul>`
    let matchesArr = this.getLoveMatches(user)
  }

  getLoveMatches(user){
    let matches = []
    for(let i in this.users){
      debugger
      let match = this.calculateLovePercent(user, this.users[i])
      matches.push(match)
    }

    // sort the list
    // return the list
  }

  calculateLovePercent(user, user2){
    let newMatch = {
      name: user2.name,
      percentage: 0,
      html: ``
    }
    let denom = this.sampleQuestions.length/100
    let num = 0

    for(let i in this.sampleQuestions){
      if(user.questions.questions[i] === user2.questions.questions[i]){
        num += denom
      }
    }

    newMatch.pecentage = num/100
    return newMatch
  }

  usersHTML() {
    return this.users.map( user => user.render() ).join('')
  }

  render() {
  //  this.usersNode.innerHTML = `<ul>${this.usersHTML()}</ul>`
  }
}
