"""
This file was generated with the customdashboard management command and
contains the class for the main dashboard.

To activate your index dashboard add the following to your settings.py::
    GRAPPELLI_INDEX_DASHBOARD = 'sitePC.dashboard.CustomIndexDashboard'
"""
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from django.urls import reverse

from grappelli.dashboard import modules, Dashboard
from grappelli.dashboard.utils import get_admin_site_name

from apps.info.views import stats
from apps.shop.apps import ShopConfig
from apps.info.apps import InfoConfig
from apps.payments.apps import PaymentsConfig


class CustomIndexDashboard(Dashboard):
    """
    Custom index dashboard for www.
    """

    def init_with_context(self, context):
        site_name = get_admin_site_name(context)

        # append an app list module for "Applications"
        self.children.append(modules.ModelList(
            ShopConfig.verbose_name,
            collapsible=True,
            column=1,
            css_classes=(),
            models=('apps.shop.*',),
        ))

        self.children.append(modules.ModelList(
            InfoConfig.verbose_name,
            collapsible=True,
            column=1,
            css_classes=(),
            models=('apps.info.*',),
        ))

        self.children.append(modules.ModelList(
            PaymentsConfig.verbose_name,
            collapsible=True,
            column=2,
            css_classes=(),
            models=('apps.payments.*',),
        ))

        self.children.append(modules.DashboardModule(
            'Статистика',
            collapsible=True,
            column=1,
            css_classes=('grp-closed', 'statsPC'),
            # pre_content=render_to_string("info/main.html", stats()),
        ))

        # self.children.append(modules.AppList(
        #     "Приложения",
        #     collapsible=True,
        #     column=1,
        #     css_classes=('collapse closed',),
        #     models=('apps.info.*', 'apps.payments.*'),
        # ))

        # append an app list module for "Applications"


        # # append a group for "Administration" & "Applications"
        # self.children.append(modules.Group(
        #     _('Group: Administration & Applications'),
        #     column=1,
        #     collapsible=True,
        #     children=[
        #         modules.AppList(
        #             _('Administration'),
        #             column=1,
        #             collapsible=False,
        #             models=('django.contrib.*',),
        #         ),
        #         modules.AppList(
        #             _('Applications'),
        #             column=1,
        #             css_classes=('collapse closed',),
        #             exclude=('django.contrib.*',),
        #         )
        #     ]
        # ))

        # # append an app list module for "Administration"
        # self.children.append(modules.ModelList(
        #     _('ModelList: Administration'),
        #     column=1,
        #     collapsible=False,
        #     models=('django.contrib.*',),
        # ))

        # # append another link list module for "support".
        # self.children.append(modules.LinkList(
        #     _('Support'),
        #     column=2,
        #     children=[
        #         {
        #             'title': _('Django Documentation'),
        #             'url': 'http://docs.djangoproject.com/',
        #             'external': True,
        #         },
        #         {
        #             'title': _('Grappelli Documentation'),
        #             'url': 'http://packages.python.org/django-grappelli/',
        #             'external': True,
        #         },
        #         {
        #             'title': _('Grappelli Google-Code'),
        #             'url': 'http://code.google.com/p/django-grappelli/',
        #             'external': True,
        #         },
        #     ]
        # ))
        #
        # # append a feed module
        # self.children.append(modules.Feed(
        #     _('Latest Django News'),
        #     column=2,
        #     feed_url='http://www.djangoproject.com/rss/weblog/',
        #     limit=5
        # ))

        # append a recent actions module
        self.children.append(modules.RecentActions(
            _('Recent actions'),
            limit=2,
            collapsible=False,
            column=3,
        ))
