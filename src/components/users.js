class Users {
  constructor() {
    this.users = []
    this.initBindingsAndEventListeners()
    this.adapter = new UsersAdapter()
    this.fetchAndLoadUsers()
    this.matchesArr = []
    this.sampleQuestions = ["Do you like to read?", "Do you like the outdoors?", "Do you like animals?", "Do you watch Game of Thrones?","Are you OK with alcohol?", "Have you ever been married?", "Do you like tattoos?", "Are you close to your family?", "Are you romantic?", "Do you play any sports?", "Do you want to have kids in the future?", "Are you multi-lingual?", "Do you like to snowboard/ski?", "Are you into art?"]
  }

  initBindingsAndEventListeners() {
    this.usersForm = document.getElementById('sign-in-create-form')
    this.userInput = document.getElementById('new-user-body')
    this.usersNode = document.getElementById('users-container')
    this.usersForm.addEventListener('submit',this.handleAddUser.bind(this))
  }

  fetchAndLoadUsers() {
    this.adapter.getUsers()
      .then( usersJSON => {
        usersJSON.forEach( user => this.users.push( new User(user) ))
      })
      .then( this.render.bind(this) )
      .catch( () => alert('The server does not appear to be running') )
    }

  handleAddUser() {
    event.preventDefault()
    const newName = this.userInput.value
    let x = []

    // check if name exists
    this.users.forEach(user => x.push(user.name))
    if (x.includes(newName)){
      for(let i in this.users){
        // User exists.
        if(this.users[i].name === newName){
          this.renderShowPage(this.users[i])
        }
      }
    }else{
      // User doesnt already exist.
      this.renderNewForm(newName)
    }
  }

  // Show sign up form
  renderNewForm(newName){
    let signInPage = document.getElementById('sign-in-page')
    event.target.parentElement.parentElement.style.backgroundImage = "url('')"
    signInPage.innerHTML = `<form> </form>`
    let questionString = ""
    for (let i = 0; i<this.sampleQuestions.length; i++){
      questionString += `${i+1}. ${this.sampleQuestions[i]}:<br> <input type='radio' name='${this.sampleQuestions[i]}' value="Yes">Yes <input type='radio' name='${this.sampleQuestions[i]}'  value="No">No<br>`
    }
    // Image: <input type="text"><br>
    // Bio:  <input type="field"><br>
    let formTemplate = `Welcome: ${newName}
    <form id="ageAndGender" >
      Age: <input type="number" min="18" max="100" value="18"><br>
      Gender: <input type='radio' name='gender' value="Male">Male <input type='radio' name='gender'  value="Female">Female<br>
      Image: <input type="text"><br>
      Bio:  <input type="field"><br>
    </form>
    <form name="${newName}" id="newUserAnswers">
      ${questionString}<input type="submit" value="Find your match">
    </form>`

    signInPage.innerHTML = formTemplate
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

    let ageandgender = document.getElementById("ageAndGender")
    let newage = ageandgender.elements[0].value
    let newgender = ""
      if(ageandgender.elements[1].checked === true){
        newgender = "Male"
      }else{
        newgender = "Female"
      }
      // create user and associate questions with user
    const newUser = this.adapter.createUser(ans.name, newage, newgender )
      .then( (userJSON) => {
        let u = new User(userJSON)
        this.users.push(u)
        let requests = params.map((question)=>{
          return u.questions.adapter.createQuestion(question, u.id)
        })
        return Promise.all(requests)
      })
      .then((requests) => {
        requests.forEach(request => {
          new Question(request.body, request.answer)
          this.users[this.users.length -1].questions.questions.push(request)
        })
          this.renderShowPage(this.users[this.users.length -1])
      })
  }

  renderShowPage(user){
    let signInPage = document.getElementById('sign-in-page')
    this.matchesArr = this.getLoveMatches(user)
    this.createShowPage(this.matchesArr)

    // const renderProfilePage = document.getElementById('seeprofile')
    // renderProfilePage.addEventListener("click", this.showProfilePage.bind(this))
  }

  createShowPage(array){
    let signInPage = document.getElementById('sign-in-page')
    let template = `
    <div class="ui container">
    <div>Filters:</div>
    <div id="genderSelector" class="ui labeled button">
      <div class="ui basic label">Gender:</div>
      <div class="ui button" id="bothgenders">Both</div>
      <div class="ui button" id="males">Male</div>
      <div class="ui button" id="females">Female</div>
    </div>
    <div class="ui labeled button">
      <form id="agefilter" >
        Min Age: <input type="number" min="18" max="100" value="18">
        Max Age: <input type="number" min="18" max="100" value="18">
      </form>
    </div>
    </div><br>
    <div class="ui four column doubling stackable grid">
    `
    let renderString = ""
    if (array === this.matchesArr){
      renderString = this.createhtmlstring(this.matchesArr)
    }else{
      renderString = this.createhtmlstring(array)
    }
    signInPage.innerHTML = template + renderString + `</div>`
    signInPage.style.backgroundImage = "url('')"

    const filterDiv = document.getElementById("genderSelector")
    filterDiv.addEventListener("click", this.filterMatches.bind(this))
  // const filterDiv = document.getElementById("genderSelector")
  // filterDiv.addEventListener("click", this.filterMatches.bind(this))
  }

  filterMatches(){
    const criteria = event.target.innerText
    let newarr = []
    if(criteria !== "Both"){
      for(let i in this.matchesArr){
        if (this.matchesArr[i].html.includes(criteria)){
          newarr.push(this.matchesArr[i])
          }
        }
      this.createShowPage(newarr)
    }else{
      this.createShowPage(this.matchesArr)
    }
  }

  createhtmlstring(matchesArr){
    let htmlstring = ""
    for(let i in matchesArr){
      htmlstring += matchesArr[i].html
    }
    return htmlstring
  }

  getLoveMatches(user){
    let matches = []
    for(let i in this.users){
      if(user !== this.users[i]){
        let match = this.calculateLovePercent(user, this.users[i])
        matches.push(match)
      }
    }
    let sortedMatches = matches.sort(function(a,b) {return (a.percentage > b.percentage) ? 1 : ((b.percentage > a.percentage) ? -1 : 0);} ).reverse()
    return sortedMatches
  }

  calculateLovePercent(user, user2){
    let newMatch = {
      name: user2.name,
      percentage: 0
    }
    let denom = 100/this.sampleQuestions.length
    let num = 0
    for(let i in this.sampleQuestions){
      //old user
      if (user.questions.hasOwnProperty('questions') === false){
        if(user.questions[i].answer === user2.questions[i].answer){
          num += denom
        }
      } else {
        if(user.questions.questions[i].answer === user2.questions[i].answer){
          num += denom
        }
      }
    }
    if(user2.img === null && user2.gender === "Male"){
      user2.img = "http://loyalkng.com/wp-content/uploads/2010/01/facebook-art-no-photo-image-batman-mickey-mouse-spock-elvis-rick-roll.jpg"
    }else if(user2.img === null && user2.gender === "Female"){
      user2.img = "https://www.qfeast.com/imret/u/d2t5ie.jpg"
    }
    num = (Math.round(100*num)/100)
    newMatch.percentage = num
    newMatch.html = `  <div class="column">
        <div class="ui fluid card" style="word-wrap:break-word">
          <div class="image">
            <img src=${user2.img} height="200">
          </div>
          <div class="content">
            <a id="seeprofile" data-id=${user2.id} class="header">Name: ${user2.name} <br>Gender: ${user2.gender} <br>Age: ${user2.age} <br>Compatability: ${num}%</a>
          </div>
        </div>
      </div>`
    return newMatch
  }
//
// <li> ${user2.name} | ${user2.age} | ${user2.gender} | <img src=${user2.img} height="200" width="200"> | Compatability: ${num}%  </li>
//
//     <div class="column">
//       <div class="ui fluid card">
//         <div class="image">
//           <img src=${user2.img} height="200" width="200">
//         </div>
//         <div class="content">
//           <a class="header">${user2.name} ${num}% </a>
//         </div>
//       </div>
//     </div>



  showProfilePage(){
    let signInPage = document.getElementById('sign-in-page')
    signInPage.innerHTML = "Profile Page"
  }





  usersHTML() {
    return this.users.map( user => user.render() ).join('')
  }

  render() {
  //  this.usersNode.innerHTML = `<ul>${this.usersHTML()}</ul>`
  }
}
