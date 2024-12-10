import typing as tp
from dataclasses import dataclass

from bs4 import BeautifulSoup
from django.template.loader import render_to_string

from sitePC.utils.variables import NOT_EXTEND_FLAG


@dataclass
class HtmlContent:
    title: str
    main: str


def get_html_content(template_name: str, context: tp.Dict[str, tp.Any]) -> HtmlContent:
    context[NOT_EXTEND_FLAG] = True
    html = render_to_string(template_name, context)

    bs = BeautifulSoup(html, "html.parser")
    html_content = HtmlContent(title=bs.title.decode_contents(), main=bs.main.decode_contents().strip())
    return html_content
