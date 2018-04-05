//flow: log in (or register), have all posts show, along w/ update/delete buttons, and createNewPost

//functions needed: logUserIn, registerUser, showRegisterForm, displayBtns, showIndexPage, create/edit/updatePosts, 
//checkPassword, checkUserName, showCreatePostForm, showUpdatePostForm, addPostToGallery, serverRequest

//misc questions: Forgotten password? (send email?)
//how to distinguish wrong password (i.e., existing user) from misspelled username?  


let loggedIn = false;

//BUTTONS
const loginTitle = document.getElementById('loginTitle');
const loginBtn = document.getElementById("loginBtn");
const loginOpen = document.getElementById("loginOpen");
const registerBtn = document.getElementById("registerBtn");
const registerTitle = document.getElementById('registerTitle');
const createBtn = document.getElementById("createBtn");
let deleteBtn;

//MODALS AND OPENS
const createOpen = document.getElementById("createOpen");
let updateOpens;
let deleteOpens;
const modalSection = document.getElementById("modalSection");
const createModal = document.getElementById('createModal');
const createModalHeader = document.getElementById('createModalHeader');

//INPUT FIELDS
let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
const userWelcome = document.getElementById('userWelcome');
const imageGallery = document.getElementById('gallery');
const galleryRow = document.getElementsByClassName('row')[0];
//REGISTER NEW USER INPUT FIELDS
let newUserNameInput = document.getElementById("newUsername");
let newPasswordInput = document.getElementById("newPassword");
let mongooseId;
let inputId;

//CAPTURE FIELDS INSIDE CREATEPOST MODAL
let imageUrlInput= document.getElementById('createImageURL');
let titleInput= document.getElementById('createTitle');
let contentInput= document.getElementById('createContent');
let titleVal;
let contentVal;
let imageVal;

//CAPTURE FIELDS INSIDE UPDATEPOST MODAL
let updateImageInput= document.getElementById('updateImageURL');
let updateTitleInput= document.getElementById('updateTitle');
let updateContentInput= document.getElementById('updateContent');
let updatedTitle;
let updatedContent;
let updatedImage;

//EVENT LISTENERS
loginBtn.addEventListener("click", logIn);
registerBtn.addEventListener("click", registerNewUser);
createBtn.addEventListener("click", createPost);
// updateBtn.addEventListener("click", updatePost);
createOpen.addEventListener("click", showCreateModal);
// updateOpen.addEventListener("click", showUpdateModal);


//MESSAGES/ALERTS
const wrongUserName = 'Sorry, this user does not exist.  Please check the spelling or register a new account.';
const wrongPassword = 'Sorry, this password is incorrect';
const nameTaken = 'Sorry, that user already exists';
const postErrorMsg = 'Please fill in all fields and try submitting again';
const deleteWarning = 'Are you sure you want to delete your post?';
// const registerSuccessMsg = `Thanks for registering, ${username}!  Welcome to the Great Outdoors`;


//make function to be usable everywhere that attaches bearerToken to all requests
//this is like making our own getJSON
//serverRequest will reuse bearerToken, attach it to all requests going forward
//this method allows us to attach bearerToken to all getJSON calls, which is a functionality regular getJSON
//doesn't have
//if success, change loggedIn to = true
// function serverRequest(requestURL, data, httpVerb, callback) {
//     //api/login will be the requestURL, or api/posts, etc.
//     //data can be $ajax, etc.
//     //also need httpVerb (GET, POST, etc.)
//     //callback does this without promises, callback will process data
//     //or you can return promise with $.getJSON
//     //httpVerb is built in to getJSON, but in .ajax this is under the type: 
//     // $.getJSON(requestURL, function(data) {
//     //     return data from serverRequest
//     //     callback(data); //if data was successfully returned, so have an if/else setup
//     //     will be returned wherever it was called
//     //     this can now be run inside logIn, with a globally set 
//     // })

//     // switch(httpVerb) {
//     //     case "GET" : 
//     //         return 
        
//     //     case "POST" : 
//     //         return 
        
//     //     case "PUT" : 
//     //         return 
        
//     //     case "DELETE" : 
//     //         return 
        
//     //     default: 
//     //         console.log("Not a valid HTTP request");
//     // }
// }

function serverRequest(requestURL, httpVerb, callback, data) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhttp.open(httpVerb, requestURL, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    if(data) {
        xhttp.send(JSON.stringify(data));
    } else {
        xhttp.send();
    }
}

//this logs the data captured via the server request (this is the callback run in the function right above)
function serverRequestcb(msg) {
    console.log(msg);
}

//sole purpose of this is to get bearerToken from server, so we can use it
function logIn(event) {
    event.preventDefault();
    let userNameVal;
    let passwordVal;
    let userVals;
    if(userNameInput.value && passwordInput.value) {
        userNameVal = userNameInput.value;
        passwordVal = passwordInput.value;
        userVals = {username: userNameVal, password: passwordVal};
        //log this user in w/ DB call
        serverRequest('/api/auth/login', "POST", serverRequestcb, userVals);
        //close loginModal
        loginBtn.setAttribute('data-dismiss', 'modal');
        //welcome message display   
        welcomeUser(userNameVal);
        //hide login and register modal Open btns
        hideLogins();
        //load all posts
        loadGallery();
        //show hidden createPost modal open button
        createOpen.style.display = 'inline-block';
    } else {
        //if user hasn't input username or password, give them a warning
        loginTitle.innerHTML+= addModalAlert(postErrorMsg);
    }
} //end of Login function

function checkPassword() {
    //run this inside logIn
    //find user in DB by passing in userNameInput

    let userNameToCheck;
    userNameToCheck = userNameInput.value;
    //check his password with what was just entered
    
    let passwordToCheck;
    passwordToCheck = passwordInput.value;

    //if they don't match, give warning message and keep login open
    //if they match, go to next()


}

function registerNewUser(event) {
    event.preventDefault();
    let newUserNameVal;
    let newPasswordVal;
    let newUserVals;
    if(newUserNameInput.value && newPasswordInput.value) {
        newUserNameVal = newUserNameInput.value;
        newPasswordVal = newPasswordInput.value;
        newUserVals = {username: newUserNameVal, password: newPasswordVal};
        //register this user
        serverRequest('/api/users', "POST", serverRequestcb, newUserVals);
        //close registerModal
        registerBtn.setAttribute('data-dismiss', 'modal');
        //welcome message display   
        welcomeUser(newUserNameVal);
        //hide login and register modal Open btns
        hideLogins();
        //show hidden createPost modal open button
        createOpen.style.display = 'inline-block';
    } else {
        registerTitle.innerHTML+= addModalAlert(postErrorMsg);
    }    
} //end of registerNewUser function

function welcomeUser(username) {
    //reveal welcome message for logged in user where loginOpen used to be
    userWelcome.style.display = 'inline-block';
    userWelcome.innerHTML = `Welcome ${username}`;
}

function hideLogins() {
    //hide loginOpen and registerOpen
    loginOpen.style.display = "none"; 
    registerOpen.style.display = "none"; 
}

function loadGallery() {
    serverRequest('/posts', "GET", loadGallerycb);
}

function loadGallerycb(msg) {
    let postsObj = JSON.parse(msg);
    let postsArray = postsObj.data;
    postsArray.forEach((post)=> {
        // mongooseId = post.id;
        // console.log(post, typeof post);
        galleryRow.innerHTML+= `
        <div id="${post.id}" class="col-xs-12 col-sm-4 col-md-3">
            <h3>${post.title}</h3>
            <a href="#" class="thumbnail">
            <img src="${post.image}" alt="${post.title}">
            </a>
            <p>${post.content}</p><br>
            <button type="button" class="btn btn-primary updateOpens" id="${post.id}-update" data-toggle="modal" data-target="#updateModal">
                Update post
            </button>
            <button type="button" class="btn btn-danger deleteOpens" id="${post.id}-delete" data-toggle="modal" data-target="#deleteModal">Delete</button>
        </div>
        `;

        //attach showUpdateModal listener to each updateOpen button as it is generated
        //this binds post ID to each eventListener's callback; when you click it from here on, it remembers this unique post ID
        // document.getElementById(`${post.id}-update`).addEventListener('click', showUpdateModal.bind(this, post.id));
        document.getElementById(`${post.id}-delete`).addEventListener('click', showDeleteModal.bind(this, post.id));
        
        // var li = document.createElement('li');
        // li.className = 'dynamic-link'; // Class name
        // li.innerHTML = dynamicValue; // Text inside
        // $('#links').appendChild(li); // Append it
        // li.onclick = dynamicEvent; // Attach the event!

    });
}

// function addModalOpenListeners(open) {
//     //$$$$$$$$$$$$$$$$$$$define opens below
//     //open is the name of an array of opens sharing the same class name
//     for(let i = 0; i < opens.length; i++) {
//         opens.push(document.getElementsByClassName(`${open}`)[i]);
//     }
//     open.addEventListener('click', showUpdateModal);
// }

// window.addEventListener('load', loadGallery);

function showCreateModal() {
    createModal.style.display = 'display-block';
}

function createPost() {
  //if all 3 fields are filled in, then send serverRequest
   if(titleInput.value && contentInput.value && imageUrlInput.value) {
    //make post object consisting of the 3 fields you're passing in:
    titleVal = titleInput.value;
    contentVal = contentInput.value;
    imageVal = imageUrlInput.value;
    let newPostObj = {title: titleVal, content: contentVal, image: imageVal};

    //add div element/thumbnail to gallery
    galleryRow.innerHTML+= `
        <div class="col-xs-12 col-sm-4 col-md-3">
            <h3>${titleVal}</h3>
            <a href="#" class="thumbnail">
            <img src="${imageVal}" alt="${contentVal}">
            </a>
            <p>${contentVal}</p><br>
            <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#updateModal" onclick="showUpdateModal">
                Update post
            </button>
            <button type="button" class="btn btn-danger deleteBtns">Delete</button>
        </div>
        `;
        createBtn.setAttribute('data-dismiss', 'modal');
        //sends post data to POST route on DB
        serverRequest('/posts', "POST", serverRequestcb, newPostObj);
        //adds image to user's index page?
        
   }
   else {
        createModalHeader.innerHTML+= addModalAlert(postErrorMsg);
   }
}//end of createPost function

function addModalAlert(warning) {
    return `
    <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>Oh snap!</strong> ${warning}.
    </div>
    `;
}

//***************************** */
//DELETE FUNCTIONS
//***************************** */

function showDeleteModal(postId) {
    console.log('reached delete modal', postId);
    return modalSection.innerHTML = `
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content" id="deletemodalContent">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body alert alert-danger alert-dismissible">
                    <strong>${deleteWarning}</strong>.
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="deleteBtn">Delete</button>
                </div>
            </div>
        </div>
    </div>
    `;
    deleteBtn = document.getElementById("deleteBtn");
    deleteBtn.addEventListener("click", deletePost.bind(this, postId));
}

function deletecb(msg) {
    console.log('reached delete cb');
    console.log(msg);
    let postObj = JSON.parse(msg);
    let postId = postObj.data.id;
    // let ids = [];
    // for(let i = 0; i < postArray.length; i++) {
    //     ids.push(postArray[i].id);
    // }
    // console.log(ids);
    // mongooseId = postArray[0].id;
    // console.log(postArray);
    // console.log(postArray[0]);
    // //this returns the ID):
    // console.log(postArray[0].id);

}
//runs on clicking delete button
function deletePost(postId) {
    console.log('reached delete post');
    //if clicked, delete this post from DB
    serverRequest('/posts/:'+postId, "DELETE", deletecb);
}


function addDeleteWarning() {
    return `
    <div class="alert alert-danger alert-dismissible">
        <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
        <strong>${deleteWarning}</strong>.
    </div>
    `;
}

//***************************** */
//UPDATE FUNCTIONS
//***************************** */
function showUpdateModal() {
    //fires when clicking updateOpen
    //its interior updateBtn fires updatePost to redo DOM, also fires serverRequest (PUT)
    return modalSection.innerHTML = `
    <div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content" id="updatemodalContent">
                <div class="modal-header">
                  <h5 class="modal-title" id="updateModalHeader">Update post</h5>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <form id="updateForm" action="/" method="PUT"></form> 
                  <div class="modal-body">
                      Title: <input type="text" name="title" placeholder="Title" id="updateTitle" required="true"><br>
                      Content: <input type="text" name="content" placeholder="Content" id="updateContent" required="true"><br>
                      Image: <input type="text" name="image" placeholder="Image URL" id="updateImageURL" required="true"><br>
                  </div>
                </form>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="updatePost" id="updateBtn">Update</button>
                  </div>
              </div>
            </div>
    </div>
    `;
}

function updatePost(event) {

    console.log(event);

    //fires when clicking updateBtn
    //get ID of post clicked on

    //sends updated data to PUT route on DB
    //grab updateBtn

    const updateBtn = document.getElementById("updateBtn");
    updatedImage = document.getElementById('updateImageURL').value;
    updatedTitle = document.getElementById('updateTitle').value;
    updatedContent = document.getElementById('updateContent').value;
    let updatedPostObj = {title: updatedTitle, content: updatedContent, image: updatedImage};
    galleryRow.innerHTML+= `
        <div class="col-xs-12 col-sm-4 col-md-3">
            <h3>${updatedTitle}</h3>
            <a href="#" class="thumbnail">
            <img src="${updatedImage}" alt="${updatedContent}">
            </a>
            <p>${updatedContent}</p><br>
            <button type="button" class="btn btn-primary updateOpens" data-toggle="modal" data-target="#updateModal">
                Update post
            </button>
            <button type="button" class="btn btn-danger deleteBtns">Delete</button>
        </div>
        `;
        updateBtn.setAttribute('data-dismiss', 'modal');
        // serverRequest('/posts/:id', "PUT", serverRequestcb, updatedPostObj);

//    else {
//         createModalHeader.innerHTML+= addModalAlert();
//    }
}




//************************************************************************************************************************** */
//************************************************************************************************************************** */
//************************************************************************************************************************** */

// function showUserIndexPage() {
    //     //only runs if user is logged in; if so, runs via "Show your posts" button
    //     //display modal of user's posts?  index page?
    //     //make API call to retrieve user's posts from DB
    //     // serverRequest()
    //     //create modal displaying those?
    //     //or remove from gallery all but that user's posts?
    // }

// function makeCreateModal(text, httpVerb) {
// function makeCreateModal() {
//     alert('Button clicked');
    // return modalSection.innerHTML = `
    // <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">
    //         <div class="modal-dialog" role="document">
    //           <div class="modal-content" id="createmodalContent">
    //             <div class="modal-header">
    //               <h5 class="modal-title" id="createModalHeader">Create stuff</h5>
  
    //             </div>
    //             <form id="createForm" action="/" method="POST"></form> 
    //               <div class="modal-body">
    //                   Title: <input type="text" name="title" placeholder="Title" id="createTitle" required="true"><br>
    //                   Content: <input type="text" name="content" placeholder="Content" id="createContent" required="true"><br>
    //                   Image: <input type="text" name="image" placeholder="Image URL" id="createImageURL" required="true"><br>
    //               </div>
    //             </form>
    //               <div class="modal-footer">
    //                 <button type="button" class="btn btn-primary" data-dismiss='modal' onclick="createPost()" id="createBtn">Create</button>
    //               </div>
    //           </div>
    //         </div>
    // </div>
    // `;
// }

