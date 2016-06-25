var iapiVersion = "13.2.22.0";
var iapiERR_OK = 0;
var iapiERR_NOK = -1;
var iapiERR_BLOCKED = -2;
var iapiCALLOUT_LOGIN = 'Login';
var iapiCALLOUT_TEMPORARYTOKEN = 'GetTemporaryAuthenticationToken';
var iapiCALLOUT_SESSIONVALIDATION = 'ValidateLoginSession';
var iapiCALLOUT_MESSAGES = 'GetWaitingMessages';
var iapiCALLOUT_SUBMITDIALOG = 'SubmitDialog';
var iapiCALLOUT_FORGOTPASSWORD = 'ForgotPassword';
var iapiCALLOUT_GETLOGGEDINPLAYER = 'GetLoggedInPlayer';
var iapiCALLOUT_LOGOUT = 'Logout';
var iapiEVENT_TIMER = 10;
var iapiUsername = null;
var iapiPassword = null;
var iapiRealMode = 1;
var iapiLanguageCode = null;
var iapiDivname = 'iapidiv';
var iapiIframename = 'iapiiframe';
var iapiRealCookieIframe = 'iapirealcookieiframe';
var iapiFunCookieIframe = 'iapifuncookieiframe';
var iapiGetLoggedInPlayerRequestIdReal = 1234567890;
var iapiGetLoggedInPlayerRequestIdFun = 9876543210;
var iapiClientParams = [];
var iapiWaitingMessagesId = 0;
var iapiCalloutFunctions = [];
var iapiRequestIds = [];
var iapiLoginSuccess = false;
var iapiSessionValid = 0;
var iapiNextLogin = null;
var iapiLoginModeDownload = false;
var iapiLoginModeFlash = false;
var iapiFlashLoginClientType = null;
var iapiFlashLoginGameType = null;
var iapiMessagesSupported = false;
var iapiMessagesAnswered = false;

function iapiLogin(aa, ba, ca, da) {
    iapiLoginModeDownload = false;
    iapiLoginModeFlash = false;
    iapiBaseLogin(aa, ba, ca, da);
    return iapiERR_OK;
};

function iapiLaunchClient(ea, fa, ga, ha, ia, ja) {
    if (iapiConf['clientUrl_' + ea]) {
        var ka = iapiConf['clientUrl_' + ea];
        if (fa) {
            ka = iapiAddUrlParams(ka, 'game=' + fa);
        }
        if (ga) {
            ka = iapiAddUrlParams(ka, 'preferedmode=' + ga);
        }
        if (iapiClientParams['clientParams_' + ea]) {
            ka = iapiAddUrlParams(ka, iapiClientParams['clientParams_' + ea]);
        }
        if (iapiLoginModeFlash) {
            document.location = ka;
            return;
        }
        var la = 'width=800,height=600';
        if (ia != undefined && ja != undefined) {
            if (ia == -1 && ja == -1) {
                la = '';
                if (navigator.appName == 'Microsoft Internet Explorer' || (navigator.userAgent.indexOf('Safari') >= 0 && navigator.userAgent.indexOf('Chrome') < 0)) {
                    la = 'left=0,top=0,';
                };
                var ma = screen.width;
                var na = screen.height;
                if (screen.availWidth != undefined) {
                    ma = screen.availWidth;
                    na = screen.availHeight;
                }
                if (typeof(innerWidth) == 'number' && typeof(outerWidth) == 'number') {
                    ma -= (outerWidth - innerWidth);
                    na -= (outerWidth - innerWidth);
                }
                la += 'width=' + ma + ',height=' + na;
            } else {
                la = 'width=' + ia + ',height=' + ja;
            };
        } else if (iapiConf['windowSize_' + ea]) {
            var oa = iapiConf['windowSize_' + ea][fa];
            if (oa == undefined) {
                oa = iapiConf['windowSize_' + ea]['default'];
            };
            if (oa != undefined && iapiConf['windowSizes'][oa]) {
                la = iapiConf['windowSizes'][oa];
            };
        };
        if (ha != null && ha.length > 0) {
            var w = document.getElementById(ha);
            if (w) {
                w.src = ka;
                return iapiERR_OK;
            };
        } else {
            ha = '';
        };
        windowParams = la + ',toolbar=no,menubar=no,scrollbars=no,resizable=no';
        var pa = window.open(ka, ha, windowParams);
        if (pa == null || pa.closed) {
            return iapiERR_BLOCKED;
        };
        return iapiERR_OK;
    }
    return iapiERR_NOK;
};

function iapiSetClientParams(qa, ra) {
    iapiClientParams['clientParams_' + qa] = ra;
};

function iapiRequestTemporaryToken(sa, ta, ua) {
    iapiClearRedirectRequests(iapiCALLOUT_TEMPORARYTOKEN, sa);
    var va = 'GetTemporaryAuthenticationToken.php?' + 'casinoname=' + iapiConf['casinoname'];
    if (ua != undefined) {
        va += '&serviceType=' + ua;
    } else {
        va += '&serviceType=' + iapiConf['serviceType'];
    };
    if (ta != undefined) {
        va += '&systemId=' + ta;
    } else {
        va += '&systemId=' + iapiConf['systemId'];
    };
    if (sa != undefined) {
        va += '&realMode=' + sa;
    };
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 30001;
        if (ua != undefined) {
            jsonObject.serviceType = ua;
        } else {
            jsonObject.serviceType = iapiConf['serviceType'];
        };
        if (ta != undefined) {
            jsonObject.systemId = ta;
        } else {
            jsonObject.systemId = iapiConf['systemId'];
        };
        va = iapiEncodeGWJson(jsonObject, sa);
    };
    iapiMakeRedirectRequest(va, null, iapiCALLOUT_TEMPORARYTOKEN);
    return iapiERR_OK;
};

function iapiDownloadLogin(wa, xa, ya, za) {
    iapiLoginModeDownload = true;
    iapiLoginModeFlash = false;
    iapiBaseLogin(wa, xa, ya, za);
    return iapiERR_OK;
};

function iapiFlashLogin(Aa, Ba, Ca, Da, Ea, Fa) {
    iapiLoginModeFlash = true;
    iapiLoginModeDownload = false;
    iapiFlashLoginClientType = Ea;
    iapiFlashLoginGameType = Fa;
    iapiBaseLogin(Aa, Ba, Ca, Da);
    return iapiERR_OK;
};

function iapiLogout(Ga, Ha) {
    iapiUsername = null;
    iapiPassword = null;
    iapiClearRedirectRequests(iapiCALLOUT_LOGIN, Ha);
    if (Ha == 1) {
        iapiWriteClientCookie('loginSuccess=0&errorCode=0&expire=-1', 1);
    } else {
        iapiWriteClientCookie('loginSuccess=0&errorCode=0&expire=-1', 0);
    };
    var Ia = 'Logout.php?' + 'allSessions=' + Ga + '&casinoname=' + iapiConf['casinoname'];
    if (Ha != undefined) {
        Ia += '&realMode=' + Ha;
    };
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31013;
        Ia = iapiEncodeGWJson(jsonObject, Ha);
    };
    iapiMakeRedirectRequest(Ia, null, iapiCALLOUT_LOGOUT);
    return iapiERR_OK;
};

function iapiSetCallout(id, Ja) {
    iapiCalloutFunctions[id] = Ja;
    return iapiERR_OK;
};

function iapiGetWaitingMessages(Ka, La) {
    iapiClearRedirectRequests(iapiCALLOUT_MESSAGES, 0);
    iapiClearRedirectRequests(iapiCALLOUT_MESSAGES, 1);
    if (!Ka) {
        Ka = 'login,bonus,alert';
    };
    var Ma = 'GetWaitingMessages.php?' + 'messageTypes=' + Ka + '&casinoname=' + iapiConf['casinoname'] + '&realMode=' + La;
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31013;
        jsonObject.messageTypes = Ka;
        Ma = iapiEncodeGWJson(jsonObject, La);
    };
    iapiMakeRedirectRequest(Ma, null, iapiCALLOUT_MESSAGES);
    return iapiERR_OK;
};

function iapiBonusConfirmation(Na, Oa, Pa) {
    var Qa = 'SubmitDialog.php?' + 'dialogType=' + 'BonusConfirmation' + '&casinoname=' + iapiConf['casinoname'];
    if (Pa != undefined) {
        Qa += '&realMode=' + Pa;
    };
    var Ra = [];
    Ra['bonusIdentifier'] = Na;
    if (Oa) {
        Ra['accept'] = 1;
    } else {
        Ra['accept'] = 0;
    };
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31022;
        if (Oa) {
            jsonObject.accept = 'true';
        } else {
            jsonObject.accept = 'false';
        };
        jsonObject.bonusIdentifier = Na;
        Qa = iapiEncodeGWJson(jsonObject, Pa);
    };
    iapiMakeRedirectRequest(Qa, Ra, iapiCALLOUT_SUBMITDIALOG);
    return iapiERR_OK;
};

function iapiValidateTCVersion(Sa, Ta, Ua) {
    var Va = 'ValidateLoginSession.php?' + 'validationType=' + 'TCVersion' + '&casinoname=' + iapiConf['casinoname'];
    if (Ua != undefined) {
        Va += '&realMode=' + Ua;
    };
    var Wa = [];
    Wa['termVersionReference'] = Sa;
    if (Ta) {
        Wa['accept'] = 1;
    } else {
        Wa['accept'] = 0;
    }
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31011;
        if (Ta) {
            jsonObject.accept = 'true';
        } else {
            jsonObject.accept = 'false';
        };
        jsonObject.termVersionReference = Sa;
        Va = iapiEncodeGWJson(jsonObject, Ua);
    };
    iapiMakeRedirectRequest(Va, Wa, iapiCALLOUT_SESSIONVALIDATION);
    return iapiERR_OK;
};

function iapiValidatePasswordChange(Xa, Ya, Za, $a) {
    var ab = 'ValidateLoginSession.php?' + 'validationType=' + 'PasswordChange' + '&casinoname=' + iapiConf['casinoname'];
    if ($a != undefined) {
        ab += '&realMode=' + $a;
    };
    var bb = [];
    bb['oldPassword'] = Xa;
    bb['newPassword'] = Ya;
    if (Za) {
        bb['changePassword'] = 1;
    }
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31028;
        jsonObject.newPassword = Ya;
        jsonObject.oldPassword = Xa;
        ab = iapiEncodeGWJson(jsonObject, $a);
    };
    iapiMakeRedirectRequest(ab, bb, iapiCALLOUT_SESSIONVALIDATION);
    return iapiERR_OK;
};

function iapiForgotPassword(cb, db, eb, fb) {
    var gb = 'ForgotPassword.php?' + 'casinoname=' + iapiConf['casinoname'] + '&realMode=' + fb;
    var hb = [];
    hb['username'] = cb;
    hb['email'] = db;
    hb['birthDate'] = eb;
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31058;
        jsonObject.userName = cb;
        jsonObject.email = db;
        jsonObject.birthDate = eb;
        gb = iapiEncodeGWJson(jsonObject, fb);
    };
    iapiMakeRedirectRequest(gb, hb, iapiCALLOUT_FORGOTPASSWORD);
    return iapiERR_OK;
};

function iapiGetLoggedInPlayer(ib) {
    var jb = 'GetLoggedInPlayer.php?' + 'casinoname=' + iapiConf['casinoname'] + '&realMode=' + ib;
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 60006;
        jb = iapiEncodeGWJson(jsonObject, ib);
    };
    iapiMakeRedirectRequest(jb, null, iapiCALLOUT_GETLOGGEDINPLAYER);
    return iapiERR_OK;
};

function iapiSetAuthenticationType(kb) {
    iapiConf['authenticationType'] = kb;
};

function iapiSetClientSkin(lb) {
    iapiConf['clientSkin'] = lb;
};

function iapiSetClientType(mb) {
    iapiConf['clientType'] = mb;
};

function iapiSetClientVersion(nb) {
    iapiConf['clientVersion'] = nb;
};

function iapiSetClientPlatform(ob) {
    iapiConf['clientPlatform'] = ob;
};

function iapiSetSystemId(pb) {
    iapiConf['systemId'] = pb;
};

function iapiSetServiceType(qb) {
    iapiConf['serviceType'] = qb;
};

function iapiCallbackWaitingMessages(rb) {
    var sb = iapiGetRequest(iapiWaitingMessagesId);
    if (!sb) {
        return;
    };
    var tb = {
        "errorCode": 6,
        "errorText": "Invalid response.",
        "playerMessage": ""
    };
    if (rb) {
        if (rb.errorCode) {
            tb = {
                "errorCode": rb.errorCode,
                "errorText": rb.errorText,
                "playerMessage": rb.playerMessage
            };
        } else {
            tb = null;
        }
    } else {
        rb = tb;
    }
    if (tb && tb.errorCode == 6) {
        if (sb[3].length < iapiConf['loginDomainRetryCount']) {
            var ub = (new Date().getTime()) + Math.round(Math.random() * 1000000);
            var vb = setTimeout('iapiRequestFailed(' + ub + ')', iapiConf['loginDomainRetryInterval'] * 1000);
            iapiRegisterRequestId(ub, iapiCALLOUT_MESSAGES, vb, sb[3], sb[4], sb[5]);
            return;
        }
    }
    if (iapiCalloutFunctions[iapiCALLOUT_MESSAGES]) {
        setTimeout(function() {
            iapiCalloutFunctions[iapiCALLOUT_MESSAGES](rb);
        }, iapiEVENT_TIMER);
    };
};

function iapiBaseLogin(wb, xb, yb, zb) {
    if ((iapiHasRedirectRequest(iapiCALLOUT_LOGIN)) && iapiRealMode != yb) {
        iapiNextLogin = [wb, xb, yb, zb];
        return iapiERR_OK;
    };
    iapiUsername = wb;
    iapiPassword = xb;
    if (yb == 1) {
        iapiRealMode = 1;
    } else {
        iapiRealMode = 0;
    };
    iapiLanguageCode = zb;
    iapiLoginSuccess = false;
    iapiWriteClientCookie('loginInProgress=1', iapiRealMode);
    iapiContinueLogin();
    return iapiERR_OK;
};

function iapiContinueLogin() {
    iapiClearRedirectRequests(iapiCALLOUT_LOGIN, 0);
    iapiClearRedirectRequests(iapiCALLOUT_LOGIN, 1);
    var Ab = 'Login.php?' + 'casinoname=' + iapiConf['casinoname'] + '&clientType=' + iapiConf['clientType'] + '&clientVersion=' + iapiConf['clientVersion'] + '&languageCode=' + iapiLanguageCode;
    if (iapiLoginModeDownload) {
        Ab += '&clientPlatform=download';
    } else if (iapiConf['clientPlatform']) {
        Ab += '&clientPlatform=' + iapiConf['clientPlatform'];
    } else {
        Ab += '&clientPlatform=flash';
    };
    if (iapiConf['clientSkin']) {
        Ab += '&clientSkin=' + iapiConf['clientSkin'];
    };
    if (iapiRealMode == 1) {
        Ab += '&realMode=1';
    } else {
        Ab += '&realMode=0';
    };
    var Bb = [];
    Bb['username'] = iapiUsername;
    if (iapiConf['authenticationType'] && iapiConf['authenticationType'] == 'externalToken') {
        Bb['externalToken'] = iapiPassword;
    } else {
        Bb['password'] = iapiPassword;
    };
    if (iapiGWMode) {
        jsonObject = new Object();
        jsonObject.ID = 31001;
        jsonObject.userName = iapiUsername;
        if (iapiConf['authenticationType'] && iapiConf['authenticationType'] == 'externalToken') {
            jsonObject.externalToken = iapiPassword;
        } else {
            jsonObject.password = iapiPassword;
        };
        jsonObject.clientVersion = iapiConf['clientVersion'];
        jsonObject.languageCode = iapiLanguageCode;
        Ab = iapiEncodeGWJson(jsonObject, iapiRealMode);
    };
    iapiMakeRedirectRequest(Ab, Bb, iapiCALLOUT_LOGIN);
};

function iapiWriteClientCookie(Cb, Db) {
    if (iapiLoginModeDownload) {
        return;
    }
    var Eb = iapiConf['clientCookieUrl'];
    if (!Eb) {
        return;
    }
    if (Eb.indexOf('://') < 0) {
        Eb = location.protocol + '//' + Eb;
    }
    var Fb = Eb + '?' + Cb + '&casinoname=' + iapiConf['casinoname'] + '&realMode=' + Db;
    var Gb = iapiRealCookieIframe;
    if (Db == 0) {
        Gb = iapiFunCookieIframe;
    }
    iapiCreateDiv(iapiDivname);
    iapiCreateIframe(iapiDivname, Gb);
    iapiGet(Gb, Fb);
};

function iapiCreateDiv(id) {
    if (document.getElementById(id)) {
        return;
    };
    var Hb = document.createElement('div');
    Hb.setAttribute('id', id);
    Hb.setAttribute('style', 'DISPLAY:none;');
    document.body.appendChild(Hb);
};

function iapiCreateIframe(Ib, Jb) {
    var l = document.getElementById(Ib);
    if (document.getElementById(Jb)) {
        if (Jb == iapiIframename + '_' + iapiGetLoggedInPlayerRequestIdReal || Jb == iapiIframename + '_' + iapiGetLoggedInPlayerRequestIdFun) {
            return true;
        }
        l.removeChild(document.getElementById(Jb));
    }
    var Kb;
    try {
        Kb = document.createElement("<iframe name='" + Jb + "'>");
    } catch (err) {
        Kb = document.createElement('iframe');
    };
    Kb.setAttribute('id', Jb);
    Kb.setAttribute('name', Jb);
    Kb.setAttribute('style', 'DISPLAY: none; LEFT: 0px; POSITION: absolute; TOP: 0px');
    Kb.setAttribute('width', '0px');
    Kb.setAttribute('height', '0px');
    Kb.setAttribute('border', '0px');
    Kb.setAttribute('frameborder', '0');
    Kb.setAttribute('src', 'javascript:false;');
    l.appendChild(Kb);
    return false;
};

function iapiPost(Lb, Mb, Nb) {
    var Ob = "<html><head></head><body><form id='formid' target='" + Lb + "' method='POST' action='" + Mb + "'>";
    var Pb;
    for (Pb in Nb) {
        if (typeof(Nb[Pb]) != 'function') {
            Ob += "<input type='hidden' name='" + Pb + "' value='" + Nb[Pb] + "'>";
        };
    };
    Ob += "</form><script type='text/javascript'>setTimeout(function(){document.getElementById('formid').submit();},100);</script></body></html>";
    iapiPostWindow(Lb, Ob);
};

function iapiPostWindow(Qb, Rb) {
    var Sb = document.getElementById(Qb);
    if (Sb) {
        try {
            Sb.contentWindow.document.open();
            Sb.contentWindow.document.write(Rb);
            Sb.contentWindow.document.close();
        } catch (e) {
            var s = "<script>document.domain='" + document.domain + "';</script>" + Rb;
            var u = "javascript:'<script>window.onload=function(){var ed=\\'" + escape(escape(s)) + "\\';document.write(unescape(ed));document.close();};<\/script>'";
            Sb.src = u;
        };
    };
};

function iapiMakeRedirectRequest(Tb, Ub, Vb, Wb) {
    if (!Wb) {
        Wb = [];
    } else if (Wb.length >= iapiConf['loginDomainRetryCount']) {
        return false;
    };
    var Xb = iapiConf['loginServer'].split('|');
    if (Wb.length < Xb.length) {
        var i;
        for (i in Wb) {
            var s = Wb[i];
            var j;
            for (j in Xb) {
                if (Xb[j] == s && typeof(Xb[j]) === 'string') {
                    Xb.splice(j, 1);
                    break;
                }
            }
        }
    }
    var Yb = Xb[Math.floor(Math.random() * Xb.length)];
    Wb.push(Yb);
    requestUrl = 'https://' + Yb + '/' + Tb;
    var Zb = (new Date().getTime()) + Math.round(Math.random() * 1000000);
    if (Vb == iapiCALLOUT_GETLOGGEDINPLAYER) {
        if (Tb.indexOf('realMode=1') > 0) {
            Zb = iapiGetLoggedInPlayerRequestIdReal;
        } else {
            Zb = iapiGetLoggedInPlayerRequestIdFun;
        }
    };
    if (iapiConf['redirectUrl'] && Vb != iapiCALLOUT_MESSAGES) {
        requestUrl += '&redirectUrl=' + escape(location.protocol + '//' + location.hostname + iapiConf['redirectUrl'] + '#requestId=' + Zb);
    } else {
        requestUrl += '&cacheBreaker=' + (new Date().getTime());
    };
    var $b = setTimeout('iapiRequestFailed(' + Zb + ')', iapiConf['loginDomainRequestTimeout'] * 1000);
    iapiRegisterRequestId(Zb, Vb, $b, Wb, Tb, Ub);
    if (iapiGWMode) {
        requestUrl = iapiMakeGWRequestUrl(Zb, Tb);
        iapiCallGW(Zb, requestUrl);
        return true;
    }
    if (Vb == iapiCALLOUT_MESSAGES) {
        iapiWaitingMessagesId = Zb;
        iapiJsonp(requestUrl, 'iapiCallbackWaitingMessages');
    } else {
        var ac = iapiIframename + '_' + Zb;
        iapiCreateDiv(iapiDivname);
        var bc = iapiCreateIframe(iapiDivname, ac);
        if (!iapiMessagesSupported) {
            initMessageListener();
        };
        if (iapiMessagesSupported) {
            requestUrl += '&messagesSupported=1';
            if (bc && iapiMessagesAnswered) {
                var cc = document.getElementById(ac);
                if (cc.contentWindow.postMessage) {
                    cc.contentWindow.postMessage(Vb, "https://" + Yb);
                    return true;
                };
            };
        };
        if (Ub) {
            iapiPost(ac, requestUrl, Ub);
        } else {
            iapiGet(ac, requestUrl);
        };
    };
    return true;
};

function iapiJsonp(dc, ec) {
    scriptElement = document.createElement('SCRIPT');
    scriptElement.type = 'text/javascript';
    scriptElement.src = dc + '&jsoncallback=' + ec + '&responseType=json';
    document.getElementsByTagName('HEAD')[0].appendChild(scriptElement);
};

function iapiGet(fc, gc) {
    var hc = document.getElementById(fc);
    if (hc) {
        hc.src = gc;
    };
};

function iapiAddUrlParams(ic, jc) {
    if (ic.indexOf('?') > 0) {
        ic += '&';
    } else {
        ic += '?';
    };
    return ic + jc;
};

function iapiLoginFailedActions(kc) {
    iapiPassword = null;
    iapiLoginSuccess = false;
    iapiSessionValid = 0;
    var lc = kc.errorCode;
    iapiWriteClientCookie('loginSuccess=0&errorCode=' + lc, iapiRealMode);
    if (iapiCalloutFunctions['login']) {
        setTimeout(function() {
            iapiCalloutFunctions['login'](0, 0, lc, iapiRealMode);
        }, iapiEVENT_TIMER);
    };
    if (iapiCalloutFunctions[iapiCALLOUT_LOGIN]) {
        setTimeout(function() {
            iapiCalloutFunctions[iapiCALLOUT_LOGIN](kc);
        }, iapiEVENT_TIMER);
    };
    if (iapiLoginModeDownload) {
        iapiDownloadHtcmd(0, 0, lc, '');
    };
    iapiCheckNextLogin();
}

function iapiTokenFailedActions(mc) {
    if (iapiCalloutFunctions['temporarytoken']) {
        setTimeout(function() {
            iapiCalloutFunctions['temporarytoken'](0, null);
        }, iapiEVENT_TIMER);
    };
    if (iapiCalloutFunctions[iapiCALLOUT_TEMPORARYTOKEN]) {
        setTimeout(function() {
            iapiCalloutFunctions[iapiCALLOUT_TEMPORARYTOKEN](mc);
        }, iapiEVENT_TIMER);
    };
    if (iapiLoginModeDownload) {
        iapiDownloadHtcmd(1, iapiSessionValid, 0, '');
    };
};

function iapiCheckNextLogin() {
    if (iapiNextLogin != null) {
        var nc = iapiNextLogin[0];
        var oc = iapiNextLogin[1];
        var pc = iapiNextLogin[2];
        var qc = iapiNextLogin[3];
        iapiNextLogin = null;
        setTimeout(function() {
            iapiLogin(nc, oc, pc, qc);
        }, iapiEVENT_TIMER);
    };
};

function iapiDownloadHtcmd(rc, sc, tc, uc) {
    if (rc && uc) {
        var vc = 'htcmd:login?';
        vc = vc + 'username=' + encodeURIComponent(iapiUsername);
        vc = vc + '&password=' + encodeURIComponent(uc);
        vc = vc + '&realmode=' + iapiRealMode;
        vc = vc + '&type=' + 3;
        document.location = vc;
    };
};

function iapiRedirectCallback(wc) {
    var xc = String(wc['requestId']);
    var yc = wc['requestReady'];
    if (yc) {
        iapiSendToGWSucceeded(xc);
        return;
    };
    var zc = iapiGetRequest(xc);
    if (!zc) {
        return;
    };
    var Ac = zc[1];
    var Bc = null;
    try {
        Bc = JSON.parse(wc['redirectResponse']);
    } catch (err) {};
    if (Bc == null) {
        try {
            Bc = eval('(' + wc['redirectResponse'] + ')');
        } catch (err) {};
    };
    var Cc = {
        "errorCode": 6,
        "errorText": "Invalid response.",
        "playerMessage": ""
    };
    if (Bc) {
        if (Bc.errorCode) {
            Cc = {
                "errorCode": Bc.errorCode,
                "errorText": Bc.errorText,
                "playerMessage": Bc.playerMessage
            };
        } else {
            Cc = null;
        }
    } else {
        Bc = Cc;
    }
    if (Cc && Cc.errorCode == 6) {
        if (zc[3].length < iapiConf['loginDomainRetryCount']) {
            var xc = (new Date().getTime()) + Math.round(Math.random() * 1000000);
            var Dc = setTimeout('iapiRequestFailed(' + xc + ')', iapiConf['loginDomainRetryInterval'] * 1000);
            iapiRegisterRequestId(xc, Ac, Dc, zc[3], zc[4], zc[5]);
            return;
        }
    }
    if (Ac == iapiCALLOUT_LOGIN) {
        if (Cc == null) {
            iapiPassword = null;
            iapiLoginSuccess = true;
            iapiError = null;
            iapiSessionValid = 1;
            var Ec = Bc.sessionValidationData;
            if (Ec) {
                iapiSessionValid = 0;
            };
            var Fc = 'loginSuccess=1&sessionValid=' + iapiSessionValid + '&loginDomain=' + iapiConf['loginServer'];
            iapiWriteClientCookie(Fc, iapiRealMode);
            if (iapiCalloutFunctions['login']) {
                setTimeout(function() {
                    iapiCalloutFunctions['login'](1, iapiSessionValid, 0, iapiRealMode);
                }, iapiEVENT_TIMER);
            };
            if (iapiCalloutFunctions[iapiCALLOUT_LOGIN]) {
                setTimeout(function() {
                    iapiCalloutFunctions[iapiCALLOUT_LOGIN](Bc);
                }, iapiEVENT_TIMER);
            };
            if (iapiLoginModeDownload) {
                if (iapiSessionValid) {
                    iapiRequestTemporaryToken(iapiRealMode);
                } else {
                    iapiDownloadHtcmd(1, 0, 0, '');
                };
            } else if (iapiLoginModeFlash) {
                if (iapiSessionValid) {
                    var Gc = 'real';
                    if (!iapiRealMode) {
                        Gc = 'fun';
                    }
                    iapiLaunchClient(iapiFlashLoginClientType, iapiFlashLoginGameType, Gc);
                } else {
                    iapiRedirectToWeblogin();
                };
            };
            iapiCheckNextLogin();
        } else {
            iapiError = Cc;
            iapiLoginFailedActions(Bc);
        };
    } else if (Ac == iapiCALLOUT_TEMPORARYTOKEN) {
        if (Cc == null && Bc.sessionToken && Bc.sessionToken.sessionToken) {
            if (iapiCalloutFunctions['temporarytoken']) {
                setTimeout(function() {
                    iapiCalloutFunctions['temporarytoken'](1, Bc.sessionToken.sessionToken);
                }, iapiEVENT_TIMER);
            };
            if (iapiCalloutFunctions[iapiCALLOUT_TEMPORARYTOKEN]) {
                setTimeout(function() {
                    iapiCalloutFunctions[iapiCALLOUT_TEMPORARYTOKEN](Bc);
                }, iapiEVENT_TIMER);
            };
            if (iapiLoginModeDownload) {
                iapiDownloadHtcmd(1, 1, 0, Bc.sessionToken.sessionToken);
            };
        } else {
            iapiTokenFailedActions(Bc);
        };
    } else if (iapiCalloutFunctions[Ac]) {
        setTimeout(function() {
            iapiCalloutFunctions[Ac](Bc);
        }, iapiEVENT_TIMER);
    };
};

function iapiRequestFailed(Hc) {
    var Ic = iapiGetRequest(Hc);
    if (!Ic) {
        return;
    };
    var Jc = Ic[1];
    if (iapiMakeRedirectRequest(Ic[4], Ic[5], Jc, Ic[3])) {
        return;
    }
    var Kc = {
        "errorCode": 6,
        "errorText": "Request timed out.",
        "playerMessage": ""
    };
    if (Jc == iapiCALLOUT_LOGIN) {
        if (iapiCalloutFunctions[iapiCALLOUT_LOGIN]) {
            iapiLoginFailedActions(Kc);
        };
    } else if (Jc == iapiCALLOUT_TEMPORARYTOKEN) {
        if (iapiCalloutFunctions[iapiCALLOUT_TEMPORARYTOKEN]) {
            iapiTokenFailedActions(Kc);
        };
    } else if (iapiCalloutFunctions[Jc]) {
        setTimeout(function() {
            iapiCalloutFunctions[Jc](Kc);
        }, iapiEVENT_TIMER);
    };
};

function iapiRegisterRequestId(Lc, Mc, Nc, Oc, Pc, Qc) {
    iapiRequestIds.push([Lc, Mc, Nc, Oc, Pc, Qc]);
};

function iapiGetRequest(Rc) {
    var i;
    for (i in iapiRequestIds) {
        arr = iapiRequestIds[i]
        if (arr[0] == Rc) {
            iapiRequestIds.splice(i, 1);
            if (arr[2]) {
                clearTimeout(arr[2]);
            }
            var Sc = document.getElementById(iapiIframename + '_' + Rc);
            if (Sc && Rc != iapiGetLoggedInPlayerRequestIdReal && Rc != iapiGetLoggedInPlayerRequestIdFun) {
                document.getElementById(iapiDivname).removeChild(Sc);
            };
            return arr;
        };
    };
    return null;
};

function iapiClearRedirectRequests(Tc, Uc) {
    var i = 0;
    while (i < iapiRequestIds.length) {
        arr = iapiRequestIds[i];
        if (arr[1] == Tc) {
            var rm = 0;
            if (arr[4].indexOf('realMode=1') > 0) {
                rm = 1;
            }
            if (rm == Uc) {
                iapiRequestIds.splice(i, 1);
                if (arr[2]) {
                    clearTimeout(arr[2]);
                }
                var Vc = document.getElementById(iapiIframename + '_' + arr[0]);
                if (Vc) {
                    document.getElementById(iapiDivname).removeChild(Vc);
                };
                continue;
            }
        };
        i++;
    };
};

function iapiHasRedirectRequest(Wc) {
    var i = 0;
    while (i < iapiRequestIds.length) {
        arr = iapiRequestIds[i]
        if (arr[1] == Wc) {
            return true;
        };
        i++;
    };
    return false;
};

function initMessageListener() {
    if (iapiConf['useMessages'] == '1' && window.postMessage) {
        if (window.addEventListener) {
            window.addEventListener('message', iapiOnMessage, false);
            iapiMessagesSupported = true;
        } else {
            if (window.attachEvent) {
                window.attachEvent('onmessage', iapiOnMessage);
                iapiMessagesSupported = true;
            };
        };
    };
};

function iapiOnMessage(e) {
    if (e.origin == "https://" + iapiConf['loginServer']) {
        var Xc = e.data;
        var Yc = Xc.split("&");
        var Zc = [];
        for (var i = 0; i < Yc.length; i++) {
            var $c = Yc[i].indexOf("=");
            if ($c > 0) {
                Zc[Yc[i].substring(0, $c)] = decodeURIComponent(Yc[i].substring($c + 1).replace(/\+/g, '%20'));
            };
        };
        if (document.getElementById(iapiDivname)) {
            for (i = 0; i < document.getElementById(iapiDivname).childNodes.length; i++) {
                if (document.getElementById(iapiDivname).childNodes[i].contentWindow == e.source) {
                    var ad = document.getElementById(iapiDivname).childNodes[i].id.split('_');
                    if (ad.length > 0) {
                        Zc['requestId'] = ad[1];
                    };
                    break;
                };
            };
        };
        iapiMessagesAnswered = true;
        iapiRedirectCallback(Zc);
    };
};

function iapiRedirectToWeblogin() {}
var iapiGWWaitingCalls = [];
var iapiGWTimer = 1;
var iapiGWId = (new Date().getTime()) + Math.round(Math.random() * 10000);
var iapiGWRedirectIframe = 'gwredirect_' + iapiGWId;
var iapiGWMode = false;
var iapiGWCreated = false;
if (iapiConf['gwUrl']) {
    iapiGWMode = true;
}

function iapiCreateGW() {
    iapiCreateDiv(iapiDivname);
    iapiCreateIframe(iapiDivname, iapiIframename + 'gw' + '_' + iapiGWId);
    var bd = iapiConf['gwUrl'];
    bd += '#redirectUrl=' + escape(location.protocol + '//' + location.hostname + iapiConf['redirectUrl'] + '#');
    bd += '&iframeName=' + iapiGWId;
    iapiGet(iapiIframename + 'gw' + '_' + iapiGWId, bd);
}

function iapiCallGW(cd, dd) {
    if (!iapiGWCreated) {
        iapiGWCreated = true;
        iapiCreateGW();
    }
    iapiGWWaitingCalls.push([cd, dd]);
    iapiSendToGW();
}

function iapiEncodeGWJson(ed, fd) {
    if (fd == 1) {
        ed.realMode = 1;
    } else {
        ed.realMode = 0;
    };
    ed.casinoName = iapiConf['casinoname'];
    var gd = null;
    try {
        gd = JSON.stringify(ed);
    } catch (err) {};
    if (gd == null) {
        try {
            gd = iapiJsonStringify(ed);
        } catch (err) {};
    };
    var hd = encodeURIComponent(gd);
    return hd;
};

function iapiMakeGWRequestUrl(jd, kd) {
    var ld = iapiConf['gwRedirectUrl'];
    ld += '#jsonObject=' + kd;
    ld += '&UUID=' + jd;
    return ld;
};

function iapiSendToGW() {
    if (iapiGWTimer) {
        return;
    };
    if (iapiGWWaitingCalls.length > 0) {
        var md = iapiGWWaitingCalls[0];
        iapiGWWaitingCalls.splice(0, 1);
        var nd = md[0];
        var od = md[1];
        iapiGWTimer = setTimeout('iapiSendToGWFailed(' + 0 + ')', 10000);
        setTimeout(function() {
            window.open(od, iapiGWRedirectIframe);
        }, 10);
    };
};

function iapiSendToGWFailed(id) {
    iapiGWTimer = 0;
    iapiSendToGW();
};

function iapiSendToGWSucceeded(id) {
    clearTimeout(iapiGWTimer);
    iapiGWTimer = 0;
    iapiSendToGW();
};

function iapiJsonStringify(pd) {
    var t = typeof(pd);
    if (t != "object" || pd === null) {
        if (t == "string") pd = '"' + pd + '"';
        return String(pd);
    } else {
        var n, v, json = [],
            arr = (pd && pd.constructor == Array);
        for (n in pd) {
            v = pd[n];
            t = typeof(v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};