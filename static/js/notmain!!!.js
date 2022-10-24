"use strict";

let csrftoken;

$(document).ready(function () {

    csrftoken = $("input[name=csrfmiddlewaretoken]").remove().val();

    $(window).on("popstate", function () {
        main_content(window.location.pathname, false);
    })

    function main_content(hrefA, pushState) {
        $(window).off("scroll.content resize.content");

        $(".scale").animate({top: $(window).height() * 0.05}, 200);
        $("html").animate({scrollTop: 0}, 200);
        if (menu === 1) $(".menu__switch").click();
        $("a[disabled]").removeAttr("disabled");
        $('a[href="' + hrefA + '"]').attr("disabled", "disabled");

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: hrefA,
            xhr: function () {
                const xhr = new window.XMLHttpRequest();
                const progress = $("#progress");
                xhr.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        const percent = evt.loaded / evt.total * 100;
                        progress.fadeIn(0).animate({width: percent + "%"}, 200);
                        if (percent === 100) $("#progress").fadeOut(500, function () {
                            $(this).css("width", "0");
                        })
                    }
                }, false);
                return xhr;
            },
            success: function (result) {
                if (result["html"] === null) return;
                if (pushState) window.history.pushState({route: hrefA}, result["title"], hrefA);
                $(".navigation__logo").fadeOut(200);
                $("main").fadeOut(200, function () {
                    $(".navigation__logo").html(result["title"]).fadeIn(200);
                    $("main").html(result["html"]).fadeIn(200);
                    $("main a").on("click", clickA);
                });
            },
        })
    }

    function clickA(ev) {
        let hrefA = $(this).attr("href").replace(window.location.origin, "");
        if (!hrefA.endsWith("/")) hrefA += "/";

        if (menu_available === false || window.location.pathname === hrefA) {
            $("html").animate({scrollTop: 0}, 200);
            ev.preventDefault();
            return;
        }

        if (hrefA.startsWith("/")) {
            ev.preventDefault();
            main_content(hrefA, true);
        }
    }

    $("a").on("click", clickA)

    let time_img = 1000, num_img = 1;

    function slideshow() {
        $(".image__title > img:nth-child(" + num_img + ")").animate({
                opacity: 0
            },
            time_img,
            function () {
                $(this).removeClass("scale").css("display", "none");
                $(".image__title > img:nth-child(" + num_img + ")").css("z-index", 0);
            }
        );
        num_img++;
        if (num_img > $(".image__title > img").length) num_img = 1;
        $(".image__title > img:nth-child(" + num_img + ")")
            .css({
                display: "block",
                top: 0.1 * $(window).height() *
                    (0.5 - $(window).scrollTop() / ($(document).height() - $(window).height())) + "px",
                opacity: 1,
                zIndex: -10,
            })
            .addClass("scale");
    }

    $(".image__title > img:first-child")
        .css({
            display: "block",
            opacity: 1,
            top: 0.05 * $(window).height() + "px"
        })
        .addClass("scale");
    setInterval(slideshow, 8000);

    function main_scroll() {
        if ($(window).scrollTop() !== 0) {
            $("#nav").addClass("navigation-darken");
        } else {
            $("#nav").removeClass("navigation-darken");
        }

        $(".scale").css(
            "top", 0.1 * $(window).height() *
            (0.5 - $(window).scrollTop() / ($(document).height() - $(window).height()))
        );
    }

    $(document).on("scroll", main_scroll);

    let menu = 0,
        secondsMenu = 800,
        menu_available = true;

    $("div.menu__switch").on("click", function () {
        if (menu_available === true) {
            menu_available = false;

            if (menu === 0) {
                $(this).addClass("open");
            } else {
                $(this).removeClass("open").addClass("close");
            }

            $(".menu > a:not([disabled])").each(function (index, el) {
                setTimeout(
                    function (el) {
                        $(el).fadeToggle(secondsMenu).toggleClass("anim");
                    },
                    index * 100,
                    el
                );
            });
            $(".menu").toggleClass("visible");
            $(".menu > span").fadeToggle(secondsMenu);
            setTimeout(function () {
                $(".menu__switch").removeClass("close");
                menu = menu === 0 ? 1 : 0;
                menu_available = true;
            }, secondsMenu - 300);
        }
    });
})