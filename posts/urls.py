from django.urls import path
from .views import (
    post_create,
    load_post_data_view,
    like_unlike_post_view,
    post_detail,
    post_detail_data_view,
    update_post,
    delete_post
)

app_name = 'posts'

urlpatterns = [
    path('',post_create, name='post-list'),
    path('data/<int:num_posts>',load_post_data_view, name='post-data'),
    path('like-unlike/',like_unlike_post_view, name='like-unlike'),
    path('post-detail/<int:pk>',post_detail, name='post-detail'),
    path('post-detail/data/<int:pk>',post_detail_data_view, name='post-detail-data'),
    path('post-detail/update/<int:pk>',update_post, name='post-update'),
    path('post-detail/delete/<int:pk>',delete_post, name='post-delete')
]
