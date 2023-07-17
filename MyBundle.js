/*! For license information please see bundle.js.LICENSE.txt */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
(()=>{
    var e = {
        355: function(e) {
            e.exports = function() {
                "use strict";
                var {entries: e, setPrototypeOf: t, isFrozen: n, getPrototypeOf: r, getOwnPropertyDescriptor: i} = Object
                  , {freeze: o, seal: a, create: s} = Object
                  , {apply: l, construct: c} = "undefined" != typeof Reflect && Reflect;
                l || (l = function(e, t, n) {
                    return e.apply(t, n)
                }
                ),
                o || (o = function(e) {
                    return e
                }
                ),
                a || (a = function(e) {
                    return e
                }
                ),
                c || (c = function(e, t) {
                    return new e(...t)
                }
                );
                var u, d = T(Array.prototype.forEach), f = T(Array.prototype.pop), p = T(Array.prototype.push), h = T(String.prototype.toLowerCase), m = T(String.prototype.toString), v = T(String.prototype.match), g = T(String.prototype.replace), b = T(String.prototype.indexOf), y = T(String.prototype.trim), w = T(RegExp.prototype.test), E = (u = TypeError,
                function() {
                    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
                        t[n] = arguments[n];
                    return c(u, t)
                }
                );
                function T(e) {
                    return function(t) {
                        for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                            r[i - 1] = arguments[i];
                        return l(e, t, r)
                    }
                }
                function O(e, r, i) {
                    i = i || h,
                    t && t(e, null);
                    for (var o = r.length; o--; ) {
                        var a = r[o];
                        if ("string" == typeof a) {
                            var s = i(a);
                            s !== a && (n(r) || (r[o] = s),
                            a = s)
                        }
                        e[a] = !0
                    }
                    return e
                }
                function S(t) {
                    var n = s(null);
                    for (var [r,i] of e(t))
                        n[r] = i;
                    return n
                }
                function x(e, t) {
                    for (; null !== e; ) {
                        var n = i(e, t);
                        if (n) {
                            if (n.get)
                                return T(n.get);
                            if ("function" == typeof n.value)
                                return T(n.value)
                        }
                        e = r(e)
                    }
                    return function(e) {
                        return console.warn("fallback value for", e),
                        null
                    }
                }
                var N = o(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"])
                  , A = o(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"])
                  , R = o(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"])
                  , C = o(["animate", "color-profile", "cursor", "discard", "fedropshadow", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"])
                  , _ = o(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"])
                  , M = o(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"])
                  , k = o(["#text"])
                  , D = o(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"])
                  , L = o(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"])
                  , z = o(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"])
                  , I = o(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"])
                  , B = a(/\{\{[\w\W]*|[\w\W]*\}\}/gm)
                  , P = a(/<%[\w\W]*|[\w\W]*%>/gm)
                  , H = a(/\${[\w\W]*}/gm)
                  , F = a(/^data-[\-\w.\u00B7-\uFFFF]/)
                  , U = a(/^aria-[\-\w]+$/)
                  , W = a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i)
                  , V = a(/^(?:\w+script|data):/i)
                  , j = a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g)
                  , G = a(/^html$/i)
                  , q = Object.freeze({
                    __proto__: null,
                    MUSTACHE_EXPR: B,
                    ERB_EXPR: P,
                    TMPLIT_EXPR: H,
                    DATA_ATTR: F,
                    ARIA_ATTR: U,
                    IS_ALLOWED_URI: W,
                    IS_SCRIPT_OR_DATA: V,
                    ATTR_WHITESPACE: j,
                    DOCTYPE_NAME: G
                })
                  , X = ()=>"undefined" == typeof window ? null : window;
                return function t() {
                    var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : X()
                      , r = e=>t(e);
                    if (r.version = "3.0.2",
                    r.removed = [],
                    !n || !n.document || 9 !== n.document.nodeType)
                        return r.isSupported = !1,
                        r;
                    var i = n.document
                      , {document: a} = n
                      , {DocumentFragment: s, HTMLTemplateElement: l, Node: c, Element: u, NodeFilter: T, NamedNodeMap: B=n.NamedNodeMap || n.MozNamedAttrMap, HTMLFormElement: P, DOMParser: H, trustedTypes: F} = n
                      , U = u.prototype
                      , V = x(U, "cloneNode")
                      , j = x(U, "nextSibling")
                      , Y = x(U, "childNodes")
                      , $ = x(U, "parentNode");
                    if ("function" == typeof l) {
                        var K = a.createElement("template");
                        K.content && K.content.ownerDocument && (a = K.content.ownerDocument)
                    }
                    var J = function(e, t) {
                        if ("object" != typeof e || "function" != typeof e.createPolicy)
                            return null;
                        var n = null
                          , r = "data-tt-policy-suffix";
                        t.currentScript && t.currentScript.hasAttribute(r) && (n = t.currentScript.getAttribute(r));
                        var i = "dompurify" + (n ? "#" + n : "");
                        try {
                            return e.createPolicy(i, {
                                createHTML: e=>e,
                                createScriptURL: e=>e
                            })
                        } catch (e) {
                            return console.warn("TrustedTypes policy " + i + " could not be created."),
                            null
                        }
                    }(F, i)
                      , Z = J ? J.createHTML("") : ""
                      , {implementation: Q, createNodeIterator: ee, createDocumentFragment: te, getElementsByTagName: ne} = a
                      , {importNode: re} = i
                      , ie = {};
                    r.isSupported = "function" == typeof e && "function" == typeof $ && Q && void 0 !== Q.createHTMLDocument;
                    var oe, ae, {MUSTACHE_EXPR: se, ERB_EXPR: le, TMPLIT_EXPR: ce, DATA_ATTR: ue, ARIA_ATTR: de, IS_SCRIPT_OR_DATA: fe, ATTR_WHITESPACE: pe} = q, {IS_ALLOWED_URI: he} = q, me = null, ve = O({}, [...N, ...A, ...R, ..._, ...k]), ge = null, be = O({}, [...D, ...L, ...z, ...I]), ye = Object.seal(Object.create(null, {
                        tagNameCheck: {
                            writable: !0,
                            configurable: !1,
                            enumerable: !0,
                            value: null
                        },
                        attributeNameCheck: {
                            writable: !0,
                            configurable: !1,
                            enumerable: !0,
                            value: null
                        },
                        allowCustomizedBuiltInElements: {
                            writable: !0,
                            configurable: !1,
                            enumerable: !0,
                            value: !1
                        }
                    })), we = null, Ee = null, Te = !0, Oe = !0, Se = !1, xe = !0, Ne = !1, Ae = !1, Re = !1, Ce = !1, _e = !1, Me = !1, ke = !1, De = !0, Le = !1, ze = !0, Ie = !1, Be = {}, Pe = null, He = O({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]), Fe = null, Ue = O({}, ["audio", "video", "img", "source", "image", "track"]), We = null, Ve = O({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), je = "http://www.w3.org/1998/Math/MathML", Ge = "http://www.w3.org/2000/svg", qe = "http://www.w3.org/1999/xhtml", Xe = qe, Ye = !1, $e = null, Ke = O({}, [je, Ge, qe], m), Je = ["application/xhtml+xml", "text/html"], Ze = null, Qe = a.createElement("form"), et = function(e) {
                        return e instanceof RegExp || e instanceof Function
                    }, tt = function(e) {
                        Ze && Ze === e || (e && "object" == typeof e || (e = {}),
                        e = S(e),
                        oe = oe = -1 === Je.indexOf(e.PARSER_MEDIA_TYPE) ? "text/html" : e.PARSER_MEDIA_TYPE,
                        ae = "application/xhtml+xml" === oe ? m : h,
                        me = "ALLOWED_TAGS"in e ? O({}, e.ALLOWED_TAGS, ae) : ve,
                        ge = "ALLOWED_ATTR"in e ? O({}, e.ALLOWED_ATTR, ae) : be,
                        $e = "ALLOWED_NAMESPACES"in e ? O({}, e.ALLOWED_NAMESPACES, m) : Ke,
                        We = "ADD_URI_SAFE_ATTR"in e ? O(S(Ve), e.ADD_URI_SAFE_ATTR, ae) : Ve,
                        Fe = "ADD_DATA_URI_TAGS"in e ? O(S(Ue), e.ADD_DATA_URI_TAGS, ae) : Ue,
                        Pe = "FORBID_CONTENTS"in e ? O({}, e.FORBID_CONTENTS, ae) : He,
                        we = "FORBID_TAGS"in e ? O({}, e.FORBID_TAGS, ae) : {},
                        Ee = "FORBID_ATTR"in e ? O({}, e.FORBID_ATTR, ae) : {},
                        Be = "USE_PROFILES"in e && e.USE_PROFILES,
                        Te = !1 !== e.ALLOW_ARIA_ATTR,
                        Oe = !1 !== e.ALLOW_DATA_ATTR,
                        Se = e.ALLOW_UNKNOWN_PROTOCOLS || !1,
                        xe = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR,
                        Ne = e.SAFE_FOR_TEMPLATES || !1,
                        Ae = e.WHOLE_DOCUMENT || !1,
                        _e = e.RETURN_DOM || !1,
                        Me = e.RETURN_DOM_FRAGMENT || !1,
                        ke = e.RETURN_TRUSTED_TYPE || !1,
                        Ce = e.FORCE_BODY || !1,
                        De = !1 !== e.SANITIZE_DOM,
                        Le = e.SANITIZE_NAMED_PROPS || !1,
                        ze = !1 !== e.KEEP_CONTENT,
                        Ie = e.IN_PLACE || !1,
                        he = e.ALLOWED_URI_REGEXP || W,
                        Xe = e.NAMESPACE || qe,
                        ye = e.CUSTOM_ELEMENT_HANDLING || {},
                        e.CUSTOM_ELEMENT_HANDLING && et(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (ye.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
                        e.CUSTOM_ELEMENT_HANDLING && et(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (ye.attributeNameCheck = e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
                        e.CUSTOM_ELEMENT_HANDLING && "boolean" == typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (ye.allowCustomizedBuiltInElements = e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
                        Ne && (Oe = !1),
                        Me && (_e = !0),
                        Be && (me = O({}, [...k]),
                        ge = [],
                        !0 === Be.html && (O(me, N),
                        O(ge, D)),
                        !0 === Be.svg && (O(me, A),
                        O(ge, L),
                        O(ge, I)),
                        !0 === Be.svgFilters && (O(me, R),
                        O(ge, L),
                        O(ge, I)),
                        !0 === Be.mathMl && (O(me, _),
                        O(ge, z),
                        O(ge, I))),
                        e.ADD_TAGS && (me === ve && (me = S(me)),
                        O(me, e.ADD_TAGS, ae)),
                        e.ADD_ATTR && (ge === be && (ge = S(ge)),
                        O(ge, e.ADD_ATTR, ae)),
                        e.ADD_URI_SAFE_ATTR && O(We, e.ADD_URI_SAFE_ATTR, ae),
                        e.FORBID_CONTENTS && (Pe === He && (Pe = S(Pe)),
                        O(Pe, e.FORBID_CONTENTS, ae)),
                        ze && (me["#text"] = !0),
                        Ae && O(me, ["html", "head", "body"]),
                        me.table && (O(me, ["tbody"]),
                        delete we.tbody),
                        o && o(e),
                        Ze = e)
                    }, nt = O({}, ["mi", "mo", "mn", "ms", "mtext"]), rt = O({}, ["foreignobject", "desc", "title", "annotation-xml"]), it = O({}, ["title", "style", "font", "a", "script"]), ot = O({}, A);
                    O(ot, R),
                    O(ot, C);
                    var at = O({}, _);
                    O(at, M);
                    var st = function(e) {
                        p(r.removed, {
                            element: e
                        });
                        try {
                            e.parentNode.removeChild(e)
                        } catch (t) {
                            e.remove()
                        }
                    }
                      , lt = function(e, t) {
                        try {
                            p(r.removed, {
                                attribute: t.getAttributeNode(e),
                                from: t
                            })
                        } catch (e) {
                            p(r.removed, {
                                attribute: null,
                                from: t
                            })
                        }
                        if (t.removeAttribute(e),
                        "is" === e && !ge[e])
                            if (_e || Me)
                                try {
                                    st(t)
                                } catch (e) {}
                            else
                                try {
                                    t.setAttribute(e, "")
                                } catch (e) {}
                    }
                      , ct = function(e) {
                        var t, n;
                        if (Ce)
                            e = "<remove></remove>" + e;
                        else {
                            var r = v(e, /^[\r\n\t ]+/);
                            n = r && r[0]
                        }
                        "application/xhtml+xml" === oe && Xe === qe && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
                        var i = J ? J.createHTML(e) : e;
                        if (Xe === qe)
                            try {
                                t = (new H).parseFromString(i, oe)
                            } catch (e) {}
                        if (!t || !t.documentElement) {
                            t = Q.createDocument(Xe, "template", null);
                            try {
                                t.documentElement.innerHTML = Ye ? Z : i
                            } catch (e) {}
                        }
                        var o = t.body || t.documentElement;
                        return e && n && o.insertBefore(a.createTextNode(n), o.childNodes[0] || null),
                        Xe === qe ? ne.call(t, Ae ? "html" : "body")[0] : Ae ? t.documentElement : o
                    }
                      , ut = function(e) {
                        return ee.call(e.ownerDocument || e, e, T.SHOW_ELEMENT | T.SHOW_COMMENT | T.SHOW_TEXT, null, !1)
                    }
                      , dt = function(e) {
                        return "object" == typeof c ? e instanceof c : e && "object" == typeof e && "number" == typeof e.nodeType && "string" == typeof e.nodeName
                    }
                      , ft = function(e, t, n) {
                        ie[e] && d(ie[e], (e=>{
                            e.call(r, t, n, Ze)
                        }
                        ))
                    }
                      , pt = function(e) {
                        var t, n;
                        if (ft("beforeSanitizeElements", e, null),
                        (n = e)instanceof P && ("string" != typeof n.nodeName || "string" != typeof n.textContent || "function" != typeof n.removeChild || !(n.attributes instanceof B) || "function" != typeof n.removeAttribute || "function" != typeof n.setAttribute || "string" != typeof n.namespaceURI || "function" != typeof n.insertBefore || "function" != typeof n.hasChildNodes))
                            return st(e),
                            !0;
                        var i = ae(e.nodeName);
                        if (ft("uponSanitizeElement", e, {
                            tagName: i,
                            allowedTags: me
                        }),
                        e.hasChildNodes() && !dt(e.firstElementChild) && (!dt(e.content) || !dt(e.content.firstElementChild)) && w(/<[/\w]/g, e.innerHTML) && w(/<[/\w]/g, e.textContent))
                            return st(e),
                            !0;
                        if (!me[i] || we[i]) {
                            if (!we[i] && mt(i)) {
                                if (ye.tagNameCheck instanceof RegExp && w(ye.tagNameCheck, i))
                                    return !1;
                                if (ye.tagNameCheck instanceof Function && ye.tagNameCheck(i))
                                    return !1
                            }
                            if (ze && !Pe[i]) {
                                var o = $(e) || e.parentNode
                                  , a = Y(e) || e.childNodes;
                                if (a && o)
                                    for (var s = a.length - 1; s >= 0; --s)
                                        o.insertBefore(V(a[s], !0), j(e))
                            }
                            return st(e),
                            !0
                        }
                        return e instanceof u && !function(e) {
                            var t = $(e);
                            t && t.tagName || (t = {
                                namespaceURI: Xe,
                                tagName: "template"
                            });
                            var n = h(e.tagName)
                              , r = h(t.tagName);
                            return !!$e[e.namespaceURI] && (e.namespaceURI === Ge ? t.namespaceURI === qe ? "svg" === n : t.namespaceURI === je ? "svg" === n && ("annotation-xml" === r || nt[r]) : Boolean(ot[n]) : e.namespaceURI === je ? t.namespaceURI === qe ? "math" === n : t.namespaceURI === Ge ? "math" === n && rt[r] : Boolean(at[n]) : e.namespaceURI === qe ? !(t.namespaceURI === Ge && !rt[r]) && !(t.namespaceURI === je && !nt[r]) && !at[n] && (it[n] || !ot[n]) : !("application/xhtml+xml" !== oe || !$e[e.namespaceURI]))
                        }(e) ? (st(e),
                        !0) : "noscript" !== i && "noembed" !== i || !w(/<\/no(script|embed)/i, e.innerHTML) ? (Ne && 3 === e.nodeType && (t = e.textContent,
                        t = g(t, se, " "),
                        t = g(t, le, " "),
                        t = g(t, ce, " "),
                        e.textContent !== t && (p(r.removed, {
                            element: e.cloneNode()
                        }),
                        e.textContent = t)),
                        ft("afterSanitizeElements", e, null),
                        !1) : (st(e),
                        !0)
                    }
                      , ht = function(e, t, n) {
                        if (De && ("id" === t || "name" === t) && (n in a || n in Qe))
                            return !1;
                        if (Oe && !Ee[t] && w(ue, t))
                            ;
                        else if (Te && w(de, t))
                            ;
                        else if (!ge[t] || Ee[t]) {
                            if (!(mt(e) && (ye.tagNameCheck instanceof RegExp && w(ye.tagNameCheck, e) || ye.tagNameCheck instanceof Function && ye.tagNameCheck(e)) && (ye.attributeNameCheck instanceof RegExp && w(ye.attributeNameCheck, t) || ye.attributeNameCheck instanceof Function && ye.attributeNameCheck(t)) || "is" === t && ye.allowCustomizedBuiltInElements && (ye.tagNameCheck instanceof RegExp && w(ye.tagNameCheck, n) || ye.tagNameCheck instanceof Function && ye.tagNameCheck(n))))
                                return !1
                        } else if (We[t])
                            ;
                        else if (w(he, g(n, pe, "")))
                            ;
                        else if ("src" !== t && "xlink:href" !== t && "href" !== t || "script" === e || 0 !== b(n, "data:") || !Fe[e])
                            if (Se && !w(fe, g(n, pe, "")))
                                ;
                            else if (n)
                                return !1;
                        return !0
                    }
                      , mt = function(e) {
                        return e.indexOf("-") > 0
                    }
                      , vt = function(e) {
                        var t, n, i, o;
                        ft("beforeSanitizeAttributes", e, null);
                        var {attributes: a} = e;
                        if (a) {
                            var s = {
                                attrName: "",
                                attrValue: "",
                                keepAttr: !0,
                                allowedAttributes: ge
                            };
                            for (o = a.length; o--; ) {
                                t = a[o];
                                var {name: l, namespaceURI: c} = t;
                                if (n = "value" === l ? t.value : y(t.value),
                                i = ae(l),
                                s.attrName = i,
                                s.attrValue = n,
                                s.keepAttr = !0,
                                s.forceKeepAttr = void 0,
                                ft("uponSanitizeAttribute", e, s),
                                n = s.attrValue,
                                !s.forceKeepAttr && (lt(l, e),
                                s.keepAttr))
                                    if (xe || !w(/\/>/i, n)) {
                                        Ne && (n = g(n, se, " "),
                                        n = g(n, le, " "),
                                        n = g(n, ce, " "));
                                        var u = ae(e.nodeName);
                                        if (ht(u, i, n)) {
                                            if (!Le || "id" !== i && "name" !== i || (lt(l, e),
                                            n = "user-content-" + n),
                                            J && "object" == typeof F && "function" == typeof F.getAttributeType)
                                                if (c)
                                                    ;
                                                else
                                                    switch (F.getAttributeType(u, i)) {
                                                    case "TrustedHTML":
                                                        n = J.createHTML(n);
                                                        break;
                                                    case "TrustedScriptURL":
                                                        n = J.createScriptURL(n)
                                                    }
                                            try {
                                                c ? e.setAttributeNS(c, l, n) : e.setAttribute(l, n),
                                                f(r.removed)
                                            } catch (e) {}
                                        }
                                    } else
                                        lt(l, e)
                            }
                            ft("afterSanitizeAttributes", e, null)
                        }
                    }
                      , gt = function e(t) {
                        var n, r = ut(t);
                        for (ft("beforeSanitizeShadowDOM", t, null); n = r.nextNode(); )
                            ft("uponSanitizeShadowNode", n, null),
                            pt(n) || (n.content instanceof s && e(n.content),
                            vt(n));
                        ft("afterSanitizeShadowDOM", t, null)
                    };
                    return r.sanitize = function(e) {
                        var t, n, o, a, l = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
                        if ((Ye = !e) && (e = "\x3c!--\x3e"),
                        "string" != typeof e && !dt(e)) {
                            if ("function" != typeof e.toString)
                                throw E("toString is not a function");
                            if ("string" != typeof (e = e.toString()))
                                throw E("dirty is not a string, aborting")
                        }
                        if (!r.isSupported)
                            return e;
                        if (Re || tt(l),
                        r.removed = [],
                        "string" == typeof e && (Ie = !1),
                        Ie) {
                            if (e.nodeName) {
                                var u = ae(e.nodeName);
                                if (!me[u] || we[u])
                                    throw E("root node is forbidden and cannot be sanitized in-place")
                            }
                        } else if (e instanceof c)
                            1 === (n = (t = ct("\x3c!----\x3e")).ownerDocument.importNode(e, !0)).nodeType && "BODY" === n.nodeName || "HTML" === n.nodeName ? t = n : t.appendChild(n);
                        else {
                            if (!_e && !Ne && !Ae && -1 === e.indexOf("<"))
                                return J && ke ? J.createHTML(e) : e;
                            if (!(t = ct(e)))
                                return _e ? null : ke ? Z : ""
                        }
                        t && Ce && st(t.firstChild);
                        for (var d = ut(Ie ? e : t); o = d.nextNode(); )
                            pt(o) || (o.content instanceof s && gt(o.content),
                            vt(o));
                        if (Ie)
                            return e;
                        if (_e) {
                            if (Me)
                                for (a = te.call(t.ownerDocument); t.firstChild; )
                                    a.appendChild(t.firstChild);
                            else
                                a = t;
                            return (ge.shadowroot || ge.shadowrootmod) && (a = re.call(i, a, !0)),
                            a
                        }
                        var f = Ae ? t.outerHTML : t.innerHTML;
                        return Ae && me["!doctype"] && t.ownerDocument && t.ownerDocument.doctype && t.ownerDocument.doctype.name && w(G, t.ownerDocument.doctype.name) && (f = "<!DOCTYPE " + t.ownerDocument.doctype.name + ">\n" + f),
                        Ne && (f = g(f, se, " "),
                        f = g(f, le, " "),
                        f = g(f, ce, " ")),
                        J && ke ? J.createHTML(f) : f
                    }
                    ,
                    r.setConfig = function(e) {
                        tt(e),
                        Re = !0
                    }
                    ,
                    r.clearConfig = function() {
                        Ze = null,
                        Re = !1
                    }
                    ,
                    r.isValidAttribute = function(e, t, n) {
                        Ze || tt({});
                        var r = ae(e)
                          , i = ae(t);
                        return ht(r, i, n)
                    }
                    ,
                    r.addHook = function(e, t) {
                        "function" == typeof t && (ie[e] = ie[e] || [],
                        p(ie[e], t))
                    }
                    ,
                    r.removeHook = function(e) {
                        if (ie[e])
                            return f(ie[e])
                    }
                    ,
                    r.removeHooks = function(e) {
                        ie[e] && (ie[e] = [])
                    }
                    ,
                    r.removeAllHooks = function() {
                        ie = {}
                    }
                    ,
                    r
                }()
            }()
        }
    }
      , t = {};
    function n(r) {
        var i = t[r];
        if (void 0 !== i)
            return i.exports;
        var o = t[r] = {
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n),
        o.exports
    }
    n.n = e=>{
        var t = e && e.__esModule ? ()=>e.default : ()=>e;
        return n.d(t, {
            a: t
        }),
        t
    }
    ,
    n.d = (e,t)=>{
        for (var r in t)
            n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            })
    }
    ,
    n.o = (e,t)=>Object.prototype.hasOwnProperty.call(e, t),
    n.r = e=>{
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }
    ;
    var r = {};
    (()=>{
        "use strict";
        n.r(r),
        n.d(r, {
            InputField: ()=>ue
        });
        const e = React;
        var t = n.n(e);
        const i = FluentUIReactv940;
        var o, a = n(355), s = [], l = "ResizeObserver loop completed with undelivered notifications.";
        !function(e) {
            e.BORDER_BOX = "border-box",
            e.CONTENT_BOX = "content-box",
            e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box"
        }(o || (o = {}));
        var c, u = function(e) {
            return Object.freeze(e)
        }, d = function(e, t) {
            this.inlineSize = e,
            this.blockSize = t,
            u(this)
        }, f = function() {
            function e(e, t, n, r) {
                return this.x = e,
                this.y = t,
                this.width = n,
                this.height = r,
                this.top = this.y,
                this.left = this.x,
                this.bottom = this.top + this.height,
                this.right = this.left + this.width,
                u(this)
            }
            return e.prototype.toJSON = function() {
                var e = this;
                return {
                    x: e.x,
                    y: e.y,
                    top: e.top,
                    right: e.right,
                    bottom: e.bottom,
                    left: e.left,
                    width: e.width,
                    height: e.height
                }
            }
            ,
            e.fromRect = function(t) {
                return new e(t.x,t.y,t.width,t.height)
            }
            ,
            e
        }(), p = function(e) {
            return e instanceof SVGElement && "getBBox"in e
        }, h = function(e) {
            if (p(e)) {
                var t = e.getBBox()
                  , n = t.width
                  , r = t.height;
                return !n && !r
            }
            var i = e
              , o = i.offsetWidth
              , a = i.offsetHeight;
            return !(o || a || e.getClientRects().length)
        }, m = function(e) {
            var t;
            if (e instanceof Element)
                return !0;
            var n = null === (t = null == e ? void 0 : e.ownerDocument) || void 0 === t ? void 0 : t.defaultView;
            return !!(n && e instanceof n.Element)
        }, v = "undefined" != typeof window ? window : {}, g = new WeakMap, b = /auto|scroll/, y = /^tb|vertical/, w = /msie|trident/i.test(v.navigator && v.navigator.userAgent), E = function(e) {
            return parseFloat(e || "0")
        }, T = function(e, t, n) {
            return void 0 === e && (e = 0),
            void 0 === t && (t = 0),
            void 0 === n && (n = !1),
            new d((n ? t : e) || 0,(n ? e : t) || 0)
        }, O = u({
            devicePixelContentBoxSize: T(),
            borderBoxSize: T(),
            contentBoxSize: T(),
            contentRect: new f(0,0,0,0)
        }), S = function(e, t) {
            if (void 0 === t && (t = !1),
            g.has(e) && !t)
                return g.get(e);
            if (h(e))
                return g.set(e, O),
                O;
            var n = getComputedStyle(e)
              , r = p(e) && e.ownerSVGElement && e.getBBox()
              , i = !w && "border-box" === n.boxSizing
              , o = y.test(n.writingMode || "")
              , a = !r && b.test(n.overflowY || "")
              , s = !r && b.test(n.overflowX || "")
              , l = r ? 0 : E(n.paddingTop)
              , c = r ? 0 : E(n.paddingRight)
              , d = r ? 0 : E(n.paddingBottom)
              , m = r ? 0 : E(n.paddingLeft)
              , v = r ? 0 : E(n.borderTopWidth)
              , S = r ? 0 : E(n.borderRightWidth)
              , x = r ? 0 : E(n.borderBottomWidth)
              , N = m + c
              , A = l + d
              , R = (r ? 0 : E(n.borderLeftWidth)) + S
              , C = v + x
              , _ = s ? e.offsetHeight - C - e.clientHeight : 0
              , M = a ? e.offsetWidth - R - e.clientWidth : 0
              , k = i ? N + R : 0
              , D = i ? A + C : 0
              , L = r ? r.width : E(n.width) - k - M
              , z = r ? r.height : E(n.height) - D - _
              , I = L + N + M + R
              , B = z + A + _ + C
              , P = u({
                devicePixelContentBoxSize: T(Math.round(L * devicePixelRatio), Math.round(z * devicePixelRatio), o),
                borderBoxSize: T(I, B, o),
                contentBoxSize: T(L, z, o),
                contentRect: new f(m,l,L,z)
            });
            return g.set(e, P),
            P
        }, x = function(e, t, n) {
            var r = S(e, n)
              , i = r.borderBoxSize
              , a = r.contentBoxSize
              , s = r.devicePixelContentBoxSize;
            switch (t) {
            case o.DEVICE_PIXEL_CONTENT_BOX:
                return s;
            case o.BORDER_BOX:
                return i;
            default:
                return a
            }
        }, N = function(e) {
            var t = S(e);
            this.target = e,
            this.contentRect = t.contentRect,
            this.borderBoxSize = u([t.borderBoxSize]),
            this.contentBoxSize = u([t.contentBoxSize]),
            this.devicePixelContentBoxSize = u([t.devicePixelContentBoxSize])
        }, A = function(e) {
            if (h(e))
                return 1 / 0;
            for (var t = 0, n = e.parentNode; n; )
                t += 1,
                n = n.parentNode;
            return t
        }, R = function() {
            var e = 1 / 0
              , t = [];
            s.forEach((function(n) {
                if (0 !== n.activeTargets.length) {
                    var r = [];
                    n.activeTargets.forEach((function(t) {
                        var n = new N(t.target)
                          , i = A(t.target);
                        r.push(n),
                        t.lastReportedSize = x(t.target, t.observedBox),
                        i < e && (e = i)
                    }
                    )),
                    t.push((function() {
                        n.callback.call(n.observer, r, n.observer)
                    }
                    )),
                    n.activeTargets.splice(0, n.activeTargets.length)
                }
            }
            ));
            for (var n = 0, r = t; n < r.length; n++)
                (0,
                r[n])();
            return e
        }, C = function(e) {
            s.forEach((function(t) {
                t.activeTargets.splice(0, t.activeTargets.length),
                t.skippedTargets.splice(0, t.skippedTargets.length),
                t.observationTargets.forEach((function(n) {
                    n.isActive() && (A(n.target) > e ? t.activeTargets.push(n) : t.skippedTargets.push(n))
                }
                ))
            }
            ))
        }, _ = [], M = 0, k = {
            attributes: !0,
            characterData: !0,
            childList: !0,
            subtree: !0
        }, D = ["resize", "load", "transitionend", "animationend", "animationstart", "animationiteration", "keyup", "keydown", "mouseup", "mousedown", "mouseover", "mouseout", "blur", "focus"], L = function(e) {
            return void 0 === e && (e = 0),
            Date.now() + e
        }, z = !1, I = new (function() {
            function e() {
                var e = this;
                this.stopped = !0,
                this.listener = function() {
                    return e.schedule()
                }
            }
            return e.prototype.run = function(e) {
                var t = this;
                if (void 0 === e && (e = 250),
                !z) {
                    z = !0;
                    var n, r = L(e);
                    n = function() {
                        var n = !1;
                        try {
                            n = function() {
                                var e, t = 0;
                                for (C(t); s.some((function(e) {
                                    return e.activeTargets.length > 0
                                }
                                )); )
                                    t = R(),
                                    C(t);
                                return s.some((function(e) {
                                    return e.skippedTargets.length > 0
                                }
                                )) && ("function" == typeof ErrorEvent ? e = new ErrorEvent("error",{
                                    message: l
                                }) : ((e = document.createEvent("Event")).initEvent("error", !1, !1),
                                e.message = l),
                                window.dispatchEvent(e)),
                                t > 0
                            }()
                        } finally {
                            if (z = !1,
                            e = r - L(),
                            !M)
                                return;
                            n ? t.run(1e3) : e > 0 ? t.run(e) : t.start()
                        }
                    }
                    ,
                    function(e) {
                        if (!c) {
                            var t = 0
                              , n = document.createTextNode("");
                            new MutationObserver((function() {
                                return _.splice(0).forEach((function(e) {
                                    return e()
                                }
                                ))
                            }
                            )).observe(n, {
                                characterData: !0
                            }),
                            c = function() {
                                n.textContent = "".concat(t ? t-- : t++)
                            }
                        }
                        _.push(e),
                        c()
                    }((function() {
                        requestAnimationFrame(n)
                    }
                    ))
                }
            }
            ,
            e.prototype.schedule = function() {
                this.stop(),
                this.run()
            }
            ,
            e.prototype.observe = function() {
                var e = this
                  , t = function() {
                    return e.observer && e.observer.observe(document.body, k)
                };
                document.body ? t() : v.addEventListener("DOMContentLoaded", t)
            }
            ,
            e.prototype.start = function() {
                var e = this;
                this.stopped && (this.stopped = !1,
                this.observer = new MutationObserver(this.listener),
                this.observe(),
                D.forEach((function(t) {
                    return v.addEventListener(t, e.listener, !0)
                }
                )))
            }
            ,
            e.prototype.stop = function() {
                var e = this;
                this.stopped || (this.observer && this.observer.disconnect(),
                D.forEach((function(t) {
                    return v.removeEventListener(t, e.listener, !0)
                }
                )),
                this.stopped = !0)
            }
            ,
            e
        }()), B = function(e) {
            !M && e > 0 && I.start(),
            !(M += e) && I.stop()
        }, P = function() {
            function e(e, t) {
                this.target = e,
                this.observedBox = t || o.CONTENT_BOX,
                this.lastReportedSize = {
                    inlineSize: 0,
                    blockSize: 0
                }
            }
            return e.prototype.isActive = function() {
                var e, t = x(this.target, this.observedBox, !0);
                return e = this.target,
                p(e) || function(e) {
                    switch (e.tagName) {
                    case "INPUT":
                        if ("image" !== e.type)
                            break;
                    case "VIDEO":
                    case "AUDIO":
                    case "EMBED":
                    case "OBJECT":
                    case "CANVAS":
                    case "IFRAME":
                    case "IMG":
                        return !0
                    }
                    return !1
                }(e) || "inline" !== getComputedStyle(e).display || (this.lastReportedSize = t),
                this.lastReportedSize.inlineSize !== t.inlineSize || this.lastReportedSize.blockSize !== t.blockSize
            }
            ,
            e
        }(), H = function(e, t) {
            this.activeTargets = [],
            this.skippedTargets = [],
            this.observationTargets = [],
            this.observer = e,
            this.callback = t
        }, F = new WeakMap, U = function(e, t) {
            for (var n = 0; n < e.length; n += 1)
                if (e[n].target === t)
                    return n;
            return -1
        }, W = function() {
            function e() {}
            return e.connect = function(e, t) {
                var n = new H(e,t);
                F.set(e, n)
            }
            ,
            e.observe = function(e, t, n) {
                var r = F.get(e)
                  , i = 0 === r.observationTargets.length;
                U(r.observationTargets, t) < 0 && (i && s.push(r),
                r.observationTargets.push(new P(t,n && n.box)),
                B(1),
                I.schedule())
            }
            ,
            e.unobserve = function(e, t) {
                var n = F.get(e)
                  , r = U(n.observationTargets, t)
                  , i = 1 === n.observationTargets.length;
                r >= 0 && (i && s.splice(s.indexOf(n), 1),
                n.observationTargets.splice(r, 1),
                B(-1))
            }
            ,
            e.disconnect = function(e) {
                var t = this
                  , n = F.get(e);
                n.observationTargets.slice().forEach((function(n) {
                    return t.unobserve(e, n.target)
                }
                )),
                n.activeTargets.splice(0, n.activeTargets.length)
            }
            ,
            e
        }(), V = function() {
            function e(e) {
                if (0 === arguments.length)
                    throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
                if ("function" != typeof e)
                    throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
                W.connect(this, e)
            }
            return e.prototype.observe = function(e, t) {
                if (0 === arguments.length)
                    throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
                if (!m(e))
                    throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
                W.observe(this, e, t)
            }
            ,
            e.prototype.unobserve = function(e) {
                if (0 === arguments.length)
                    throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
                if (!m(e))
                    throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
                W.unobserve(this, e)
            }
            ,
            e.prototype.disconnect = function() {
                W.disconnect(this)
            }
            ,
            e.toString = function() {
                return "function ResizeObserver () { [polyfill code] }"
            }
            ,
            e
        }();
        const j = t()["undefined" != typeof document && void 0 !== document.createElement ? "useLayoutEffect" : "useEffect"]
          , G = t=>{
            var n = e.useRef(t);
            return e.useEffect((()=>{
                n.current = t
            }
            )),
            n
        }
        ;
        var q, X = "undefined" != typeof window && "ResizeObserver"in window ? window.ResizeObserver : V;
        const Y = function(e, t) {
            var n = q || (q = function() {
                var e = !1
                  , t = []
                  , n = new Map
                  , r = new X((function(r, i) {
                    t = t.concat(r),
                    e || window.requestAnimationFrame((function() {
                        for (var r = new Set, o = function(e) {
                            if (r.has(t[e].target))
                                return "continue";
                            r.add(t[e].target);
                            var o = n.get(t[e].target);
                            null == o || o.forEach((function(n) {
                                return n(t[e], i)
                            }
                            ))
                        }, a = 0; a < t.length; a++)
                            o(a);
                        t = [],
                        e = !1
                    }
                    )),
                    e = !0
                }
                ));
                return {
                    observer: r,
                    subscribe: function(e, t) {
                        var i;
                        r.observe(e);
                        var o = null !== (i = n.get(e)) && void 0 !== i ? i : [];
                        o.push(t),
                        n.set(e, o)
                    },
                    unsubscribe: function(e, t) {
                        var i, o = null !== (i = n.get(e)) && void 0 !== i ? i : [];
                        if (1 === o.length)
                            return r.unobserve(e),
                            void n.delete(e);
                        var a = o.indexOf(t);
                        -1 !== a && o.splice(a, 1),
                        n.set(e, o)
                    }
                }
            }())
              , r = G(t);
            return j((function() {
                var t = !1
                  , i = e && "current"in e ? e.current : e;
                if (!i)
                    return function() {}
                    ;
                function o(e, n) {
                    t || r.current(e, n)
                }
                return n.subscribe(i, o),
                function() {
                    t = !0,
                    n.unsubscribe(i, o)
                }
            }
            ), [e, n, r]),
            n
        };
        var $;
        const K = function(e, t, n) {
            var r = $ || ($ = function() {
                var e = !1
                  , t = []
                  , n = new Map
                  , r = new MutationObserver((function(r, i) {
                    t = t.concat(r),
                    e || window.requestAnimationFrame((function() {
                        for (var r = new Set, o = function(e) {
                            if (r.has(t[e].target))
                                return "continue";
                            r.add(t[e].target);
                            var o = n.get(t[e].target);
                            null == o || o.forEach((function(n) {
                                return n(t[e], i)
                            }
                            ))
                        }, a = 0; a < t.length; a++)
                            o(a);
                        t = [],
                        e = !1
                    }
                    )),
                    e = !0
                }
                ));
                return {
                    observer: r,
                    subscribe: function(e, t, i) {
                        var o;
                        r.observe(e, i);
                        var a = null !== (o = n.get(e)) && void 0 !== o ? o : [];
                        a.push(t),
                        n.set(e, a)
                    },
                    unsubscribe: function(e, t) {
                        var i, o = null !== (i = n.get(e)) && void 0 !== i ? i : [];
                        if (1 === o.length)
                            return n.delete(e),
                            void (0 === n.size && r.disconnect());
                        var a = o.indexOf(t);
                        -1 !== a && o.splice(a, 1),
                        n.set(e, o)
                    }
                }
            }())
              , i = G(t);
            return j((function() {
                var t = !1
                  , o = e && "current"in e ? e.current : e;
                if (!o)
                    return function() {}
                    ;
                function a(e, n) {
                    t || i.current(e, n)
                }
                return r.subscribe(o, a, n),
                function() {
                    t = !0,
                    r.unsubscribe(o, a)
                }
            }
            ), [e, r, i]),
            r.observer
        };
        var J = function() {
            return J = Object.assign || function(e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }
            ,
            J.apply(this, arguments)
        }
          , Z = function(t, n) {
            return void 0 === n && (n = "div"),
            t && e.createElement(n, {
                dangerouslySetInnerHTML: {
                    __html: a.sanitize(t)
                }
            })
        }
          , Q = (0,
        i.makeStyles)({
            root: {
                flexGrow: 1,
                alignContent: "flex-start"
            }
        })
          , ee = function(t) {
            var n = t.label
              , r = t.info
              , o = t.hint
              , s = t.required
              , l = t.validate
              , c = t.valueChanged
              , u = t.pendingValidation
              , d = t.orientation
              , f = t.size
              , p = t.onResize
              , h = t.onClick
              , m = t.onValidate
              , v = function(e, t) {
                var n = {};
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
                        t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]])
                }
                return n
            }(t, ["label", "info", "hint", "required", "validate", "valueChanged", "pendingValidation", "orientation", "size", "onResize", "onClick", "onValidate"])
              , g = e.useMemo((function() {
                return r ? {
                    children: function(t, o) {
                        return e.createElement(i.InfoLabel, J({}, o, {
                            info: e.createElement("div", {
                                dangerouslySetInnerHTML: {
                                    __html: a.sanitize(r)
                                }
                            })
                        }), n)
                    }
                } : n
            }
            ), [n, r])
              , b = e.useMemo((function() {
                return Z(o)
            }
            ), [o])
              , y = e.useRef(null)
              , w = function(t, n) {
                var r = e.useState((function() {
                    var e, r, i = t && "current"in t ? t.current : t;
                    return i ? {
                        width: i.scrollWidth,
                        height: i.scrollHeight
                    } : {
                        width: null !== (e = null == n ? void 0 : n.initialWidth) && void 0 !== e ? e : 0,
                        height: null !== (r = null == n ? void 0 : n.initialHeight) && void 0 !== r ? r : 0
                    }
                }
                ))
                  , i = r[0]
                  , o = r[1];
                j((function() {
                    var e = t && "current"in t ? t.current : t;
                    e && o({
                        width: e.scrollWidth,
                        height: e.scrollHeight
                    })
                }
                ), [t]);
                var a = Y(t, (function(e) {
                    var t = e.target;
                    o({
                        width: t.scrollWidth,
                        height: t.scrollHeight
                    })
                }
                ))
                  , s = e.useCallback((function() {
                    var e = t && "current"in t ? t.current : t;
                    e && o({
                        width: e.scrollWidth,
                        height: e.scrollHeight
                    })
                }
                ), [t, o]);
                return K(t, (function(e, t) {
                    "childList" === e.type && (e.addedNodes.forEach((function(e) {
                        a.subscribe(e, s)
                    }
                    )),
                    e.removedNodes.forEach((function(e) {
                        a.unsubscribe(e, s)
                    }
                    )),
                    s())
                }
                ), {
                    childList: !0
                }),
                i
            }(y)
              , E = e.useMemo((function() {
                return "always" == l || "onchange" == l && c ? (u.validationMessage || (u.validationState = "none"),
                u.validationState || (u.validationState = "error"),
                u) : {
                    validationMessage: void 0,
                    validationState: "none"
                }
            }
            ), [u.validationMessage, u.validationState, c, l]);
            e.useEffect((function() {
                y.current && (null == m || m({
                    type: "validate",
                    target: y.current
                }, E))
            }
            ), [E]);
            var T = e.useMemo((function() {
                return Z(E.validationMessage, "span")
            }
            ), [E.validationMessage]);
            e.useEffect((function() {
                y && (null == w ? void 0 : w.height) && (null == w ? void 0 : w.width) && (null == p || p(w, y))
            }
            ), [w, null == w ? void 0 : w.height, null == w ? void 0 : w.width, y]);
            var O = Q();
            return e.createElement(i.Field, J({}, v, {
                label: g,
                hint: b,
                required: s,
                validationMessage: T,
                validationState: E.validationState,
                orientation: d,
                size: f,
                ref: y,
                onClick: h,
                className: O.root
            }))
        }
          , te = function() {
            return te = Object.assign || function(e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }
            ,
            te.apply(this, arguments)
        }
          , ne = function(t) {
            var n = t.size
              , r = t.isControlDisabled
              , o = t.isRead
              , a = t.valueUpdated
              , s = t.contentBefore
              , l = t.contentAfter
              , c = t.onBlur
              , u = t.onChange
              , d = t.fieldProps
              , f = function(e, t) {
                var n = {};
                for (var r in e)
                    Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (r = Object.getOwnPropertySymbols(e); i < r.length; i++)
                        t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]])
                }
                return n
            }(t, ["size", "isControlDisabled", "isRead", "valueUpdated", "contentBefore", "contentAfter", "onBlur", "onChange", "fieldProps"])
              , p = e.useRef(null)
              , h = e.useState(t.value)
              , m = h[0]
              , v = h[1]
              , g = e.useRef(!1);
            e.useEffect((function() {
                a && t.value !== m && (g.current = !1,
                v(t.value),
                p.current && (null == u || u({
                    type: "change",
                    target: p.current
                }, {
                    value: t.value || ""
                })))
            }
            ), [t.value, a, v]);
            var b = e.useMemo((function() {
                return o ? {
                    children: function(t, n) {
                        return e.createElement(i.Text, te({}, n), m)
                    }
                } : void 0
            }
            ), [o, m])
              , y = e.useMemo((function() {
                return Z(s, "span")
            }
            ), [s])
              , w = e.useMemo((function() {
                return Z(l, "span")
            }
            ), [l]);
            return e.createElement(ee, te({}, d, {
                valueChanged: g.current
            }), e.createElement(i.Input, te({}, f, {
                input: b,
                onChange: function(e, n) {
                    var r = te({}, e);
                    g.current = n.value != t.value,
                    v(n.value),
                    null == u || u(r, n)
                },
                onBlur: c,
                value: m,
                contentBefore: y,
                contentAfter: w,
                disabled: r,
                size: n,
                ref: p
            })))
        }
          , re = function() {
            return re = Object.assign || function(e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }
            ,
            re.apply(this, arguments)
        }
          , ie = {
            type: "object",
            properties: {
                type: {
                    type: "string"
                },
                target: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        tagName: {
                            type: "string"
                        },
                        classList: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        attributes: {
                            type: "array",
                            items: {
                                name: {
                                    type: "string"
                                },
                                value: {
                                    type: "string"
                                }
                            }
                        },
                        value: {
                            type: "string"
                        }
                    }
                }
            }
        }
          , oe = (re({
            $schema: "http://json-schema.org/draft-04/schema#"
        }, ie),
        {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "array",
            items: re({}, ie)
        })
          , ae = function(e) {
            var t, n, r, i;
            if (e) {
                var o = e.target
                  , a = []
                  , s = [];
                if (o) {
                    if (o.classList)
                        for (var l = 0; l < o.classList.length; l++)
                            a.push(o.classList[l].toString());
                    if (o.attributes)
                        for (l = 0; l < o.attributes.length; l++)
                            s.push(o.attributes[l])
                }
                return {
                    type: e.type || "",
                    target: {
                        name: (null == o ? void 0 : o.name) || "",
                        tagName: (null == o ? void 0 : o.tagName) || "",
                        classList: a,
                        attributes: s,
                        value: null !== (i = null !== (t = null == o ? void 0 : o.value) && void 0 !== t ? t : null === (r = null === (n = null == o ? void 0 : o.attributes) || void 0 === n ? void 0 : n.getNamedItem("href")) || void 0 === r ? void 0 : r.value) && void 0 !== i ? i : ""
                    }
                }
            }
            return {
                type: "",
                target: {
                    name: "",
                    tagName: "",
                    classList: [],
                    attributes: [],
                    value: ""
                }
            }
        }
          , se = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "object",
            properties: {
                Message: {
                    type: "string"
                },
                State: {
                    type: "string"
                }
            }
        }
          , le = function() {
            return le = Object.assign || function(e) {
                for (var t, n = 1, r = arguments.length; n < r; n++)
                    for (var i in t = arguments[n])
                        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
                return e
            }
            ,
            le.apply(this, arguments)
        }
          , ce = function(e, t, n) {
            if (n || 2 === arguments.length)
                for (var r, i = 0, o = t.length; i < o; i++)
                    !r && i in t || (r || (r = Array.prototype.slice.call(t, 0, i)),
                    r[i] = t[i]);
            return e.concat(r || Array.prototype.slice.call(t))
        }
          , ue = function() {
            function t() {
                var e = this;
                this.events = [],
                this.dispatchOnChange = !1,
                this.dispatchOnSelect = !1,
                this.dispatchOnResize = !1,
                this.dispatchOnValidate = !1,
                this.debounceTimeout = 300,
                this.maybeDebounceNotifyOutputChanged = function() {
                    switch (window.clearTimeout(e.debounceTimeoutId),
                    e.debounce) {
                    case "debounce":
                        e.debounceTimeoutId = window.setTimeout((function() {
                            e.notifyOutputChanged()
                        }
                        ), e.debounceTimeout);
                        break;
                    case "onblur":
                        break;
                    default:
                        e.notifyOutputChanged()
                    }
                }
                ,
                this.onBlur = function(t) {
                    "onblur" === e.debounce && e.notifyOutputChanged()
                }
                ,
                this.onChange = function(t, n) {
                    e.value !== (null == n ? void 0 : n.value) && (e.value = null == n ? void 0 : n.value,
                    e.dispatchOnChange = !0,
                    e.maybeDebounceNotifyOutputChanged())
                }
                ,
                this.onSelect = function(t) {
                    e.events.push(ae(t)),
                    e.dispatchOnSelect = !0,
                    e.maybeDebounceNotifyOutputChanged()
                }
                ,
                this.onResize = function(t, n) {
                    e.contentHeight = null == t ? void 0 : t.height,
                    e.contentWidth = null == t ? void 0 : t.width,
                    e.dispatchOnResize = !0,
                    e.maybeDebounceNotifyOutputChanged()
                }
                ,
                this.onValidate = function(t, n) {
                    var r, i, o = ae(le(le({}, t), {
                        value: JSON.stringify(n)
                    }));
                    e.events.push(o),
                    e.validation = {
                        Message: null !== (r = n.validationMessage) && void 0 !== r ? r : "",
                        State: null !== (i = n.validationState) && void 0 !== i ? i : n.validationMessage ? "error" : "none"
                    },
                    e.dispatchOnValidate = !0,
                    e.maybeDebounceNotifyOutputChanged()
                }
            }
            return t.prototype.init = function(e, t, n) {
                var r, i;
                this.notifyOutputChanged = t,
                this.pendingValidation = {
                    validationMessage: e.parameters.ValidationMessage.raw || void 0,
                    validationState: e.parameters.ValidationState.raw || "none"
                },
                this.value = null !== (i = null !== (r = e.parameters.Value.raw) && void 0 !== r ? r : e.parameters.DefaultValue.raw) && void 0 !== i ? i : void 0,
                this.validation = {
                    Message: "",
                    State: "none"
                },
                e.mode.trackContainerResize(!0)
            }
            ,
            t.prototype.updateView = function(t) {
                var n, r, i, o, a, s, l, c, u, d;
                if (this.dispatchOnChange && (null === (r = (n = t.events).OnChange) || void 0 === r || r.call(n),
                this.dispatchOnChange = !1),
                this.dispatchOnSelect && (null === (o = (i = t.events).OnSelect) || void 0 === o || o.call(i),
                this.dispatchOnSelect = !1),
                this.dispatchOnResize && (null === (s = (a = t.events).OnResize) || void 0 === s || s.call(a),
                this.dispatchOnResize = !1),
                this.dispatchOnValidate && (null === (c = (l = t.events).OnValidate) || void 0 === c || c.call(l),
                this.dispatchOnValidate = !1),
                this.events.length = 0,
                this.debounceTimeout = t.parameters.DelayTimeout.raw || 300,
                this.debounce = t.parameters.DelayOutput.raw,
                this.label = t.parameters.Label.raw || void 0,
                this.hint = t.parameters.Hint.raw || void 0,
                this.info = t.parameters.Info.raw || void 0,
                this.required = t.parameters.Required.raw,
                this.contentHeight && this.contentWidth || (this.contentHeight || (this.contentHeight = t.mode.allocatedHeight),
                this.contentWidth || (this.contentWidth = t.mode.allocatedWidth),
                this.notifyOutputChanged()),
                t.updatedProperties.includes("ValidationMessage") || t.updatedProperties.includes("ValidationState")) {
                    var f = {
                        validationMessage: null !== (u = t.parameters.ValidationMessage.raw) && void 0 !== u ? u : "",
                        validationState: null !== (d = t.parameters.ValidationState.raw) && void 0 !== d ? d : t.parameters.ValidationMessage.raw ? "error" : "none"
                    };
                    this.pendingValidation.validationMessage == f.validationMessage && this.pendingValidation.validationState == f.validationState || (this.pendingValidation = f)
                }
                var p = t.parameters.DefaultValue.raw ? "DefaultValue" : "Value"
                  , h = t.parameters[p].raw || ""
                  , m = t.updatedProperties.includes(p);
                m && (this.value = h);
                var v = {
                    fieldProps: {
                        label: this.label,
                        hint: this.hint,
                        info: this.info,
                        required: this.required,
                        orientation: t.parameters.Orientation.raw,
                        size: t.parameters.Size.raw || "medium",
                        onResize: this.onResize,
                        onClick: this.onSelect,
                        onValidate: this.onValidate,
                        validate: t.parameters.Validate.raw,
                        pendingValidation: this.pendingValidation,
                        style: {
                            height: t.mode.allocatedHeight,
                            width: t.mode.allocatedWidth
                        }
                    },
                    value: h,
                    valueUpdated: m,
                    placeholder: t.parameters.Placeholder.raw || void 0,
                    contentBefore: t.parameters.ContentBefore.raw || void 0,
                    contentAfter: t.parameters.ContentAfter.raw || void 0,
                    type: t.parameters.InputType.raw,
                    appearance: t.parameters.Appearance.raw || "outline",
                    isRead: t.mode.isRead,
                    isControlDisabled: t.mode.isControlDisabled,
                    onBlur: this.onBlur,
                    onChange: this.onChange
                };
                return e.createElement(ne, v)
            }
            ,
            t.prototype.getOutputs = function() {
                return {
                    Value: this.value,
                    Validation: le({}, this.validation),
                    ContentHeight: this.contentHeight,
                    ContentWidth: this.contentWidth,
                    Events: ce([], this.events, !0),
                    Label: this.label,
                    Hint: this.hint,
                    Info: this.info,
                    Required: this.required
                }
            }
            ,
            t.prototype.getOutputSchema = function(e) {
                return t = this,
                n = void 0,
                i = function() {
                    return function(e, t) {
                        var n, r, i, o, a = {
                            label: 0,
                            sent: function() {
                                if (1 & i[0])
                                    throw i[1];
                                return i[1]
                            },
                            trys: [],
                            ops: []
                        };
                        return o = {
                            next: s(0),
                            throw: s(1),
                            return: s(2)
                        },
                        "function" == typeof Symbol && (o[Symbol.iterator] = function() {
                            return this
                        }
                        ),
                        o;
                        function s(s) {
                            return function(l) {
                                return function(s) {
                                    if (n)
                                        throw new TypeError("Generator is already executing.");
                                    for (; o && (o = 0,
                                    s[0] && (a = 0)),
                                    a; )
                                        try {
                                            if (n = 1,
                                            r && (i = 2 & s[0] ? r.return : s[0] ? r.throw || ((i = r.return) && i.call(r),
                                            0) : r.next) && !(i = i.call(r, s[1])).done)
                                                return i;
                                            switch (r = 0,
                                            i && (s = [2 & s[0], i.value]),
                                            s[0]) {
                                            case 0:
                                            case 1:
                                                i = s;
                                                break;
                                            case 4:
                                                return a.label++,
                                                {
                                                    value: s[1],
                                                    done: !1
                                                };
                                            case 5:
                                                a.label++,
                                                r = s[1],
                                                s = [0];
                                                continue;
                                            case 7:
                                                s = a.ops.pop(),
                                                a.trys.pop();
                                                continue;
                                            default:
                                                if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
                                                    a = 0;
                                                    continue
                                                }
                                                if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
                                                    a.label = s[1];
                                                    break
                                                }
                                                if (6 === s[0] && a.label < i[1]) {
                                                    a.label = i[1],
                                                    i = s;
                                                    break
                                                }
                                                if (i && a.label < i[2]) {
                                                    a.label = i[2],
                                                    a.ops.push(s);
                                                    break
                                                }
                                                i[2] && a.ops.pop(),
                                                a.trys.pop();
                                                continue
                                            }
                                            s = t.call(e, a)
                                        } catch (e) {
                                            s = [6, e],
                                            r = 0
                                        } finally {
                                            n = i = 0
                                        }
                                    if (5 & s[0])
                                        throw s[1];
                                    return {
                                        value: s[0] ? s[1] : void 0,
                                        done: !0
                                    }
                                }([s, l])
                            }
                        }
                    }(this, (function(e) {
                        return [2, Promise.resolve({
                            Events: oe,
                            Validation: se
                        })]
                    }
                    ))
                }
                ,
                new ((r = void 0) || (r = Promise))((function(e, o) {
                    function a(e) {
                        try {
                            l(i.next(e))
                        } catch (e) {
                            o(e)
                        }
                    }
                    function s(e) {
                        try {
                            l(i.throw(e))
                        } catch (e) {
                            o(e)
                        }
                    }
                    function l(t) {
                        var n;
                        t.done ? e(t.value) : (n = t.value,
                        n instanceof r ? n : new r((function(e) {
                            e(n)
                        }
                        ))).then(a, s)
                    }
                    l((i = i.apply(t, n || [])).next())
                }
                ));
                var t, n, r, i
            }
            ,
            t.prototype.destroy = function() {}
            ,
            t
        }()
    }
    )(),
    pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = r
}
)();
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
    ComponentFramework.registerControl('F9Fields.InputField', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.InputField);
} else {
    var F9Fields = F9Fields || {};
    F9Fields.InputField = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.InputField;
    pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}
