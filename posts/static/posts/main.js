const postsBox = document.getElementById("posts-box");
const spinnerBox = document.getElementById("spinner-box");
const loadBtn = document.getElementById("load-btn");
const endBox = document.getElementById("end-box")

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
const alertBox = document.getElementById('alert-box')


const url = window.location.href

const handleAlert = (type , message) =>{
    alertBox.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `
    $("#alert-box").fadeIn(3000).fadeOut(5000); 
}


const deleted = localStorage.getItem('title')
if(deleted){
    handleAlert('danger', `${deleted} deleted`)
    localStorage.clear()
}

const getCookie = name => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const likeUnlikePosts = () =>{
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form=>{
        form.addEventListener('submit', e=>{
            e.preventDefault()
            const clickedId = e.target.getAttribute('data-from-id')
            const clickedBtnId = document.getElementById(`like-unlike-${clickedId}`)
            $.ajax({
                type: "POST",
                url: "/like-unlike/",
                data:{
                    'csrfmiddlewaretoken' : csrftoken,
                    'pk' : clickedId
                },
                success: response =>{
                    // console.log(response)
                    clickedBtnId.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
                },
                error: error => console.log(error)
            })

        })
    })
}

let visible = 3;

const getData = () => {
  $.ajax({
    type: "GET",
    url: `/data/${visible}`,
    success: (response) => {
      setTimeout(() => {
        spinnerBox.classList.add("not-visible");
        const data = response.data;
        data.forEach((element) => {
          postsBox.innerHTML += `
            <div class="card mb-2" >
                <div class="card-body">
                    <h5 class="card-title">${element.title}</h5>
                    <p class="card-text">${element.body}</p>
                </div>
                <div class="card-footer">
                    <div class="row">
                        <div class="col-2">
                            <a href="${url}post-detail/${element.id}" class="btn btn-primary">Details</a>
                        </div>
                        <div class="col-3">
                            <form class="like-unlike-forms" data-from-id="${element.id}">
                                
                                <button href="#" class="btn btn-primary" id="like-unlike-${element.id}">
                                    ${element.liked ? `Unlike (${element.count})` : `Like (${element.count})`}
                                </button>
                            </form>
                        </div>
                    </div>
                    
                </div>
            </div>
            `;
        });
        
        likeUnlikePosts() 
      }, 100);
        if(response.size === 0){
            endBox.textContent = 'No posts added yet'
        }
        else if (response.size <= visible ){
            loadBtn.classList.add('not-visible');
            endBox.textContent = 'No more post to show'
        }
    },
    error: error => console.log(error)
  });
};

loadBtn.addEventListener("click", () => {
  spinnerBox.classList.remove("not-visible");
  visible += 3;
  getData();
});

postForm.addEventListener('submit', e=>{
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '',
        data:{
            'csrfmiddlewaretoken' : csrf,
            'title' : title.value,
            'body' : body.value
        },
        success: response =>{
            postsBox.insertAdjacentHTML('afterbegin' , `
                <div class="card mb-2" >
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>
                    </div>
                    <div class="card-footer">
                        <div class="row">
                            <div class="col-2">
                                <a href="${url}post-detail/${response.id}" class="btn btn-primary">Details</a>
                            </div>
                            <div class="col-3">
                                <form class="like-unlike-forms" data-from-id="${response.id}">
                                    
                                    <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">
                                        Like (0)
                                    </button>
                                </form>
                            </div>
                        </div>
                        
                    </div>
                </div>
                ` 
            )
            likeUnlikePosts() 
            $('#addPostModal').modal('hide')
            postForm.reset()
            handleAlert('success', 'New post added !')
        },
        error: error =>{
            $('#addPostModal').modal('hide')
            handleAlert('dark', 'Something went worng')
        } 
    })
})

getData();
