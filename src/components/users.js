class Users {
  constructor() {
    this.users = []
    this.initBindingsAndEventListeners()
    this.adapter = new UsersAdapter()
    this.fetchAndLoadUsers()
  }

  initBindingsAndEventListeners() {
    this.usersForm = document.getElementById('sign-in-create-form')
    this.userInput = document.getElementById('new-user-body')
    this.usersNode = document.getElementById('users-container')
    this.usersForm.addEventListener('submit',this.handleAddUser.bind(this))
    // this.usersNode.addEventListener('click',this.handleDeleteNote.bind(this))
  }

  fetchAndLoadUsers() {
    this.adapter.getUsers()
    .then( usersJSON => usersJSON.forEach( user => this.users.push( new User(user) )))

      .then( this.render.bind(this) )
      .catch( () => alert('The server does not appear to be running') )
  }

  handleAddUser() {
    event.preventDefault()
    const body = this.userInput.value
    this.adapter.createUser(name)
    .then( (userJSON) => this.users.push(new User(userJSON)) )
    .then(  this.render.bind(this) )
    .then( () => this.userInput.value = '' )
  }

  // handleDeleteNote() {
  //   if (event.target.dataset.action === 'delete-' && event.target.parentElement.classList.contains("note-element")) {
  //     const noteId = event.target.parentElement.dataset.userid
  //     this.adapter.deleteNote(noteId)
  //     .then( resp => this.removeDeletedNote(resp) )
  //   }
  // }

  // removeDeletedNote(deleteResponse) {
  //   this.users = this.users.filter( note => note.id !== deleteResponse.noteId )
  //   this.render()
  // }

  usersHTML() {
    return this.users.map( user => user.render() ).join('')
  }

  render() {
    this.usersNode.innerHTML = `<ul>${this.usersHTML()}</ul>`
  }
}
