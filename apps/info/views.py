from django.http import HttpRequest
from django.shortcuts import render

from sitePC.utils.split_view import SplitView


class Main(SplitView):
    def handle(self, request: HttpRequest, *args, **kwargs) -> None:
        self.template_name = f"info/{kwargs['pk']}.html"
