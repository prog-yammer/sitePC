"""
WSGI config for myshop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

sys.path.insert(0, "/home/u136938850/domains/u136938850.ha003.t.justns.ru/public_html/sitePC")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sitePC.settings')

application = get_wsgi_application()
