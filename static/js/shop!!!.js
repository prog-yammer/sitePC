"use strict";

function activeShop() {

    let scrTop,
        pixelcore = $("div.greeting__title").html(), nav_state = 0,
        shop = '<span class="shop">Магазин</span>',
        logo_text = $("span.navigation__logo").html(),
        PC_version = $(document).width() > 628 && $(window).height() > 650;

    $(window).on("resize.content", function() {
        $("#traveler").stop();
        PC_version = $(document).width() > 628 && $(window).height() > 650;
    });

    function scroll() {
        scrTop = $(window).scrollTop();
        if (PC_version) {
            if (scrTop >= $(".wrapper .shop").offset().top - 90 && nav_state === 1) {
                nav_state = 2;

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
                        always: function() {
                            $("#traveler").remove();
                            $(".navigation__logo").removeAttr("style");
                        }
                    });
            } else if (scrTop < $(".wrapper .shop").offset().top - 90 && nav_state === 2) {
                nav_state = 1;
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
            } else if (scrTop >= $(".greeting__info .greeting__title").offset().top - 100 && nav_state === 0) {
                nav_state = 1;

                $("#traveler").stop();
                $(".navigation__logo").html(pixelcore).css("opacity", 0);
                $(".greeting__title").css("opacity", 0);
                $(".greeting__content").prepend(
                    '<h1 id="traveler" class="greeting__title">' + pixelcore + "</h1>"
                );
                $("#traveler")
                    .stop()
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
            } else if (scrTop <= $(".greeting__info .greeting__title").offset().top - 100 && nav_state === 1) {
                nav_state = 0;

                $("#traveler").stop();
                $(".navigation__logo").css("opacity", 0);
                $(".greeting__content").prepend(
                    '<h1 id="traveler" class="navigation__logo">' + pixelcore + "</h1>"
                );
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
                        }
                    });
            }
        } else {
            if (scrTop >= $("div.wrapper .shop").offset().top - 90 && nav_state === 1) {
                nav_state = 2;
                $(".shop").animate({
                    opacity: 0
                });
                $(".navigation__logo").text("Магазин");
            } else if (scrTop < $(".wrapper .shop").offset().top - 90 && nav_state === 2) {
                nav_state = 1;
                $(".shop").animate({
                    opacity: 1
                });
                $(".navigation__logo").html(pixelcore);
            } else if (scrTop >= $(".greeting__info .greeting__title").offset().top - 100 && nav_state === 0) {
                nav_state = 1;
                $(".greeting__title").animate({
                    opacity: 0
                });
                $(".navigation__logo").html(pixelcore);
            } else if (scrTop <= $(".greeting__info .greeting__title").offset().top - 100 && nav_state === 1) {
                nav_state = 0;
                $(".greeting__title").animate({
                    opacity: 1
                });
                $(".navigation__logo").text(logo_text);
            }
        }
    }

    setTimeout(function() {
        $(window).scrollTop(0).scrollLeft(0).on("scroll.content", scroll);
    }, 200);

    setInterval(function() {
        if (PC_version === 0) return;
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/info/online/",
            headers: {
                "X-CSRFToken": csrftoken
            },
            success: function success(result) {
                if (result["status"] === "success") {
                    $("#online").text(result["online"]);
                }
            }
        })
    }, 6e4)

    $("#ip").on("click", function() {
        let $tmp = $("<input>");
        $(".header").append($tmp);
        $tmp.val($("#ip").text());
        $tmp.select();
        document.execCommand("copy");
        $tmp.remove();
        $(".message.success").fadeIn(500);
        setTimeout(function() {
            $(".message.success").fadeOut(500);
        }, 1500);
    });

    const msg = {
        product_not: "Товар недоступен",
        nick_found: "Игрок найден)",
        product_available: "Товар доступен)",
        buy: $("button.modal__buy-button > span").text(),
        coupon_placeholder: $("#coupon").attr("placeholder"),
        rub: "₽",
        have: "Уже куплено",
        sale: "Скидка ",
        nick_not_found: "Игрок не найден(",
        invalid_characters: "Недопустимые символы",
        input_nick: "Введите никнейм",
        wait: "Ожидайте",
        error: "Произошла ошибка! Попробуйте ещё раз или обратитесь в тех.поддержку\nОшибка: "
    };

    const form_small_el = {
        create: function (text, form_el) {
            $(".form__element small").remove();
            $('<small class="input-error">' + text + '</small>')
                .hide(0).appendTo(".form__element:" +
                ((form_el === "nick") ? "first" : "last") +"-child").slideDown(100)
        },
        delete: function () {
            $("small").slideUp(100, function(){ $(this).remove(); });
        }
    }

    $(".dialog").on("click", function(e) {
        const dialog_class = $(e.target).attr("class");

        if (dialog_class === "dialog" || dialog_class === "btn") {
            clearTimeout(time_nick);
            clearTimeout(time_coupon);
            coupon_main = "";
            if (nick_ajax_flag) nick_ajax.abort();
            if (coupon_ajax_flag) coupon_ajax.abort();
            product_id = -1;
            price = 0;
            $(".modal").fadeOut();
            $(".modal__wrapper").addClass("zoomOut");
            setTimeout(function() {
                $(".modal__wrapper").removeAttr("style");
                $(".modal__container").removeAttr("style");
                $(".modal__methods").css({
                    display: "none"
                });
                $(".modal__buy-button").removeAttr("disabled");
                $(".modal__buy-button > span").text(msg.buy);
                // $("#coupon").attr("placeholder", msg.coupon_placeholder);
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

                if (nick_state !== 1 && nick_state !== -5) {
                    $("#i1.input__clear").fadeOut();
                    $("#nickname").val("").removeClass("form__input-error");
                    form_small_el.delete();
                }
            }, 500);
        }
    });

    $(".categories > li:first-child").addClass("active");
    $(".subcategories > li:nth-child(2)").addClass("active");

    let now_cat = $(".categories > li:first-child").data("category-id"),
        now_sub = $(".subcategories > li:nth-child(2)").data("subcategory-id");

    $(".subcategories > li[data-category-id!=" + now_cat + "]").hide();
    $('div.card[data-category-id!="' + now_cat + ":" + now_sub + '"]').hide();
    let check_sub = $(".subcategories > li[data-check]").removeAttr("data-check"),
        check_arr = [];

    for (let _i = 0; _i < check_sub.length; _i++) {
        check_arr.push($(check_sub[_i]).data("subcategory-id"));
    }

    check_sub = $(".dialogue div");
    for (let _i2 = 0; _i2 < check_sub.length; _i2++) {
        $(".greeting__description").text(
            $(".greeting__description").text() + $(check_sub[_i2]).text()
        );
    }

    const products = eval("{obj: [" + $("#info__products").text() + "]}")[0];
    $("#info__products").remove();
    let li_available = true,
        time_sub = 500;

    $("#categories li").on("click", function(el) {
        el = el.currentTarget;

        if (li_available) {
            li_available = false;

            setTimeout(function(interval_obj) {
                clearInterval(interval_obj);
                li_available = true;
            }, 1000, setInterval(function(){$(document).trigger("scroll")}, 20));

            let parent_class = $($(el).parent()).attr("class");

            $('div[data-category-id="' + now_cat + ":" + now_sub + '"]').addClass("zoomOut");

            if (parent_class === "categories") {
                $(".categories > li.active").removeClass("active");
                $(".subcategories").height($(".subcategories").height());
                $(".icon-subcategories").fadeOut(time_sub);
                $(".subcategories > li[data-category-id=" + now_cat + "]").fadeOut(
                    time_sub,
                    function() {
                        $(this).removeClass("active");
                        sub.fadeIn(time_sub);
                        $(".icon-subcategories").fadeIn(time_sub);
                        $(".subcategories").removeAttr("style");
                    }
                );

                now_cat = $(el).data("category-id");
                let sub = $(".subcategories > li[data-category-id=" + now_cat + "]");
                $(sub[0]).addClass("active");
                now_sub = $(sub[0]).data("subcategory-id");

            } else if (parent_class === "subcategories") {
                now_sub = $(el).data("subcategory-id");
                $(".subcategories > .active").removeClass("active");
            }

            $(el).addClass("active");
            setTimeout(function() {
                $(".shop__main").height($(".wrapper").innerHeight());
                $(".card.zoomOut").removeClass("zoomOut").hide();
                $('div[data-category-id="' + now_cat + ":" + now_sub + '"').show().addClass("zoomIn");
                $(".shop__main").animate({height: $(".wrapper").innerHeight()},
                    500, function(){$(this).removeAttr("style")});
                setTimeout(function() {
                    $(".card.zoomIn").removeClass("zoomIn");
                }, 1000);
            }, 500);
        }
    });

    let time_nick,
        nick_main = "",
        symbols_available = /^[a-zA-Z\d]+$/,
        coupon_main = "",
        nick_state = 0,
        nick_text = localStorage.getItem("nickname"),
        focus_id = "#nickname";

    if (nick_text !== null && typeof nick_text !== "undefined" && symbols_available.test(nick_text)) {
        nick_state = -5;
        $("#nickname").val(nick_text);
        $("#i1.input__clear").fadeIn();
    } else {
        nick_text = "";
        localStorage.removeItem("nickname");
    }

    let product_id = -1, price, amount;
    $(".card").on("click", function(el) {
        product_id = $(el.currentTarget).data("item-id");
        const p = products[product_id];
        price = p["price"];
        amount = price;
        $(".modal__details").data("item-id", product_id);
        $(".modal__details > h2").text(p["name"]);
        $(".cost__value > h2").text(price + msg.rub);
        $(".pre-formatted").text(p["desc"]);

        if (nick_state === -5) {
            ajax_nick();
        } else if (possibility["false"].indexOf(product_id) !== -1) {
            $(".modal__buy-button")
                .attr("disabled", "")
                .html("<span>Уже куплено</span>");
            $("#coupon").attr("placeholder", msg.product_not);
            amount = -1;
        } else if (possibility["sub"].hasOwnProperty(now_sub)) {
            let sum = possibility["sub"][now_sub];

            if (sum < price) {
                if (sum !== 0) {
                    price -= sum;
                    $(".cost__value > h2").text(price + msg.rub);
                    $("#sale").text(msg.sale + sum + msg.rub);
                }
            } else {
                noLoad(0);
                amount = -1;
                $(".modal__buy-button")
                    .attr("disabled", "")
                    .html("<span>" + msg.have + "</span>");
                $("#coupon").attr("placeholder", msg.product_not);
            }
        } else if (
            possibility["true"].indexOf(product_id) === -1 &&
            check_arr.indexOf(now_sub) !== -1 &&
            nick_state === 1
        ) {
            ajax_nick();
        }

        $(".modal").fadeIn();
        $(".modal__wrapper").addClass("zoomIn").show();
        setTimeout(function() {
            if ((nick_main === "" || coupon_main === "") && $(document).width() > 768) $(focus_id).focus();
            $(".modal__wrapper.zoomIn").removeClass("zoomIn");
        }, 1e3);
    });

    $("#i1.input__clear").on("click", function() {
        if (possibility["sub"].hasOwnProperty(now_sub) && amount !== -1)
            price = price + possibility["sub"][now_sub];
        else if (amount === -1)
            $(".modal__buy-button")
            .removeAttr("disabled")
            .html("<span>Купить</span>");
        if (nick_ajax_flag) nick_ajax.abort();
        possibility = {
            false: [],
            true: [],
            sub: {}
        };
        $("#coupon").attr("placeholder", msg.coupon_placeholder);
        form_small_el.delete();
        nick_main = "";
        focus_id = "#nickname";
        clearTimeout(time_nick);
        $("#i2.input__clear").click();
        $("#i1.input__clear").fadeOut(200);
        $("#nickname").val("").attr("class", "form__input").focus();
        nick_state = 0;
    });
    
    $("#i2.input__clear").on("click", function() {
        if (coupon_ajax_flag) coupon_ajax.abort();
        clearTimeout(time_coupon);
        if (nick_state === 1) $("#coupon").val("").attr("class", "form__input").focus();
        let sum = "";

        if (possibility["sub"].hasOwnProperty(now_sub)) {
            if (possibility["sub"][now_sub] !== 0)
                sum = msg.sale + possibility["sub"][now_sub] + msg.rub;
        }

        $("#sale").text(sum);
        $(".cost__value > h2").text(price + msg.rub);
        amount = price;
        $("#i2.input__clear").fadeOut(200);
        coupon_main = "";
    });

    let toast_timeout;
    function toast(type, text) {
        $(".notices").html(
            '<div role="alert" class="toast toast-' +
            type +
            ' is-bottom-right fadeInUp"><div class="toast-icon"></div><p class="toast-text">' +
            text +
            "</p></div>"
        );
        clearTimeout(toast_timeout);
        setTimeout(function() {
            $(".toast").removeClass("fadeInUp");
            toast_timeout = setTimeout(function() {
                $(".toast").fadeOut(100);
                setTimeout(function() {
                    $(".toast").remove();
                }, 100);
            }, 1000);
        }, 500);
    }

    function load() {
        form_small_el.delete();
        $(".modal__buy-button")
            .html(
                '<div class="modal__buy-button__load"><img src="static/loading/395.gif"></div>'
            )
            .addClass("load");
        $(".modal__buy-button__load").fadeIn(500);
    }

    function noLoad(type_text) {
        if (type_text === void 0) {
            type_text = 1;
        }

        $(".modal__buy-button").removeClass("load").removeAttr("disabled");
        type_text = type_text === 1 ? msg.buy : msg.have;
        $(".modal__buy-button__load").fadeOut(500, function() {
            $(".modal__buy-button").html("<span>" + type_text + "</span>");
        });
    }

    let possibility = {
            false: [],
            true: [],
            sub: {}
        };



    function ajax_nick() {
        load();
        nick_ajax_flag = true;
        nick_ajax = $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/info/player/",
            headers: {
                "X-CSRFToken": csrftoken
            },
            data: JSON.stringify({
                nick: nick_text,
                id: product_id
            }),
            success: function success(result) {
                nick_ajax_flag = false;

                if (result["status"] === "success") {
                    $("#nickname").blur();
                    focus_id = "#coupon";
                    let msg_info = true;

                    if (nick_state !== 1) {
                        nick_state = 1;
                        toast("success", msg.nick_found);
                        msg_info = false;
                    }
                    console.log(coupon_main)
                    if (coupon_main !== "") $("#i2.input__clear").click();

                    if (result["nick"] !== nick_main) {
                        possibility = {
                            false: [],
                            true: [],
                            sub: {}
                        };
                        nick_main = result["nick"];
                        localStorage.setItem("nickname", nick_main);
                    }

                    $("#nickname").addClass("form__input-success").val(nick_main);
                    clearTimeout(time_nick);
                    form_small_el.delete();

                    switch (result["possibility"]) {
                        case true:
                            possibility["true"].push(product_id);
                            if (msg_info) toast("success", msg.product_available);
                            noLoad();
                            $("#coupon").focus();
                            break;

                        case false:
                            amount = -1;
                            noLoad(0);

                            if (msg_info) {
                                toast("error", msg.product_not);
                            }

                            possibility["false"].push(product_id);
                            $(".modal__buy-button").attr("disabled", "");
                            $("#coupon").attr("placeholder", msg.product_not);
                            break;

                        default:
                            let sum = result["possibility"];
                            possibility["sub"][now_sub] = sum;

                            if (sum < price) {
                                if (msg_info) {
                                    toast("success", msg.product_available);
                                }

                                noLoad();
                                $("#coupon").focus();

                                if (sum !== 0) {
                                    price -= sum;
                                    $(".cost__value > h2").text(price + msg.rub);
                                    $("#sale").text(msg.sale + sum + msg.rub);
                                }
                            } else {
                                amount = -1;
                                noLoad(0);
                                $(".modal__buy-button").attr("disabled", "");

                                if (msg_info) {
                                    toast("error", msg.product_not);
                                }

                                $("#coupon").attr("placeholder", msg.product_not);
                            }
                    }
                } else if (result["status"] === "error") {
                    noLoad();

                    if (nick_state !== 1) {
                        localStorage.removeItem("nickname");
                        $("#nickname").addClass("form__input-error");
                        form_small_el.create(msg.nick_not_found, "nick");
                        toast("error", msg.nick_not_found);
                        $("#nickname").focus();
                        if (nick_text !== "" && (nick_state === 0 || nick_state === -5)) nick_state = -1;
                    } else {
                        $("#nickname").val(nick_main).addClass("form__input-success");
                        $("#coupon").focus();
                    }
                }
            },
            error: function error(xhr, text, _error, q) {
                noLoad();
                nick_ajax_flag = false;

                if (text !== "abort") {
                    $("#i1.input__clear").click();
                    alert(
                        msg.error + text
                    );
                }
            }
        });
    }

    let nick_ajax,
        coupon_ajax,
        nick_ajax_flag = false,
        coupon_ajax_flag = false,
        time_input = 1000;

    $("#nickname").on("input", function() {
        if (!symbols_available.test($("#nickname").val()) && $("#nickname").val() !== "") {
            toast("warning", msg.invalid_characters);
            $("#nickname").val(
                $("#nickname")
                .val()
                .replace(/[^-_a-zA-Z\d]/g, "")
            );
        }

        if ($("#nickname").val() !== nick_text) {
            nick_text = $("#nickname").val();
            
            if (nick_ajax_flag) nick_ajax.abort();
            
            clearTimeout(time_nick);
            $("#nickname").attr("class", "form__input");
            form_small_el.delete();

            if (nick_text !== "") {
                $("#i1.input__clear").fadeIn(100);
                time_nick = setTimeout(ajax_nick, time_input);
            } else {
                $("#i1.input__clear").click();
            }
        }
    });
    
    $("#nickname").on("keydown", function(e) {
        if (e.keyCode === 13) {
            if (nick_state === 1) {
                $("#coupon").focus();
            } else {
                $(".modal__buy-button").click();
            }
        }
    });
    
    $("#nickname").on("focus", function() {
        if (coupon_ajax_flag) {
            $("#nickname").blur();
            toast("warning", "Идёт загрузка");
            form_small_el.delete();
        }
    });
    
    $("#coupon").on("focus", function() {
        if (nick_ajax_flag) {
            $("#coupon").blur();
            toast("warning", "Идёт загрузка");
            form_small_el.delete();
            
        } else if (nick_state !== 1) 
            $(".modal__buy-button").click();
        
        else if (amount === -1) {
            $("#coupon").blur();
            toast("error", msg.product_not);
        }
    });
    
    let coupon_text,
        time_coupon;

    function sale(disc) {
        $("#coupon").addClass("form__input-success").blur().text(coupon_main);
        amount = Math.floor((price * (100 - disc)) / 100);
        $(".cost__value > h2").text(amount + msg.rub);
        let sum = msg.sale + disc + "%";

        if (possibility["sub"].hasOwnProperty(now_sub)) {
            if (possibility["sub"][now_sub] !== 0)
                sum = msg.sale + possibility["sub"][now_sub] + " " + msg.rub + " + " + disc + "%";
        }

        $("#sale").text(sum);
        toast("success", "Купон применен");
    }

    $("#coupon").on("input", function() {
        if (!symbols_available.test($("#coupon").val()) && $("#coupon").val() !== "") {
            toast("warning", msg.invalid_characters);
            $("#coupon").val(
                $("#coupon")
                .val()
                .replace(/\(.+\)/g, "")
                .replace(/[^-_a-zA-Z\d]/g, "")
            );
        }

        if ($("#coupon").val() !== coupon_text) {
            
            coupon_text = $("#coupon").val();
            if (coupon_ajax_flag) coupon_ajax.abort();
            
            clearTimeout(time_coupon);
            $("#coupon").attr("class", "form__input");

            if (coupon_text !== "") {
                $("#i2.input__clear").fadeIn(100);
                time_coupon = setTimeout(function() {
                    load();
                    coupon_ajax_flag = true;
                    coupon_ajax = $.ajax({
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        url: "/info/coupon/",
                        headers: {
                            "X-CSRFToken": csrftoken
                        },
                        data: JSON.stringify({
                            code: coupon_text,
                            nick: nick_main
                        }),
                        success: function success(result) {
                            coupon_ajax_flag = false;
                            noLoad();

                            if (result["status"] === "success") {
                                coupon_main = result["code"];
                                sale(result["discount"]);
                            } else if (result["status"] === "error") {
                                if (coupon_main === "") {
                                    $("#coupon").addClass("form__input-error");
                                    toast("error", "Купон не найден");
                                } else {
                                    $("#coupon")
                                        .val(coupon_main)
                                        .addClass("form__input-success")
                                        .blur();
                                }
                            }
                        },
                        error: function error(xhr, text, _error2) {
                            noLoad();
                            coupon_ajax_flag = false;

                            if (text !== "abort") {
                                $("#i2.input__clear").click();
                                alert(
                                    msg.error + text
                                );
                            }
                        }
                    });
                }, time_input);
            } else {
                $("#i2.input__clear").click();
            }
        }
    });
    $("#coupon").on("keydown", function(e) {
        if (e.keyCode === 13) {
            $(".modal__buy-button").click();
        } else if (e.keyCode === 8 && $("#coupon").val() === "") {
            setTimeout(function() {
                $("#nickname").focus();
            }, 50);
        } else if (e.keyCode === 32) {
            e.preventDefault();
        }
    });

    let time_methods_anim = 500;

    $(".arrow__back").on("click", function() {
        $(".modal__container").animate({
                left: $(".modal__wrapper").width()
            },
            time_methods_anim,
            function() {
                $(this).removeAttr("style");
            }
        );
        $(".modal__methods").animate({
                left: $(".modal__wrapper").width()
            },
            time_methods_anim,
            function() {
                $(this).css("display", "none");
                $(".modal__wrapper").removeAttr("style");
            }
        );
    });
    
    let modal_flag = true;
    $(".modal__buy-button").on("click", function() {
        console.log(nick_main,coupon_main,product_id)

        if (nick_ajax_flag || coupon_ajax_flag) {
            toast("warning", "Идёт загрузка");
        } else {
            switch (nick_state) {
                case 1:
                    if (modal_flag) {
                        modal_flag = false;
                        setTimeout(function() {
                            modal_flag = true;
                        }, 1000);
                        $(".modal__container").animate({
                                left: -$(".modal__wrapper").width()
                            },
                            time_methods_anim,
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
                                time_methods_anim,
                                function() {
                                    $(this).removeAttr("style");
                                }
                            );
                    }

                    break;

                case 0:
                    form_small_el.create(msg.input_nick, "nick");
                    toast("warning", msg.input_nick);
                    $("#nickname").focus();
                    break;

                case -1:
                    $("#nickname").focus();
                    form_small_el.create(msg.nick_not_found, "nick");
                    toast("warning", msg.nick_not_found);
                    break;
            }
        }
    });
    
    let anim_type,
        anim_fps = 30,
        anim_duration = 300,
        anim_arr = {};

    check_sub = $(".modal__btn");

    for (let i = 0; i < check_sub.length; i++) {
        anim_arr[$(check_sub[i]).data("type")] = [
            0,
            -1,
            ["300", "120"][Math.floor(Math.random() * 2)]
        ];
    }

    check_sub = null;

    function anim(el, anim_sec, anim_deg) {
        $(el).css(
            "background",
            "linear-gradient(" +
            anim_deg +
            "deg, blue " +
            (20 / anim_fps) * anim_sec +
            "%, red " +
            (80 / anim_fps) * anim_sec +
            "%, white " +
            (150 / anim_fps) * anim_sec +
            "%)"
        );
    }

    $(".modal__btn").on("mouseenter", function() {
        anim_type = $(this).data("type");
        clearInterval(anim_arr[anim_type][0]);
        anim_arr[anim_type][0] = setInterval(
            function(el, grad) {
                grad[1]++;
                anim(el, grad[1], grad[2]);

                if (grad[1] >= anim_fps) {
                    grad[1] = anim_fps;
                    clearInterval(grad[0]);
                }
            },
            anim_duration / anim_fps,
            this,
            anim_arr[anim_type]
        );
    });

    $(".modal__btn").on("mouseleave", function() {
        anim_type = $(this).data("type");
        clearInterval(anim_arr[anim_type][0]);
        anim_arr[anim_type][0] = setInterval(
            function(el, grad) {
                anim(el, grad[1], grad[2]);
                grad[1]--;

                if (grad[1] <= -1) {
                    $(el).removeAttr("style");
                    clearInterval(grad[0]);
                    grad[0] = -1;
                    grad[2] = grad[2] === "300" ? "120" : "300";
                }
            },
            anim_duration / anim_fps,
            this,
            anim_arr[anim_type]
        );
    });

    $(".modal__btn").on("click", function() {
        let _this = this;

        if (nick_state !== 5) {
            nick_state = 5;
            anim_type = $(this).data("type");
            $(this).addClass("clicked");
            toast("success", msg.wait);
            $.ajax({
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                url: "/payment/create/",
                headers: {
                    "X-CSRFToken": csrftoken
                },
                data: JSON.stringify({
                    id: product_id,
                    nick: nick_main,
                    coupon: coupon_main,
                    pay_type: anim_type,
                }),
                success: function success(result) {
                    nick_state = 1;
                    $(_this).removeClass("clicked");
                    if (result["status"] === "success") {
                        document.location.href = result["url"];
                    } else {
                        alert(
                            "Произошла ошибка в составлении платежа! Попробуйте ещё раз или обратитесь в тех.поддержку"
                        );
                    }
                },
                error: function error(xhr, text, _error3) {
                    nick_state = 1;
                    $(_this).removeClass("clicked");
                    if (text !== "abort") {
                        alert(
                            "Произошла ошибка в составлении платежа! Попробуйте ещё раз или обратитесь в тех.поддержку"
                        );
                    }
                }
            });
        }
    });

}

activeShop();
