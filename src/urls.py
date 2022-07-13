from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.AdminSite.site_title = "DJ-AJAX | Admin"
admin.AdminSite.site_header = "Admin Panel"
admin.AdminSite.index_title = "Django-ajax"


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('posts.urls'))
]

urlpatterns += static(settings.STATIC_URL , doument_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
