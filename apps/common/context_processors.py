from .models import BackgroundImage, MenuLinks


def common_data(request):
   return {
       'background_images': BackgroundImage.objects.all(),
       'menu_links': MenuLinks.objects.all(),
   }
