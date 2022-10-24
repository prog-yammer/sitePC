"use strict";

var toggleShop, s = -1, logo_text;

function activeShop() {

    var scrTop,
        pixelcore = $(".greeting__title").html(), navLog = 0,
        shop = '<span class="shop">Магазин</span>';
    s = $(document).width() > 628 && $(window).height() > 650;

    toggleShop = function toggleShop(boolShop) {
        if (boolShop) {
            $("#shop").fadeIn(200);
            s = $(document).width() > 628 && $(window).height() > 650;
            $(".navigation__logo").html(logo_text).fadeIn(200);
        } else {
            navLog = 0;
            $("#traveler").stop();
            $(".shop").removeAttr("style");
            $(".greeting__title").removeAttr("style");
            s = 0;
        }
    }

    $(window).on("resize", function() {
        if (s == 0) return;
        $("#traveler").stop();
        s = $(document).width() > 628 && $(window).height() > 650;
    });

    var scroll = function scroll() {
        if (s == 0) return;
        scrTop = $(window).scrollTop();
        if (s) {
            if (scrTop >= $(".wrapper .shop").offset().top - 90 && navLog == 1) {
                navLog = 2;

                $("#traveler").stop();
                $(".shop").css("opacity", 0);
                $(".navigation__logo").html(shop).css("opacity", 0);
                $(".greeting__content").prepend('<h1 id="traveler" class="shop">Магазин</h1>');
                $("#traveler").text("Магазин")
                    .css({
                        display: "block",
                        fontSize: $(".wrapper .shop").css("font-size"),
                        top: $(".wrapper .shop").offset().top - scrTop,
                        left: $(".wrapper .shop").offset().left,
                    })
                    .animate({
                        fontSize: $(".navigation__logo").css("font-size"),
                        letterSpacing: ".1em",
                        top: $(".navigation__logo").position().top,
                        left: $(".navigation__logo").offset().left,
                    }, {
                        duration: 500,
                        always: function always() {
                            $("#traveler").remove();
                            $(".navigation__logo").removeAttr("style");
                        }
                    });
            } else if (scrTop < $(".wrapper .shop").offset().top - 90 && navLog == 2) {
                navLog = 1;
                $("#traveler").stop();
                $(".navigation__logo").css("opacity", 0);
                $(".greeting__content").prepend(
                    '<h1 id="traveler" class="navigation__logo">' + shop + "</h1>"
                );
                $("#traveler")
                    .css({
                        display: "block",
                        position: "absolute",
                        top: $(".navigation__logo").position().top + scrTop,
                        left: $(".navigation__logo").offset().left,
                    })
                    .animate({
                        fontSize: $(".wrapper .shop").css("font-size"),
                        letterSpacing: "0",
                        top: $(".wrapper .shop").offset().top,
                        left: $(".wrapper .shop").offset().left,
                    }, {
                        duration: 500,
                        always: function always() {
                            $("#traveler").remove();
                            $(".shop").removeAttr("style");
                            $(".navigation__logo").html(pixelcore).removeAttr("style");
                        }
                    });
            } else if (scrTop >= $(".greeting__info .greeting__title").offset().top - 100 && navLog == 0) {
                navLog = 1;

                $("#traveler").stop();
                $(".navigation__logo").html(pixelcore).css("opacity", 0);
                $(".greeting__title").css("opacity", 0);
                $(".greeting__content").prepend(
                    '<h1 id="traveler" class="greeting__title">' + pixelcore + "</h1>"
                );
                $("#traveler")
                    .css({
                        display: "block",
                        top: $(".greeting__info .greeting__title").offset().top - scrTop,
                        left: $(".greeting__info .greeting__title").offset().left,
                    })
                    .animate({
                        fontSize: $(".navigation__logo").css("font-size"),
                        letterSpacing: ".1em",
                        top: 23,
                        left: $(".navigation__logo").position().left,
                    }, {
                        duration: 500,
                        always: function always() {
                            $("#traveler").remove();
                            $(".navigation__logo").removeAttr("style");
                        }
                    });
            } else if (scrTop <= $(".greeting__info .greeting__title").offset().top - 100 && navLog == 1) {
                navLog = 0;

                $("#traveler").stop();
                $(".navigation__logo").css("opacity", 0);
                $(".greeting__content").prepend(
                    '<h1 id="traveler" class="navigation__logo">' + pixelcore + "</h1>"
                );
                console.log($(".greeting__info .greeting__title").position().top,$(".greeting__info .greeting__title").position().top);
                $("#traveler")
                    .css({
                        display: "block",
                        position: "absolute",
                        top: 23 + scrTop,
                        left: $(".navigation__title .navigation__logo").offset().left,
                    })
                    .animate({
                        fontSize: $(".greeting__info .greeting__title").css("font-size"),
                        top: $(".greeting__info .greeting__title").position().top - 2,
                        left: $(".greeting__info .greeting__title").offset().left,
                    }, {
                        duration: 500,
                        always: function always() {
                            $("#traveler").remove();
                            $(".greeting__title").removeAttr("style");
                            $(".navigation__logo").html(logo_text).removeAttr("style");
                            //$(".greeting__info .greeting__title").removeAttr("style")
                        }
                    });
            }
        } else {
            if (scrTop >= $(".wrapper .shop").offset().top - 90 && navLog == 1) {
                navLog = 2;
                $(".shop").animate({
                    opacity: 0
                });
                $(".navigation__logo").text("Магазин");
            } else if (scrTop < $(".wrapper .shop").offset().top - 90 && navLog == 2) {
                navLog = 1;
                $(".shop").animate({
                    opacity: 1
                });
                $(".navigation__logo").html(pixelcore);
            } else if (scrTop >= $(".greeting__info .greeting__title").offset().top - 100 && navLog == 0) {
                navLog = 1;
                $(".greeting__title").animate({
                    opacity: 0
                });
                $(".navigation__logo").html(pixelcore);
            } else if (scrTop <= $(".greeting__info .greeting__title").offset().top - 100 && navLog == 1) {
                navLog = 0;
                $(".greeting__title").animate({
                    opacity: 1
                });
                $(".navigation__logo").text(logo_text);
            }
        }
    };

    setTimeout(function() {
        $(window).scrollTop(0).scrollLeft(0).on("scroll", scroll);
    }, 200);

    setInterval(function() {
        if (s == 0) return;
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/info/online/",
            headers: {
                "X-CSRFToken": csrftoken
            },
            success: function success(result) {;
                if (result["status"] == "success") {
                    $("#online").text(result["online"]);
                }
            }
        })
    }, 6e4)

    $("#ip").on("click", function() {
        var $tmp = $("<input>");
        $(".header").append($tmp);
        $tmp.val($("#ip").text());
        $tmp.select();
        document.execCommand("copy");
        $tmp.remove();
        $tmp = 0;
        $(".message.success").fadeIn(500);
        setTimeout(function() {
            $(".message.success").fadeOut(500);
        }, 1500);
    });

    var notprod = "Товар недоступен";
    $(".dialog").on("click", function(e) {
        var dialclass = $(e.target).attr("class");

        if (dialclass == "dialog" || dialclass == "btn") {
            clearTimeout(nicktime);
            clearTimeout(couptime);
            coupon = "-";
            if (nickajaxflag == 1) nickajax.abort();
            if (coupajaxflag == 1) coupajax.abort();
            id = -1;
            c = 0;
            $(".modal").fadeOut();
            $(".modal__wrapper").addClass("zoomOut");
            setTimeout(function() {
                $(".modal__wrapper").removeAttr("style");
                $(".modal__container").removeAttr("style");
                $(".modal__methods").css({
                    display: "none"
                });
                $(".modal__buy-button").removeAttr("disabled");
                $(".modal__buy-button > span").text("Купить");
                $("#coupon").attr("placeholder", "Купон на скидку");
                $(".modal__wrapper.zoomOut").removeClass("zoomOut");
                $("#sale").text("");
                $(".modal__details > h2").text("");
                $(".cost__value").data("cost", "");
                $(".cost__value > h2").text("");
                $(".pre-formatted").text("");
                $("#coupon")
                    .val("")
                    .removeClass("form__input-success")
                    .removeClass("form__input-error");
                $("#i2.input__clear").fadeOut();

                if (nickon != 1 && nickon != -5) {
                    $("#i1.input__clear").fadeOut();
                    $("#nickname").val("").removeClass("form__input-error");
                    $("small").slideUp(100, function(){ $(this).remove(); });
                }
            }, 500);
        }
    });

    $(".categories > li:first-child").addClass("active");
    $(".subcategories > li:nth-child(2)").addClass("active");
    var tprev = $(".categories > li:first-child").data("category-id");
    var tprevsub = $(".subcategories > li:nth-child(2)").data("subcategory-id");
    $(".subcategories > li[data-category-id!=" + tprev + "]").hide();
    $('div.card[data-category-id!="' + tprev + ":" + tprevsub + '"]').hide();
    var checkels = $(".subcategories > li[data-check]").removeAttr("data-check");
    var checkarr = [];

    for (var _i = 0; _i < checkels.length; _i++) {
        checkarr.push($(checkels[_i]).data("subcategory-id"));
    }

    checkels = $(".dialogue div");

    for (var _i2 = 0; _i2 < checkels.length; _i2++) {
        $(".greeting__description").text(
            $(".greeting__description").text() + $(checkels[_i2]).text()
        );
    }

    checkels = null;
    var products = eval("{obj:[" + $("#info__products").text() + "]}")[0];
    $("#info__products").remove();
    var dli = 1,
        parentcl,
        sub;
    var subhs = 500;
    $("#categories li").on("click", function(el) {
        el = el.currentTarget;

        if (dli == 1) {
            dli = 0;
            setTimeout(function() {
                dli = 1;
            }, 1000);
            parentcl = $($(el).parent()).attr("class");
            $('div[data-category-id="' + tprev + ":" + tprevsub + '"]').addClass(
                "zoomOut"
            );

            if (parentcl == "categories") {
                $(".categories > li.active").removeClass("active");
                $(".subcategories").height($(".subcategories").height());
                $(".icon-subcategories").fadeOut(subhs);
                $(".subcategories > li[data-category-id=" + tprev + "]").fadeOut(
                    subhs,
                    function() {
                        $(this).removeClass("active");
                        sub.fadeIn(subhs);
                        $(".icon-subcategories").fadeIn(subhs);
                        $(".subcategories").removeAttr("style");
                    }
                );
                tprev = $(el).data("category-id");
                sub = $(".subcategories > li[data-category-id=" + tprev + "]");
                $(sub[0]).addClass("active");
                tprevsub = $(sub[0]).data("subcategory-id");
            } else if (parentcl == "subcategories") {
                tprevsub = $(el).data("subcategory-id");
                $(".subcategories > .active").removeClass("active");
            }

            $(el).addClass("active");
            setTimeout(function() {
                $(".gray-area").height($(".wrapper").innerHeight());
                $(".card.zoomOut").removeClass("zoomOut").hide();
                $('div[data-category-id="' + tprev + ":" + tprevsub + '"').show().addClass("zoomIn");
                $(".gray-area").animate({height: $(".wrapper").innerHeight()}, 500, function(){$(this).removeAttr("style")});
                setTimeout(function() {
                    $(".card.zoomIn").removeClass("zoomIn");
                }, 1000);
            }, 500);
        }
    });
    var nicktime,
        nickmain = "",
        sym = /^[a-zA-Z0-9]+$/;
    var coupon = "-",
        nickon = 0,
        w;
    var nick = localStorage.getItem("nickname"),
        foc = "#nickname";

    if (nick !== null && typeof nick !== "undefined" && sym.test(nick)) {
        nickon = -5;
        $("#nickname").val(nick);
        $("#i1.input__clear").fadeIn();
    } else {
        nick = "";
        localStorage.removeItem("nickname");
    }

    var id = -1, c, cws;
    $(".card").on("click", function(el) {
        id = $(el.currentTarget).data("item-id");
        var p = products[id];
        c = p["price"];
        cws = c;
        $(".modal__details").data("item-id", id);
        $(".modal__details > h2").text(p["name"]);
        $(".cost__value > h2").text(c + "₽");
        $(".pre-formatted").text(p["desc"]);

        if (nickon == -5) {
            ajaxnick();
        } else if (possibility["false"].indexOf(id) != -1) {
            console.log(1);
            $(".modal__buy-button")
                .attr("disabled", "")
                .html("<span>Уже куплено</span>");
            $("#coupon").attr("placeholder", notprod);
            cws = -1;
        } else if (possibility["sub"].hasOwnProperty(tprevsub)) {
            console.log(2);
            sum = possibility["sub"][tprevsub];

            if (sum < c) {
                if (sum != 0) {
                    c -= sum;
                    $(".cost__value > h2").text(c + "₽");
                    $("#sale").text("Скидка " + sum + "₽");
                }
            } else {
                noload(0);
                cws = -1;
                $(".modal__buy-button")
                    .attr("disabled", "")
                    .html("<span>Уже куплено</span>");
                $("#coupon").attr("placeholder", notprod);
            }
        } else if (
            possibility["true"].indexOf(id) == -1 &&
            checkarr.indexOf(tprevsub) != -1 &&
            nickon == 1
        ) {
            ajaxnick();
        }

        $(".modal").fadeIn();
        $(".modal__wrapper").addClass("zoomIn").show();
        setTimeout(function() {
            if (nickajaxflag == 0 && cws != -1 && $(document).width() > 768) $(foc).focus();
            $(".modal__wrapper.zoomIn").removeClass("zoomIn");
        }, 1e3);
    });

    $("#i1.input__clear").on("click", function() {
        if (possibility["sub"].hasOwnProperty(tprevsub) && cws != -1)
            c = c + possibility["sub"][tprevsub];
        else if (cws == -1)
            $(".modal__buy-button")
            .removeAttr("disabled")
            .html("<span>Купить</span>");
        if (nickajaxflag == 1) nickajax.abort();
        possibility = {
            false: [],
            true: [],
            sub: {}
        };
        $("#coupon").attr("placeholder", "Купон на скидку");
        $("small").slideUp(100, function(){ $(this).remove(); });
        nickmain = "";
        foc = "#nickname";
        clearTimeout(nicktime);
        $("#i2.input__clear").click();
        $("#i1.input__clear").fadeOut(200);
        $("#nickname").val("").attr("class", "form__input").focus();
        nickon = 0;
        coupons = {};
    });
    $("#i2.input__clear").on("click", function() {
        if (coupajaxflag == 1) coupajax.abort();
        clearTimeout(couptime);
        if (nickon == 1) $("#coupon").val("").attr("class", "form__input").focus();
        sum = "";

        if (possibility["sub"].hasOwnProperty(tprevsub)) {
            if (possibility["sub"][tprevsub] != 0)
                sum =
                "Скидка " +
                possibility["sub"][tprevsub] +
                "₽";
        }

        $("#sale").text(sum);
        $(".cost__value > h2").text(c + "₽");
        cws = c;
        $("#i2.input__clear").fadeOut(200);
        coupon = "-";
    });

    var toast = function toast(type, text) {
        $(".notices").html(
            '<div role="alert" class="toast toast-' +
            type +
            ' is-bottom-right fadeInUp"><div class="toast-icon"></div><p class="toast-text">' +
            text +
            "</p></div>"
        );
        clearTimeout(w);
        setTimeout(function() {
            $(".toast").removeClass("fadeInUp");
            w = setTimeout(function() {
                $(".toast").fadeOut(100);
                setTimeout(function() {
                    $(".toast").remove();
                }, 100);
            }, 1000);
        }, 500);
    };

    var load = function load() {
        $(".modal__buy-button")
            .html(
                '<div class="modal__buy-button__load"><img src="static/loading/395.gif"></div>'
            )
            .addClass("load");
        $(".modal__buy-button__load").fadeIn(500);
    };

    var noload = function noload(typetext) {
        if (typetext === void 0) {
            typetext = 1;
        }

        $(".modal__buy-button").removeClass("load").removeAttr("disabled");
        typetext = typetext == 1 ? "Купить" : "Уже куплено";
        $(".modal__buy-button__load").fadeOut(500, function() {
            $(".modal__buy-button").html("<span>" + typetext + "</span>");
        });
    };

    var sum,
        possibility = {
            false: [],
            true: [],
            sub: {}
        },
        mesinf;

    var ajaxnick = function ajaxnick() {
        load();
        nickajaxflag = 1;
        nickajax = $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/info/player/",
            headers: {
                "X-CSRFToken": csrftoken
            },
            data: JSON.stringify({
                nick: nick,
                id: id
            }),
            success: function success(result) {
                nickajaxflag = 0;

                if (result["status"] == "success") {
                    $("#nickname").blur();
                    foc = "#coupon";
                    mesinf = true;

                    if (nickon != 1) {
                        nickon = 1;
                        toast("success", "Игрок найден)");
                        mesinf = false;
                    }

                    if (result["nick"] != nickmain) {
                        possibility = {
                            false: [],
                            true: [],
                            sub: {}
                        };
                        nickmain = result["nick"];
                        localStorage.setItem("nickname", nickmain);
                    }

                    $("#nickname").addClass("form__input-success").val(nickmain);
                    clearTimeout(nicktime);
                    $("small").slideUp(100, function(){ $(this).remove(); });

                    switch (result["possibility"]) {
                        case true:
                            possibility["true"].push(id);

                            if (mesinf) {
                                toast("success", "Товар доступен)");
                            }

                            noload();
                            $("#coupon").focus();
                            break;

                        case false:
                            cws = -1;
                            noload(0);

                            if (mesinf) {
                                toast("error", notprod);
                            }

                            possibility["false"].push(id);
                            $(".modal__buy-button").attr("disabled", "");
                            $("#coupon").attr("placeholder", notprod);
                            break;

                        default:
                            sum = result["possibility"];
                            possibility["sub"][tprevsub] = sum;

                            if (sum < c) {
                                if (mesinf) {
                                    toast("success", "Товар доступен)");
                                }

                                noload();
                                $("#coupon").focus();

                                if (sum != 0) {
                                    c -= sum;
                                    $(".cost__value > h2").text(c + "₽");
                                    $("#sale").text("Скидка " + sum + "₽");
                                }
                            } else {
                                cws = -1;
                                noload(0);
                                $(".modal__buy-button").attr("disabled", "");

                                if (mesinf) {
                                    toast("error", notprod);
                                }

                                $("#coupon").attr("placeholder", notprod);
                            }
                    }
                } else if (result["status"] == "error") {
                    noload();
                    console.log(nickon);

                    if (nickon != 1) {
                        localStorage.removeItem("nickname");
                        $("#nickname").addClass("form__input-error");
                        $('<small class="input-error">Такого игрока на сервере никогда не было!</small>')
                        .hide(0).appendTo(".form__element:first-child").slideDown(100);
                        toast("error", "Такого игрока нет(");
                        $("#nickname").focus();
                        if (nick != "" && (nickon == 0 || nickon == -5)) nickon = -1;
                    } else {
                        $("#nickname").val(nickmain).addClass("form__input-success");
                        $("#coupon").focus();
                    }
                }
            },
            error: function error(xhr, text, _error, q) {
                noload();
                nickajaxflag = 0;

                if (text != "abort") {
                    $("#i1.input__clear").click();
                    alert(
                        "Произошла ошибка, обратитесь в тех.поддержку\nОшибка: " + text
                    );
                }
            }
        });
    };

    var nickajax,
        coupajax,
        nickajaxflag = 0,
        coupajaxflag = 0;
    var inputtime = 1000;

    $("#nickname").on("input", function() {
        if (!sym.test($("#nickname").val()) && $("#nickname").val() != "") {
            toast("warning", "Недопустимые символы");
            $("#nickname").val(
                $("#nickname")
                .val()
                .replace(/[^-_a-zA-Z0-9]/g, "")
            );
        }

        if ($("#nickname").val() != nick) {
            nick = $("#nickname").val();
            if (nickajaxflag == 1) nickajax.abort();
            clearTimeout(nicktime);
            $("#nickname").attr("class", "form__input");
            $("small").slideUp(100, function(){ $(this).remove(); });

            if (nick != "") {
                $("#i1.input__clear").fadeIn(100);
                nicktime = setTimeout(ajaxnick, inputtime);
            } else {
                $("#i1.input__clear").click();
            }
        }
    });
    $("#nickname").on("keydown", function(e) {
        if (e.keyCode == 13) {
            if (nickon == 1) {
                $("#coupon").focus();
            } else {
                $(".modal__buy-button").click();
            }
        }
    });
    $("#nickname").on("focus", function() {
        if (coupajaxflag == 1) {
            $("#nickname").blur();
            toast("warning", "Идёт загрузка");
            $("small").slideUp(100, function(){ $(this).remove(); });
        }
    });
    $("#coupon").on("focus", function() {
        if (nickajaxflag == 1) {
            $("#coupon").blur();
            toast("warning", "Идёт загрузка");
            $("small").slideUp(100, function(){ $(this).remove(); });
        } else if (nickon != 1) $(".modal__buy-button").click();
        else if (cws == -1) {
            $("#coupon").blur();
            toast("error", notprod);
        }
    });
    var coup,
        couptime,
        coupons = {};

    var sale = function sale(disc) {
        $("#coupon").addClass("form__input-success").blur().text(coupon);
        cws = Math.floor((c * (100 - disc)) / 100);
        $(".cost__value > h2").text(cws + "₽");
        sum = "Скидка " + disc + "%";

        if (possibility["sub"].hasOwnProperty(tprevsub)) {
            if (possibility["sub"][tprevsub] != 0)
                sum =
                "\u0421\u043A\u0438\u0434\u043A\u0430 " +
                possibility["sub"][tprevsub] +
                " \u20BD + " +
                disc +
                "%";
        }

        $("#sale").text(sum);
        toast("success", "Купон применен");
    };

    $("#coupon").on("input", function() {
        if (!sym.test($("#coupon").val()) && $("#coupon").val() != "") {
            toast("warning", "Недопустимые символы");
            $("#coupon").val(
                $("#coupon")
                .val()
                .replace(/\(.+\)/g, "")
                .replace(/[^-_a-zA-Z0-9]/g, "")
            );
        }

        if ($("#coupon").val() != coup) {
            coup = $("#coupon").val();
            if (coupajaxflag == 1) coupajax.abort();
            clearTimeout(couptime);
            $("#coupon").attr("class", "form__input");

            if (coup != "") {
                $("#i2.input__clear").fadeIn(100);
                couptime = setTimeout(function() {
                    if (!coupons.hasOwnProperty(coup)) {
                        load();
                        coupajaxflag = 1;
                        coupajax = $.ajax({
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            url: "/info/coupon/",
                            headers: {
                                "X-CSRFToken": csrftoken
                            },
                            data: JSON.stringify({
                                code: coup,
                                nick: nickmain
                            }),
                            success: function success(result) {
                                coupajaxflag = 0;
                                noload();

                                if (result["status"] == "success") {
                                    coupon = result["code"];
                                    coupons[coupon] = result["discount"];
                                    sale(result["discount"]);
                                } else if (result["status"] == "error") {
                                    if (coupon == "-") {
                                        $("#coupon").addClass("form__input-error");
                                        toast("error", "Купон не найден");
                                    } else {
                                        $("#coupon")
                                            .val(coupon)
                                            .addClass("form__input-success")
                                            .blur();
                                    }
                                }
                            },
                            error: function error(xhr, text, _error2) {
                                noload();
                                coupajaxflag = 0;

                                if (text != "abort") {
                                    $("#i2.input__clear").click();
                                    alert(
                                        "Произошла ошибка! Попробуйте ещё раз или обратитесь в тех.поддержку\nОшибка: " +
                                        text
                                    );
                                }
                            }
                        });
                    } else sale(coupons[coup]);
                }, inputtime);
            } else {
                $("#i2.input__clear").click();
            }
        }
    });
    $("#coupon").on("keydown", function(e) {
        if (e.keyCode == 13) {
            $(".modal__buy-button").click();
        } else if (e.keyCode == 8 && $("#coupon").val() == "") {
            setTimeout(function() {
                $("#nickname").focus();
            }, 50);
        } else if (e.keyCode == 32) {
            e.preventDefault();
        }
    });

    var meth = 500,
        _text;

    $(".arrow__back").on("click", function() {
        $(".modal__container").animate({
                left: $(".modal__wrapper").width()
            },
            meth,
            function() {
                $(this).removeAttr("style");
            }
        );
        $(".modal__methods").animate({
                left: $(".modal__wrapper").width()
            },
            meth,
            function() {
                $(this).css("display", "none");
                $(".modal__wrapper").removeAttr("style");
            }
        );
    });
    var modalclc = true;
    $(".modal__buy-button").on("click", function() {
        console.log(nickon);

        if (nickajaxflag == 1 || coupajaxflag == 1) {
            toast("warning", "Идёт загрузка");
        } else {
            switch (nickon) {
                case 1:
                    if (modalclc) {
                        modalclc = false;
                        setTimeout(function() {
                            modalclc = true;
                        }, 1000);
                        $(".modal__container").animate({
                                left: -$(".modal__wrapper").width()
                            },
                            meth,
                            function() {
                                $(".modal__wrapper").css("align-content", "flex-end");
                                $(this).removeAttr("style");
                            }
                        );
                        $(".modal__methods")
                            .removeAttr("style")
                            .animate({
                                    left: -$(".modal__wrapper").width()
                                },
                                meth,
                                function() {
                                    $(this).removeAttr("style");
                                }
                            );
                    }

                    break;

                case 0:
                    $("small").slideUp(100, function(){ $(this).remove(); });
                    $('<small class="input-error">Введите никнейм!</small>')
                        .hide(0).appendTo(".form__element:first-child").slideDown(100);
                    _text = "Введите никнейм ";

                case -1:
                    _text = "Игрок не найден( ";
                    $("#nickname").focus();
                    toast("warning", _text);
                    break;
            }
        }
    });
    var gradtype,
        gradfps = 30,
        graddur = 300,
        gradarr = {};
    checkels = $(".modal__btn");

    for (var i = 0; i < checkels.length; i++) {
        gradarr[$(checkels[i]).data("type")] = [
            0,
            -1,
            ["300", "120"][Math.floor(Math.random() * 2)]
        ];
    }

    checkels = null;

    function gradanim(el, gradsec, gradat) {
        $(el).css(
            "background",
            "linear-gradient(" +
            gradat +
            "deg, blue " +
            (20 / gradfps) * gradsec +
            "%, red " +
            (80 / gradfps) * gradsec +
            "%, white " +
            (150 / gradfps) * gradsec +
            "%)"
        );
    }

    $(".modal__btn").on("mouseenter", function() {
        gradtype = $(this).data("type");
        clearInterval(gradarr[gradtype][0]);
        gradarr[gradtype][0] = setInterval(
            function(el, grad) {
                grad[1]++;
                gradanim(el, grad[1], grad[2]);

                if (grad[1] >= gradfps) {
                    grad[1] = gradfps;
                    clearInterval(grad[0]);
                }
            },
            graddur / gradfps,
            this,
            gradarr[gradtype]
        );
    });
    $(".modal__btn").on("mouseleave", function() {
        gradtype = $(this).data("type");
        clearInterval(gradarr[gradtype][0]);
        gradarr[gradtype][0] = setInterval(
            function(el, grad) {
                gradanim(el, grad[1], grad[2]);
                grad[1]--;

                if (grad[1] <= -1) {
                    $(el).removeAttr("style");
                    clearInterval(grad[0]);
                    grad[0] = -1;
                    grad[2] = grad[2] == "300" ? "120" : "300";
                }
            },
            graddur / gradfps,
            this,
            gradarr[gradtype]
        );
    });
    $(".modal__btn").on("click", function() {
        var _this = this;

        if (nickon != 5) {
            nickon = 5;
            gradtype = $(this).data("type");
            $(this).addClass("clicked");
            toast("success", "Ожидайте");
            if (coupon == "-") coupon = null;
            $.ajax({
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                url: "/payment/create/",
                headers: {
                    "X-CSRFToken": csrftoken
                },
                data: JSON.stringify({
                    id: id,
                    nick: nickmain,
                    coupon: coupon,
                    type: gradtype
                }),
                success: function success(result) {
                    if (result["status"] == "success") {
                        document.location.href = result["url"];
                    } else {
                        $(_this).removeClass("clicked");
                        nickon = 1;
                        alert(
                            "Произошла ошибка в составлении платежа! Попробуйте ещё раз или обратитесь в тех.поддержку"
                        );
                    }
                },
                error: function error(xhr, text, _error3) {
                    noload();
                    coupajaxflag = 0;
                    nickon = 1;

                    if (text != "abort") {
                        $("#i2.input__clear").click();
                        alert(
                            "Произошла ошибка! Попробуйте ещё раз или обратитесь в тех.поддержку\nОшибка: " + text
                        );
                    }
                }
            });
        }
    });
}
