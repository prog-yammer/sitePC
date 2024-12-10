import typing as tp
from abc import ABC, abstractmethod
from dataclasses import asdict

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from sitePC.utils.html import get_html_content, HtmlContent


@method_decorator(csrf_exempt, name='dispatch') # TODO
class SplitView(View, ABC):
    template_name: str

    def context_data(self, request: HttpRequest) -> tp.Dict[str, tp.Any]:
        return {}

    def handle(self, request: HttpRequest, *args, **kwargs) -> None:
        ...

    def get(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        self.handle(request, *args, **kwargs)
        return render(request, self.template_name, self.context_data(request))

    @csrf_exempt
    def post(self, request: HttpRequest, *args, **kwargs) -> HttpResponse:
        self.handle(request, *args, **kwargs)
        html_content: HtmlContent = get_html_content(self.template_name, self.context_data(request))
        return JsonResponse(asdict(html_content), status=200)
