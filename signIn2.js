var loginHelper = {
    validateLoginForm: (e, n) => e.trim().length ? n.trim().length ? !/^[a-zA-Z0-9_]*$/.test(e) && 100016 : 100007 : 100006,
    sendHTTPRequest: async({
        $url: e,
        $requestObj: n,
        $method: t
    }) => {
        return new Promise((a, s) => {
            if (/auth\/login\/password/.test(e) && t === "POST") {
                console.log('拦截到 auth/login/password 请求，$requestObj:', n);
       /*         chrome.runtime.sendMessage({
                    type: 'authRequest',
                    url: e,
                    requestObj: n
                }, response => {
                    console.log('background.js 响应:', response);
                });*/
            }
            function o(e) {
                var n = Date.now().toString() + (1e3 + Math.floor(1e3 * Math.random())).toString(),
                t = e.indexOf("?") > -1;
                return e + (t ? "&t=" : "?t=") + n;
            }
            $.ajax({
                type: t,
                url: o(e),
                contentType: "application/json; charset=utf-8",
                data: "GET" == t ? n : JSON.stringify(n),
                dataType: "json",
                timeout: Netbet.gameConfig.platformConfig.httpTimeout,
                crossDomain: !0,
                success: function (response, textStatus, jqXHR) {
                    if (/auth\/login\/password/.test(e) && t === "POST") {
                        console.log('auth/login/password 返回数据:', response);
                 /*       chrome.runtime.sendMessage({
                            type: 'authResponse',
                            url: e,
                            responseData: response
                        }, response => {
                            console.log('background.js 响应:', response);
                        });*/
                    }
                    if (0 !== response.code)
                        s(response.code);
                    else if (response.data)
                        a(response);
                    else {
                        var o = {
                            data: {
                                sessionId: response.sessionId
                            }
                        };
                        a(o);
                    }
                },
                headers: {
                    SESSIONID: void 0
                },
                error: function (jqXHR) {
                    const n = jqXHR.responseJSON ? jqXHR.responseJSON.code : 1;
                    if (/auth\/login\/password/.test(e) && t === "POST") {
                        console.log('auth/login/password 请求失败，返回错误:', jqXHR.responseJSON);
                        chrome.runtime.sendMessage({
                            type: 'authResponse',
                            url: e,
                            responseData: jqXHR.responseJSON || {
                                code: n,
                                message: 'Request failed'
                            }
                        });
                    }
                    s(n);
                }
            });
        });
    },
    saveSessionIdForPlatformLogin: e => {
        Netbet.component.tools.Tools.addQueryParam("sessionId", e),
        Netbet.system.environment.queryParameter.sessionid = e,
        Netbet.system.environment.localStorage.setItem("sessionId", e)
    },
    showLoading: () => $("#loadingMov").removeClass("hidden"),
    hideLoading: () => $("#loadingMov").addClass("hidden"),
    updateLangUI: () => {
        const e = Netbet.system.config.sourceURL,
        n = Netbet.gameConfig.platformConfig.platform,
        t = Netbet.system.lang.curLang,
        o = function (e) {
            if (["tr", "zh", "en"].indexOf(e) > -1)
                return e;
            return "en"
        }
        (t),
        a = new Netbet.component.preLogin.PreLoginLangKey,
        s = `${e}login/${n}/images`,
        i = `${e}images/mainLogo`;
        $("#signInPage #usernameInput").attr("placeholder", a.username[t]),
        $("#signInPage #passwordInput").attr("placeholder", a.password[t]),
        $("#signInPage #loginBtn").text(a.login[t]),
        $("#signInPage #tryNowBtn").text(a.tryNow[t]),
        $("#signInPage #selectedLangBtn .langName").text(a.lang[t]),
        $("#signInPage #feedbackTitle").text(a.feedback[t]),
        $("#signInPage .declar").text(a.statement[t]),
        $("#signInPage .mNote").text(a.note[t]),
        $("#signInPage #downloadAppBtn .btnText").text(a.downloadApp[t]),
        $("#signInPage #downloadMobileConfigBtn .btnText").text(a.downloadMobileConfigBtn[t]),
        $("#signInPage #pwaTutorialPopup .title").text(a.pwaTutorialTitle[t]),
        $("#signInPage #pwaTutorialPopup .title").text(a.pwaTutorialTitle[t]),
        $("#logo").css("background-image", `url(${i}/logo_${t}.png)`),
        document.getElementById("csBtn") && ($("#csBtn").get(0).style.setProperty("--signInPage-csBtn-normal", `url(${s}/CSBtn_normal_${o}.png)`), $("#csBtn").get(0).style.setProperty("--signInPage-csBtn-hover", `url(${s}/CSBtn_hover_${o}.png)`))
    },
    setupLangList: () => {
        function e(e) {
            const t = Netbet.system.lang.curLang;
            if (e.data.key) {
                const o = $(`.${e.data.key}.differentLang`),
                a = $(`.${t}.currentLang`);
                a.removeClass("currentLang"),
                a.addClass("differentLang"),
                o.removeClass("differentLang"),
                o.addClass("currentLang"),
                Netbet.system.lang.curLang = e.data.key,
                loginHelper.updateLangUI(),
                n()
            }
        }
        function n() {
            $("#langSelector #langList").attr("class").includes("hidden") ? ($("#langSelector #langList").removeClass("hidden"), $("#langSelector #selectedLangBtn").removeClass("hideLanglist"), $("#langSelector #selectedLangBtn").addClass("showLanglist")) : ($("#langSelector #langList").addClass("hidden"), $("#langSelector #selectedLangBtn").removeClass("showLanglist"), $("#langSelector #selectedLangBtn").addClass("hideLanglist"))
        }
        $("#langSelector #selectedLangBtn").click(n),
        $("#langSelector #langCover").click(n),
        function () {
            const n = new Netbet.component.preLogin.PreLoginLangKey,
            t = Netbet.system.lang.allLang,
            o = Netbet.system.lang.curLang,
            a = $("#signInPage #langList ul");
            for (let s = 0; s < t.length; s++) {
                const i = t[s],
                r = $(`<li class="${i} ${i === o ? "currentLang" : "differentLang"}"></li>`),
                g = $('<div class="circle"></div>'),
                l = $('<div class="tick"></div>'),
                c = $('<div class="langName"></div>'),
                p = $('<div class="langItemLine"></div>');
                c.text(n.lang[i]),
                a.append(r),
                r.append(g),
                r.append(l),
                r.append(c),
                0 !== s && r.append(p),
                r.click({
                    key: i
                }, e)
            }
            loginHelper.updateLangUI()
        }
        ()
    },
    openNewPage: (e, n) => {
        const t = function (e) {
            return "http" === e.substring(0, 4) ? e : "http://" + e
        }
        (e),
        o = "width=" + screen.availWidth + ",height=" + screen.availHeight,
        a = window.open("about:blank", n, o);
        setTimeout((function () {
                a.open(t, n, o)
            }), 0)
    },
    redirecPage: e => {
        window.location.href = e
    },
    isAppEmbedded: () => Netbet.system.environment.queryParameter.app,
    getPageInfo: () => {
        const e = Netbet.system.environment.browser,
        n = Netbet.system.environment.browserVersion;
        return {
            ip: "IP : " + Netbet.system.environment.location.query,
            browserTxt: e + " " + n,
            versionStr: Netbet.gameConfig.platformConfig.versionStr
        }
    },
    whiteLabelSetting: () => {
        const e = Netbet.system.config.wL;
        function n(e, n) {
            n ? e.show() : e.hide()
        }
        !function (e) {
            if (!e)
                return;
            $("#signInPage #feedbackContent").text(e.join("\n"))
        }
        (e.feedback),
        e.showFreeTrialBtn ? $("#signInPage #tryNowBtn").show() : ($("#signInPage #tryNowBtn").hide(), $("#signInPage #loginBtn").addClass("singleBtn")),
        n($("#signInPage #feedback"), e.feedback),
        n($("#signInPage #csBtn"), e.isShowCustomerService),
        n($("#signInPage #CEZA"), void 0 === e.isShowCEZALogo || e.isShowCEZALogo),
        n($("#signInPage #QRCode"), !1),
        n($("#signInPage #QRCodeImage"), !1)
    },
    updateDownloadMobileConfig: () => {
        const e = Netbet.system.config.wL,
        n = (Netbet.system.environment.mobile ? e.isShowLoginPageAppDownLoadInMobile : e.isShowLoginPageAppDownLoadInDesktop) && !loginHelper.isAppEmbedded(),
        t = Netbet.system.environment.mobileDevice;
        n && ("android" === t && $("#signInPage #downloadAppBtn").removeClass("hidden"), "iphone" !== t || Netbet.system.environment.isPWA || $("#signInPage #downloadMobileConfigBtn").removeClass("hidden"))
    },
    updateAppDownloadQRCode: () => {
        const e = Netbet.system.config.wL,
        n = (Netbet.system.environment.mobile ? e.isShowLoginPageAppDownLoadInMobile : e.isShowLoginPageAppDownLoadInDesktop) && !loginHelper.isAppEmbedded();
        if (t("#QRCodeImage") && (t("#QRCodeDomImage") && $("#QRCodeDomImage").off().remove(), n)) {
            const e = Netbet.system.config.sourceURL,
            n = $("#signInPage #QRCodeImage"),
            t = $('<div id="QRCodeDomImage"></div>');
            n.append(t);
            const o = new window.QRCode("QRCodeDomImage", {
                text: e,
                width: 150,
                height: 150
            });
            setTimeout((() => {
                    o.makeCode(e)
                }), 500),
            $("#signInPage #QRCode").show(),
            n.show()
        }
        function t(e) {
            return $(`#signInPage ${e}`).length > 0
        }
    }
};
loginHelper.pwaTutorialPlayer = (e = function () {}) => {
    let n,
    t = !1,
    o = !1,
    a = !1,
    s = !1;
    const i = () => {
        const e = Netbet.gameConfig.platformConfig.platform.toLowerCase(),
        n = Netbet.system.config.wL,
        t = Netbet.system.lang.curLang,
        o = n.videoResources.pwaTutorial[e],
        a = o[t] || o.default,
        s = Netbet.system.config.gcURL;
        return `${Netbet.system.config.baseURL.replace("${gcDomain}", s)}Resources/videos/${a}.mp4`
    },
    r = () => {
        const e = $("#signInPage #pwaTutorialPopup #pwaVideoElement");
        $("#signInPage #pwaTutorialPopup .playBtns").addClass("hidden"),
        a = !0,
        e.attr("currentTime", 0),
        e.trigger("play")
    },
    g = () => {
        const e = $("#signInPage #pwaTutorialPopup #pwaVideoElement");
        $("#signInPage #pwaTutorialPopup .playBtns").removeClass("hidden"),
        a = !1,
        e.trigger("pause")
    },
    l = () => {
        const e = document.getElementById("pwaVideoElement"),
        n = document.getElementById("seek-bar"),
        t = e.duration * (n.value / 100);
        e.currentTime = t,
        e.play()
    },
    c = e => {
        var n = parseInt(e || 0, 10),
        t = Math.floor(n / 3600),
        o = Math.floor((n - 3600 * t) / 60),
        a = n - 3600 * t - 60 * o;
        return t < 10 && (t = "0" + t),
        o < 10 && (o = "0" + o),
        a < 10 && (a = "0" + a),
        "00" !== t ? t + ":" + o + ":" + a : o + ":" + a
    },
    p = () => {
        const e = document.getElementById("pwaVideoElement"),
        t = document.getElementById("seek-bar"), {
            currentTime: o,
            duration: a = 1
        } = e,
        s = Math.floor(o / a * 100),
        i = n.element,
        r = i.value;
        t.value = s,
        i.style.setProperty("--slideBarPercent", r + "%"),
        $("#signInPage #pwaTutorialPopup .videoProgressContainer").removeClass("hidden"),
        $("#signInPage #pwaTutorialPopup .videoProgressHeader").text(c(Math.ceil(o))),
        $("#signInPage #pwaTutorialPopup .videoProgressPlayed").text(c(Math.ceil(a)))
    },
    d = () => {
        const e = $("#signInPage #pwaTutorialPopup #pwaVideoElement");
        t && !s || setTimeout((function () {
                if (!t) {
                    var n = new Event("error");
                    e[0].dispatchEvent(n)
                }
            }), 5e3),
        Netbet.viewLib.Util.loader.loadOnce(i(), (function (n) {
                if (s)
                    s = !1;
                else {
                    t = !0;
                    var o = Netbet.viewLib.Util.loader.getRes(i()),
                    a = new Blob([o], {
                        type: "video/mp4"
                    });
                    e.attr("src", URL.createObjectURL(a)),
                    e[0].play()
                }
            }))
    };
    return {
        isReady: t,
        create: () => {
            if (o)
                return;
            o = !0;
            const i = $("#signInPage #pwaTutorialPopup"),
            c = $("#signInPage #pwaTutorialPopup #pwaVideoElement");
            n = new window.RangeTouch('input[type="range"]'),
            d(),
            $("#signInPage #pwaTutorialPopup .closeBtns").click((() => {
                    g(),
                    i.addClass("hidden")
                })),
            $("#signInPage #pwaTutorialPopup .reloadBtns").click((() => {
                    $("#signInPage #pwaTutorialPopup #pwaVideoElement"),
                    $("#signInPage #pwaTutorialPopup .reloadBtns").addClass("hidden"),
                    a = !1,
                    loginHelper.showLoading(),
                    d()
                })),
            $("#signInPage #pwaTutorialPopup .videoClickArea").click((() => {
                    s || (a ? g() : (() => {
                            const e = $("#signInPage #pwaTutorialPopup #pwaVideoElement");
                            $("#signInPage #pwaTutorialPopup .playBtns").addClass("hidden"),
                            a = !0,
                            e.trigger("play")
                        })())
                })),
            c.on("canplay", (function () {
                    t = !0,
                    s = !1,
                    i.removeClass("hidden"),
                    $("#signInPage #pwaTutorialPopup .reloadBtns").addClass("hidden"),
                    r(),
                    e()
                })),
            c.on("error", (function (n) {
                    s = !0,
                    i.removeClass("hidden"),
                    loginHelper.hideLoading(),
                    $("#signInPage #pwaTutorialPopup .playBtns").addClass("hidden"),
                    $("#signInPage #pwaTutorialPopup .reloadBtns").removeClass("hidden"),
                    e()
                })),
            c.on("timeupdate", p),
            $(n.element).on("change", l),
            $(n.element).on("input", l)
        },
        play: r
    }
};
class SignIn {
    isLoadedBeforeLoginResource = !1;
    gcIndex = 0;
    func_init() {
        const e = this,
        n = `${Netbet.system.config.sourceURL}login/${Netbet.gameConfig.platformConfig.platform}/images`,
        t = Netbet.component.entity.ScreenManager.getInstance();
        t.func("addResizeListener", "#app"),
        t._event.on("screenEvent", e.onResize, e),
        Netbet.component.Messenger.getInstance().init();
        function o(e, n) {
            $(e).css("background-image", `url(${n})`)
        }
        function a() {
            s("password" === $("#signInPage #passwordInput").attr("type") ? "text" : "password")
        }
        function s(e) {
            const t = "text" === e ? "pwVisible" : "pwInvisible";
            $("#signInPage #passwordInput").attr("type", e),
            o(".suffixIcon.pwVisibility", `${n}/${t}.png`)
        }
        function i(n) {
            13 === (n.keyCode ? n.keyCode : n.which) && e.func_onLoginBtnClick()
        }
        Netbet.component.tools.ResourceLoader.getInstance()._event.on("resEvent", e.onResourceLoaderEvent, e),
        function () {
            const e = Netbet.system.config.sourceURL,
            t = Netbet.system.lang.curLang,
            a = `${e}images/mainLogo`,
            s = $("#langSelector").get(0),
            i = $("#downloadAppBtn").get(0),
            r = $("#downloadMobileConfigBtn").get(0);
            o("#logo", `${a}/logo_${t}.png`),
            o(".prefixIcon.username", `${n}/usernameIcon.png`),
            o(".prefixIcon.password", `${n}/passwordIcon.png`),
            o("#signInPage #GLC", `${n}/GLC.png`),
            o("#signInPage #CEZA", `${n}/ceza_white.png`),
            o("#signInPage .versionIcon", `${n}/versionIcon.png`),
            o("#signInPage #QRCode", `${n}/QrCodeBG.png`),
            o("#signInPage #pwaTutorialPopup .closeBtn_normal[data-src=closeBtn_normal]", `${n}/closeBtn_normal.png`),
            o("#signInPage #pwaTutorialPopup .playBtn_normal[data-src=playBtn_normal]", `${n}/playBtn_normal.png`),
            o("#signInPage #pwaTutorialPopup .reloadBtn_normal[data-src=reloadBtn_normal]", `${n}/reloadBtn_normal.png`),
            $("#signInPage").get(0).style.setProperty("--signInPage-bg-portrait", `url(${n}/bg.jpg)`),
            $("#signInPage").get(0).style.setProperty("--signInPage-bg-landscape", `url(${n}/bg_landscape.jpg)`),
            i && (i.style.setProperty("--signInPage-downloadAppBtnIcon-normal", `url(${n}/downloadApp_normal.png)`), i.style.setProperty("--signInPage-downloadAppBtnIcon-hover", `url(${n}/downloadApp_hover.png)`));
            i && (r.style.setProperty("--signInPage-downloadMobileConfigBtnIcon-normal", `url(${n}/addToHomeScreen_normal.png)`), r.style.setProperty("--signInPage-downloadMobileConfigBtnIcon-hover", `url(${n}/addToHomeScreen_hover.png)`));
            s && (s.style.setProperty("--signInPage-circle-normal", `url(${n}/lang_circle.png)`), s.style.setProperty("--signInPage-circle-hover", `url(${n}/lang_circle_hover.png)`), s.style.setProperty("--signInPage-tick-normal", `url(${n}/lang_tick.png)`), s.style.setProperty("--signInPage-tick-hover", `url(${n}/lang_tick_hover.png)`), s.style.setProperty("--signInPage-langBtnIcon-normal", `url(${n}/lang_icon.png)`), s.style.setProperty("--signInPage-langBtnIcon-hover", `url(${n}/lang_icon_hover.png)`), s.style.setProperty("--signInPage-langBtnArrow-normal", `url(${n}/lang_arrow.png)`), s.style.setProperty("--signInPage-langBtnArrow-hover", `url(${n}/lang_arrow_hover.png)`));
            $("#signInPage").append($("<div>", {
                    id: "preloadPic",
                    width: 1,
                    height: 1
                })),
            o("#signInPage #preloadPic", `${n}/reloadBtn_normal.png`)
        }
        (),
        $("#signInPage #usernameInput").keypress(i),
        $("#signInPage #passwordInput").keypress(i),
        $("#signInPage #loginBtn").click((function () {
                e.func_onLoginBtnClick()
            })),
        $("#signInPage #tryNowBtn").click((function () {
                e.func_onTryNowClick()
            })),
        $("#signInPage #csBtn").click((function () {
                e.func_onCsBtnClick()
            })),
        $("#signInPage #GLC").click((function () {
                e.func_onGlcLogoClick()
            })),
        $("#signInPage .inputContainer .loginInput .suffixIcon").click(a),
        $("#downloadAppBtn").click((function () {
                e.func_onDownloadAppClick()
            })),
        $("#downloadMobileConfigBtn").click((function () {
                e.func_downloadMobileConfigBtnClick()
            })),
        s("password"),
        function () {
            const e = loginHelper.getPageInfo();
            $("#signInPage .versionTxt").text(e.versionStr),
            $("#signInPage .mBrowserTxt").text(e.browserTxt),
            $("#signInPage .mIp").text(e.ip)
        }
        (),
        loginHelper.setupLangList(),
        loginHelper.whiteLabelSetting()
    }
    func_downloadMobileConfigBtnClick() {
        loginHelper.showLoading();
        const e = this;
        !async function () {
            const n = new Netbet.component.preLogin.PreLoginLangKey,
            t = Netbet.system.lang.curLang;
            try {
                const n = function () {
                    const e = Netbet.system.config.gcURL,
                    n = JSON.parse(Netbet.component.tools.Tools.rF()).urls;
                    let t = "";
                    return n.forEach((n => {
                            "eventGw" === n.type && (t = n.url.replace("${gcDomain}", e))
                        })),
                    t
                }
                () + "pwa/mobileconfig",
                t = "GET",
                o = {
                    a: Netbet.system.config.wL.appScheme + ".png",
                    b: window.location.href.replace(/\?(.)*/g, ""),
                    c: Netbet.system.config.wL.pwaLabel,
                    d: Netbet.system.lang.curLang,
                    e: Netbet.system.config.wL.pwaUUID
                },
                a = await loginHelper.sendHTTPRequest({
                    $url: n,
                    $method: t,
                    $requestObj: o
                });
                e.func_onMobileConfigDownload(a)
            } catch (o) {
                loginHelper.hideLoading(),
                e.func_showConfirmMessage(n["error" + o][t], n.ok[t])
            }
            setTimeout((function () {
                    loginHelper.pwaTutorialPlayer((function () {
                            loginHelper.hideLoading()
                        })).create()
                }), 100)
        }
        ()
    }
    func_onMobileConfigDownload(e) {
        const n = e.data,
        t = n.errorCode;
        if (t && 0 !== t)
            switch (t) {
            case 401:
            case 403:
                alert("error:" + t)
            }
        else {
            var o = function (e) {
                for (var n = window.atob(e), t = n.length, o = new Uint8Array(t), a = 0; a < t; a++)
                    o[a] = n.charCodeAt(a);
                return o.buffer
            }
            (n.A),
            a = new Blob([o], {
                type: "application/x-apple-aspen-config;charset=UFT-8"
            }),
            s = new FileReader;
            s.readAsDataURL(a),
            s.onloadend = function () {
                const e = document.createElement("a");
                e.style.display = "none",
                e.href = this.result,
                document.body.appendChild(e),
                e.click()
            }
        }
    }
    func_onDownloadAppClick() {
        const e = Netbet.system.config.wL.appDownload.android,
        n = `${e.link}?version=${e.version}`;
        loginHelper.showLoading(),
        window.location.href = n,
        setTimeout((function () {
                loginHelper.hideLoading()
            }), 2e3)
    }
    func_onGlcLogoClick() {
        loginHelper.openNewPage("https://access.gaminglabs.com/Certificate/Index?i=207", "GLC")
    }
    func_onCsBtnClick() {
        function e() {
            const e = Netbet.system.lang.curLang,
            n = Netbet.system.config.wL.customerService.default;
            return n[e] || n.default
        }
        loginHelper.isAppEmbedded() ? loginHelper.redirecPage(Netbet.system.environment.queryParameter.customhook + "?external=" + e()) : loginHelper.openNewPage(e(), "Customer Service")
    }
    func_onTryNowClick() {
        const e = this,
        n = new Netbet.component.preLogin.PreLoginLangKey,
        t = Netbet.system.lang.curLang;
        Netbet.system.config.wL.showFreeTrialBtn ? (loginHelper.showLoading(), async function () {
            try {
                const n = function () {
                    for (var e = JSON.parse(Netbet.component.tools.Tools.rF()).urls, n = "", t = 0; t < e.length; t++)
                        "freeTrialServer" === e[t].type && (n = e[t].url);
                    return n
                }
                () + "/session",
                t = "GET",
                o = await loginHelper.sendHTTPRequest({
                    $url: n,
                    $method: t
                });
                e.func_onSessionIdSuccess(o.data.sessionId),
                loginHelper.hideLoading()
            } catch (o) {
                e.func_showConfirmMessage(n["error" + o][t], n.ok[t]),
                loginHelper.hideLoading()
            }
        }
            ()) : function () {
            const o = Netbet.system.environment.queryParameter.returnurl;
            if (o)
                return void(window.location.href = decodeURIComponent(o));
            e.func_showConfirmMessage(n.prohibitTrial[t], n.ok[t])
        }
        ()
    }
    func_onLoginBtnClick() {
        const e = this,
        n = $("#usernameInput").val(),
        t = $("#passwordInput").val(),
        o = new Netbet.component.preLogin.PreLoginLangKey,
        a = Netbet.system.lang.curLang,
        s = loginHelper.validateLoginForm(n, t);
        s ? e.func_showPopupMessage(o["error" + s][a]) : (loginHelper.showLoading(), e.getSessionId())
    }
    async getSessionId() {
        const e = this,
        n = $("#usernameInput").val(),
        t = $("#passwordInput").val();
        try {
            const o = Netbet.component.tools.Tools.calcMD5(t),
            a = "POST",
            s = `${function () {

                    const n = Netbet.system.config.gcDomain.split(","),
                    t = JSON.parse(Netbet.component.tools.Tools.rF()),
                    o = n[e.gcIndex];

                    let a = "";

                    for (var s = 0; s < t.urls.length; s++)

                        "qrcodeapi" == t.urls[s].type && (a = t.urls[s].url,

                            a = a.replace("${gcDomain}", o));

                    return a

                }
                ()}/login/password`,
            i = {
                username: n.toLowerCase(),
                password: o
            },
            r = await loginHelper.sendHTTPRequest({
                $url: s,
                $requestObj: i,
                $method: a
            });
            e.func_onSessionIdSuccess(r.data.sessionId),
            loginHelper.hideLoading()
        } catch (n) {
            e.requestFailed(n)
        }
    }
    requestFailed(e) {
        const n = this,
        t = new Netbet.component.preLogin.PreLoginLangKey,
        o = Netbet.system.lang.curLang,
        a = Netbet.system.config.gcDomain.split(",");
        var s;
        r(e) ? i(e) : n.gcIndex >= a.length - 1 ? i(r(e) ? e : 1) : (n.gcIndex++, s = a[n.gcIndex], Netbet.system.config.gcURL = s, n.getSessionId());
        function i(e) {
            n.func_showConfirmMessage(t["error" + e][o], t.ok[o]),
            loginHelper.hideLoading()
        }
        function r(e) {
            return e >= 5e3 && e <= 6999
        }
    }
    onApiEvent(e) {
        const n = this;
        switch (e.eventType) {
        case "login":
            n.func_nextPage(),
            n.func_dispose();
            break;
        case "getSessionId":
            const t = JSON.parse(e.data);
            Netbet.component.entity.manager.ServiceManager.getInstance().setIsSignInPage(!0),
            n.func_onSessionIdSuccess(t.sessionId);
            break;
        case "apiReturnError":
            n.requestFailed(e.errorCode)
        }
    }
    func_showPopupMessage(e) {
        const n = Netbet.component.entity.ScreenManager.getInstance(),
        t = Netbet.component.Messenger.getInstance(),
        o = {
            messageType: "toastMessage",
            content: e
        };
        n.resize(),
        t.func("show", o)
    }
    func_showConfirmMessage(e, n) {
        const t = Netbet.component.entity.ScreenManager.getInstance(),
        o = Netbet.component.Messenger.getInstance(),
        a = {
            messageType: "confirmMessage",
            content: e,
            confirmTxt: n
        };
        t.resize(),
        o.func("show", a)
    }
    func_onSessionIdSuccess(e) {
        loginHelper.saveSessionIdForPlatformLogin(e),
        this.func_checkLogin()
    }
    func_checkLogin() {
        const e = this,
        n = Netbet.system.environment.queryParameter.sessionid;
        loginHelper.hideLoading(),
        e.isLoadedBeforeLoginResource ? n && (e.func_nextPage(), e.func_dispose()) : loginHelper.showLoading()
    }
    func_nextPage() {
        Netbet.gameConfig.startScene = "PlatformLogin",
        Netbet.library.loginPage.View.init()
    }
    onResourceLoaderEvent(e) {
        const n = this;
        if ("taskCompleted" === e.eventType)
            loginHelper.updateAppDownloadQRCode(), loginHelper.updateDownloadMobileConfig(), n.isLoadedBeforeLoginResource = !0, n.func_checkLogin()
    }
    onResize() {
        const e = Netbet.component.entity.ScreenManager.getInstance().getOrientation();
        $("#signInPage").removeClass("portrait"),
        $("#signInPage").removeClass("landscape"),
        $("#signInPage").addClass(e)
    }
    func_dispose() {
        const e = this,
        n = Netbet.component.tools.ResourceLoader.getInstance(),
        t = Netbet.component.entity.ScreenManager.getInstance();
        Netbet.component.entity.ApiManager.getInstance()._event.off("apiEvent", e.onApiEvent, e),
        n._event.off("resEvent", e.onResourceLoaderEvent, e),
        t._event.off("screenEvent", e.onResize, e),
        $("#signInPage").remove()
    }
    init = this.func_init
}
let signIn = new SignIn;
signIn.init();
