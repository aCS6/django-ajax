from django.http import JsonResponse
from django.shortcuts import render
from .models import Post
from .forms import PostForm
from profiles.models import Profile

# Create your views here.

def post_create(request):
    form = PostForm(request.POST or None)


    if request.is_ajax():
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title' : instance.title,
                'body' : instance.body,
                'author' : author.user.username,
                'id': instance.id
            })
    
    context = {
        "form": form
    }
    return render(request, 'posts/main.html' , context=context)

def load_post_data_view(request, **kwargs):
    if request.is_ajax():
        visible = 3
        upper = kwargs.get('num_posts')
        lower = upper - visible
        size = Post.objects.all().count()
        
        posts = Post.objects.select_related('author')\
                .prefetch_related('liked').all()[lower:upper]

        data = []
        for each in posts:
            data.append({
                'id' : each.id,
                'title' : each.title,
                'body' : each.body,
                'liked' : True if request.user in each.liked.all() else False,
                'count' : each.like_count,
                'author' : each.author.user.username
            })

        return JsonResponse({
                "data" : data,
                "size" : size
            })

def post_detail_data_view(request , pk):
    obj = Post.objects.filter(pk=pk).first()

    if obj:
        data = {
            'id' : obj.id,
            'title' : obj.title,
            'body' : obj.body,
            'author' : obj.author.user.username,
            'logged_in' : request.user.username
        }
        return JsonResponse({'data': data})

def post_detail(request, pk):
    post = Post.objects.get(pk=pk)
    form = PostForm() 

    context ={
        'post' : post,
        'form' : form
    }
    return render(request , 'posts/detail.html', context=context)
    
def like_unlike_post_view(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        post_obj = Post.objects.filter(pk = pk).first()

        if post_obj and request.user in post_obj.liked.all():
            liked = False
            post_obj.liked.remove(request.user)
        elif post_obj:
            liked = True 
            post_obj.liked.add(request.user)
        
        return JsonResponse({
            'liked' : liked,
            'count' : post_obj.like_count
        })


def update_post(request,pk):
    post = Post.objects.filter(pk=pk).first()
    if post:
        if request.is_ajax():
            post.title = request.POST.get('title')
            post.body = request.POST.get('body')
            post.save()
        return JsonResponse({
            'title' : post.title,
            'body' : post.body
        })
    return JsonResponse({})


def delete_post(request,pk):
    post = Post.objects.filter(pk=pk).first()
    if post:
        if request.is_ajax():
            post.delete()
            
    return JsonResponse({})