/*! Copyright (C) Microsoft Corporation. All rights reserved. */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
!function() {
    "use strict";
    var e = {
        d: function(r, t) {
            for (var o in t)
                e.o(t, o) && !e.o(r, o) && Object.defineProperty(r, o, {
                    enumerable: !0,
                    get: t[o]
                })
        }
    };
    e.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window)
                return window
        }
    }(),
    e.o = function(e, r) {
        return Object.prototype.hasOwnProperty.call(e, r)
    }
    ,
    e.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ;
    var r = {};
    e.r(r),
    e.d(r, {
        TextInputCanvas: function() {
            return Ko
        }
    });
    var t = React
      , o = "undefined" != typeof WeakRef;
    class n {
        constructor(e) {
            o && "object" == typeof e ? this._weakRef = new WeakRef(e) : this._instance = e
        }
        deref() {
            var e, r, t, o;
            return this._weakRef ? (o = null === (e = this._weakRef) || void 0 === e ? void 0 : e.deref()) || delete this._weakRef : (null === (t = null === (r = o = this._instance) || void 0 === r ? void 0 : r.isDisposed) || void 0 === t ? void 0 : t.call(r)) && delete this._instance,
            o
        }
    }
    var a = "keyborg:focusin";
    var i = !1;
    var s = 0;
    class l {
        constructor() {
            this.__keyborgCoreRefs = {},
            this._isNavigatingWithKeyboard = !1
        }
        add(e) {
            var r = e.id;
            r in this.__keyborgCoreRefs || (this.__keyborgCoreRefs[r] = new n(e))
        }
        remove(e) {
            delete this.__keyborgCoreRefs[e],
            0 === Object.keys(this.__keyborgCoreRefs).length && (this._isNavigatingWithKeyboard = !1)
        }
        setVal(e) {
            if (this._isNavigatingWithKeyboard !== e)
                for (var r of (this._isNavigatingWithKeyboard = e,
                Object.keys(this.__keyborgCoreRefs))) {
                    var t = this.__keyborgCoreRefs[r].deref();
                    t ? t.update(e) : this.remove(r)
                }
        }
        getVal() {
            return this._isNavigatingWithKeyboard
        }
    }
    var u = new l;
    class c {
        constructor(e, r) {
            this._isMouseUsed = !1,
            this._onFocusIn = e=>{
                if (this._isMouseUsed)
                    this._isMouseUsed = !1;
                else if (!u.getVal()) {
                    var r = e.details;
                    r.relatedTarget && (r.isFocusedProgrammatically || void 0 === r.isFocusedProgrammatically || u.setVal(!0))
                }
            }
            ,
            this._onMouseDown = e=>{
                0 === e.buttons || 0 === e.clientX && 0 === e.clientY && 0 === e.screenX && 0 === e.screenY || (this._isMouseUsed = !0,
                u.setVal(!1))
            }
            ,
            this._onKeyDown = e=>{
                var r, t = u.getVal(), o = e.keyCode, n = this._triggerKeys;
                t || n && !n.has(o) ? t && (null === (r = this._dismissKeys) || void 0 === r ? void 0 : r.has(o)) && this._scheduleDismiss() : u.setVal(!0)
            }
            ,
            this.id = "c" + ++s,
            this._win = e;
            var t = e.document;
            if (r) {
                var o = r.triggerKeys
                  , l = r.dismissKeys;
                (null == o ? void 0 : o.length) && (this._triggerKeys = new Set(o)),
                (null == l ? void 0 : l.length) && (this._dismissKeys = new Set(l))
            }
            t.addEventListener(a, this._onFocusIn, !0),
            t.addEventListener("mousedown", this._onMouseDown, !0),
            e.addEventListener("keydown", this._onKeyDown, !0),
            function(e) {
                var r = e;
                i || (i = function(e) {
                    var r = e.HTMLElement
                      , t = r.prototype.focus
                      , o = !1;
                    return r.prototype.focus = function() {
                        o = !0
                    }
                    ,
                    e.document.createElement("button").focus(),
                    r.prototype.focus = t,
                    o
                }(r));
                var t = r.HTMLElement.prototype.focus;
                if (!t.__keyborgNativeFocus) {
                    r.HTMLElement.prototype.focus = s;
                    var o = r.__keyborgData = {
                        focusInHandler: e=>{
                            var r, t = e.target;
                            if (t) {
                                var n = document.createEvent("HTMLEvents");
                                n.initEvent(a, !0, !0);
                                var s = {
                                    relatedTarget: e.relatedTarget || void 0
                                };
                                (i || o.lastFocusedProgrammatically) && (s.isFocusedProgrammatically = t === (null === (r = o.lastFocusedProgrammatically) || void 0 === r ? void 0 : r.deref()),
                                o.lastFocusedProgrammatically = void 0),
                                n.details = s,
                                t.dispatchEvent(n)
                            }
                        }
                    };
                    r.document.addEventListener("focusin", r.__keyborgData.focusInHandler, !0),
                    s.__keyborgNativeFocus = t
                }
                function s() {
                    var e = r.__keyborgData;
                    return e && (e.lastFocusedProgrammatically = new n(this)),
                    t.apply(this, arguments)
                }
            }(e),
            u.add(this)
        }
        dispose() {
            var e = this._win;
            if (e) {
                this._dismissTimer && (e.clearTimeout(this._dismissTimer),
                this._dismissTimer = void 0),
                function(e) {
                    var r = e
                      , t = r.HTMLElement.prototype
                      , o = t.focus.__keyborgNativeFocus
                      , n = r.__keyborgData;
                    n && (r.document.removeEventListener("focusin", n.focusInHandler, !0),
                    delete r.__keyborgData),
                    o && (t.focus = o)
                }(e);
                var r = e.document;
                r.removeEventListener(a, this._onFocusIn, !0),
                r.removeEventListener("mousedown", this._onMouseDown, !0),
                e.removeEventListener("keydown", this._onKeyDown, !0),
                delete this._win,
                u.remove(this.id)
            }
        }
        isDisposed() {
            return !!this._win
        }
        update(e) {
            var r, t, o = null === (t = null === (r = this._win) || void 0 === r ? void 0 : r.__keyborg) || void 0 === t ? void 0 : t.refs;
            if (o)
                for (var n of Object.keys(o))
                    f.update(o[n], e)
        }
        _scheduleDismiss() {
            var e = this._win;
            if (e) {
                this._dismissTimer && (e.clearTimeout(this._dismissTimer),
                this._dismissTimer = void 0);
                var r = e.document.activeElement;
                this._dismissTimer = e.setTimeout((()=>{
                    this._dismissTimer = void 0;
                    var t = e.document.activeElement;
                    r && t && r === t && u.setVal(!1)
                }
                ), 500)
            }
        }
    }
    class f {
        constructor(e, r) {
            this._cb = [],
            this._id = "k" + ++s,
            this._win = e;
            var t = e.__keyborg;
            t ? (this._core = t.core,
            t.refs[this._id] = this) : (this._core = new c(e,r),
            e.__keyborg = {
                core: this._core,
                refs: {
                    [this._id]: this
                }
            })
        }
        static create(e, r) {
            return new f(e,r)
        }
        static dispose(e) {
            e.dispose()
        }
        static update(e, r) {
            e._cb.forEach((e=>e(r)))
        }
        dispose() {
            var e, r = null === (e = this._win) || void 0 === e ? void 0 : e.__keyborg;
            (null == r ? void 0 : r.refs[this._id]) && (delete r.refs[this._id],
            0 === Object.keys(r.refs).length && (r.core.dispose(),
            delete this._win.__keyborg)),
            this._cb = [],
            delete this._core,
            delete this._win
        }
        isNavigatingWithKeyboard() {
            return u.getVal()
        }
        subscribe(e) {
            this._cb.push(e)
        }
        unsubscribe(e) {
            var r = this._cb.indexOf(e);
            r >= 0 && this._cb.splice(r, 1)
        }
        setVal(e) {
            u.setVal(e)
        }
    }
    var d = "data-keyboard-nav"
      , p = (":global([".concat(d, "])"),
    t.createContext(void 0))
      , b = {
        targetDocument: "object" == typeof document ? document : void 0,
        dir: "ltr"
    };
    p.Provider;
    function v() {
        var e, {targetDocument: r} = null !== (e = t.useContext(p)) && void 0 !== e ? e : b, o = (0,
        t.useMemo)((()=>{
            return r && (e = r.defaultView,
            f.create(e, t));
            var e, t
        }
        ), [r]), n = (0,
        t.useRef)(null);
        return (0,
        t.useEffect)((()=>{
            if (o) {
                h(n, d, o.isNavigatingWithKeyboard());
                var e = e=>{
                    h(n, d, e)
                }
                ;
                return o.subscribe(e),
                ()=>o.unsubscribe(e)
            }
        }
        ), [o]),
        n
    }
    function h(e, r, t) {
        e.current && (t ? e.current.setAttribute(r, "") : e.current.removeAttribute(r))
    }
    var g = "undefined" == typeof window ? e.g : window
      , m = "@griffel/";
    function y(e, r) {
        return g[Symbol.for(m + e)] || (g[Symbol.for(m + e)] = r),
        g[Symbol.for(m + e)]
    }
    var w = y("DEFINITION_LOOKUP_TABLE", {})
      , k = "data-make-styles-bucket"
      , j = "f"
      , x = 7
      , S = "___"
      , O = S.length + x
      , z = {
        all: 1,
        animation: 1,
        background: 1,
        backgroundPosition: 1,
        border: 1,
        borderBlock: 1,
        borderBlockEnd: 1,
        borderBlockStart: 1,
        borderBottom: 1,
        borderColor: 1,
        borderImage: 1,
        borderInline: 1,
        borderInlineEnd: 1,
        borderInlineStart: 1,
        borderLeft: 1,
        borderRadius: 1,
        borderRight: 1,
        borderStyle: 1,
        borderTop: 1,
        borderWidth: 1,
        columns: 1,
        columnRule: 1,
        flex: 1,
        flexFlow: 1,
        font: 1,
        gap: 1,
        grid: 1,
        gridArea: 1,
        gridColumn: 1,
        gridRow: 1,
        gridTemplate: 1,
        lineClamp: 1,
        listStyle: 1,
        margin: 1,
        mask: 1,
        maskBorder: 1,
        motion: 1,
        offset: 1,
        outline: 1,
        overflow: 1,
        overscrollBehavior: 1,
        padding: 1,
        placeItems: 1,
        placeSelf: 1,
        textDecoration: 1,
        textEmphasis: 1,
        transition: 1
    };
    var P = function(e) {
        for (var r, t = 0, o = 0, n = e.length; n >= 4; ++o,
        n -= 4)
            r = 1540483477 * (65535 & (r = 255 & e.charCodeAt(o) | (255 & e.charCodeAt(++o)) << 8 | (255 & e.charCodeAt(++o)) << 16 | (255 & e.charCodeAt(++o)) << 24)) + (59797 * (r >>> 16) << 16),
            t = 1540483477 * (65535 & (r ^= r >>> 24)) + (59797 * (r >>> 16) << 16) ^ 1540483477 * (65535 & t) + (59797 * (t >>> 16) << 16);
        switch (n) {
        case 3:
            t ^= (255 & e.charCodeAt(o + 2)) << 16;
        case 2:
            t ^= (255 & e.charCodeAt(o + 1)) << 8;
        case 1:
            t = 1540483477 * (65535 & (t ^= 255 & e.charCodeAt(o))) + (59797 * (t >>> 16) << 16)
        }
        return (((t = 1540483477 * (65535 & (t ^= t >>> 13)) + (59797 * (t >>> 16) << 16)) ^ t >>> 15) >>> 0).toString(36)
    };
    function _(e) {
        var r = e.length;
        if (r === x)
            return e;
        for (var t = r; t < x; t++)
            e += "0";
        return e
    }
    function B(e, r) {
        return S + _(P(e + r))
    }
    function T(e, r) {
        var t = "";
        for (var o in e) {
            var n = e[o];
            if (n) {
                var a = Array.isArray(n);
                t += "rtl" === r ? (a ? n[1] : n) + " " : (a ? n[0] : n) + " "
            }
        }
        return t.slice(0, -1)
    }
    function q(e, r) {
        var t = {};
        for (var o in e) {
            var n = T(e[o], r);
            if ("" !== n) {
                var a = B(n, r)
                  , i = a + " " + n;
                w[a] = [e[o], r],
                t[o] = i
            } else
                t[o] = ""
        }
        return t
    }
    var C = {};
    function R() {
        for (var e = arguments, r = null, t = "", o = "", n = new Array(arguments.length), a = function() {
            var r = e[i];
            if ("string" == typeof r && "" !== r) {
                var a = r.indexOf(S);
                if (-1 === a)
                    t += r + " ";
                else {
                    var s = r.substr(a, O);
                    a > 0 && (t += r.slice(0, a)),
                    o += s,
                    n[i] = s
                }
                0
            }
        }, i = 0; i < arguments.length; i++)
            a();
        if ("" === o)
            return t.slice(0, -1);
        var s = C[o];
        if (void 0 !== s)
            return t + s;
        for (var l = [], u = 0; u < arguments.length; u++) {
            var c = n[u];
            if (c) {
                var f = w[c];
                f && (l.push(f[0]),
                r = f[1])
            }
        }
        var d = Object.assign.apply(Object, [{}].concat(l))
          , p = T(d, r)
          , b = B(p, r, n);
        return p = b + " " + p,
        C[o] = p,
        w[b] = [d, r],
        t + p
    }
    var D = e=>{
        var r = N(e.state)
          , o = void 0 === e.defaultState ? e.initialState : e.defaultState
          , [n,a] = t.useState(o)
          , i = r ? e.state : n
          , s = t.useRef(i);
        t.useEffect((()=>{
            s.current = i
        }
        ), [i]);
        var l = t.useCallback((e=>{
            !function(e) {
                return "function" == typeof e
            }(e) ? s.current = e : s.current = e(s.current),
            a(s.current)
        }
        ), []);
        return [i, l]
    }
      , N = e=>{
        var [r] = t.useState((()=>void 0 !== e));
        return r
    }
      , E = function() {
        for (var e = {}, r = arguments.length, t = new Array(r), o = 0; o < r; o++)
            t[o] = arguments[o];
        for (var n of t) {
            var a = Array.isArray(n) ? n : Object.keys(n);
            for (var i of a)
                e[i] = 1
        }
        return e
    }
      , A = E(["onAuxClick", "onCopy", "onCut", "onPaste", "onCompositionEnd", "onCompositionStart", "onCompositionUpdate", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onInput", "onSubmit", "onLoad", "onError", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyUp", "onAbort", "onCanPlay", "onCanPlayThrough", "onDurationChange", "onEmptied", "onEncrypted", "onEnded", "onLoadedData", "onLoadedMetadata", "onLoadStart", "onPause", "onPlay", "onPlaying", "onProgress", "onRateChange", "onSeeked", "onSeeking", "onStalled", "onSuspend", "onTimeUpdate", "onVolumeChange", "onWaiting", "onClick", "onClickCapture", "onContextMenu", "onDoubleClick", "onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp", "onMouseUpCapture", "onSelect", "onTouchCancel", "onTouchEnd", "onTouchMove", "onTouchStart", "onScroll", "onWheel", "onPointerCancel", "onPointerDown", "onPointerEnter", "onPointerLeave", "onPointerMove", "onPointerOut", "onPointerOver", "onPointerUp", "onGotPointerCapture", "onLostPointerCapture"])
      , M = E(E(["accessKey", "children", "className", "contentEditable", "dir", "draggable", "hidden", "htmlFor", "id", "lang", "ref", "role", "style", "tabIndex", "title", "translate", "spellCheck", "name"]), A, E(["itemID", "itemProp", "itemRef", "itemScope", "itemType"]))
      , I = E(M, ["form"])
      , F = E(M, ["height", "loop", "muted", "preload", "src", "width"])
      , H = E(F, ["poster"])
      , L = E(M, ["start"])
      , W = E(M, ["value"])
      , X = E(M, ["download", "href", "hrefLang", "media", "rel", "target", "type"])
      , $ = E(M, ["dateTime"])
      , V = E(M, ["autoFocus", "disabled", "form", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "type", "value"]);
    var G = {
        label: I,
        audio: F,
        video: H,
        ol: L,
        li: W,
        a: X,
        button: V,
        input: E(V, ["accept", "alt", "autoCapitalize", "autoComplete", "checked", "dirname", "form", "height", "inputMode", "list", "max", "maxLength", "min", "multiple", "pattern", "placeholder", "readOnly", "required", "src", "step", "size", "type", "value", "width"]),
        textarea: E(V, ["autoCapitalize", "cols", "dirname", "form", "maxLength", "placeholder", "readOnly", "required", "rows", "wrap"]),
        select: E(V, ["form", "multiple", "required"]),
        option: E(M, ["selected", "value"]),
        table: E(M, ["cellPadding", "cellSpacing"]),
        tr: M,
        th: E(M, ["colSpan", "rowSpan", "scope"]),
        td: E(M, ["colSpan", "headers", "rowSpan", "scope"]),
        colGroup: E(M, ["span"]),
        col: E(M, ["span"]),
        fieldset: E(M, ["disabled", "form"]),
        form: E(M, ["acceptCharset", "action", "encType", "encType", "method", "noValidate", "target"]),
        iframe: E(M, ["allow", "allowFullScreen", "allowPaymentRequest", "allowTransparency", "csp", "height", "importance", "referrerPolicy", "sandbox", "src", "srcDoc", "width"]),
        img: E(M, ["alt", "crossOrigin", "height", "src", "srcSet", "useMap", "width"]),
        time: $,
        dialog: E(M, ["open", "onCancel", "onClose"])
    };
    function U(e, r, t) {
        var o = e && G[e] || M;
        return o.as = 1,
        function(e, r, t) {
            var o = Array.isArray(r)
              , n = {}
              , a = Object.keys(e);
            for (var i of a)
                !(!o && r[i] || o && r.indexOf(i) >= 0 || 0 === i.indexOf("data-") || 0 === i.indexOf("aria-")) || t && -1 !== (null == t ? void 0 : t.indexOf(i)) || (n[i] = e[i]);
            return n
        }(r, o, t)
    }
    var K = e=>{
        var {primarySlotTagName: r, props: t, excludedPropNames: o} = e;
        return {
            root: {
                style: t.style,
                className: t.className
            },
            primary: U(r, t, [...o || [], "style", "className"])
        }
    }
    ;
    function Y(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function Q(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Y(Object(t), !0).forEach((function(r) {
                Z(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Y(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Z(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var J = (e,r)=>{
        var {required: o=!1, defaultProps: n} = r || {};
        if (null !== e && (void 0 !== e || o)) {
            var a = {};
            return "string" == typeof e || "number" == typeof e || Array.isArray(e) || (0,
            t.isValidElement)(e) ? a.children = e : "object" == typeof e && (a = Q({}, e)),
            n ? Q(Q({}, n), a) : a
        }
    }
    ;
    function ee() {
        return "undefined" != typeof window && !(!window.document || !window.document.createElement)
    }
    var re = ee() ? t.useLayoutEffect : t.useEffect
      , te = e=>{
        var r = t.useRef((()=>{
            throw new Error("Cannot call an event handler while rendering")
        }
        ));
        return re((()=>{
            r.current = e
        }
        ), [e]),
        t.useCallback((function() {
            return (0,
            r.current)(...arguments)
        }
        ), [r])
    }
      , oe = t.createContext(void 0);
    oe.Provider;
    function ne() {
        var e;
        return null !== (e = t.useContext(oe)) && void 0 !== e ? e : {}
    }
    function ae(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function ie(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? ae(Object(t), !0).forEach((function(r) {
                se(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ae(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function se(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var le = ["children", "as"];
    function ue(e, r) {
        if (null == e)
            return {};
        var t, o, n = function(e, r) {
            if (null == e)
                return {};
            var t, o, n = {}, a = Object.keys(e);
            for (o = 0; o < a.length; o++)
                t = a[o],
                r.indexOf(t) >= 0 || (n[t] = e[t]);
            return n
        }(e, r);
        if (Object.getOwnPropertySymbols) {
            var a = Object.getOwnPropertySymbols(e);
            for (o = 0; o < a.length; o++)
                t = a[o],
                r.indexOf(t) >= 0 || Object.prototype.propertyIsEnumerable.call(e, t) && (n[t] = e[t])
        }
        return n
    }
    function ce(e) {
        var r = {}
          , t = {}
          , o = Object.keys(e.components);
        for (var n of o) {
            var [a,i] = fe(e, n);
            r[n] = a,
            t[n] = i
        }
        return {
            slots: r,
            slotProps: t
        }
    }
    function fe(e, r) {
        var o, n, a;
        if (void 0 === e[r])
            return [null, void 0];
        var i = e[r]
          , {children: s, as: l} = i
          , u = ue(i, le)
          , c = void 0 === (null === (o = e.components) || void 0 === o ? void 0 : o[r]) || "string" == typeof e.components[r] ? l || (null === (n = e.components) || void 0 === n ? void 0 : n[r]) || "div" : e.components[r];
        if ("function" == typeof s) {
            var f = s;
            return [t.Fragment, {
                children: f(c, u)
            }]
        }
        return [c, "string" == typeof c && (null === (a = e[r]) || void 0 === a ? void 0 : a.as) ? function(e, r) {
            var t = {};
            for (var o in e)
                -1 === r.indexOf(o) && e.hasOwnProperty(o) && (t[o] = e[o]);
            return t
        }(e[r], ["as"]) : e[r]]
    }
    function de(e, r, t) {
        var o = [];
        if (t[k] = r,
        e)
            for (var n in t)
                e.setAttribute(n, t[n]);
        return {
            elementAttributes: t,
            insertRule: function(r) {
                return (null == e ? void 0 : e.sheet) ? e.sheet.insertRule(r, e.sheet.cssRules.length) : o.push(r)
            },
            element: e,
            bucketName: r,
            cssRules: ()=>(null == e ? void 0 : e.sheet) ? Array.from(e.sheet.cssRules).map((e=>e.cssText)) : o
        }
    }
    function pe(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function be(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? pe(Object(t), !0).forEach((function(r) {
                ve(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : pe(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function ve(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var he = ["r", "d", "l", "v", "w", "f", "i", "h", "a", "k", "t", "m"].reduce(((e,r,t)=>(e[r] = t,
    e)), {});
    function ge(e, r, t, o) {
        var n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {}
          , a = "m" === e
          , i = a ? e + n.m : e;
        if (!o.stylesheets[i]) {
            var s = r && r.createElement("style")
              , l = de(s, e, be(be({}, o.styleElementAttributes), a && {
                media: n.m
            }));
            o.stylesheets[i] = l,
            r && s && r.head.insertBefore(s, function(e, r, t, o, n) {
                var a = he[t]
                  , i = e=>a - he[e.getAttribute(k)]
                  , s = e.head.querySelectorAll("[".concat(k, "]"));
                if ("m" === t && n) {
                    var l = e.head.querySelectorAll("[".concat(k, '="').concat(t, '"]'));
                    l.length && (s = l,
                    i = e=>o.compareMediaQueries(n.m, e.media))
                }
                var u = s.length
                  , c = u - 1;
                for (; c >= 0; ) {
                    var f = s.item(c);
                    if (i(f) > 0)
                        return f.nextSibling;
                    c--
                }
                if (u > 0)
                    return s.item(0);
                return r ? r.nextSibling : null
            }(r, t, e, o, n))
        }
        return o.stylesheets[i]
    }
    var me = 0
      , ye = (e,r)=>e < r ? -1 : e > r ? 1 : 0;
    function we() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "undefined" == typeof document ? void 0 : document
          , r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          , {unstable_filterCSSRule: t, insertionPoint: o, styleElementAttributes: n, compareMediaQueries: a=ye} = r
          , i = {
            insertionCache: {},
            stylesheets: {},
            styleElementAttributes: Object.freeze(n),
            compareMediaQueries: a,
            id: "d".concat(me++),
            insertCSSRules(r) {
                for (var n in r)
                    for (var a = r[n], s = 0, l = a.length; s < l; s++) {
                        var [u,c] = (d = a[s],
                        Array.isArray(d) ? d : [d])
                          , f = ge(n, e, o || null, i, c);
                        if (!i.insertionCache[u]) {
                            i.insertionCache[u] = n;
                            try {
                                t ? t(u) && f.insertRule(u) : f.insertRule(u)
                            } catch (e) {
                                0
                            }
                        }
                    }
                var d
            }
        };
        return i
    }
    ":(".concat(["-moz-placeholder", "-moz-focus-inner", "-moz-focusring", "-ms-input-placeholder", "-moz-read-write", "-moz-read-only"].join("|"), ")");
    var ke = t.createContext(we());
    function je() {
        return t.useContext(ke)
    }
    var xe = t.createContext("ltr");
    function Se() {
        return t.useContext(xe)
    }
    function Oe(e, r, t) {
        var o = function(e, r, t) {
            var o = {};
            return function(n) {
                var {dir: a, renderer: i} = n
                  , s = "ltr" === a
                  , l = s ? i.id : i.id + "r";
                return void 0 === o[l] && (i.insertCSSRules({
                    r: t
                }),
                o[l] = !0),
                s ? e : r || e
            }
        }(e, r, t);
        return function() {
            var e = Se()
              , r = je();
            return o({
                dir: e,
                renderer: r
            })
        }
    }
    function ze(e, r) {
        var t = function(e, r) {
            var t = {}
              , o = null
              , n = null;
            return function(a) {
                var {dir: i, renderer: s} = a
                  , l = "ltr" === i
                  , u = l ? s.id : s.id + "r";
                return l ? null === o && (o = q(e, i)) : null === n && (n = q(e, i)),
                void 0 === t[u] && (s.insertCSSRules(r),
                t[u] = !0),
                l ? o : n
            }
        }(e, r);
        return function() {
            var e = Se()
              , r = je();
            return t({
                dir: e,
                renderer: r
            })
        }
    }
    var Pe = "fui-Input"
      , _e = "fui-Input__input"
      , Be = "fui-Input__contentBefore"
      , Te = "fui-Input__contentAfter"
      , qe = Oe("r1jtohuq", "rl1z2p5", [".r1jtohuq{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-flex-wrap:nowrap;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;gap:var(--spacingHorizontalXXS);border-radius:var(--borderRadiusMedium);position:relative;box-sizing:border-box;min-height:32px;padding:0 var(--spacingHorizontalMNudge);font-family:var(--fontFamilyBase);font-size:var(--fontSizeBase300);font-weight:var(--fontWeightRegular);line-height:var(--lineHeightBase300);background-color:var(--colorNeutralBackground1);border:1px solid var(--colorNeutralStroke1);border-bottom-color:var(--colorNeutralStrokeAccessible);}", '.r1jtohuq::after{box-sizing:border-box;content:"";position:absolute;left:-1px;bottom:-1px;right:-1px;height:max(2px, var(--borderRadiusMedium));border-bottom-left-radius:var(--borderRadiusMedium);border-bottom-right-radius:var(--borderRadiusMedium);border-bottom:2px solid var(--colorCompoundBrandStroke);-webkit-clip-path:inset(calc(100% - 2px) 0 0 0);clip-path:inset(calc(100% - 2px) 0 0 0);-webkit-transform:scaleX(0);-moz-transform:scaleX(0);-ms-transform:scaleX(0);transform:scaleX(0);transition-property:transform;transition-duration:var(--durationUltraFast);transition-delay:var(--curveAccelerateMid);}', "@media screen and (prefers-reduced-motion: reduce){.r1jtohuq::after{transition-duration:0.01ms;transition-delay:0.01ms;}}", ".r1jtohuq:focus-within::after{-webkit-transform:scaleX(1);-moz-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1);transition-property:transform;transition-duration:var(--durationNormal);transition-delay:var(--curveDecelerateMid);}", "@media screen and (prefers-reduced-motion: reduce){.r1jtohuq:focus-within::after{transition-duration:0.01ms;transition-delay:0.01ms;}}", ".r1jtohuq:focus-within:active::after{border-bottom-color:var(--colorCompoundBrandStrokePressed);}", ".r1jtohuq:focus-within{outline:2px solid transparent;}", ".rl1z2p5{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-flex-wrap:nowrap;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;gap:var(--spacingHorizontalXXS);border-radius:var(--borderRadiusMedium);position:relative;box-sizing:border-box;min-height:32px;padding:0 var(--spacingHorizontalMNudge);font-family:var(--fontFamilyBase);font-size:var(--fontSizeBase300);font-weight:var(--fontWeightRegular);line-height:var(--lineHeightBase300);background-color:var(--colorNeutralBackground1);border:1px solid var(--colorNeutralStroke1);border-bottom-color:var(--colorNeutralStrokeAccessible);}", '.rl1z2p5::after{box-sizing:border-box;content:"";position:absolute;right:-1px;bottom:-1px;left:-1px;height:max(2px, var(--borderRadiusMedium));border-bottom-right-radius:var(--borderRadiusMedium);border-bottom-left-radius:var(--borderRadiusMedium);border-bottom:2px solid var(--colorCompoundBrandStroke);-webkit-clip-path:inset(calc(100% - 2px) 0 0 0);clip-path:inset(calc(100% - 2px) 0 0 0);-webkit-transform:scaleX(0);-moz-transform:scaleX(0);-ms-transform:scaleX(0);transform:scaleX(0);transition-property:transform;transition-duration:var(--durationUltraFast);transition-delay:var(--curveAccelerateMid);}', "@media screen and (prefers-reduced-motion: reduce){.rl1z2p5::after{transition-duration:0.01ms;transition-delay:0.01ms;}}", ".rl1z2p5:focus-within::after{-webkit-transform:scaleX(1);-moz-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1);transition-property:transform;transition-duration:var(--durationNormal);transition-delay:var(--curveDecelerateMid);}", "@media screen and (prefers-reduced-motion: reduce){.rl1z2p5:focus-within::after{transition-duration:0.01ms;transition-delay:0.01ms;}}", ".rl1z2p5:focus-within:active::after{border-bottom-color:var(--colorCompoundBrandStrokePressed);}", ".rl1z2p5:focus-within{outline:2px solid transparent;}"])
      , Ce = ze({
        small: {
            sshi5w: "f1pha7fy",
            uwmqm3: ["fk8j09s", "fdw0yi8"],
            z189sj: ["fdw0yi8", "fk8j09s"],
            Bahqtrf: "fk6fouc",
            Be2twd7: "fy9rknc",
            Bhrd7zp: "figsok6",
            Bg96gwp: "fwrc4pm"
        },
        medium: {},
        large: {
            sshi5w: "f1w5jphr",
            uwmqm3: ["f1uw59to", "fw5db7e"],
            z189sj: ["fw5db7e", "f1uw59to"],
            Bahqtrf: "fk6fouc",
            Be2twd7: "fod5ikn",
            Bhrd7zp: "figsok6",
            Bg96gwp: "faaz57k",
            i8kkvl: "f1rjii52",
            Belr9w4: "f1r7g2jn"
        },
        outline: {},
        outlineInteractive: {
            Bgoe8wy: "fvcxoqz",
            Bwzppfd: ["f1ub3y4t", "f1m52nbi"],
            oetu4i: "f1l4zc64",
            gg5e9n: ["f1m52nbi", "f1ub3y4t"],
            Drbcw7: "f8vnjqi",
            udz0bu: ["fz1etlk", "f1hc16gm"],
            Be8ivqh: "f1klwx88",
            ofdepl: ["f1hc16gm", "fz1etlk"]
        },
        underline: {
            De3pzq: "f1c21dwh",
            Bbmb7ep: ["f1krrbdw", "f1deotkl"],
            Beyfa6y: ["f1deotkl", "f1krrbdw"],
            B7oj6ja: ["f10ostut", "f1ozlkrg"],
            Btl43ni: ["f1ozlkrg", "f10ostut"],
            icvyot: "f1ern45e",
            vrafjx: ["f1n71otn", "f1deefiw"],
            wvpqe5: ["f1deefiw", "f1n71otn"],
            Eqx8gd: ["f1n6gb5g", "f15yvnhg"],
            B1piin3: ["f15yvnhg", "f1n6gb5g"]
        },
        underlineInteractive: {
            oetu4i: "f1l4zc64",
            Be8ivqh: "f1klwx88",
            B3778ie: ["f1nf3wye", "feulmo5"],
            d9w3h3: ["feulmo5", "f1nf3wye"],
            Bl18szs: ["f18vqdqu", "f53nyzz"],
            B4j8arr: ["f53nyzz", "f18vqdqu"]
        },
        filled: {
            g2u3we: "fghlq4f",
            h3c5rm: ["f1gn591s", "fjscplz"],
            B9xav0g: "fb073pr",
            zhjwy3: ["fjscplz", "f1gn591s"]
        },
        filledInteractive: {
            q7v0qe: "ftmjh5b",
            kmh5ft: ["f17blpuu", "fsrcdbj"],
            nagaa4: "f1tpwn32",
            B1yhkcb: ["fsrcdbj", "f17blpuu"]
        },
        invalid: {
            tvckwq: "fs4k3qj",
            gk2u95: ["fcee079", "fmyw78r"],
            hhx65j: "f1fgmyf4",
            Bxowmz0: ["fmyw78r", "fcee079"]
        },
        "filled-darker": {
            De3pzq: "f16xq7d1"
        },
        "filled-lighter": {
            De3pzq: "fxugw4r"
        },
        "filled-darker-shadow": {
            De3pzq: "f16xq7d1",
            E5pizo: "fyed02w"
        },
        "filled-lighter-shadow": {
            De3pzq: "fxugw4r",
            E5pizo: "fyed02w"
        },
        disabled: {
            Bceei9c: "fdrzuqr",
            De3pzq: "f1c21dwh",
            g2u3we: "f1jj8ep1",
            h3c5rm: ["f15xbau", "fy0fskl"],
            B9xav0g: "f4ikngz",
            zhjwy3: ["fy0fskl", "f15xbau"],
            Bjwas2f: "fg455y9",
            Bn1d65q: ["f1rvyvqg", "f14g86mu"],
            Bxeuatn: "f1cwzwz",
            n51gp8: ["f14g86mu", "f1rvyvqg"],
            Bsft5z2: "fhr9occ",
            Bduesf4: "f99w1ws"
        }
    }, {
        d: [".f1pha7fy{min-height:24px;}", ".fk8j09s{padding-left:var(--spacingHorizontalSNudge);}", ".fdw0yi8{padding-right:var(--spacingHorizontalSNudge);}", ".fk6fouc{font-family:var(--fontFamilyBase);}", ".fy9rknc{font-size:var(--fontSizeBase200);}", ".figsok6{font-weight:var(--fontWeightRegular);}", ".fwrc4pm{line-height:var(--lineHeightBase200);}", ".f1w5jphr{min-height:40px;}", ".f1uw59to{padding-left:var(--spacingHorizontalM);}", ".fw5db7e{padding-right:var(--spacingHorizontalM);}", ".fod5ikn{font-size:var(--fontSizeBase400);}", ".faaz57k{line-height:var(--lineHeightBase400);}", ".f1rjii52{-webkit-column-gap:var(--spacingHorizontalSNudge);column-gap:var(--spacingHorizontalSNudge);}", ".f1r7g2jn{row-gap:var(--spacingHorizontalSNudge);}", ".f1c21dwh{background-color:var(--colorTransparentBackground);}", ".f1krrbdw{border-bottom-right-radius:0;}", ".f1deotkl{border-bottom-left-radius:0;}", ".f10ostut{border-top-right-radius:0;}", ".f1ozlkrg{border-top-left-radius:0;}", ".f1ern45e{border-top-style:none;}", ".f1n71otn{border-right-style:none;}", ".f1deefiw{border-left-style:none;}", ".f1n6gb5g::after{left:0;}", ".f15yvnhg::after{right:0;}", ".f1nf3wye::after{border-bottom-right-radius:0;}", ".feulmo5::after{border-bottom-left-radius:0;}", ".f18vqdqu::after{border-top-right-radius:0;}", ".f53nyzz::after{border-top-left-radius:0;}", ".fghlq4f{border-top-color:var(--colorTransparentStroke);}", ".f1gn591s{border-right-color:var(--colorTransparentStroke);}", ".fjscplz{border-left-color:var(--colorTransparentStroke);}", ".fb073pr{border-bottom-color:var(--colorTransparentStroke);}", ".fs4k3qj:not(:focus-within),.fs4k3qj:hover:not(:focus-within){border-top-color:var(--colorPaletteRedBorder2);}", ".fcee079:not(:focus-within),.fcee079:hover:not(:focus-within){border-right-color:var(--colorPaletteRedBorder2);}", ".fmyw78r:not(:focus-within),.fmyw78r:hover:not(:focus-within){border-left-color:var(--colorPaletteRedBorder2);}", ".f1fgmyf4:not(:focus-within),.f1fgmyf4:hover:not(:focus-within){border-bottom-color:var(--colorPaletteRedBorder2);}", ".f16xq7d1{background-color:var(--colorNeutralBackground3);}", ".fxugw4r{background-color:var(--colorNeutralBackground1);}", ".fyed02w{box-shadow:var(--shadow2);}", ".fdrzuqr{cursor:not-allowed;}", ".f1jj8ep1{border-top-color:var(--colorNeutralStrokeDisabled);}", ".f15xbau{border-right-color:var(--colorNeutralStrokeDisabled);}", ".fy0fskl{border-left-color:var(--colorNeutralStrokeDisabled);}", ".f4ikngz{border-bottom-color:var(--colorNeutralStrokeDisabled);}", ".fhr9occ::after{content:unset;}"],
        h: [".fvcxoqz:hover{border-top-color:var(--colorNeutralStroke1Hover);}", ".f1ub3y4t:hover{border-right-color:var(--colorNeutralStroke1Hover);}", ".f1m52nbi:hover{border-left-color:var(--colorNeutralStroke1Hover);}", ".f1l4zc64:hover{border-bottom-color:var(--colorNeutralStrokeAccessibleHover);}", ".ftmjh5b:hover,.ftmjh5b:focus-within{border-top-color:var(--colorTransparentStrokeInteractive);}", ".f17blpuu:hover,.f17blpuu:focus-within{border-right-color:var(--colorTransparentStrokeInteractive);}", ".fsrcdbj:hover,.fsrcdbj:focus-within{border-left-color:var(--colorTransparentStrokeInteractive);}", ".f1tpwn32:hover,.f1tpwn32:focus-within{border-bottom-color:var(--colorTransparentStrokeInteractive);}"],
        a: [".f8vnjqi:active,.f8vnjqi:focus-within{border-top-color:var(--colorNeutralStroke1Pressed);}", ".fz1etlk:active,.fz1etlk:focus-within{border-right-color:var(--colorNeutralStroke1Pressed);}", ".f1hc16gm:active,.f1hc16gm:focus-within{border-left-color:var(--colorNeutralStroke1Pressed);}", ".f1klwx88:active,.f1klwx88:focus-within{border-bottom-color:var(--colorNeutralStrokeAccessiblePressed);}"],
        m: [["@media (forced-colors: active){.fg455y9{border-top-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f1rvyvqg{border-right-color:GrayText;}.f14g86mu{border-left-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f1cwzwz{border-bottom-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f14g86mu{border-left-color:GrayText;}.f1rvyvqg{border-right-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }]],
        w: [".f99w1ws:focus-within{outline-style:none;}"]
    })
      , Re = Oe("rvp2gzh", null, [".rvp2gzh{box-sizing:border-box;-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;min-width:0;border-style:none;padding:0 var(--spacingHorizontalXXS);color:var(--colorNeutralForeground1);background-color:transparent;outline-style:none;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:inherit;}", ".rvp2gzh::-webkit-input-placeholder{color:var(--colorNeutralForeground4);opacity:1;}", ".rvp2gzh::-moz-placeholder{color:var(--colorNeutralForeground4);opacity:1;}", ".rvp2gzh:-ms-input-placeholder{color:var(--colorNeutralForeground4);opacity:1;}", ".rvp2gzh::placeholder{color:var(--colorNeutralForeground4);opacity:1;}"])
      , De = ze({
        large: {
            uwmqm3: ["fk8j09s", "fdw0yi8"],
            z189sj: ["fdw0yi8", "fk8j09s"]
        },
        disabled: {
            sj55zd: "f1s2aq7o",
            De3pzq: "f1c21dwh",
            Bceei9c: "fdrzuqr",
            yvdlaj: "fahhnxm"
        }
    }, {
        d: [".fk8j09s{padding-left:var(--spacingHorizontalSNudge);}", ".fdw0yi8{padding-right:var(--spacingHorizontalSNudge);}", ".f1s2aq7o{color:var(--colorNeutralForegroundDisabled);}", ".f1c21dwh{background-color:var(--colorTransparentBackground);}", ".fdrzuqr{cursor:not-allowed;}", ".fahhnxm::-webkit-input-placeholder{color:var(--colorNeutralForegroundDisabled);}", ".fahhnxm::-moz-placeholder{color:var(--colorNeutralForegroundDisabled);}"]
    })
      , Ne = Oe("r1572tok", null, [".r1572tok{box-sizing:border-box;color:var(--colorNeutralForeground3);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}", ".r1572tok>svg{font-size:20px;}"])
      , Ee = ze({
        disabled: {
            sj55zd: "f1s2aq7o"
        },
        small: {
            kwki1k: "f3u2cy0"
        },
        medium: {},
        large: {
            kwki1k: "fa420co"
        }
    }, {
        d: [".f1s2aq7o{color:var(--colorNeutralForegroundDisabled);}", ".f3u2cy0>svg{font-size:16px;}", ".fa420co>svg{font-size:24px;}"]
    })
      , Ae = t.createContext(void 0)
      , Me = ()=>{}
      , Ie = {
        useAccordionHeaderStyles_unstable: Me,
        useAccordionItemStyles_unstable: Me,
        useAccordionPanelStyles_unstable: Me,
        useAccordionStyles_unstable: Me,
        useAvatarStyles_unstable: Me,
        useAvatarGroupStyles_unstable: Me,
        useAvatarGroupItemStyles_unstable: Me,
        useAvatarGroupPopoverStyles_unstable: Me,
        useBadgeStyles_unstable: Me,
        useCounterBadgeStyles_unstable: Me,
        useCardHeaderStyles_unstable: Me,
        useCardStyles_unstable: Me,
        useCardFooterStyles_unstable: Me,
        useCardPreviewStyles_unstable: Me,
        usePresenceBadgeStyles_unstable: Me,
        useButtonStyles_unstable: Me,
        useCompoundButtonStyles_unstable: Me,
        useMenuButtonStyles_unstable: Me,
        useSplitButtonStyles_unstable: Me,
        useToggleButtonStyles_unstable: Me,
        useCheckboxStyles_unstable: Me,
        useComboboxStyles_unstable: Me,
        useDropdownStyles_unstable: Me,
        useListboxStyles_unstable: Me,
        useOptionStyles_unstable: Me,
        useOptionGroupStyles_unstable: Me,
        useDividerStyles_unstable: Me,
        useInputStyles_unstable: Me,
        useImageStyles_unstable: Me,
        useLabelStyles_unstable: Me,
        useLinkStyles_unstable: Me,
        useMenuDividerStyles_unstable: Me,
        useMenuGroupHeaderStyles_unstable: Me,
        useMenuGroupStyles_unstable: Me,
        useMenuItemCheckboxStyles_unstable: Me,
        useMenuItemRadioStyles_unstable: Me,
        useMenuItemStyles_unstable: Me,
        useMenuListStyles_unstable: Me,
        useMenuPopoverStyles_unstable: Me,
        useMenuSplitGroupStyles_unstable: Me,
        usePersonaStyles_unstable: Me,
        usePopoverSurfaceStyles_unstable: Me,
        useRadioGroupStyles_unstable: Me,
        useRadioStyles_unstable: Me,
        useSelectStyles_unstable: Me,
        useSliderStyles_unstable: Me,
        useSpinButtonStyles_unstable: Me,
        useSpinnerStyles_unstable: Me,
        useSwitchStyles_unstable: Me,
        useTabStyles_unstable: Me,
        useTabListStyles_unstable: Me,
        useTextStyles_unstable: Me,
        useTextareaStyles_unstable: Me,
        useTooltipStyles_unstable: Me,
        useDialogTitleStyles_unstable: Me,
        useDialogBodyStyles_unstable: Me,
        useDialogActionsStyles_unstable: Me,
        useDialogSurfaceStyles_unstable: Me,
        useDialogContentStyles_unstable: Me,
        useProgressBarStyles_unstable: Me,
        useToolbarButtonStyles_unstable: Me,
        useToolbarRadioButtonStyles_unstable: Me,
        useToolbarGroupStyles_unstable: Me,
        useToolbarToggleButtonStyles_unstable: Me,
        useToolbarDividerStyles_unstable: Me,
        useToolbarStyles_unstable: Me,
        useTableCellStyles_unstable: Me,
        useTableRowStyles_unstable: Me,
        useTableBodyStyles_unstable: Me,
        useTableStyles_unstable: Me,
        useTableHeaderStyles_unstable: Me,
        useTableHeaderCellStyles_unstable: Me,
        useTableResizeHandleStyles_unstable: Me,
        useTableSelectionCellStyles_unstable: Me,
        useTableCellActionsStyles_unstable: Me,
        useTableCellLayoutStyles_unstable: Me,
        useDataGridCellStyles_unstable: Me,
        useDataGridRowStyles_unstable: Me,
        useDataGridBodyStyles_unstable: Me,
        useDataGridStyles_unstable: Me,
        useDataGridHeaderStyles_unstable: Me,
        useDataGridHeaderCellStyles_unstable: Me,
        useDataGridSelectionCellStyles_unstable: Me
    };
    Ae.Provider;
    function Fe() {
        var e;
        return null !== (e = t.useContext(Ae)) && void 0 !== e ? e : Ie
    }
    var He = t.forwardRef(((e,r)=>{
        var o = ((e,r)=>{
            var t, o = ne(), {size: n="medium", appearance: a=(null !== (t = o.inputDefaultAppearance) && void 0 !== t ? t : "outline"), onChange: i} = e, [s,l] = D({
                state: e.value,
                defaultState: e.defaultValue,
                initialState: ""
            }), u = K({
                props: e,
                primarySlotTagName: "input",
                excludedPropNames: ["size", "onChange", "value", "defaultValue"]
            }), c = {
                size: n,
                appearance: a,
                components: {
                    root: "span",
                    input: "input",
                    contentBefore: "span",
                    contentAfter: "span"
                },
                input: J(e.input, {
                    required: !0,
                    defaultProps: ie({
                        type: "text",
                        ref: r
                    }, u.primary)
                }),
                contentAfter: J(e.contentAfter),
                contentBefore: J(e.contentBefore),
                root: J(e.root, {
                    required: !0,
                    defaultProps: u.root
                })
            };
            return c.input.value = s,
            c.input.onChange = te((e=>{
                var r = e.target.value;
                null == i || i(e, {
                    value: r
                }),
                l(r)
            }
            )),
            c
        }
        )(e, r);
        (e=>{
            var {size: r, appearance: t} = e
              , o = e.input.disabled
              , n = "true" === "".concat(e.input["aria-invalid"])
              , a = t.startsWith("filled")
              , i = Ce()
              , s = De()
              , l = Ee();
            e.root.className = R(Pe, qe(), i[r], i[t], !o && "outline" === t && i.outlineInteractive, !o && "underline" === t && i.underlineInteractive, !o && a && i.filledInteractive, a && i.filled, !o && n && i.invalid, o && i.disabled, e.root.className),
            e.input.className = R(_e, Re(), "large" === r && s.large, o && s.disabled, e.input.className);
            var u = [Ne(), o && l.disabled, l[r]];
            e.contentBefore && (e.contentBefore.className = R(Be, ...u, e.contentBefore.className)),
            e.contentAfter && (e.contentAfter.className = R(Te, ...u, e.contentAfter.className))
        }
        )(o);
        var {useInputStyles_unstable: n} = Fe();
        return n(o),
        (e=>{
            var {slots: r, slotProps: o} = ce(e);
            return t.createElement(r.root, o.root, r.contentBefore && t.createElement(r.contentBefore, o.contentBefore), t.createElement(r.input, o.input), r.contentAfter && t.createElement(r.contentAfter, o.contentAfter))
        }
        )(o)
    }
    ));
    function Le(e) {
        return e.reduce((function(e, r) {
            var t = r[0]
              , o = r[1];
            return e[t] = o,
            e[o] = t,
            e
        }
        ), {})
    }
    function We(e) {
        return "number" == typeof e
    }
    function Xe(e, r) {
        return -1 !== e.indexOf(r)
    }
    function $e(e, r, t, o) {
        return r + (n = t,
        0 === parseFloat(n) ? n : "-" === n[0] ? n.slice(1) : "-" + n) + o;
        var n
    }
    function Ve(e) {
        return e.replace(/ +/g, " ").split(" ").map((function(e) {
            return e.trim()
        }
        )).filter(Boolean).reduce((function(e, r) {
            var t = e.list
              , o = e.state
              , n = (r.match(/\(/g) || []).length
              , a = (r.match(/\)/g) || []).length;
            return o.parensDepth > 0 ? t[t.length - 1] = t[t.length - 1] + " " + r : t.push(r),
            o.parensDepth += n - a,
            {
                list: t,
                state: o
            }
        }
        ), {
            list: [],
            state: {
                parensDepth: 0
            }
        }).list
    }
    function Ge(e) {
        var r = Ve(e);
        if (r.length <= 3 || r.length > 4)
            return e;
        var t = r[0]
          , o = r[1]
          , n = r[2];
        return [t, r[3], n, o].join(" ")
    }
    He.displayName = "Input";
    var Ue = {
        padding: function(e) {
            var r = e.value;
            return We(r) ? r : Ge(r)
        },
        textShadow: function(e) {
            var r = function(e) {
                for (var r = [], t = 0, o = 0, n = !1; o < e.length; )
                    n || "," !== e[o] ? "(" === e[o] ? (n = !0,
                    o++) : ")" === e[o] ? (n = !1,
                    o++) : o++ : (r.push(e.substring(t, o).trim()),
                    t = ++o);
                return t != o && r.push(e.substring(t, o + 1)),
                r
            }(e.value).map((function(e) {
                return e.replace(/(^|\s)(-*)([.|\d]+)/, (function(e, r, t, o) {
                    return "0" === o ? e : "" + r + ("" === t ? "-" : "") + o
                }
                ))
            }
            ));
            return r.join(",")
        },
        borderColor: function(e) {
            return Ge(e.value)
        },
        borderRadius: function(e) {
            var r = e.value;
            if (We(r))
                return r;
            if (Xe(r, "/")) {
                var t = r.split("/")
                  , o = t[0]
                  , n = t[1];
                return Ue.borderRadius({
                    value: o.trim()
                }) + " / " + Ue.borderRadius({
                    value: n.trim()
                })
            }
            var a = Ve(r);
            switch (a.length) {
            case 2:
                return a.reverse().join(" ");
            case 4:
                var i = a[0]
                  , s = a[1]
                  , l = a[2];
                return [s, i, a[3], l].join(" ");
            default:
                return r
            }
        },
        background: function(e) {
            var r = e.value
              , t = e.valuesToConvert
              , o = e.isRtl
              , n = e.bgImgDirectionRegex
              , a = e.bgPosDirectionRegex;
            if (We(r))
                return r;
            var i = r.replace(/(url\(.*?\))|(rgba?\(.*?\))|(hsl\(.*?\))|(#[a-fA-F0-9]+)|((^| )(\D)+( |$))/g, "").trim();
            return r = r.replace(i, Ue.backgroundPosition({
                value: i,
                valuesToConvert: t,
                isRtl: o,
                bgPosDirectionRegex: a
            })),
            Ue.backgroundImage({
                value: r,
                valuesToConvert: t,
                bgImgDirectionRegex: n
            })
        },
        backgroundImage: function(e) {
            var r = e.value
              , t = e.valuesToConvert
              , o = e.bgImgDirectionRegex;
            return Xe(r, "url(") || Xe(r, "linear-gradient(") ? r.replace(o, (function(e, r, o) {
                return e.replace(o, t[o])
            }
            )) : r
        },
        backgroundPosition: function(e) {
            var r = e.value
              , t = e.valuesToConvert
              , o = e.isRtl
              , n = e.bgPosDirectionRegex;
            return r.replace(o ? /^((-|\d|\.)+%)/ : null, (function(e, r) {
                return function(e) {
                    var r = e.indexOf(".");
                    if (-1 === r)
                        e = 100 - parseFloat(e) + "%";
                    else {
                        var t = e.length - r - 2;
                        e = (e = 100 - parseFloat(e)).toFixed(t) + "%"
                    }
                    return e
                }(r)
            }
            )).replace(n, (function(e) {
                return t[e]
            }
            ))
        },
        backgroundPositionX: function(e) {
            var r = e.value
              , t = e.valuesToConvert
              , o = e.isRtl
              , n = e.bgPosDirectionRegex;
            return We(r) ? r : Ue.backgroundPosition({
                value: r,
                valuesToConvert: t,
                isRtl: o,
                bgPosDirectionRegex: n
            })
        },
        transition: function(e) {
            var r = e.value
              , t = e.propertiesToConvert;
            return r.split(/,\s*/g).map((function(e) {
                var r = e.split(" ");
                return r[0] = t[r[0]] || r[0],
                r.join(" ")
            }
            )).join(", ")
        },
        transitionProperty: function(e) {
            var r = e.value
              , t = e.propertiesToConvert;
            return r.split(/,\s*/g).map((function(e) {
                return t[e] || e
            }
            )).join(", ")
        },
        transform: function(e) {
            var r = e.value
              , t = "[^\\u0020-\\u007e]"
              , o = "(?:(?:(?:\\[0-9a-f]{1,6})(?:\\r\\n|\\s)?)|\\\\[^\\r\\n\\f0-9a-f])"
              , n = "((?:-?(?:[0-9]*\\.[0-9]+|[0-9]+)(?:\\s*(?:em|ex|px|cm|mm|in|pt|pc|deg|rad|grad|ms|s|hz|khz|%)|-?(?:[_a-z]|" + t + "|" + o + ")(?:[_a-z0-9-]|" + t + "|" + o + ")*)?)|(?:inherit|auto))"
              , a = new RegExp("(translateX\\s*\\(\\s*)" + n + "(\\s*\\))","gi")
              , i = new RegExp("(translate\\s*\\(\\s*)" + n + "((?:\\s*,\\s*" + n + "){0,1}\\s*\\))","gi")
              , s = new RegExp("(translate3d\\s*\\(\\s*)" + n + "((?:\\s*,\\s*" + n + "){0,2}\\s*\\))","gi")
              , l = new RegExp("(rotate[ZY]?\\s*\\(\\s*)" + n + "(\\s*\\))","gi");
            return r.replace(a, $e).replace(i, $e).replace(s, $e).replace(l, $e)
        }
    };
    Ue.objectPosition = Ue.backgroundPosition,
    Ue.margin = Ue.padding,
    Ue.borderWidth = Ue.padding,
    Ue.boxShadow = Ue.textShadow,
    Ue.webkitBoxShadow = Ue.boxShadow,
    Ue.mozBoxShadow = Ue.boxShadow,
    Ue.WebkitBoxShadow = Ue.boxShadow,
    Ue.MozBoxShadow = Ue.boxShadow,
    Ue.borderStyle = Ue.borderColor,
    Ue.webkitTransform = Ue.transform,
    Ue.mozTransform = Ue.transform,
    Ue.WebkitTransform = Ue.transform,
    Ue.MozTransform = Ue.transform,
    Ue.transformOrigin = Ue.backgroundPosition,
    Ue.webkitTransformOrigin = Ue.transformOrigin,
    Ue.mozTransformOrigin = Ue.transformOrigin,
    Ue.WebkitTransformOrigin = Ue.transformOrigin,
    Ue.MozTransformOrigin = Ue.transformOrigin,
    Ue.webkitTransition = Ue.transition,
    Ue.mozTransition = Ue.transition,
    Ue.WebkitTransition = Ue.transition,
    Ue.MozTransition = Ue.transition,
    Ue.webkitTransitionProperty = Ue.transitionProperty,
    Ue.mozTransitionProperty = Ue.transitionProperty,
    Ue.WebkitTransitionProperty = Ue.transitionProperty,
    Ue.MozTransitionProperty = Ue.transitionProperty,
    Ue["text-shadow"] = Ue.textShadow,
    Ue["border-color"] = Ue.borderColor,
    Ue["border-radius"] = Ue.borderRadius,
    Ue["background-image"] = Ue.backgroundImage,
    Ue["background-position"] = Ue.backgroundPosition,
    Ue["background-position-x"] = Ue.backgroundPositionX,
    Ue["object-position"] = Ue.objectPosition,
    Ue["border-width"] = Ue.padding,
    Ue["box-shadow"] = Ue.textShadow,
    Ue["-webkit-box-shadow"] = Ue.textShadow,
    Ue["-moz-box-shadow"] = Ue.textShadow,
    Ue["border-style"] = Ue.borderColor,
    Ue["-webkit-transform"] = Ue.transform,
    Ue["-moz-transform"] = Ue.transform,
    Ue["transform-origin"] = Ue.transformOrigin,
    Ue["-webkit-transform-origin"] = Ue.transformOrigin,
    Ue["-moz-transform-origin"] = Ue.transformOrigin,
    Ue["-webkit-transition"] = Ue.transition,
    Ue["-moz-transition"] = Ue.transition,
    Ue["transition-property"] = Ue.transitionProperty,
    Ue["-webkit-transition-property"] = Ue.transitionProperty,
    Ue["-moz-transition-property"] = Ue.transitionProperty;
    var Ke = Le([["paddingLeft", "paddingRight"], ["marginLeft", "marginRight"], ["left", "right"], ["borderLeft", "borderRight"], ["borderLeftColor", "borderRightColor"], ["borderLeftStyle", "borderRightStyle"], ["borderLeftWidth", "borderRightWidth"], ["borderTopLeftRadius", "borderTopRightRadius"], ["borderBottomLeftRadius", "borderBottomRightRadius"], ["padding-left", "padding-right"], ["margin-left", "margin-right"], ["border-left", "border-right"], ["border-left-color", "border-right-color"], ["border-left-style", "border-right-style"], ["border-left-width", "border-right-width"], ["border-top-left-radius", "border-top-right-radius"], ["border-bottom-left-radius", "border-bottom-right-radius"]])
      , Ye = ["content"]
      , Qe = Le([["ltr", "rtl"], ["left", "right"], ["w-resize", "e-resize"], ["sw-resize", "se-resize"], ["nw-resize", "ne-resize"]])
      , Ze = new RegExp("(^|\\W|_)((ltr)|(rtl)|(left)|(right))(\\W|_|$)","g")
      , Je = new RegExp("(left)|(right)");
    function er(e) {
        return Object.keys(e).reduce((function(r, t) {
            var o = e[t];
            if ("string" == typeof o && (o = o.trim()),
            Xe(Ye, t))
                return r[t] = o,
                r;
            var n = rr(t, o)
              , a = n.key
              , i = n.value;
            return r[a] = i,
            r
        }
        ), Array.isArray(e) ? [] : {})
    }
    function rr(e, r) {
        var t, o = /\/\*\s?@noflip\s?\*\//.test(r), n = o ? e : Ke[t = e] || t, a = o ? r : function(e, r) {
            if (!function(e) {
                return r = e,
                !("boolean" == typeof r || function(e) {
                    return null == e
                }(e));
                var r
            }(r))
                return r;
            if (t = r,
            t && "object" == typeof t)
                return er(r);
            var t;
            var o, n = We(r), a = function(e) {
                return "function" == typeof e
            }(r), i = n || a ? r : r.replace(/ !important.*?$/, ""), s = !n && i.length !== r.length, l = Ue[e];
            o = l ? l({
                value: i,
                valuesToConvert: Qe,
                propertiesToConvert: Ke,
                isRtl: !0,
                bgImgDirectionRegex: Ze,
                bgPosDirectionRegex: Je
            }) : Qe[i] || i;
            if (s)
                return o + " !important";
            return o
        }(n, r);
        return {
            key: n,
            value: a
        }
    }
    var tr = "-ms-"
      , or = "-moz-"
      , nr = "-webkit-"
      , ar = "comm"
      , ir = "rule"
      , sr = "decl"
      , lr = "@import"
      , ur = "@keyframes"
      , cr = Math.abs
      , fr = String.fromCharCode
      , dr = Object.assign;
    function pr(e) {
        return e.trim()
    }
    function br(e, r) {
        return (e = r.exec(e)) ? e[0] : e
    }
    function vr(e, r, t) {
        return e.replace(r, t)
    }
    function hr(e, r) {
        return e.indexOf(r)
    }
    function gr(e, r) {
        return 0 | e.charCodeAt(r)
    }
    function mr(e, r, t) {
        return e.slice(r, t)
    }
    function yr(e) {
        return e.length
    }
    function wr(e) {
        return e.length
    }
    function kr(e, r) {
        return r.push(e),
        e
    }
    function jr(e, r) {
        for (var t = "", o = wr(e), n = 0; n < o; n++)
            t += r(e[n], n, e, r) || "";
        return t
    }
    function xr(e, r, t, o) {
        switch (e.type) {
        case lr:
        case sr:
            return e.return = e.return || e.value;
        case ar:
            return "";
        case ur:
            return e.return = e.value + "{" + jr(e.children, o) + "}";
        case ir:
            e.value = e.props.join(",")
        }
        return yr(t = jr(e.children, o)) ? e.return = e.value + "{" + t + "}" : ""
    }
    var Sr = 1
      , Or = 1
      , zr = 0
      , Pr = 0
      , _r = 0
      , Br = "";
    function Tr(e, r, t, o, n, a, i) {
        return {
            value: e,
            root: r,
            parent: t,
            type: o,
            props: n,
            children: a,
            line: Sr,
            column: Or,
            length: i,
            return: ""
        }
    }
    function qr(e, r) {
        return dr(Tr("", null, null, "", null, null, 0), e, {
            length: -e.length
        }, r)
    }
    function Cr() {
        return _r = Pr > 0 ? gr(Br, --Pr) : 0,
        Or--,
        10 === _r && (Or = 1,
        Sr--),
        _r
    }
    function Rr() {
        return _r = Pr < zr ? gr(Br, Pr++) : 0,
        Or++,
        10 === _r && (Or = 1,
        Sr++),
        _r
    }
    function Dr() {
        return gr(Br, Pr)
    }
    function Nr() {
        return Pr
    }
    function Er(e, r) {
        return mr(Br, e, r)
    }
    function Ar(e) {
        switch (e) {
        case 0:
        case 9:
        case 10:
        case 13:
        case 32:
            return 5;
        case 33:
        case 43:
        case 44:
        case 47:
        case 62:
        case 64:
        case 126:
        case 59:
        case 123:
        case 125:
            return 4;
        case 58:
            return 3;
        case 34:
        case 39:
        case 40:
        case 91:
            return 2;
        case 41:
        case 93:
            return 1
        }
        return 0
    }
    function Mr(e) {
        return Sr = Or = 1,
        zr = yr(Br = e),
        Pr = 0,
        []
    }
    function Ir(e) {
        return Br = "",
        e
    }
    function Fr(e) {
        return pr(Er(Pr - 1, Xr(91 === e ? e + 2 : 40 === e ? e + 1 : e)))
    }
    function Hr(e) {
        return Ir(function(e) {
            for (; Rr(); )
                switch (Ar(_r)) {
                case 0:
                    kr(Vr(Pr - 1), e);
                    break;
                case 2:
                    kr(Fr(_r), e);
                    break;
                default:
                    kr(fr(_r), e)
                }
            return e
        }(Mr(e)))
    }
    function Lr(e) {
        for (; (_r = Dr()) && _r < 33; )
            Rr();
        return Ar(e) > 2 || Ar(_r) > 3 ? "" : " "
    }
    function Wr(e, r) {
        for (; --r && Rr() && !(_r < 48 || _r > 102 || _r > 57 && _r < 65 || _r > 70 && _r < 97); )
            ;
        return Er(e, Nr() + (r < 6 && 32 == Dr() && 32 == Rr()))
    }
    function Xr(e) {
        for (; Rr(); )
            switch (_r) {
            case e:
                return Pr;
            case 34:
            case 39:
                34 !== e && 39 !== e && Xr(_r);
                break;
            case 40:
                41 === e && Xr(e);
                break;
            case 92:
                Rr()
            }
        return Pr
    }
    function $r(e, r) {
        for (; Rr() && e + _r !== 57 && (e + _r !== 84 || 47 !== Dr()); )
            ;
        return "/*" + Er(r, Pr - 1) + "*" + fr(47 === e ? e : Rr())
    }
    function Vr(e) {
        for (; !Ar(Dr()); )
            Rr();
        return Er(e, Pr)
    }
    function Gr(e) {
        return Ir(Ur("", null, null, null, [""], e = Mr(e), 0, [0], e))
    }
    function Ur(e, r, t, o, n, a, i, s, l) {
        for (var u = 0, c = 0, f = i, d = 0, p = 0, b = 0, v = 1, h = 1, g = 1, m = 0, y = "", w = n, k = a, j = o, x = y; h; )
            switch (b = m,
            m = Rr()) {
            case 40:
                if (108 != b && 58 == gr(x, f - 1)) {
                    -1 != hr(x += vr(Fr(m), "&", "&\f"), "&\f") && (g = -1);
                    break
                }
            case 34:
            case 39:
            case 91:
                x += Fr(m);
                break;
            case 9:
            case 10:
            case 13:
            case 32:
                x += Lr(b);
                break;
            case 92:
                x += Wr(Nr() - 1, 7);
                continue;
            case 47:
                switch (Dr()) {
                case 42:
                case 47:
                    kr(Yr($r(Rr(), Nr()), r, t), l);
                    break;
                default:
                    x += "/"
                }
                break;
            case 123 * v:
                s[u++] = yr(x) * g;
            case 125 * v:
            case 59:
            case 0:
                switch (m) {
                case 0:
                case 125:
                    h = 0;
                case 59 + c:
                    p > 0 && yr(x) - f && kr(p > 32 ? Qr(x + ";", o, t, f - 1) : Qr(vr(x, " ", "") + ";", o, t, f - 2), l);
                    break;
                case 59:
                    x += ";";
                default:
                    if (kr(j = Kr(x, r, t, u, c, n, s, y, w = [], k = [], f), a),
                    123 === m)
                        if (0 === c)
                            Ur(x, r, j, j, w, a, f, s, k);
                        else
                            switch (99 === d && 110 === gr(x, 3) ? 100 : d) {
                            case 100:
                            case 109:
                            case 115:
                                Ur(e, j, j, o && kr(Kr(e, j, j, 0, 0, n, s, y, n, w = [], f), k), n, k, f, s, o ? w : k);
                                break;
                            default:
                                Ur(x, j, j, j, [""], k, 0, s, k)
                            }
                }
                u = c = p = 0,
                v = g = 1,
                y = x = "",
                f = i;
                break;
            case 58:
                f = 1 + yr(x),
                p = b;
            default:
                if (v < 1)
                    if (123 == m)
                        --v;
                    else if (125 == m && 0 == v++ && 125 == Cr())
                        continue;
                switch (x += fr(m),
                m * v) {
                case 38:
                    g = c > 0 ? 1 : (x += "\f",
                    -1);
                    break;
                case 44:
                    s[u++] = (yr(x) - 1) * g,
                    g = 1;
                    break;
                case 64:
                    45 === Dr() && (x += Fr(Rr())),
                    d = Dr(),
                    c = f = yr(y = x += Vr(Nr())),
                    m++;
                    break;
                case 45:
                    45 === b && 2 == yr(x) && (v = 0)
                }
            }
        return a
    }
    function Kr(e, r, t, o, n, a, i, s, l, u, c) {
        for (var f = n - 1, d = 0 === n ? a : [""], p = wr(d), b = 0, v = 0, h = 0; b < o; ++b)
            for (var g = 0, m = mr(e, f + 1, f = cr(v = i[b])), y = e; g < p; ++g)
                (y = pr(v > 0 ? d[g] + " " + m : vr(m, /&\f/g, d[g]))) && (l[h++] = y);
        return Tr(e, r, t, 0 === n ? ir : s, l, u, c)
    }
    function Yr(e, r, t) {
        return Tr(e, r, t, ar, fr(_r), mr(e, 2, -2), 0)
    }
    function Qr(e, r, t, o) {
        return Tr(e, r, t, sr, mr(e, 0, o), mr(e, o + 1, -1), o)
    }
    function Zr(e, r, t) {
        switch (function(e, r) {
            return 45 ^ gr(e, 0) ? (((r << 2 ^ gr(e, 0)) << 2 ^ gr(e, 1)) << 2 ^ gr(e, 2)) << 2 ^ gr(e, 3) : 0
        }(e, r)) {
        case 5103:
            return nr + "print-" + e + e;
        case 5737:
        case 4201:
        case 3177:
        case 3433:
        case 1641:
        case 4457:
        case 2921:
        case 5572:
        case 6356:
        case 5844:
        case 3191:
        case 6645:
        case 3005:
        case 6391:
        case 5879:
        case 5623:
        case 6135:
        case 4599:
        case 4855:
        case 4215:
        case 6389:
        case 5109:
        case 5365:
        case 5621:
        case 3829:
            return nr + e + e;
        case 4789:
            return or + e + e;
        case 5349:
        case 4246:
        case 4810:
        case 6968:
        case 2756:
            return nr + e + or + e + tr + e + e;
        case 5936:
            switch (gr(e, r + 11)) {
            case 114:
                return nr + e + tr + vr(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
            case 108:
                return nr + e + tr + vr(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
            case 45:
                return nr + e + tr + vr(e, /[svh]\w+-[tblr]{2}/, "lr") + e
            }
        case 6828:
        case 4268:
        case 2903:
            return nr + e + tr + e + e;
        case 6165:
            return nr + e + tr + "flex-" + e + e;
        case 5187:
            return nr + e + vr(e, /(\w+).+(:[^]+)/, nr + "box-$1$2" + tr + "flex-$1$2") + e;
        case 5443:
            return nr + e + tr + "flex-item-" + vr(e, /flex-|-self/g, "") + (br(e, /flex-|baseline/) ? "" : tr + "grid-row-" + vr(e, /flex-|-self/g, "")) + e;
        case 4675:
            return nr + e + tr + "flex-line-pack" + vr(e, /align-content|flex-|-self/g, "") + e;
        case 5548:
            return nr + e + tr + vr(e, "shrink", "negative") + e;
        case 5292:
            return nr + e + tr + vr(e, "basis", "preferred-size") + e;
        case 6060:
            return nr + "box-" + vr(e, "-grow", "") + nr + e + tr + vr(e, "grow", "positive") + e;
        case 4554:
            return nr + vr(e, /([^-])(transform)/g, "$1" + nr + "$2") + e;
        case 6187:
            return vr(vr(vr(e, /(zoom-|grab)/, nr + "$1"), /(image-set)/, nr + "$1"), e, "") + e;
        case 5495:
        case 3959:
            return vr(e, /(image-set\([^]*)/, nr + "$1$`$1");
        case 4968:
            return vr(vr(e, /(.+:)(flex-)?(.*)/, nr + "box-pack:$3" + tr + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + nr + e + e;
        case 4200:
            if (!br(e, /flex-|baseline/))
                return tr + "grid-column-align" + mr(e, r) + e;
            break;
        case 2592:
        case 3360:
            return tr + vr(e, "template-", "") + e;
        case 4384:
        case 3616:
            return t && t.some((function(e, t) {
                return r = t,
                br(e.props, /grid-\w+-end/)
            }
            )) ? ~hr(e + (t = t[r].value), "span") ? e : tr + vr(e, "-start", "") + e + tr + "grid-row-span:" + (~hr(t, "span") ? br(t, /\d+/) : +br(t, /\d+/) - +br(e, /\d+/)) + ";" : tr + vr(e, "-start", "") + e;
        case 4896:
        case 4128:
            return t && t.some((function(e) {
                return br(e.props, /grid-\w+-start/)
            }
            )) ? e : tr + vr(vr(e, "-end", "-span"), "span ", "") + e;
        case 4095:
        case 3583:
        case 4068:
        case 2532:
            return vr(e, /(.+)-inline(.+)/, nr + "$1$2") + e;
        case 8116:
        case 7059:
        case 5753:
        case 5535:
        case 5445:
        case 5701:
        case 4933:
        case 4677:
        case 5533:
        case 5789:
        case 5021:
        case 4765:
            if (yr(e) - 1 - r > 6)
                switch (gr(e, r + 1)) {
                case 109:
                    if (45 !== gr(e, r + 4))
                        break;
                case 102:
                    return vr(e, /(.+:)(.+)-([^]+)/, "$1" + nr + "$2-$3$1" + or + (108 == gr(e, r + 3) ? "$3" : "$2-$3")) + e;
                case 115:
                    return ~hr(e, "stretch") ? Zr(vr(e, "stretch", "fill-available"), r, t) + e : e
                }
            break;
        case 5152:
        case 5920:
            return vr(e, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, (function(r, t, o, n, a, i, s) {
                return tr + t + ":" + o + s + (n ? tr + t + "-span:" + (a ? i : +i - +o) + s : "") + e
            }
            ));
        case 4949:
            if (121 === gr(e, r + 6))
                return vr(e, ":", ":" + nr) + e;
            break;
        case 6444:
            switch (gr(e, 45 === gr(e, 14) ? 18 : 11)) {
            case 120:
                return vr(e, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1" + nr + (45 === gr(e, 14) ? "inline-" : "") + "box$3$1" + nr + "$2$3$1" + tr + "$2box$3") + e;
            case 100:
                return vr(e, ":", ":" + tr) + e
            }
            break;
        case 5719:
        case 2647:
        case 2135:
        case 3927:
        case 2391:
            return vr(e, "scroll-", "scroll-snap-") + e
        }
        return e
    }
    function Jr(e) {
        var r = wr(e);
        return function(t, o, n, a) {
            for (var i = "", s = 0; s < r; s++)
                i += e[s](t, o, n, a) || "";
            return i
        }
    }
    function et(e) {
        return function(r) {
            r.root || (r = r.return) && e(r)
        }
    }
    function rt(e, r, t, o) {
        if (e.length > -1 && !e.return)
            switch (e.type) {
            case sr:
                return void (e.return = Zr(e.value, e.length, t));
            case ur:
                return jr([qr(e, {
                    value: vr(e.value, "@", "@" + nr)
                })], o);
            case ir:
                if (e.length)
                    return function(e, r) {
                        return e.map(r).join("")
                    }(e.props, (function(r) {
                        switch (br(r, /(::plac\w+|:read-\w+)/)) {
                        case ":read-only":
                        case ":read-write":
                            return jr([qr(e, {
                                props: [vr(r, /:(read-\w+)/, ":" + or + "$1")]
                            })], o);
                        case "::placeholder":
                            return jr([qr(e, {
                                props: [vr(r, /:(plac\w+)/, ":" + nr + "input-$1")]
                            }), qr(e, {
                                props: [vr(r, /:(plac\w+)/, ":" + or + "$1")]
                            }), qr(e, {
                                props: [vr(r, /:(plac\w+)/, tr + "input-$1")]
                            })], o)
                        }
                        return ""
                    }
                    ))
            }
    }
    var tt = e=>{
        if (e.type === ir) {
            if ("string" == typeof e.props)
                return void 0;
            e.props = e.props.map((e=>-1 === e.indexOf(":global(") ? e : Hr(e).reduce(((e,r,t,o)=>{
                if ("" === r)
                    return e;
                if (":" === r && "global" === o[t + 1]) {
                    var n = o[t + 2].slice(1, -1) + " ";
                    return e.unshift(n),
                    o[t + 1] = "",
                    o[t + 2] = "",
                    e
                }
                return e.push(r),
                e
            }
            ), []).join("")))
        }
    }
      , ot = /[A-Z]/g
      , nt = /^ms-/
      , at = {};
    function it(e) {
        return "-" + e.toLowerCase()
    }
    function st(e) {
        if (Object.prototype.hasOwnProperty.call(at, e))
            return at[e];
        if ("--" === e.substr(0, 2))
            return e;
        var r = e.replace(ot, it);
        return at[e] = nt.test(r) ? "-" + r : r
    }
    function lt(e) {
        return "&" === e.charAt(0) ? e.slice(1) : e
    }
    var ut = /,( *[^ &])/g;
    function ct(e, r, t) {
        var o = r;
        return t.length > 0 && (o = t.reduceRight(((e,r)=>{
            return "".concat((t = r,
            "&" + lt(t.replace(ut, ",&$1"))), " { ").concat(e, " }");
            var t
        }
        ), r)),
        "".concat(e, "{").concat(o, "}")
    }
    function ft(e) {
        var r, {className: t, media: o, layer: n, selectors: a, support: i, property: s, rtlClassName: l, rtlProperty: u, rtlValue: c, value: f} = e, d = ct(".".concat(t), Array.isArray(f) ? "".concat(f.map((e=>"".concat(st(s), ": ").concat(e))).join(";"), ";") : "".concat(st(s), ": ").concat(f, ";"), a);
        u && l && (d += ct(".".concat(l), Array.isArray(c) ? "".concat(c.map((e=>"".concat(st(u), ": ").concat(e))).join(";"), ";") : "".concat(st(u), ": ").concat(c, ";"), a));
        return o && (d = "@media ".concat(o, " { ").concat(d, " }")),
        n && (d = "@layer ".concat(n, " { ").concat(d, " }")),
        i && (d = "@supports ".concat(i, " { ").concat(d, " }")),
        r = [],
        jr(Gr(d), Jr([tt, rt, xr, et((e=>r.push(e)))])),
        r
    }
    function dt(e) {
        var r = "";
        for (var t in e) {
            var o = e[t];
            "string" != typeof o && "number" != typeof o || (r += st(t) + ":" + o + ";")
        }
        return r
    }
    function pt(e) {
        var r = "";
        for (var t in e)
            r += "".concat(t, "{").concat(dt(e[t]), "}");
        return r
    }
    function bt(e, r) {
        var t = "@keyframes ".concat(e, " {").concat(r, "}")
          , o = [];
        return jr(Gr(t), Jr([rt, xr, et((e=>o.push(e)))])),
        o
    }
    function vt(e, r) {
        return 0 === e.length ? r : "".concat(e, " and ").concat(r)
    }
    var ht = /^(:|\[|>|&)/;
    var gt = {
        "us-w": "w",
        "us-v": "i",
        nk: "l",
        si: "v",
        cu: "f",
        ve: "h",
        ti: "a"
    };
    function mt(e, r, t, o) {
        if (t)
            return "m";
        if (r || o)
            return "t";
        if (e.length > 0) {
            var n = e[0].trim();
            if (58 === n.charCodeAt(0))
                return gt[n.slice(4, 8)] || gt[n.slice(3, 5)] || "d"
        }
        return "d"
    }
    function yt(e) {
        var {media: r, layer: t, property: o, selectors: n, support: a, value: i} = e
          , s = P(n.join("") + r + t + a + o + i.trim());
        return j + s
    }
    function wt(e, r, t, o) {
        var n = e.join("") + r + t + o
          , a = P(n)
          , i = a.charCodeAt(0);
        return i >= 48 && i <= 57 ? String.fromCharCode(i + 17) + a.substr(1) : a
    }
    function kt(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function jt(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? kt(Object(t), !0).forEach((function(r) {
                xt(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : kt(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function xt(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    function St(e, r, t, o) {
        e[r] = o ? [t, o] : t
    }
    function Ot(e, r) {
        return r ? [e, r] : e
    }
    function zt(e, r, t, o, n) {
        var a, i;
        "m" === r && n && (i = {
            m: n
        }),
        null !== (a = e[r]) && void 0 !== a || (e[r] = []),
        t && e[r].push(Ot(t, i)),
        o && e[r].push(Ot(o, i))
    }
    function Pt(e) {
        var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : []
          , t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : ""
          , o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : ""
          , n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : ""
          , a = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {}
          , i = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : {}
          , s = arguments.length > 7 ? arguments[7] : void 0
          , l = function(l) {
            if (z.hasOwnProperty(l))
                return "continue";
            var u, c = e[l];
            if (null == c)
                return "continue";
            if ("string" == typeof c || "number" == typeof c) {
                var f = wt(r, t, n, l)
                  , d = yt({
                    media: t,
                    layer: o,
                    value: c.toString(),
                    support: n,
                    selectors: r,
                    property: l
                })
                  , p = s && {
                    key: l,
                    value: s
                } || rr(l, c)
                  , b = p.key !== l || p.value !== c
                  , v = b ? yt({
                    value: p.value.toString(),
                    property: p.key,
                    selectors: r,
                    media: t,
                    layer: o,
                    support: n
                }) : void 0
                  , h = b ? {
                    rtlClassName: v,
                    rtlProperty: p.key,
                    rtlValue: p.value
                } : void 0
                  , g = mt(r, o, t, n)
                  , [m,y] = ft(jt({
                    className: d,
                    media: t,
                    layer: o,
                    selectors: r,
                    property: l,
                    support: n,
                    value: c
                }, h));
                St(a, f, d, v),
                zt(i, g, m, y, t)
            } else if ("animationName" === l) {
                var w = Array.isArray(c) ? c : [c]
                  , k = []
                  , x = [];
                for (var S of w) {
                    var O = pt(S)
                      , _ = pt(er(S))
                      , B = j + P(O)
                      , T = void 0
                      , q = bt(B, O)
                      , C = [];
                    O === _ ? T = B : C = bt(T = j + P(_), _);
                    for (var R = 0; R < q.length; R++)
                        zt(i, "k", q[R], C[R], t);
                    k.push(B),
                    x.push(T)
                }
                Pt({
                    animationName: k.join(", ")
                }, r, t, o, n, a, i, x.join(", "))
            } else if (Array.isArray(c)) {
                if (0 === c.length)
                    return "continue";
                var D = wt(r, t, n, l)
                  , N = yt({
                    media: t,
                    layer: o,
                    value: c.map((e=>(null != e ? e : "").toString())).join(";"),
                    support: n,
                    selectors: r,
                    property: l
                })
                  , E = c.map((e=>rr(l, e)));
                if (!!E.some((e=>e.key !== E[0].key)))
                    return "continue";
                var A = E[0].key !== l || E.some(((e,r)=>e.value !== c[r]))
                  , M = A ? yt({
                    value: E.map((e=>{
                        var r;
                        return (null !== (r = null == e ? void 0 : e.value) && void 0 !== r ? r : "").toString()
                    }
                    )).join(";"),
                    property: E[0].key,
                    selectors: r,
                    layer: o,
                    media: t,
                    support: n
                }) : void 0
                  , I = A ? {
                    rtlClassName: M,
                    rtlProperty: E[0].key,
                    rtlValue: E.map((e=>e.value))
                } : void 0
                  , F = mt(r, o, t, n)
                  , [H,L] = ft(jt({
                    className: N,
                    media: t,
                    layer: o,
                    selectors: r,
                    property: l,
                    support: n,
                    value: c
                }, I));
                St(a, D, N, M),
                zt(i, F, H, L, t)
            } else if (null != (u = c) && "object" == typeof u && !1 === Array.isArray(u))
                if (function(e) {
                    return ht.test(e)
                }(l))
                    Pt(c, r.concat(lt(l)), t, o, n, a, i);
                else if (function(e) {
                    return "@media" === e.substr(0, 6)
                }(l)) {
                    var W = vt(t, l.slice(6).trim());
                    Pt(c, r, W, o, n, a, i)
                } else if (function(e) {
                    return "@layer" === e.substr(0, 6)
                }(l)) {
                    var X = (o ? "".concat(o, ".") : "") + l.slice(6).trim();
                    Pt(c, r, t, X, n, a, i)
                } else if (function(e) {
                    return "@supports" === e.substr(0, 9)
                }(l)) {
                    var $ = vt(n, l.slice(9).trim());
                    Pt(c, r, t, o, $, a, i)
                }
        };
        for (var u in e)
            l(u);
        return [a, i]
    }
    function _t(e) {
        var r = {}
          , t = null
          , o = null
          , n = null
          , a = null;
        return function(i) {
            var {dir: s, renderer: l} = i;
            null === t && ([t,o] = function(e) {
                var r = {}
                  , t = {}
                  , o = function() {
                    var o = e[n]
                      , [a,i] = Pt(o);
                    r[n] = a,
                    Object.keys(i).forEach((e=>{
                        t[e] = (t[e] || []).concat(i[e])
                    }
                    ))
                };
                for (var n in e)
                    o();
                return [r, t]
            }(e));
            var u = "ltr" === s
              , c = u ? l.id : l.id + "r";
            return u ? null === n && (n = q(t, s)) : null === a && (a = q(t, s)),
            void 0 === r[c] && (l.insertCSSRules(o),
            r[c] = !0),
            u ? n : a
        }
    }
    function Bt(e) {
        var r = _t(e);
        return function() {
            var e = Se()
              , t = je();
            return r({
                dir: e,
                renderer: t
            })
        }
    }
    var Tt = ["Top", "Right", "Bottom", "Left"];
    function qt(e, r) {
        for (var t = arguments.length, o = new Array(t > 2 ? t - 2 : 0), n = 2; n < t; n++)
            o[n - 2] = arguments[n];
        for (var [a,i=a,s=a,l=i] = o, u = [a, i, s, l], c = {}, f = 0; f < u.length; f += 1) {
            if (u[f] || 0 === u[f])
                c[e + Tt[f] + r] = u[f]
        }
        return c
    }
    function Ct() {
        for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
            r[t] = arguments[t];
        return qt("border", "Width", ...r)
    }
    function Rt() {
        for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
            r[t] = arguments[t];
        return qt("border", "Style", ...r)
    }
    function Dt() {
        for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
            r[t] = arguments[t];
        return qt("border", "Color", ...r)
    }
    function Nt(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function Et(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Nt(Object(t), !0).forEach((function(r) {
                At(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Nt(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function At(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    function Mt(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function It(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Mt(Object(t), !0).forEach((function(r) {
                Ft(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Mt(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Ft(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    function Ht(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function Lt(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Ht(Object(t), !0).forEach((function(r) {
                Wt(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Ht(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Wt(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    function Xt(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function $t(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Xt(Object(t), !0).forEach((function(r) {
                Vt(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Xt(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Vt(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    function Gt(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function Ut(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Gt(Object(t), !0).forEach((function(r) {
                Kt(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Gt(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Kt(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var Yt = e=>"number" == typeof e && !Number.isNaN(e)
      , Qt = e=>"auto" === e
      , Zt = ["content", "fit-content", "max-content", "min-content"]
      , Jt = e=>Zt.some((r=>e === r)) || (e=>"string" == typeof e && /(\d+(\w+|%))/.test(e))(e);
    var eo = /var\(.*\)/gi;
    var ro = /^[a-zA-Z0-9\-_\\#;]+$/
      , to = /^-moz-initial$|^auto$|^initial$|^inherit$|^revert$|^unset$|^span \d+$|\d.*/;
    function oo(e) {
        return void 0 !== e && "string" == typeof e && ro.test(e) && !to.test(e)
    }
    function no(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function ao(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? no(Object(t), !0).forEach((function(r) {
                io(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : no(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function io(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var so = ["-moz-initial", "inherit", "initial", "revert", "unset"];
    var lo, uo = {
        border: function() {
            return Et(Et(Et({}, Ct(arguments.length <= 0 ? void 0 : arguments[0])), (arguments.length <= 1 ? void 0 : arguments[1]) && Rt(arguments.length <= 1 ? void 0 : arguments[1])), (arguments.length <= 2 ? void 0 : arguments[2]) && Dt(arguments.length <= 2 ? void 0 : arguments[2]))
        },
        borderLeft: function() {
            return It(It({
                borderLeftWidth: arguments.length <= 0 ? void 0 : arguments[0]
            }, (arguments.length <= 1 ? void 0 : arguments[1]) && {
                borderLeftStyle: arguments.length <= 1 ? void 0 : arguments[1]
            }), (arguments.length <= 2 ? void 0 : arguments[2]) && {
                borderLeftColor: arguments.length <= 2 ? void 0 : arguments[2]
            })
        },
        borderBottom: function() {
            return Lt(Lt({
                borderBottomWidth: arguments.length <= 0 ? void 0 : arguments[0]
            }, (arguments.length <= 1 ? void 0 : arguments[1]) && {
                borderBottomStyle: arguments.length <= 1 ? void 0 : arguments[1]
            }), (arguments.length <= 2 ? void 0 : arguments[2]) && {
                borderBottomColor: arguments.length <= 2 ? void 0 : arguments[2]
            })
        },
        borderRight: function() {
            return $t($t({
                borderRightWidth: arguments.length <= 0 ? void 0 : arguments[0]
            }, (arguments.length <= 1 ? void 0 : arguments[1]) && {
                borderRightStyle: arguments.length <= 1 ? void 0 : arguments[1]
            }), (arguments.length <= 2 ? void 0 : arguments[2]) && {
                borderRightColor: arguments.length <= 2 ? void 0 : arguments[2]
            })
        },
        borderTop: function() {
            return Ut(Ut({
                borderTopWidth: arguments.length <= 0 ? void 0 : arguments[0]
            }, (arguments.length <= 1 ? void 0 : arguments[1]) && {
                borderTopStyle: arguments.length <= 1 ? void 0 : arguments[1]
            }), (arguments.length <= 2 ? void 0 : arguments[2]) && {
                borderTopColor: arguments.length <= 2 ? void 0 : arguments[2]
            })
        },
        borderColor: Dt,
        borderStyle: Rt,
        borderRadius: function(e) {
            var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e;
            return {
                borderBottomRightRadius: arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : e,
                borderBottomLeftRadius: arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : r,
                borderTopRightRadius: r,
                borderTopLeftRadius: e
            }
        },
        borderWidth: Ct,
        flex: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            var o = 1 === r.length
              , n = 2 === r.length
              , a = 3 === r.length;
            if (o) {
                var [i] = r;
                if ("initial" === i)
                    return {
                        flexGrow: 0,
                        flexShrink: 1,
                        flexBasis: "auto"
                    };
                if (Qt(i))
                    return {
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: "auto"
                    };
                if ((e=>"none" === e)(i))
                    return {
                        flexGrow: 0,
                        flexShrink: 0,
                        flexBasis: "auto"
                    };
                if (Yt(i))
                    return {
                        flexGrow: i,
                        flexShrink: 1,
                        flexBasis: 0
                    };
                if (Jt(i))
                    return {
                        flexGrow: 1,
                        flexShrink: 1,
                        flexBasis: i
                    }
            }
            if (n) {
                var [s,l] = r;
                if (Yt(l))
                    return {
                        flexGrow: s,
                        flexShrink: l,
                        flexBasis: 0
                    };
                if (Jt(l))
                    return {
                        flexGrow: s,
                        flexShrink: 1,
                        flexBasis: l
                    }
            }
            if (a) {
                var [u,c,f] = r;
                if (Yt(u) && Yt(c) && (Qt(f) || Jt(f)))
                    return {
                        flexGrow: u,
                        flexShrink: c,
                        flexBasis: f
                    }
            }
            return {}
        },
        gap: function(e) {
            return {
                columnGap: e,
                rowGap: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e
            }
        },
        gridArea: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            if (r.some((e=>!function(e) {
                return void 0 === e || "number" == typeof e || "string" == typeof e && !eo.test(e)
            }(e))))
                return {};
            var o = void 0 !== r[0] ? r[0] : "auto"
              , n = void 0 !== r[1] ? r[1] : oo(o) ? o : "auto";
            return {
                gridRowStart: o,
                gridColumnStart: n,
                gridRowEnd: void 0 !== r[2] ? r[2] : oo(o) ? o : "auto",
                gridColumnEnd: void 0 !== r[3] ? r[3] : oo(n) ? n : "auto"
            }
        },
        margin: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            return qt("margin", "", ...r)
        },
        padding: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            return qt("padding", "", ...r)
        },
        overflow: function(e) {
            return {
                overflowX: e,
                overflowY: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e
            }
        },
        inset: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            var [o,n=o,a=o,i=n] = r;
            return {
                top: o,
                right: n,
                bottom: a,
                left: i
            }
        },
        outline: function(e, r, t) {
            return ao(ao({
                outlineWidth: e
            }, r && {
                outlineStyle: r
            }), t && {
                outlineColor: t
            })
        },
        transition: function() {
            for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++)
                r[t] = arguments[t];
            return function(e) {
                return 1 === e.length && so.includes(e[0])
            }(r) ? {
                transitionDelay: r[0],
                transitionDuration: r[0],
                transitionProperty: r[0],
                transitionTimingFunction: r[0]
            } : function(e) {
                if (1 === e.length && Array.isArray(e[0]))
                    return e[0];
                return [e]
            }(r).reduce(((e,r,t)=>{
                var [o,n="0s",a="0s",i="ease"] = r;
                return 0 === t ? (e.transitionProperty = o,
                e.transitionDuration = n,
                e.transitionDelay = a,
                e.transitionTimingFunction = i) : (e.transitionProperty += ", ".concat(o),
                e.transitionDuration += ", ".concat(n),
                e.transitionDelay += ", ".concat(a),
                e.transitionTimingFunction += ", ".concat(i)),
                e
            }
            ), {})
        }
    }, co = "var(--colorTransparentBackground)", fo = "var(--colorTransparentStrokeInteractive)", po = "var(--colorStrokeFocus2)", bo = "var(--borderRadiusNone)", vo = "var(--borderRadiusMedium)", ho = "var(--strokeWidthThick)", go = function() {
        return go = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        go.apply(this, arguments)
    }, mo = Bt({
        root: {
            ":focus-within": {
                position: "relative",
                zIndex: 1
            }
        }
    }), yo = (Bt({
        bookend: go({}, uo.border(ho)),
        bookendEnd: {
            borderBottomLeftRadius: bo,
            borderTopLeftRadius: bo
        },
        bookendStart: {
            borderBottomRightRadius: bo,
            borderTopRightRadius: bo
        }
    }),
    (0,
    t.createContext)(void 0)), wo = (0,
    t.memo)((function(e) {
        var r = e.position
          , o = e.children
          , n = mo().root;
        return t.createElement("div", {
            role: "presentation",
            className: R("pa-bookend", n)
        }, t.createElement(yo.Provider, {
            value: r
        }, o))
    }
    )), ko = function() {
        return ko = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        ko.apply(this, arguments)
    }, jo = Bt({
        container: {
            display: "flex",
            width: "100%",
            height: "100%"
        },
        component: {
            width: "100%",
            height: "100%"
        },
        componentBookendEnd: {
            ":not(:focus-within[data-keyboard-nav])": {
                borderBottomRightRadius: bo,
                borderTopRightRadius: bo
            },
            "::after": {
                borderBottomRightRadius: bo
            }
        },
        componentBookendStart: {
            ":not(:focus-within[data-keyboard-nav])": {
                borderBottomLeftRadius: bo,
                borderTopLeftRadius: bo
            },
            "::after": {
                borderBottomLeftRadius: bo
            }
        },
        componentRoot: {
            width: "100%",
            boxShadow: "none"
        },
        componentRootReadOnly: {
            backgroundColor: co,
            "::after": {
                content: ""
            },
            ":focus-within[data-keyboard-nav]": ko({}, uo.outline(ho, "solid", po))
        },
        componentInput: (lo = {
            height: "100%",
            textOverflow: "ellipsis",
            width: "100%"
        },
        lo["[readonly]"] = {
            "::placeholder": {
                visibility: "hidden"
            }
        },
        lo)
    }), xo = function() {
        return xo = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        xo.apply(this, arguments)
    }, So = function(e, r) {
        var t = {};
        for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) && r.indexOf(o) < 0 && (t[o] = e[o]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
            var n = 0;
            for (o = Object.getOwnPropertySymbols(e); n < o.length; n++)
                r.indexOf(o[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[n]) && (t[o[n]] = e[o[n]])
        }
        return t
    }, Oo = (0,
    t.forwardRef)((function(e, r) {
        var o = e
          , n = o.bookendEnd
          , a = o.bookendStart
          , i = o.className
          , s = o.onChange
          , l = o.onFocus
          , u = o.readOnly
          , c = o.selectValueOnFocus
          , f = o.value
          , d = o.valueUpdated
          , p = So(o, ["bookendEnd", "bookendStart", "className", "onChange", "onFocus", "readOnly", "selectValueOnFocus", "value", "valueUpdated"])
          , b = (0,
        t.useRef)(null);
        (0,
        t.useImperativeHandle)(r, (function() {
            return b.current
        }
        ));
        var h = v()
          , g = (0,
        t.useState)(f || "")
          , m = g[0]
          , y = g[1];
        (0,
        t.useEffect)((function() {
            d && y(f)
        }
        ), [f, d, y]);
        var w = (0,
        t.useCallback)((function(e, r) {
            y(r.value || ""),
            null == s || s(e, r)
        }
        ), [])
          , k = (0,
        t.useCallback)((function(e) {
            c && e.target.select(),
            null == l || l(e)
        }
        ), [c, l])
          , j = jo()
          , x = j.component
          , S = j.componentBookendEnd
          , O = j.componentBookendStart
          , z = j.componentInput
          , P = j.componentRoot
          , _ = j.componentRootReadOnly
          , B = j.container;
        return t.createElement("div", {
            className: R("pa-input-component-root", B),
            role: "presentation"
        }, !!a && m && t.createElement(wo, {
            position: "start"
        }, a), t.createElement(He, xo({}, p, {
            appearance: "filled-darker",
            className: R(x, !!a && m && O, !!n && m && S, i),
            input: {
                className: z
            },
            onChange: w,
            onFocus: k,
            ref: b,
            readOnly: u,
            value: m,
            root: {
                ref: h,
                className: R(P, !!u && _)
            }
        })), !!n && m && t.createElement(wo, {
            position: "end"
        }, n))
    }
    )), zo = (0,
    t.memo)(Oo);
    function Po(e, r) {
        var t = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter((function(r) {
                return Object.getOwnPropertyDescriptor(e, r).enumerable
            }
            ))),
            t.push.apply(t, o)
        }
        return t
    }
    function _o(e) {
        for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? Po(Object(t), !0).forEach((function(r) {
                Bo(e, r, t[r])
            }
            )) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Po(Object(t)).forEach((function(r) {
                Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r))
            }
            ))
        }
        return e
    }
    function Bo(e, r, t) {
        return (r = function(e) {
            var r = function(e, r) {
                if ("object" != typeof e || null === e)
                    return e;
                var t = e[Symbol.toPrimitive];
                if (void 0 !== t) {
                    var o = t.call(e, r || "default");
                    if ("object" != typeof o)
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === r ? String : Number)(e)
            }(e, "string");
            return "symbol" == typeof r ? r : String(r)
        }(r))in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[r] = t,
        e
    }
    var To = "fui-Textarea"
      , qo = "fui-Textarea__textarea"
      , Co = ze({
        base: {
            mc9l5x: "ftuwxu6",
            B7ck84d: "f1ewtqcl",
            qhf8xq: "f10pi13n",
            z8tnut: "f1g0x7ka",
            z189sj: ["fhxju0i", "f1cnd47f"],
            Byoj8tv: "f1ean75l",
            uwmqm3: ["f1cnd47f", "fhxju0i"],
            B6of3ja: "f1hu3pq6",
            t21cq0: ["f11qmguv", "f1tyq0we"],
            jrapky: "f19f4twv",
            Frg6f3: ["f1tyq0we", "f11qmguv"],
            Bbmb7ep: ["f1aa9q02", "f16jpd5f"],
            Beyfa6y: ["f16jpd5f", "f1aa9q02"],
            B7oj6ja: ["f1jar5jt", "fyu767a"],
            Btl43ni: ["fyu767a", "f1jar5jt"]
        },
        disabled: {
            De3pzq: "f1c21dwh",
            B4j52fo: "f192inf7",
            Bekrc4i: ["f5tn483", "f1ojsxk5"],
            Bn0qgzm: "f1vxd6vx",
            ibv6hh: ["f1ojsxk5", "f5tn483"],
            icvyot: "fzkkow9",
            vrafjx: ["fcdblym", "fjik90z"],
            oivjwe: "fg706s2",
            wvpqe5: ["fjik90z", "fcdblym"],
            g2u3we: "f1jj8ep1",
            h3c5rm: ["f15xbau", "fy0fskl"],
            B9xav0g: "f4ikngz",
            zhjwy3: ["fy0fskl", "f15xbau"],
            luzg7z: "f156r3ny",
            B1sv8sq: "f1tglsy2",
            Bjwas2f: "fg455y9",
            Bn1d65q: ["f1rvyvqg", "f14g86mu"],
            Bxeuatn: "f1cwzwz",
            n51gp8: ["f14g86mu", "f1rvyvqg"]
        },
        interactive: {
            li1rpt: "f1gw3sf2",
            Bsft5z2: "f13zj6fq",
            E3zdtr: "f1mdlcz9",
            Eqx8gd: ["f1a7op3", "f1cjjd47"],
            By385i5: "f1gboi2j",
            B1piin3: ["f1cjjd47", "f1a7op3"],
            Dlnsje: "ffyw7fx",
            d9w3h3: ["f1kp91vd", "f1ibwz09"],
            B3778ie: ["f1ibwz09", "f1kp91vd"],
            Bcgy8vk: "f14pi962",
            Bw17bha: "f1lh990p",
            B1q35kw: "f1jc6hxc",
            Gjdm7m: "fj2g8qd",
            b1kco5: "f1yk9hq",
            Ba2ppi3: "fhwpy7i",
            F2fol1: "f14ee0xe",
            lck23g: "f1xhbsuh",
            df92cz: "fv8e3ye",
            I188md: "ftb5wc6",
            umuwi5: "fjw5xc1",
            Blcqepd: "f1xdyd5c",
            nplu4u: "fatpbeo",
            Bioka5o: "fb7uyps",
            H713fs: "f1cmft4k",
            B9ooomg: "f1x58t8o",
            Bercvud: "f1ibeo51",
            Bbr2w1p: "f1vnc8sk",
            Bduesf4: "f3e99gv",
            Bpq79vn: "fhljsf7"
        },
        filled: {
            B4j52fo: "f192inf7",
            Bekrc4i: ["f5tn483", "f1ojsxk5"],
            Bn0qgzm: "f1vxd6vx",
            ibv6hh: ["f1ojsxk5", "f5tn483"],
            icvyot: "fzkkow9",
            vrafjx: ["fcdblym", "fjik90z"],
            oivjwe: "fg706s2",
            wvpqe5: ["fjik90z", "fcdblym"],
            g2u3we: "fghlq4f",
            h3c5rm: ["f1gn591s", "fjscplz"],
            B9xav0g: "fb073pr",
            zhjwy3: ["fjscplz", "f1gn591s"],
            q7v0qe: "ftmjh5b",
            kmh5ft: ["f17blpuu", "fsrcdbj"],
            nagaa4: "f1tpwn32",
            B1yhkcb: ["fsrcdbj", "f17blpuu"]
        },
        "filled-darker": {
            De3pzq: "f16xq7d1"
        },
        "filled-lighter": {
            De3pzq: "fxugw4r"
        },
        "filled-darker-shadow": {
            De3pzq: "f16xq7d1",
            B4j52fo: "f192inf7",
            Bekrc4i: ["f5tn483", "f1ojsxk5"],
            Bn0qgzm: "f1vxd6vx",
            ibv6hh: ["f1ojsxk5", "f5tn483"],
            icvyot: "fzkkow9",
            vrafjx: ["fcdblym", "fjik90z"],
            oivjwe: "fg706s2",
            wvpqe5: ["fjik90z", "fcdblym"],
            g2u3we: "f1bh3yvw",
            h3c5rm: ["fmi79ni", "f11fozsx"],
            B9xav0g: "fnzw4c6",
            zhjwy3: ["f11fozsx", "fmi79ni"],
            E5pizo: "fyed02w"
        },
        "filled-lighter-shadow": {
            De3pzq: "fxugw4r",
            B4j52fo: "f192inf7",
            Bekrc4i: ["f5tn483", "f1ojsxk5"],
            Bn0qgzm: "f1vxd6vx",
            ibv6hh: ["f1ojsxk5", "f5tn483"],
            icvyot: "fzkkow9",
            vrafjx: ["fcdblym", "fjik90z"],
            oivjwe: "fg706s2",
            wvpqe5: ["fjik90z", "fcdblym"],
            g2u3we: "f1bh3yvw",
            h3c5rm: ["fmi79ni", "f11fozsx"],
            B9xav0g: "fnzw4c6",
            zhjwy3: ["f11fozsx", "fmi79ni"],
            E5pizo: "fyed02w"
        },
        outline: {
            De3pzq: "fxugw4r",
            B4j52fo: "f192inf7",
            Bekrc4i: ["f5tn483", "f1ojsxk5"],
            Bn0qgzm: "f1vxd6vx",
            ibv6hh: ["f1ojsxk5", "f5tn483"],
            icvyot: "fzkkow9",
            vrafjx: ["fcdblym", "fjik90z"],
            oivjwe: "fg706s2",
            wvpqe5: ["fjik90z", "fcdblym"],
            g2u3we: "fj3muxo",
            h3c5rm: ["f1akhkt", "f1lxtadh"],
            B9xav0g: "f1c1zstj",
            zhjwy3: ["f1lxtadh", "f1akhkt"]
        },
        outlineInteractive: {
            ckks6v: "f7ic3uo",
            B2zwrfe: ["f1omjgsz", "f1snvl17"],
            xv9156: "fn6xmsl",
            dt87k2: ["f1snvl17", "f1omjgsz"],
            Bf40cpq: "f1sn8sm0",
            Bop6t4b: ["f1wovo5e", "f716mnf"],
            gvrnp0: "fm0h710",
            Beu9t3s: ["f716mnf", "f1wovo5e"],
            Bgoe8wy: "fvcxoqz",
            Bwzppfd: ["f1ub3y4t", "f1m52nbi"],
            oetu4i: "f1l4zc64",
            gg5e9n: ["f1m52nbi", "f1ub3y4t"],
            uqwnxt: "fk7lb2a",
            Bvecx4l: ["f1knhbbd", "f17itt0b"],
            Bs0cc2w: "f15pjvi3",
            e1hlit: ["f17itt0b", "f1knhbbd"],
            e2sjt0: "f6ginmj",
            Bbcopvn: ["f1grcyuh", "fgzu20w"],
            Bj33j0h: "fk1xjsr",
            f7epvg: ["fgzu20w", "f1grcyuh"],
            B6oc9vd: "fvs00aa",
            ak43y8: ["f1assf6x", "f4ruux4"],
            wmxk5l: "f1z0osm6",
            B50zh58: ["f4ruux4", "f1assf6x"],
            Bbs6y8j: "fu7v4fk",
            rexu52: ["f1fnaxjy", "fwory1w"],
            B7pmvfx: "f7hodha",
            Belqbek: ["fwory1w", "f1fnaxjy"],
            Bawrxx6: "f8jkv7v",
            r7b1zc: ["f1f3jaeo", "fh8au0q"],
            Bt3ojkv: "f19usxel",
            t1ykpo: ["fh8au0q", "f1f3jaeo"],
            Bvq3b66: "f12oevn0",
            Brahy3i: ["fvdgz8d", "f1cq0lt5"],
            zoxjo1: "f1so894s",
            an54nd: ["f1cq0lt5", "fvdgz8d"]
        },
        invalid: {
            tvckwq: "fs4k3qj",
            gk2u95: ["fcee079", "fmyw78r"],
            hhx65j: "f1fgmyf4",
            Bxowmz0: ["fmyw78r", "fcee079"]
        }
    }, {
        d: [".ftuwxu6{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;}", ".f1ewtqcl{box-sizing:border-box;}", ".f10pi13n{position:relative;}", ".f1g0x7ka{padding-top:0;}", ".fhxju0i{padding-right:0;}", ".f1cnd47f{padding-left:0;}", ".f1ean75l{padding-bottom:var(--strokeWidthThick);}", ".f1hu3pq6{margin-top:0;}", ".f11qmguv{margin-right:0;}", ".f1tyq0we{margin-left:0;}", ".f19f4twv{margin-bottom:0;}", ".f1aa9q02{border-bottom-right-radius:var(--borderRadiusMedium);}", ".f16jpd5f{border-bottom-left-radius:var(--borderRadiusMedium);}", ".f1jar5jt{border-top-right-radius:var(--borderRadiusMedium);}", ".fyu767a{border-top-left-radius:var(--borderRadiusMedium);}", ".f1c21dwh{background-color:var(--colorTransparentBackground);}", ".f192inf7{border-top-width:var(--strokeWidthThin);}", ".f5tn483{border-right-width:var(--strokeWidthThin);}", ".f1ojsxk5{border-left-width:var(--strokeWidthThin);}", ".f1vxd6vx{border-bottom-width:var(--strokeWidthThin);}", ".fzkkow9{border-top-style:solid;}", ".fcdblym{border-right-style:solid;}", ".fjik90z{border-left-style:solid;}", ".fg706s2{border-bottom-style:solid;}", ".f1jj8ep1{border-top-color:var(--colorNeutralStrokeDisabled);}", ".f15xbau{border-right-color:var(--colorNeutralStrokeDisabled);}", ".fy0fskl{border-left-color:var(--colorNeutralStrokeDisabled);}", ".f4ikngz{border-bottom-color:var(--colorNeutralStrokeDisabled);}", ".f156r3ny>textarea{cursor:not-allowed;}", ".f1tglsy2>textarea::-webkit-input-placeholder{color:var(--colorNeutralForegroundDisabled);}", ".f1tglsy2>textarea::-moz-placeholder{color:var(--colorNeutralForegroundDisabled);}", ".f1gw3sf2::after{box-sizing:border-box;}", '.f13zj6fq::after{content:"";}', ".f1mdlcz9::after{position:absolute;}", ".f1a7op3::after{left:-1px;}", ".f1cjjd47::after{right:-1px;}", ".f1gboi2j::after{bottom:-1px;}", ".ffyw7fx::after{height:max(var(--strokeWidthThick), var(--borderRadiusMedium));}", ".f1kp91vd::after{border-bottom-left-radius:var(--borderRadiusMedium);}", ".f1ibwz09::after{border-bottom-right-radius:var(--borderRadiusMedium);}", ".f14pi962::after{border-bottom-width:var(--strokeWidthThick);}", ".f1lh990p::after{border-bottom-style:solid;}", ".f1jc6hxc::after{border-bottom-color:var(--colorCompoundBrandStroke);}", ".fj2g8qd::after{-webkit-clip-path:inset(calc(100% - var(--strokeWidthThick)) 0 0 0);clip-path:inset(calc(100% - var(--strokeWidthThick)) 0 0 0);}", ".f1yk9hq::after{-webkit-transform:scaleX(0);-moz-transform:scaleX(0);-ms-transform:scaleX(0);transform:scaleX(0);}", ".fhwpy7i::after{transition-property:transform;}", ".f14ee0xe::after{transition-duration:var(--durationUltraFast);}", ".f1xhbsuh::after{transition-delay:var(--curveAccelerateMid);}", ".fghlq4f{border-top-color:var(--colorTransparentStroke);}", ".f1gn591s{border-right-color:var(--colorTransparentStroke);}", ".fjscplz{border-left-color:var(--colorTransparentStroke);}", ".fb073pr{border-bottom-color:var(--colorTransparentStroke);}", ".f16xq7d1{background-color:var(--colorNeutralBackground3);}", ".fxugw4r{background-color:var(--colorNeutralBackground1);}", ".f1bh3yvw{border-top-color:var(--colorTransparentStrokeInteractive);}", ".fmi79ni{border-right-color:var(--colorTransparentStrokeInteractive);}", ".f11fozsx{border-left-color:var(--colorTransparentStrokeInteractive);}", ".fnzw4c6{border-bottom-color:var(--colorTransparentStrokeInteractive);}", ".fyed02w{box-shadow:var(--shadow2);}", ".fj3muxo{border-top-color:var(--colorNeutralStroke1);}", ".f1akhkt{border-right-color:var(--colorNeutralStroke1);}", ".f1lxtadh{border-left-color:var(--colorNeutralStroke1);}", ".f1c1zstj{border-bottom-color:var(--colorNeutralStrokeAccessible);}", ".fs4k3qj:not(:focus-within),.fs4k3qj:hover:not(:focus-within){border-top-color:var(--colorPaletteRedBorder2);}", ".fcee079:not(:focus-within),.fcee079:hover:not(:focus-within){border-right-color:var(--colorPaletteRedBorder2);}", ".fmyw78r:not(:focus-within),.fmyw78r:hover:not(:focus-within){border-left-color:var(--colorPaletteRedBorder2);}", ".f1fgmyf4:not(:focus-within),.f1fgmyf4:hover:not(:focus-within){border-bottom-color:var(--colorPaletteRedBorder2);}"],
        m: [["@media (forced-colors: active){.fg455y9{border-top-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f1rvyvqg{border-right-color:GrayText;}.f14g86mu{border-left-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f1cwzwz{border-bottom-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media (forced-colors: active){.f14g86mu{border-left-color:GrayText;}.f1rvyvqg{border-right-color:GrayText;}}", {
            m: "(forced-colors: active)"
        }], ["@media screen and (prefers-reduced-motion: reduce){.fv8e3ye::after{transition-duration:0.01ms;}}", {
            m: "screen and (prefers-reduced-motion: reduce)"
        }], ["@media screen and (prefers-reduced-motion: reduce){.ftb5wc6::after{transition-delay:0.01ms;}}", {
            m: "screen and (prefers-reduced-motion: reduce)"
        }], ["@media screen and (prefers-reduced-motion: reduce){.f1cmft4k:focus-within::after{transition-duration:0.01ms;}}", {
            m: "screen and (prefers-reduced-motion: reduce)"
        }], ["@media screen and (prefers-reduced-motion: reduce){.f1x58t8o:focus-within::after{transition-delay:0.01ms;}}", {
            m: "screen and (prefers-reduced-motion: reduce)"
        }]],
        w: [".fjw5xc1:focus-within::after{-webkit-transform:scaleX(1);-moz-transform:scaleX(1);-ms-transform:scaleX(1);transform:scaleX(1);}", ".f1xdyd5c:focus-within::after{transition-property:transform;}", ".fatpbeo:focus-within::after{transition-duration:var(--durationNormal);}", ".fb7uyps:focus-within::after{transition-delay:var(--curveDecelerateMid);}", ".f1ibeo51:focus-within:active::after{border-bottom-color:var(--colorCompoundBrandStrokePressed);}", ".f1vnc8sk:focus-within{outline-width:var(--strokeWidthThick);}", ".f3e99gv:focus-within{outline-style:solid;}", ".fhljsf7:focus-within{outline-color:transparent;}", ".fu7v4fk:focus-within{border-top-width:var(--strokeWidthThin);}", ".f1fnaxjy:focus-within{border-right-width:var(--strokeWidthThin);}", ".fwory1w:focus-within{border-left-width:var(--strokeWidthThin);}", ".f7hodha:focus-within{border-bottom-width:var(--strokeWidthThin);}", ".f8jkv7v:focus-within{border-top-style:solid;}", ".f1f3jaeo:focus-within{border-right-style:solid;}", ".fh8au0q:focus-within{border-left-style:solid;}", ".f19usxel:focus-within{border-bottom-style:solid;}", ".f12oevn0:focus-within{border-top-color:var(--colorNeutralStroke1);}", ".fvdgz8d:focus-within{border-right-color:var(--colorNeutralStroke1);}", ".f1cq0lt5:focus-within{border-left-color:var(--colorNeutralStroke1);}", ".f1so894s:focus-within{border-bottom-color:var(--colorCompoundBrandStroke);}"],
        h: [".ftmjh5b:hover,.ftmjh5b:focus-within{border-top-color:var(--colorTransparentStrokeInteractive);}", ".f17blpuu:hover,.f17blpuu:focus-within{border-right-color:var(--colorTransparentStrokeInteractive);}", ".fsrcdbj:hover,.fsrcdbj:focus-within{border-left-color:var(--colorTransparentStrokeInteractive);}", ".f1tpwn32:hover,.f1tpwn32:focus-within{border-bottom-color:var(--colorTransparentStrokeInteractive);}", ".f7ic3uo:hover{border-top-width:var(--strokeWidthThin);}", ".f1omjgsz:hover{border-right-width:var(--strokeWidthThin);}", ".f1snvl17:hover{border-left-width:var(--strokeWidthThin);}", ".fn6xmsl:hover{border-bottom-width:var(--strokeWidthThin);}", ".f1sn8sm0:hover{border-top-style:solid;}", ".f1wovo5e:hover{border-right-style:solid;}", ".f716mnf:hover{border-left-style:solid;}", ".fm0h710:hover{border-bottom-style:solid;}", ".fvcxoqz:hover{border-top-color:var(--colorNeutralStroke1Hover);}", ".f1ub3y4t:hover{border-right-color:var(--colorNeutralStroke1Hover);}", ".f1m52nbi:hover{border-left-color:var(--colorNeutralStroke1Hover);}", ".f1l4zc64:hover{border-bottom-color:var(--colorNeutralStrokeAccessibleHover);}"],
        a: [".fk7lb2a:active{border-top-width:var(--strokeWidthThin);}", ".f1knhbbd:active{border-right-width:var(--strokeWidthThin);}", ".f17itt0b:active{border-left-width:var(--strokeWidthThin);}", ".f15pjvi3:active{border-bottom-width:var(--strokeWidthThin);}", ".f6ginmj:active{border-top-style:solid;}", ".f1grcyuh:active{border-right-style:solid;}", ".fgzu20w:active{border-left-style:solid;}", ".fk1xjsr:active{border-bottom-style:solid;}", ".fvs00aa:active{border-top-color:var(--colorNeutralStroke1Pressed);}", ".f1assf6x:active{border-right-color:var(--colorNeutralStroke1Pressed);}", ".f4ruux4:active{border-left-color:var(--colorNeutralStroke1Pressed);}", ".f1z0osm6:active{border-bottom-color:var(--colorNeutralStrokeAccessiblePressed);}"]
    })
      , Ro = ze({
        base: {
            icvyot: "f1ern45e",
            vrafjx: ["f1n71otn", "f1deefiw"],
            oivjwe: "f1h8hb77",
            wvpqe5: ["f1deefiw", "f1n71otn"],
            B6of3ja: "f1hu3pq6",
            t21cq0: ["f11qmguv", "f1tyq0we"],
            jrapky: "f19f4twv",
            Frg6f3: ["f1tyq0we", "f11qmguv"],
            De3pzq: "f3rmtva",
            B7ck84d: "f1ewtqcl",
            sj55zd: "f19n0e5",
            Bh6795r: "fqerorx",
            Bahqtrf: "fk6fouc",
            Bqenvij: "f1l02sjl",
            Bxyxcbc: "f1immsc2",
            yvdlaj: "fwyc1cq",
            B3o7kgh: "f13ta7ih",
            B4brmom: "f1vw9udw",
            Brrnbx2: "fbb3kq8",
            oeaueh: "f1s6fcnf"
        },
        small: {
            Bqenvij: "frvgh55",
            sshi5w: "f1w5jphr",
            z8tnut: "f1ywm7hm",
            z189sj: ["fqznh8f", "f1xile11"],
            Byoj8tv: "f14wxoun",
            uwmqm3: ["f1xile11", "fqznh8f"],
            Bahqtrf: "fk6fouc",
            Be2twd7: "fy9rknc",
            Bhrd7zp: "figsok6",
            Bg96gwp: "fwrc4pm"
        },
        medium: {
            Bqenvij: "f1d2rq10",
            sshi5w: "fvmd9f",
            z8tnut: "fp2oml8",
            z189sj: ["f135dnwl", "f1e60jzv"],
            Byoj8tv: "f1tdddsa",
            uwmqm3: ["f1e60jzv", "f135dnwl"],
            Bahqtrf: "fk6fouc",
            Be2twd7: "fkhj508",
            Bhrd7zp: "figsok6",
            Bg96gwp: "f1i3iumi"
        },
        large: {
            Bqenvij: "fbhnoac",
            sshi5w: "f1kfson",
            z8tnut: "f1kwiid1",
            z189sj: ["fcgl2c4", "f1anj20m"],
            Byoj8tv: "f5b47ha",
            uwmqm3: ["f1anj20m", "fcgl2c4"],
            Bahqtrf: "fk6fouc",
            Be2twd7: "fod5ikn",
            Bhrd7zp: "figsok6",
            Bg96gwp: "faaz57k"
        }
    }, {
        d: [".f1ern45e{border-top-style:none;}", ".f1n71otn{border-right-style:none;}", ".f1deefiw{border-left-style:none;}", ".f1h8hb77{border-bottom-style:none;}", ".f1hu3pq6{margin-top:0;}", ".f11qmguv{margin-right:0;}", ".f1tyq0we{margin-left:0;}", ".f19f4twv{margin-bottom:0;}", ".f3rmtva{background-color:transparent;}", ".f1ewtqcl{box-sizing:border-box;}", ".f19n0e5{color:var(--colorNeutralForeground1);}", ".fqerorx{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;}", ".fk6fouc{font-family:var(--fontFamilyBase);}", ".f1l02sjl{height:100%;}", ".f1immsc2{max-height:100%;}", ".fwyc1cq::-webkit-input-placeholder{color:var(--colorNeutralForeground4);}", ".fwyc1cq::-moz-placeholder{color:var(--colorNeutralForeground4);}", ".f13ta7ih::-webkit-input-placeholder{opacity:1;}", ".f13ta7ih::-moz-placeholder{opacity:1;}", ".f1vw9udw::selection{color:var(--colorNeutralForegroundInverted);}", ".fbb3kq8::selection{background-color:var(--colorNeutralBackgroundInverted);}", ".f1s6fcnf{outline-style:none;}", ".frvgh55{height:24px;}", ".f1w5jphr{min-height:40px;}", ".f1ywm7hm{padding-top:var(--spacingVerticalXS);}", ".fqznh8f{padding-right:calc(var(--spacingHorizontalSNudge) + var(--spacingHorizontalXXS));}", ".f1xile11{padding-left:calc(var(--spacingHorizontalSNudge) + var(--spacingHorizontalXXS));}", ".f14wxoun{padding-bottom:var(--spacingVerticalXS);}", ".fy9rknc{font-size:var(--fontSizeBase200);}", ".figsok6{font-weight:var(--fontWeightRegular);}", ".fwrc4pm{line-height:var(--lineHeightBase200);}", ".f1d2rq10{height:32px;}", ".fvmd9f{min-height:52px;}", ".fp2oml8{padding-top:var(--spacingVerticalSNudge);}", ".f135dnwl{padding-right:calc(var(--spacingHorizontalMNudge) + var(--spacingHorizontalXXS));}", ".f1e60jzv{padding-left:calc(var(--spacingHorizontalMNudge) + var(--spacingHorizontalXXS));}", ".f1tdddsa{padding-bottom:var(--spacingVerticalSNudge);}", ".fkhj508{font-size:var(--fontSizeBase300);}", ".f1i3iumi{line-height:var(--lineHeightBase300);}", ".fbhnoac{height:40px;}", ".f1kfson{min-height:64px;}", ".f1kwiid1{padding-top:var(--spacingVerticalS);}", ".fcgl2c4{padding-right:calc(var(--spacingHorizontalM) + var(--spacingHorizontalXXS));}", ".f1anj20m{padding-left:calc(var(--spacingHorizontalM) + var(--spacingHorizontalXXS));}", ".f5b47ha{padding-bottom:var(--spacingVerticalS);}", ".fod5ikn{font-size:var(--fontSizeBase400);}", ".faaz57k{line-height:var(--lineHeightBase400);}"]
    })
      , Do = ze({
        none: {
            B3rzk8w: "f1o1s39h"
        },
        both: {
            B3rzk8w: "f1pxm0xe"
        },
        horizontal: {
            B3rzk8w: "fq6nmtn"
        },
        vertical: {
            B3rzk8w: "f1f5ktr4"
        }
    }, {
        d: [".f1o1s39h{resize:none;}", ".f1pxm0xe{resize:both;}", ".fq6nmtn{resize:horizontal;}", ".f1f5ktr4{resize:vertical;}"]
    })
      , No = t.forwardRef(((e,r)=>{
        var o = ((e,r)=>{
            var t, o = ne(), {size: n="medium", appearance: a=(null !== (t = o.inputDefaultAppearance) && void 0 !== t ? t : "outline"), resize: i="none", onChange: s} = e, [l,u] = D({
                state: e.value,
                defaultState: e.defaultValue,
                initialState: void 0
            }), c = K({
                props: e,
                primarySlotTagName: "textarea",
                excludedPropNames: ["onChange", "value", "defaultValue"]
            }), f = {
                size: n,
                appearance: a,
                resize: i,
                components: {
                    root: "span",
                    textarea: "textarea"
                },
                textarea: J(e.textarea, {
                    required: !0,
                    defaultProps: _o({
                        ref: r
                    }, c.primary)
                }),
                root: J(e.root, {
                    required: !0,
                    defaultProps: c.root
                })
            };
            return f.textarea.value = l,
            f.textarea.onChange = te((e=>{
                var r = e.target.value;
                null == s || s(e, {
                    value: r
                }),
                u(r)
            }
            )),
            f
        }
        )(e, r);
        (e=>{
            var {size: r, appearance: t, resize: o} = e
              , n = e.textarea.disabled
              , a = "true" === "".concat(e.textarea["aria-invalid"])
              , i = t.startsWith("filled")
              , s = Co();
            e.root.className = R(To, s.base, s[t], i && s.filled, n && s.disabled, !n && s.interactive, !n && "outline" === t && s.outlineInteractive, !n && a && s.invalid, e.root.className);
            var l = Ro()
              , u = Do();
            e.textarea.className = R(qo, l.base, l[r], u[o], e.textarea.className)
        }
        )(o);
        var {useTextareaStyles_unstable: n} = Fe();
        return n(o),
        (e=>{
            var {slots: r, slotProps: o} = ce(e);
            return t.createElement(r.root, o.root, t.createElement(r.textarea, o.textarea))
        }
        )(o)
    }
    ));
    No.displayName = "Textarea";
    var Eo, Ao = function() {
        return Ao = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        Ao.apply(this, arguments)
    }, Mo = Bt({
        componentRoot: {
            width: "100%",
            height: "100%",
            boxShadow: "none",
            ":focus-within": {
                borderRightColor: fo,
                borderLeftColor: fo
            }
        },
        componentRootReadOnly: {
            backgroundColor: co,
            "::after": {
                content: ""
            },
            ":focus-within > [data-keyboard-nav]": Ao(Ao({}, uo.outline(ho, "solid", po)), uo.borderRadius(vo))
        },
        textarea: (Eo = {
            height: "auto"
        },
        Eo["[readonly]"] = {
            "::placeholder": {
                visibility: "hidden"
            }
        },
        Eo)
    }), Io = function() {
        return Io = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        Io.apply(this, arguments)
    }, Fo = function(e, r) {
        var t = {};
        for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) && r.indexOf(o) < 0 && (t[o] = e[o]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
            var n = 0;
            for (o = Object.getOwnPropertySymbols(e); n < o.length; n++)
                r.indexOf(o[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[n]) && (t[o[n]] = e[o[n]])
        }
        return t
    }, Ho = (0,
    t.forwardRef)((function(e, r) {
        var o = e.autoExpand
          , n = e.className
          , a = e.onBlur
          , i = e.onChange
          , s = e.onFocus
          , l = e.readOnly
          , u = e.rows
          , c = e.selectValueOnFocus
          , f = e.value
          , d = e.valueUpdated
          , p = Fo(e, ["autoExpand", "className", "onBlur", "onChange", "onFocus", "readOnly", "rows", "selectValueOnFocus", "value", "valueUpdated"])
          , b = (0,
        t.useRef)(null);
        (0,
        t.useImperativeHandle)(r, (function() {
            return b.current
        }
        ));
        var h = v()
          , g = function() {
            for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++)
                r[o] = arguments[o];
            var n = t.useCallback((e=>{
                for (var t of (n.current = e,
                r))
                    "function" == typeof t ? t(e) : t && (t.current = e)
            }
            ), [...r]);
            return n
        }(h, h)
          , m = (0,
        t.useState)(f || "")
          , y = m[0]
          , w = m[1]
          , k = (0,
        t.useState)(!1)
          , j = k[0]
          , x = k[1]
          , S = (0,
        t.useRef)(0);
        (0,
        t.useEffect)((function() {
            d && w(f),
            o && x(!0)
        }
        ), [f, d, o, w, x]);
        var O = (0,
        t.useCallback)((function(e, r) {
            w(r.value || ""),
            null == i || i(e, r)
        }
        ), [])
          , z = (0,
        t.useCallback)((function(e) {
            o && g.current && x(!0),
            null == a || a(e)
        }
        ), [o, g.current])
          , P = (0,
        t.useCallback)((function(e) {
            c && e.target.select(),
            null == s || s(e)
        }
        ), [c, s]);
        (0,
        t.useLayoutEffect)((function() {
            j && g.current && (S.current || (S.current = function(e) {
                var r = e.value;
                e.value = "";
                var t = e.clientHeight;
                return e.value = r,
                t
            }(g.current)),
            Wo(g.current, S.current),
            x(!1))
        }
        ), [g.current, u, j]);
        var _ = Mo()
          , B = _.componentRoot
          , T = _.componentRootReadOnly
          , q = _.textarea;
        return t.createElement(No, Io({}, p, {
            appearance: "filled-darker",
            className: R(B, !!l && T, n),
            onBlur: z,
            onChange: O,
            onFocus: P,
            ref: g,
            readOnly: l,
            rows: u,
            textarea: {
                className: R(q)
            },
            value: y
        }))
    }
    )), Lo = (0,
    t.memo)(Ho), Wo = function(e, r) {
        e.style.removeProperty("height"),
        e.style.setProperty("overflow-y", "hidden");
        var t = function(e) {
            return e.scrollHeight
        }(e);
        e.style.removeProperty("overflow-y"),
        t > r ? e.style.setProperty("height", "".concat(t, "px")) : e.getAttribute("style") || e.removeAttribute("style")
    }, Xo = Bt({
        sizingContainer: {
            bottom: 0,
            left: 0,
            overflowX: "hidden",
            overflowY: "hidden",
            position: "absolute",
            right: 0,
            top: 0
        }
    }), $o = function() {
        return $o = Object.assign || function(e) {
            for (var r, t = 1, o = arguments.length; t < o; t++)
                for (var n in r = arguments[t])
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
            return e
        }
        ,
        $o.apply(this, arguments)
    }, Vo = function(e, r) {
        var t = {};
        for (var o in e)
            Object.prototype.hasOwnProperty.call(e, o) && r.indexOf(o) < 0 && (t[o] = e[o]);
        if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
            var n = 0;
            for (o = Object.getOwnPropertySymbols(e); n < o.length; n++)
                r.indexOf(o[n]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[n]) && (t[o[n]] = e[o[n]])
        }
        return t
    }, Go = function(e) {
        var r = e.multiline
          , o = Vo(e, ["multiline"])
          , n = Xo().sizingContainer;
        return t.createElement("div", {
            className: n
        }, r ? t.createElement(Lo, $o({}, o)) : t.createElement(zo, $o({}, o)))
    }, Uo = (0,
    t.memo)(Go), Ko = function() {
        function e() {
            var r = this;
            this._debounceCallbackId = 0,
            this._debounceTime = e._DEFAULT_DEBOUNCE_TIME,
            this._delayOutput = !1,
            this._onChange = function(e, t) {
                t.value !== r._composingValue && (r._composingValue = t.value,
                r._delayOutput ? r._debouncedOutputChange() : r._notifyOutputChanged())
            }
        }
        return e.prototype.init = function(e, r) {
            this._notifyOutputChanged = r,
            this._composingValue = this._value = e.parameters.Value.raw
        }
        ,
        e.prototype.updateView = function(r) {
            var o = r.parameters
              , n = o.AccessibleLabel
              , a = o.DelayOutput
              , i = o.DelayOutputTime
              , s = o.Mode
              , l = o.Required
              , u = o.Value
              , c = r.mode
              , f = c.isControlDisabled
              , d = c.isRead;
            this._delayOutput = a.raw,
            this._debounceTime = null != i ? i : e._DEFAULT_DEBOUNCE_TIME,
            this._value = u.raw;
            var p = r.updatedProperties.includes("Value");
            return p && (this._composingValue = this._value),
            t.createElement(Uo, {
                "aria-label": n.raw,
                disabled: f,
                multiline: "Multiline" === s.raw,
                onChange: this._onChange,
                readOnly: d,
                required: l.raw,
                value: this._value || "",
                valueUpdated: p
            })
        }
        ,
        e.prototype.getOutputs = function() {
            return {
                Value: this._composingValue
            }
        }
        ,
        e.prototype.destroy = function() {
            clearTimeout(this._debounceCallbackId)
        }
        ,
        e.prototype._debouncedOutputChange = function() {
            var e = this;
            clearTimeout(this._debounceCallbackId),
            this._debounceCallbackId = window.setTimeout((function() {
                return e._notifyOutputChanged()
            }
            ), this._debounceTime)
        }
        ,
        e._DEFAULT_DEBOUNCE_TIME = 500,
        e
    }();
    pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = r
}();
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
    ComponentFramework.registerControl('PowerApps.CoreControls.TextInputCanvas', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.TextInputCanvas);
} else {
    var PowerApps = PowerApps || {};
    PowerApps.CoreControls = PowerApps.CoreControls || {};
    PowerApps.CoreControls.TextInputCanvas = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.TextInputCanvas;
    pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}
