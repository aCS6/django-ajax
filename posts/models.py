from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile
# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User , blank=True)
    author = models.ForeignKey(Profile , on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.title}"
    
    @property
    def like_count(self):
        return self.liked.all().count()
    
    @property
    def get_photos(self):
        return self.photo.all()

    class Meta:
        ordering = ("-created_at",)


class Photo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="photo")
    image = models.ImageField(upload_to="photos")
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post.title} - {self.pk}"