const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')
const spinnerBox = document.getElementById('spinner-box')
const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')

const titleInput = document.getElementById('id_title') // id generated by 
const bodyInput = document.getElementById('id_body') // id generated by 
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value



const handleAlert = (type , message) =>{
    alertBox.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `
    $("#alert-box").fadeIn(3000).fadeOut(5000); 
}


backBtn.addEventListener('click',()=>{
    history.back()
})

// URLS
window_url = window.location.href.split("/")
main_url = window_url.slice(0, window_url.length - 1).join("/")
pk = window_url[window_url.length - 1]

url = main_url + '/data/' + pk
update_url = main_url + '/update/' + pk
delete_url = main_url + '/delete/' + pk


// Forms
const updateForm =  document.getElementById('update-form');
const deleteForm =  document.getElementById('delete-form');

$.ajax({
    'type' : 'GET',
    'url' : url ,
    'success' : response =>{
        console.log(response.data)
        const data = response.data
        if(data.logged_in == data.author){
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }
        const postTitle = document.createElement('h3')
        postTitle.setAttribute('class','mt-3')
        postTitle.setAttribute('id','post-title')

        const postBody = document.createElement('p')
        postBody.setAttribute('class','mt-1')
        postBody.setAttribute('id','post-body')
        
        postTitle.textContent = data.title
        postBody.textContent = data.body

        postBox.appendChild(postTitle)
        postBox.appendChild(postBody)

        titleInput.value = data.title
        bodyInput.value = data.body

        spinnerBox.classList.add('not-visible')
    },
    'error': error => console.log('error')
})


updateForm.addEventListener('submit', e =>{
    e.preventDefault()

    const title = document.getElementById('post-title')
    const body = document.getElementById('post-body')

    $.ajax({
        type: 'POST',
        url: update_url,
        data:{
            'csrfmiddlewaretoken' : csrf,
            'title' : titleInput.value,
            'body' : bodyInput.value
        },
        success: response =>{
            handleAlert('success', 'Updated Successfully')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: error => console.log(error)
    })
})

deleteForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: delete_url,
        data:{
            'csrfmiddlewaretoken' : csrf,
        },
        success: response =>{
            window.location.href = window.location.origin 
            localStorage.setItem('title', titleInput.value)
        },
        error: error => console.log(error)
    })
})