"use strict";

var csrftoken;

$(document).ready(function() {

    csrftoken = $("input[name=csrfmiddlewaretoken]").val();
    $("input[name=csrfmiddlewaretoken]").remove();

    var num_img = 1,
        time_img = 1000;

    $(window).on("popstate", function(ev){
        info_content(window.location.pathname, false);
    })

    if (window.location.pathname == "/") {
        logo_text = $(".navigation__logo").html();
        activeShop();
    } else {
        logo_text = $(".navigation__logo").html().split("%PC%")[0];
        $(".navigation__logo").html($(".navigation__logo").html().split("%PC%")[1]);
    }

    function info_content(hrefA, pushState) {

        $(".scale").animate({top: $(window).height() * 0.05}, 200);
        $("html").animate({scrollTop: 0}, 200);
        if (menu == 1) $(".menu__switch").click();
        $("a[disabled]").removeAttr("disabled");
        $('a[href="' + hrefA + '"]').attr("disabled", "disabled");

        if (hrefA == "/") {
            if (pushState) window.history.pushState({route: hrefA}, "PixelCore", hrefA);
            if (s == -1) activeShop();

            $("#progress").fadeIn(0).animate({width: "100%"}, 200);
            $("#progress").fadeOut(500, function(){ $(this).css("width", "0"); });

            $(".navigation__logo").fadeOut(200);
            $("#info__content").fadeOut(200, function(){
                toggleShop(true);
                $(this).html("");
            });
            return;
        }

        $.ajax({
                type: "POST",
                contentType: "application/json",
                url: hrefA,
                xhr: function(){
                    var xhr = new window.XMLHttpRequest();
                    xhr.addEventListener("progress", function(evt){
                        if (evt.lengthComputable) {
                            var percent = evt.loaded / evt.total * 100;
                            $("#progress").fadeIn(0).animate({width: percent + "%"}, 200);
                            if (percent == 100) $("#progress").fadeOut(500, function(){ $(this).css("width", "0"); })
                        }
                    }, false);
                    return xhr;
                },
                success: function(result) {
                        if (result["html"] === null) return;
                        var component = (window.location.pathname == "/") ? "#shop" : "#info__content";
                        if (s != -1) toggleShop(false);
                        if (pushState) window.history.pushState({route: hrefA}, result["title"], hrefA);
                        $(".navigation__logo").fadeOut(200);
                        $(component).fadeOut(200, function(){
                            $(".navigation__logo").html(result["title"]).fadeIn(200);
                            $("#info__content").html(result["html"]).fadeIn(200);
                            $("#info__content a").on("click", clickA);
                        });
                    },
            })
    }

    $("a").on("click", clickA)

    function clickA(ev) {
        var hrefA = $(this).attr("href").replace(window.location.origin, "");
        if (!hrefA.endsWith("/")) hrefA += "/";

        if (commn == 0 || window.location.pathname === hrefA) {
            $("html").animate({scrollTop: 0}, 200);
            ev.preventDefault();
            return;
        }

        if (hrefA.startsWith("/")){
            ev.preventDefault();

            info_content(hrefA, true);
        }
    }

    var slideshow = function slideshow() {
        $(".image__title > img:nth-child(" + num_img + ")").animate({
                opacity: 0
            },
            time_img,
            function() {
                $(this).removeClass("scale").css("display", "none");
            }
        );
        num_img++;
        if (num_img > $(".image__title > img").length) num_img = 1;
        var wer = 1.1 * $(window).height() - $(window).height();
        $(".image__title > img:nth-child(" + num_img + ")")
            .css({
                display: "block",
                top: 0.1 *
                    $(window).height() *
                    (0.5 -
                        $(window).scrollTop() /
                        ($(document).height() - $(window).height())) +
                    "px"
            })
            .animate({
                    opacity: 1
                },
                time_img
            )
            .addClass("scale");
    };

    $(".image__title > img:first-child")
        .css({
            display: "block",
            opacity: 1,
            top: 0.05 * $(window).height() + "px"
        })
        .addClass("scale");

    setInterval(slideshow, 8000);

    $(window).on("scroll", function() {
        $(".scale").css(
            "top", 0.1 * $(window).height() *
            (0.5 - $(window).scrollTop() / ($(document).height() - $(window).height())) + "px"
        );
        if ($(window).scrollTop() != 0) {
            $("#nav").addClass("navigation-darken");
        } else {
            $("#nav").removeClass("navigation-darken");
        }
    })

    var menu = 0,
        secondsMenu = 800,
        commn = 1;

    $(".menu__switch").on("click", function() {
        if (commn == 1) {
            commn = 0;

            if (menu == 0) {
                $(this).addClass("open");
            } else {
                $(this).removeClass("open").addClass("close");
            }

            $(".menu > a:not([disabled])").each(function(index, el) {
                setTimeout(
                    function(el) {
                        $(el).fadeToggle(secondsMenu).toggleClass("anim");
                    },
                    index * 100,
                    el
                );
            });
            $(".menu").toggleClass("visible");
            $(".menu > span").fadeToggle(secondsMenu);
            setTimeout(function() {
                $(".menu__switch").removeClass("close");
                menu = menu == 0 ? 1 : 0;
                commn = 1;
            }, secondsMenu - 300);
        }
    });
})