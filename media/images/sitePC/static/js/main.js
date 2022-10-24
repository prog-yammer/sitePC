"use strict";

try {
  eval("let foo = (x) => x+1");
} catch (e) {
  alert("Версия Вашего браузера не поддерживается!\nОбновите браузер!");
}

$(document).ready(function () {
  var num_img = 1,
    time_img = 1000,
    cnt_img;

  var slideshow = function slideshow() {
    $(".image__title > img:nth-child(" + num_img + ")").animate(
      {
        opacity: 0
      },
      time_img,
      function () {
        $(this).removeClass("scale").css("display", "none");
      }
    );
    num_img++;
    if (num_img > $(".image__title > img").length) num_img = 1;
    $(".image__title > img:nth-child(" + num_img + ")")
      .css("display", "block")
      .animate(
        {
          opacity: 1
        },
        time_img
      )
      .addClass("scale");
  };

  $(".image__title > img:first-child")
    .css({
      display: "block",
      opacity: 1
    })
    .addClass("scale"); //    setTimeout(() => {
  //        $(".image__title > img:first-child").css("display", "block").addClass("scale").animate({opacity: 1}, t);
  //    }, 1500)

  var top,
    s,
    www,
    font,
    offsetTop,
    navLog = 0,
    scrTop;
  var offsetTopShop = $(".shop").offset().top,
    offsetLeftShop;
  var logo_text = $(".navigation__logo").text();
  var pixelcore = '<span class="gradient">PIXELCORE</span>';
  $(window).on("load resize", function () {
    www = $(document).width();
    offsetLeftShop = $(".shop").offset().left;
    offsetTop = $(".greeting__title").offset().top;
  });

  var scroll = function scroll(e) {
    scrTop = $(e.target).scrollTop();
    s = scrTop / $(".greeting").height();

    if (s >= 0.1) {
      $("#nav").addClass("navigation-darken");

      if (www > 628) {
        if (scrTop >= offsetTopShop - 90 && navLog == 1) {
          navLog = 2;

          if (www >= 768) {
            font = "1.3";
          } else {
            font = "1.2";
          }

          $("#traveler").stop();
          $(".navigation__logo").text("");
          top = offsetTopShop - scrTop;
          $(".shop").css("visibility", "hidden");
          $(".wrapper").prepend('<h2 id="traveler" class="shop">Магазин</h2>');
          $("#traveler")
            .css({
              position: "fixed",
              top: top
            })
            .animate(
              {
                fontSize: font + "em",
                letterSpacing: ".05em",
                top: "15px",
                left: "10vw"
              },
              {
                duration: 500,
                always: function always() {
                  $("#traveler").remove();
                  $(".navigation__logo").text("Магазин");
                }
              }
            );
        } else if (scrTop < offsetTopShop - 90 && navLog == 2) {
          navLog = 1;
          $("#traveler").stop();
          $(".navigation__logo").text("");
          $(".greeting__content").prepend(
            '<h1 id="traveler" class="navigation__logo">Магазин</h1>'
          );
          $("#traveler")
            .css({
              top: scrTop + 24 + "px"
            })
            .animate(
              {
                fontSize: "60px",
                letterSpacing: "0",
                top: offsetTopShop + 5 + "px",
                left: offsetLeftShop + "px"
              },
              {
                duration: 500,
                always: function always() {
                  $(".shop").removeAttr("style");
                  $("#traveler").remove();
                  $(".navigation__logo").html(pixelcore);
                }
              }
            );
        } else if (scrTop >= offsetTop - 80 && navLog == 0) {
          navLog = 1;

          if (www >= 768) {
            font = "1.3";
          } else {
            font = "1.2";
          }

          $("#traveler").stop();
          $(".navigation__logo").text("");
          top = offsetTop - scrTop;
          $(".greeting__title").css("visibility", "hidden");
          $(".greeting__content").prepend(
            '<h1 id="traveler" class="greeting__title">' + pixelcore + "</h1>"
          );
          $("#traveler")
            .css({
              position: "fixed",
              top: top
            })
            .animate(
              {
                fontSize: font + "em",
                letterSpacing: ".05em",
                top: "25px"
              },
              {
                duration: 500,
                always: function always() {
                  $("#traveler").remove();
                  $(".navigation__logo").html(pixelcore);
                }
              }
            );
        } else if (scrTop <= offsetTop - 80 && navLog == 1) {
          navLog = 0;

          if (www >= 992) {
            font = "5";
          } else if (www >= 768) {
            font = "4";
          } else {
            font = "3";
          }

          $("#traveler").stop();
          $(".navigation__logo").text("");
          $(".greeting__content").prepend(
            '<h1 id="traveler" class="navigation__logo">' + pixelcore + "</h1>"
          );
          $("#traveler")
            .css({
              top: scrTop + 25 + "px"
            })
            .animate(
              {
                fontSize: font + "em",
                letterSpacing: ".1em",
                top: offsetTop + "px"
              },
              {
                duration: 500,
                always: function always() {
                  $(".greeting__title").removeAttr("style");
                  $("#traveler").remove();
                  $(".navigation__logo").text(logo_text);
                }
              }
            );
        }
      } else {
        if (scrTop >= offsetTopShop - 90 && navLog == 1) {
          navLog = 2;
          $(".shop").animate({
            opacity: 0
          });
          $(".navigation__logo").text("Магазин");
        } else if (scrTop < offsetTopShop - 90 && navLog == 2) {
          navLog = 1;
          $(".shop").animate({
            opacity: 1
          });
          $(".navigation__logo").html(pixelcore);
        } else if (scrTop >= offsetTop - 80 && navLog == 0) {
          navLog = 1;
          $(".greeting__title").animate({
            opacity: 0
          });
          $(".navigation__logo").html(pixelcore);
        } else if (scrTop <= offsetTop - 80 && navLog == 1) {
          navLog = 0;
          $(".greeting__title").animate({
            opacity: 1
          });
          $(".navigation__logo").text(logo_text);
        }
      }
    } else {
      $("#nav").removeClass("navigation-darken");
    }
  };

  setTimeout(function () {
    $(document).scrollTop(0).on("scroll", scroll);
  }, 100);
  $(".server__ip").on("click", function () {
    var $tmp = $("<input>");
    $(".header").append($tmp);
    $tmp.val($("#ip").text());
    $tmp.select();
    document.execCommand("copy");
    $tmp.remove();
    $tmp = 0;
    $(".message.success").fadeIn(500);
    setTimeout(function () {
      $(".message.success").fadeOut(500);
    }, 1500);
  });
  setInterval(slideshow, 8000);
  var menu = 0,
    secondsMenu,
    mn,
    commn = 1;
  $(".open-menu").on("click", function (e) {
    if (commn == 1) {
      commn = 0;
      $(e.target).toggleClass("active");
      $(".menu").toggleClass("visible");
      mn = setTimeout(function () {
        secondsMenu = menu == 0 ? 200 : 0;
        menu = menu == 0 ? 1 : 0;
        $(".menu > a").fadeToggle(secondsMenu);
        $(".menu > span").fadeToggle(secondsMenu, function () {
          commn = 1;
        });
      }, 300);
    }
  });
  $(".dialog").on("click", function (e) {
    var dialclass = $(e.target).attr("class");

    if (dialclass == "dialog" || dialclass == "btn") {
      clearTimeout(nicktime);
      clearTimeout(couptime);
      coupon = "0";
      if (nickajaxflag == 1) nickajax.abort();
      if (coupajaxflag == 1) coupajax.abort();
      id = 0;
      c = 0;
      $(".modal").fadeOut();
      $(".modal__wrapper").addClass("zoomOut");
      setTimeout(function () {
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

        if (nickon != 1) {
          $("#i1.input__clear").fadeOut();
          $("#nickname").val("").removeClass("form__input-error");
          $("small").remove();
        }
      }, 500);
    }
  });
  var csrftoken = $("input[name=csrfmiddlewaretoken]").val();
  $("input[name=csrfmiddlewaretoken]").remove();
  $("li:first-child").addClass("active");
  var tprev = $(".categories > li:first-child").data("category-id"),
    products;
  var tprevsub = $(".subcategories > li:first-child").data("subcategory-id");
  $(".subcategories > li[data-category-id!=" + tprev + "]").hide();
  $('div.card[data-category-id!="' + tprev + ":" + tprevsub + '"]').hide();
  var checkels = $(".subcategories > li[data-check]").removeAttr("data-check");
  var checkarr = [];
  console.log(checkels);

  for (var i = 0; i < checkels.length; i++) {
    checkarr.push($(checkels[i]).data("subcategory-id"));
  }

  console.log(checkarr);
  checkels = null;
  $.ajax({
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    url: "/products/",
    headers: {
      "X-CSRFToken": csrftoken
    },
    success: function success(result) {
      if (result["status"] == "success") {
        console.log("ok");
        products = result["products"];
      }
    }
  });
  var dli = 1,
    parentcl,
    sub;
  var subhs = 500;
  $("li").on("click", function (el) {
    el = el.currentTarget;

    if (dli == 1) {
      dli = 0;
      setTimeout(function () {
        dli = 1;
      }, 1000);
      parentcl = $($(el).parent()).attr("class");
      $('div[data-category-id="' + tprev + ":" + tprevsub + '"]').addClass(
        "zoomOut"
      );

      if (parentcl == "categories") {
        $("li.active").removeClass("active");
        $(".subcategories").height($(".subcategories").height());
        $(".subcategories > li[data-category-id=" + tprev + "]").hide(
          subhs,
          function () {
            sub.fadeIn(subhs);
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
        setTimeout(function () {
          $(".card.zoomOut").removeClass("zoomOut").hide();
          $('div[data-category-id="' + tprev + ":" + tprevsub + '"')
            .addClass("zoomIn")
            .show();
          setTimeout(function () {
            $(".card.zoomIn").removeClass("zoomIn");
          }, 1e3);
        }, 500);
      }
    });
    var nick,
      nicktime,
      nickmain = "";
    var coupon = "0",
      discount = 0,
      nickon = 0,
      w;
  var loc = localStorage.getItem("nickname"),
    foc = "#nickname";
  console.log(loc);

  if (loc) {
    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "/info/player/",
      headers: {
        "X-CSRFToken": csrftoken
      },
      data: JSON.stringify({
        nick: loc
      }),
      success: function success(result) {
        console.log(result);

        if (result["status"] == "success") {
          foc = "#coupon";
          nickon = 1;
          nickmain = loc;
          nick = loc;
          $("#i1.input__clear").fadeIn();
          $("#nickname").val(loc).addClass("form__input-success");
        }
      },
      error: function error(xhr, text, _error) {
        console.log(xhr, text, _error);
      }
    });
  }

  var id, c, d, cws;
  $(".card").on("click", function (el) {
    id = $(el.currentTarget).data("item-id");
    var p = products[id];
    c = p["price"];
    cws = c;
    $(".modal__details").data("item-id", id);
    $(".modal__details > h2").text(p["name"]);
    $(".cost__value > h2").text(c + " ₽");
    $(".pre-formatted").text(p["desc"]);

    if (possibility["false"].indexOf(id) != -1) {
      console.log(1);
      $(".modal__buy-button")
        .attr("disabled", "")
        .html("<span>Уже куплено</span>");
      $("#coupon").attr("placeholder", "Товар недоступен");
      cws = -1;
    } else if (possibility["sub"].hasOwnProperty(tprevsub)) {
      console.log(2);
      sum = possibility["sub"][tprevsub];

      if (sum < c) {
        if (sum != 0) {
          c -= sum;
          $(".cost__value > h2").text(c + " ₽");
          $("#sale").text("Скидка " + sum + " ₽");
        }
      } else {
        noload(0);
        cws = -1;
        $(".modal__buy-button")
          .attr("disabled", "")
          .html("<span>Уже куплено</span>");
        $("#coupon").attr("placeholder", "Товар недоступен");
      }
    } else if (
      possibility["true"].indexOf(id) == -1 &&
      checkarr.indexOf(tprevsub) != -1 &&
      nickmain != ""
    ) {
      console.log(4);
      ajaxnick(0);
    }

    $(".modal").fadeIn();
    $(".modal__wrapper").addClass("zoomIn").show();
    setTimeout(function () {
      if (nickajaxflag == 0 && cws != -1) $(foc).focus();
      $(".modal__wrapper.zoomIn").removeClass("zoomIn");
    }, 1e3);
  });
  $("#i1.input__clear").on("click", function () {
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
    nickon = 0;
    nickmain = "";
    foc = "#nickname";
    clearTimeout(nicktime);
    $("#i2.input__clear").click();
    $("#i1.input__clear").fadeOut(200);
    $("#nickname").val("").attr("class", "form__input").focus();
    coupons = {};
  });
  $("#i2.input__clear").on("click", function () {
    if (coupajaxflag == 1) coupajax.abort();
    clearTimeout(couptime);
    if (nickon == 1) $("#coupon").val("").attr("class", "form__input").focus();
    sum = "";

    if (possibility["sub"].hasOwnProperty(tprevsub)) {
      if (possibility["sub"][tprevsub] != 0)
        sum =
          "\u0421\u043A\u0438\u0434\u043A\u0430 " +
          possibility["sub"][tprevsub] +
          " \u20BD";
    }

    $("#sale").text(sum);
    $(".cost__value > h2").text(c + " ₽");
    cws = c;
    $("#i2.input__clear").fadeOut(200);
    coupon = "0";
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
    setTimeout(function () {
      $(".toast").removeClass("fadeInUp");
      w = setTimeout(function () {
        $(".toast").fadeOut(100);
        setTimeout(function () {
          $(".toast").remove();
        }, 100);
      }, 1000);
    }, 500);
  };

  var load = function load() {
    $(".modal__buy-button")
      .html(
        '<div class="modal__buy-button__load"><img src="static/395.gif"></div>'
      )
      .addClass("load");
    $(".modal__buy-button__load").fadeIn(500);
  };

  var noload = function noload(typetext) {
    if (typetext === void 0) {
      typetext = 1;
    }

    $(".modal__buy-button").removeClass("load");
    typetext = typetext == 1 ? "Купить" : "Уже куплено";
    $(".modal__buy-button__load").fadeOut(500, function () {
      $(".modal__buy-button").html("<span>" + typetext + "</span>");
    });
  };

  var send_info,
    sum,
    possibility = {
      false: [],
      true: [],
      sub: {}
    };

  var ajaxnick = function ajaxnick(toa) {
    load();
    send_info = {
      nick: nick
    };
    if (checkarr.indexOf(tprevsub) != -1) send_info["id"] = id;
    nickajaxflag = 1;
    nickajax = $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "/info/player/",
      headers: {
        "X-CSRFToken": csrftoken
      },
      data: JSON.stringify(send_info),
      success: function success(result) {
        nickajaxflag = 0;

        if (result["status"] == "success") {
          $("#nickname").blur();
          foc = "#coupon";
          nickon = 1;

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
          $("small").remove();
          toa = toa == 1 ? "Игрок найден)" : "Товар доступен)";
          toast("success", toa);

          switch (result["possibility"]) {
            case true:
              possibility["true"].push(id);

            case "true":
              noload();
              $("#coupon").focus();
              break;

            case false:
              cws = -1;
              noload(0);
              possibility["false"].push(id);
              $(".modal__buy-button").attr("disabled", "");
              $("#coupon").attr("placeholder", "Товар недоступен");
              break;

            default:
              sum = result["possibility"];
              possibility["sub"][tprevsub] = sum;

              if (sum < c) {
                noload();
                $("#coupon").focus();

                if (sum != 0) {
                  c -= sum;
                  $(".cost__value > h2").text(c + " ₽");
                  $("#sale").text("Скидка " + sum + " ₽");
                }
              } else {
                cws = -1;
                noload(0);
                $(".modal__buy-button").attr("disabled", "");
                $("#coupon").attr("placeholder", "Товар недоступен");
              }
          }
        } else {
          noload();

          if (nickon != 1) {
            $("#nickname").addClass("form__input-error");
            $(".form__element:first-child").append(
              '<small class="input-error">Такого игрока на сервере никогда не было!</small>'
            );
            toast("error", "Такого игрока нет(");
            if (nick != "" && nickon == 0) nickon = -1;
          } else {
            $("#nickname").val(nickmain).addClass("form__input-success");
            $("#coupon").focus();
          }
        }
      },
      error: function error(xhr, text, _error2) {
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
  $("#nickname").on("input", function () {
    console.log(nickon);
    nick = $("#nickname").val();

    if (/^[-_a-zA-Z0-9]+$/.test(nick) || nick == "") {
      nickon = 2;
      if (nickajaxflag == 1) nickajax.abort();
      clearTimeout(nicktime);
      $("#nickname").attr("class", "form__input");
      $("small").remove();

      if (nick != "") {
        $("#i1.input__clear").fadeIn(100);
        nicktime = setTimeout(ajaxnick, inputtime, 1);
      } else {
        $("#i1.input__clear").click();
      }
    } else {
      $("#nickname").val(nick.replace(/[^-_a-zA-Z0-9]/g, ""));
      toast("warning", "Недопустимые символы");
    }
  });
  $("#nickname").on("keydown", function (e) {
    if (e.keyCode == 13) {
      if (nickon == 1) {
        $("#coupon").focus();
      } else {
        $(".modal__buy-button").click();
      }
    }
  });
  $("#nickname").on("focus", function () {
    if (coupajaxflag == 1) {
      $("#nickname").blur();
      toast("warning", "Идёт загрузка");
      $("small").remove();
    }
  });
  $("#coupon").on("focus", function () {
    if (nickajaxflag == 1 || nickon == 2) {
      $("#coupon").blur();
      toast("warning", "Идёт загрузка");
      $("small").remove();
    } else if (nickon != 1) $(".modal__buy-button").click();
    else if (cws == -1) {
      $("#coupon").blur();
      toast("error", "Товар недоступен");
    }
  });
  var coup,
    couptime,
    coupons = {};

  var sale = function sale(disc) {
    $("#coupon").addClass("form__input-success").blur().text(coupon);
    cws = Math.floor((c * (100 - disc)) / 100);
    $(".cost__value > h2").text(cws + " ₽");
    sum = "Скидка " + discount + "%";

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

  $("#coupon").on("input", function () {
    coup = $("#coupon").val();

    if (/^[-_a-zA-Z0-9]+$/.test(coup) || coup == "") {
      if (coupajaxflag == 1) coupajax.abort();
      clearTimeout(couptime);
      $("#coupon").attr("class", "form__input");

      if (coup != "") {
        $("#i2.input__clear").fadeIn(100);
        couptime = setTimeout(function () {
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
                  discount = result["discount"];
                  coupons[coupon] = discount;
                  sale(discount);
                } else {
                  if (coupon == "0") {
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
              error: function error(xhr, text, _error3) {
                noload();
                coupajaxflag = 0;

                if (text != "abort") {
                  $("#i2.input__clear").click();
                  alert(
                    "Произошла ошибка, обратитесь в тех.поддержку\nОшибка: " +
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
    } else {
      $("#coupon").val(coup.replace(/[^-_a-zA-Z0-9]/g, ""));
      toast("warning", "Недопустимые символы");
    }
  });
  $("#coupon").on("keydown", function (e) {
    if (e.keyCode == 13) {
      $(".modal__buy-button").click();
    } else if (e.keyCode == 8 && $("#coupon").val() == "") {
      setTimeout(function () {
        $("#nickname").focus();
      }, 50);
    } else if (e.keyCode == 32) {
      e.preventDefault();
    }
  });
  $(".modal__buy-button").on("click", function () {
    console.log(nickon);

    switch (nickon) {
      case 1:
        load();
        setTimeout(function () {
          noload();
        }, 500);
        console.log(
          "https://fefwf.com/?id=" +
            id +
            "&nickname=" +
            nickmain +
            "&cost=" +
            cws +
            "&coupon=" +
            coupon
        );
        break;

      case 0:
        $("small").remove();
        $(".form__element:first-child").append(
          '<small class="input-error">Введите никнейм! </small>'
        );
        var _text = "Введите никнейм ";

      case -1:
        _text = "Игрок не найден( ";
        $("#nickname").focus();
        toast("warning", _text);
        break;
    }
  });
});
