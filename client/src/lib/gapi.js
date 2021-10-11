var gapi = (window.gapi = window.gapi || {});
gapi._bs = new Date().getTime();
(function () {
  var n,
    aa = function (a) {
      var b = 0;
      return function () {
        return b < a.length
          ? {
              done: !1,
              value: a[b++],
            }
          : {
              done: !0,
            };
      };
    },
    ba =
      "function" == typeof Object.defineProperties
        ? Object.defineProperty
        : function (a, b, c) {
            if (a == Array.prototype || a == Object.prototype) return a;
            a[b] = c.value;
            return a;
          },
    ca = function (a) {
      a = [
        "object" == typeof globalThis && globalThis,
        a,
        "object" == typeof window && window,
        "object" == typeof self && self,
        "object" == typeof global && global,
      ];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        if (c && c.Math == Math) return c;
      }
      throw Error("Cannot find global object");
    },
    da = ca(this),
    ea = function (a, b) {
      if (b)
        a: {
          var c = da;
          a = a.split(".");
          for (var d = 0; d < a.length - 1; d++) {
            var e = a[d];
            if (!(e in c)) break a;
            c = c[e];
          }
          a = a[a.length - 1];
          d = c[a];
          b = b(d);
          b != d &&
            null != b &&
            ba(c, a, {
              configurable: !0,
              writable: !0,
              value: b,
            });
        }
    };
  ea("Symbol", function (a) {
    if (a) return a;
    var b = function (f, g) {
      this.ca = f;
      ba(this, "description", {
        configurable: !0,
        writable: !0,
        value: g,
      });
    };
    b.prototype.toString = function () {
      return this.ca;
    };
    var c = "jscomp_symbol_" + ((1e9 * Math.random()) >>> 0) + "_",
      d = 0,
      e = function (f) {
        if (this instanceof e)
          throw new TypeError("Symbol is not a constructor");
        return new b(c + (f || "") + "_" + d++, f);
      };
    return e;
  });
  ea("Symbol.iterator", function (a) {
    if (a) return a;
    a = Symbol("Symbol.iterator");
    for (
      var b =
          "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(
            " "
          ),
        c = 0;
      c < b.length;
      c++
    ) {
      var d = da[b[c]];
      "function" === typeof d &&
        "function" != typeof d.prototype[a] &&
        ba(d.prototype, a, {
          configurable: !0,
          writable: !0,
          value: function () {
            return fa(aa(this));
          },
        });
    }
    return a;
  });
  var fa = function (a) {
      a = {
        next: a,
      };
      a[Symbol.iterator] = function () {
        return this;
      };
      return a;
    },
    ja = function (a, b) {
      a instanceof String && (a += "");
      var c = 0,
        d = !1,
        e = {
          next: function () {
            if (!d && c < a.length) {
              var f = c++;
              return {
                value: b(f, a[f]),
                done: !1,
              };
            }
            d = !0;
            return {
              done: !0,
              value: void 0,
            };
          },
        };
      e[Symbol.iterator] = function () {
        return e;
      };
      return e;
    };
  ea("Array.prototype.keys", function (a) {
    return a
      ? a
      : function () {
          return ja(this, function (b) {
            return b;
          });
        };
  });
  var q = this || self,
    ka = function (a) {
      var b = typeof a;
      return "object" != b ? b : a ? (Array.isArray(a) ? "array" : b) : "null";
    },
    la = function (a) {
      var b = ka(a);
      return "array" == b || ("object" == b && "number" == typeof a.length);
    },
    ma = function (a) {
      var b = typeof a;
      return ("object" == b && null != a) || "function" == b;
    },
    na = "closure_uid_" + ((1e9 * Math.random()) >>> 0),
    oa = 0,
    pa = function (a, b, c) {
      return a.call.apply(a.bind, arguments);
    },
    qa = function (a, b, c) {
      if (!a) throw Error();
      if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function () {
          var e = Array.prototype.slice.call(arguments);
          Array.prototype.unshift.apply(e, d);
          return a.apply(b, e);
        };
      }
      return function () {
        return a.apply(b, arguments);
      };
    },
    ra = function (a, b, c) {
      ra =
        Function.prototype.bind &&
        -1 != Function.prototype.bind.toString().indexOf("native code")
          ? pa
          : qa;
      return ra.apply(null, arguments);
    },
    sa = function (a, b) {
      function c() {}
      c.prototype = b.prototype;
      a.pa = b.prototype;
      a.prototype = new c();
      a.prototype.constructor = a;
      a.B = function (d, e, f) {
        for (
          var g = Array(arguments.length - 2), h = 2;
          h < arguments.length;
          h++
        )
          g[h - 2] = arguments[h];
        return b.prototype[e].apply(d, g);
      };
    },
    ta = function (a) {
      return a;
    },
    ua = function (a) {
      var b = null,
        c = q.trustedTypes;
      if (!c || !c.createPolicy) return b;
      try {
        b = c.createPolicy(a, {
          createHTML: ta,
          createScript: ta,
          createScriptURL: ta,
        });
      } catch (d) {
        q.console && q.console.error(d.message);
      }
      return b;
    };

  function va(a) {
    if (Error.captureStackTrace) Error.captureStackTrace(this, va);
    else {
      var b = Error().stack;
      b && (this.stack = b);
    }
    a && (this.message = String(a));
  }
  sa(va, Error);
  va.prototype.name = "CustomError";
  var wa;
  var xa = function (a, b) {
    a = a.split("%s");
    for (var c = "", d = a.length - 1, e = 0; e < d; e++)
      c += a[e] + (e < b.length ? b[e] : "%s");
    va.call(this, c + a[d]);
  };
  sa(xa, va);
  xa.prototype.name = "AssertionError";
  var ya = function (a, b, c, d) {
      var e = "Assertion failed";
      if (c) {
        e += ": " + c;
        var f = d;
      } else a && ((e += ": " + a), (f = b));
      throw new xa("" + e, f || []);
    },
    za = function (a, b, c) {
      a || ya("", null, b, Array.prototype.slice.call(arguments, 2));
      return a;
    },
    Aa = function (a, b) {
      throw new xa(
        "Failure" + (a ? ": " + a : ""),
        Array.prototype.slice.call(arguments, 1)
      );
    },
    Ba = function (a, b, c) {
      "string" !== typeof a &&
        ya(
          "Expected string but got %s: %s.",
          [ka(a), a],
          b,
          Array.prototype.slice.call(arguments, 2)
        );
    };
  var Ca = Array.prototype.forEach
    ? function (a, b) {
        za(null != a.length);
        Array.prototype.forEach.call(a, b, void 0);
      }
    : function (a, b) {
        for (
          var c = a.length, d = "string" === typeof a ? a.split("") : a, e = 0;
          e < c;
          e++
        )
          e in d && b.call(void 0, d[e], e, a);
      };

  function Da(a) {
    var b = a.length;
    if (0 < b) {
      for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
      return c;
    }
    return [];
  }

  function Ea(a, b) {
    for (var c in a) b.call(void 0, a[c], c, a);
  }
  var Ga =
    "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(
      " "
    );

  function Ha(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d) a[c] = d[c];
      for (var f = 0; f < Ga.length; f++)
        (c = Ga[f]),
          Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
  var Ia;
  var r = function (a, b) {
    this.S = (a === Ja && b) || "";
    this.da = Ka;
  };
  r.prototype.F = !0;
  r.prototype.D = function () {
    return this.S;
  };
  r.prototype.toString = function () {
    return "Const{" + this.S + "}";
  };
  var La = function (a) {
      if (a instanceof r && a.constructor === r && a.da === Ka) return a.S;
      Aa("expected object of type Const, got '" + a + "'");
      return "type_error:Const";
    },
    Ka = {},
    Ja = {};
  var Ma = /&/g,
    Na = /</g,
    Oa = />/g,
    Pa = /"/g,
    Qa = /'/g,
    Ra = /\x00/g,
    Sa = /[\x00&<>"']/,
    w = function (a, b) {
      return -1 != a.indexOf(b);
    };
  var x = function (a, b) {
    this.P = b === Ta ? a : "";
  };
  x.prototype.F = !0;
  x.prototype.D = function () {
    return this.P.toString();
  };
  x.prototype.toString = function () {
    return this.P.toString();
  };
  var Ua = function (a) {
      if (a instanceof x && a.constructor === x) return a.P;
      Aa("expected object of type SafeUrl, got '" + a + "' of type " + ka(a));
      return "type_error:SafeUrl";
    },
    Va = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i,
    Wa = function (a) {
      if (a instanceof x) return a;
      a = "object" == typeof a && a.F ? a.D() : String(a);
      za(Va.test(a), "%s does not match the safe URL pattern", a) ||
        (a = "about:invalid#zClosurez");
      return new x(a, Ta);
    },
    Ta = {};
  var Xa = function () {
      var a = q.navigator;
      return a ? a.userAgentData || null : null;
    },
    z;
  a: {
    var Ya = q.navigator;
    if (Ya) {
      var Za = Ya.userAgent;
      if (Za) {
        z = Za;
        break a;
      }
    }
    z = "";
  }
  var $a = {},
    A = function (a, b, c) {
      this.O = c === $a ? a : "";
      this.F = !0;
    };
  A.prototype.D = function () {
    return this.O.toString();
  };
  A.prototype.toString = function () {
    return this.O.toString();
  };
  var ab = function (a) {
      if (a instanceof A && a.constructor === A) return a.O;
      Aa("expected object of type SafeHtml, got '" + a + "' of type " + ka(a));
      return "type_error:SafeHtml";
    },
    bb = new A((q.trustedTypes && q.trustedTypes.emptyHTML) || "", 0, $a);
  var cb = function (a, b) {
    a: {
      try {
        var c = a && a.ownerDocument,
          d = c && (c.defaultView || c.parentWindow);
        d = d || q;
        if (d.Element && d.Location) {
          var e = d;
          break a;
        }
      } catch (g) {}
      e = null;
    }
    if (
      e &&
      "undefined" != typeof e[b] &&
      (!a ||
        (!(a instanceof e[b]) &&
          (a instanceof e.Location || a instanceof e.Element)))
    ) {
      if (ma(a))
        try {
          var f =
            a.constructor.displayName ||
            a.constructor.name ||
            Object.prototype.toString.call(a);
        } catch (g) {
          f = "<object could not be stringified>";
        }
      else f = void 0 === a ? "undefined" : null === a ? "null" : typeof a;
      Aa(
        "Argument is not a %s (or a non-Element, non-Location mock); got: %s",
        b,
        f
      );
    }
    return a;
  };
  var db = {
      MATH: !0,
      SCRIPT: !0,
      STYLE: !0,
      SVG: !0,
      TEMPLATE: !0,
    },
    eb = (function (a) {
      var b = !1,
        c;
      return function () {
        b || ((c = a()), (b = !0));
        return c;
      };
    })(function () {
      if ("undefined" === typeof document) return !1;
      var a = document.createElement("div"),
        b = document.createElement("div");
      b.appendChild(document.createElement("div"));
      a.appendChild(b);
      if (!a.firstChild) return !1;
      b = a.firstChild.firstChild;
      a.innerHTML = ab(bb);
      return !b.parentElement;
    });
  var fb = function (a) {
    Sa.test(a) &&
      (-1 != a.indexOf("&") && (a = a.replace(Ma, "&amp;")),
      -1 != a.indexOf("<") && (a = a.replace(Na, "&lt;")),
      -1 != a.indexOf(">") && (a = a.replace(Oa, "&gt;")),
      -1 != a.indexOf('"') && (a = a.replace(Pa, "&quot;")),
      -1 != a.indexOf("'") && (a = a.replace(Qa, "&#39;")),
      -1 != a.indexOf("\x00") && (a = a.replace(Ra, "&#0;")));
    return a;
  };
  var gb = Xa() ? !1 : w(z, "Opera"),
    hb = Xa() ? !1 : w(z, "Trident") || w(z, "MSIE"),
    jb = w(z, "Edge"),
    kb =
      w(z, "Gecko") &&
      !(w(z.toLowerCase(), "webkit") && !w(z, "Edge")) &&
      !(w(z, "Trident") || w(z, "MSIE")) &&
      !w(z, "Edge"),
    lb = w(z.toLowerCase(), "webkit") && !w(z, "Edge"),
    mb = function () {
      var a = q.document;
      return a ? a.documentMode : void 0;
    },
    nb;
  a: {
    var ob = "",
      pb = (function () {
        var a = z;
        if (kb) return /rv:([^\);]+)(\)|;)/.exec(a);
        if (jb) return /Edge\/([\d\.]+)/.exec(a);
        if (hb) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
        if (lb) return /WebKit\/(\S+)/.exec(a);
        if (gb) return /(?:Version)[ \/]?(\S+)/.exec(a);
      })();
    pb && (ob = pb ? pb[1] : "");
    if (hb) {
      var qb = mb();
      if (null != qb && qb > parseFloat(ob)) {
        nb = String(qb);
        break a;
      }
    }
    nb = ob;
  }
  var rb = nb,
    sb;
  if (q.document && hb) {
    var tb = mb();
    sb = tb ? tb : parseInt(rb, 10) || void 0;
  } else sb = void 0;
  var ub = sb;
  var vb;
  (vb = !hb) || (vb = 9 <= Number(ub));
  var wb = vb;
  var yb = function (a, b) {
      Ea(b, function (c, d) {
        c && "object" == typeof c && c.F && (c = c.D());
        "style" == d
          ? (a.style.cssText = c)
          : "class" == d
          ? (a.className = c)
          : "for" == d
          ? (a.htmlFor = c)
          : xb.hasOwnProperty(d)
          ? a.setAttribute(xb[d], c)
          : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0)
          ? a.setAttribute(d, c)
          : (a[d] = c);
      });
    },
    xb = {
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      colspan: "colSpan",
      frameborder: "frameBorder",
      height: "height",
      maxlength: "maxLength",
      nonce: "nonce",
      role: "role",
      rowspan: "rowSpan",
      type: "type",
      usemap: "useMap",
      valign: "vAlign",
      width: "width",
    },
    zb = function (a, b, c, d) {
      function e(h) {
        h && b.appendChild("string" === typeof h ? a.createTextNode(h) : h);
      }
      for (; d < c.length; d++) {
        var f = c[d];
        if (!la(f) || (ma(f) && 0 < f.nodeType)) e(f);
        else {
          a: {
            if (f && "number" == typeof f.length) {
              if (ma(f)) {
                var g =
                  "function" == typeof f.item || "string" == typeof f.item;
                break a;
              }
              if ("function" === typeof f) {
                g = "function" == typeof f.item;
                break a;
              }
            }
            g = !1;
          }
          Ca(g ? Da(f) : f, e);
        }
      }
    },
    Ab = function (a, b) {
      b = String(b);
      "application/xhtml+xml" === a.contentType && (b = b.toLowerCase());
      return a.createElement(b);
    },
    Bb = function (a) {
      za(a, "Node cannot be null or undefined.");
      return 9 == a.nodeType ? a : a.ownerDocument || a.document;
    },
    Cb = function (a) {
      this.C = a || q.document || document;
    };
  n = Cb.prototype;
  n.getElementsByTagName = function (a, b) {
    return (b || this.C).getElementsByTagName(String(a));
  };
  n.ga = function (a, b, c) {
    var d = this.C,
      e = arguments,
      f = String(e[0]),
      g = e[1];
    if (!wb && g && (g.name || g.type)) {
      f = ["<", f];
      g.name && f.push(' name="', fb(g.name), '"');
      if (g.type) {
        f.push(' type="', fb(g.type), '"');
        var h = {};
        Ha(h, g);
        delete h.type;
        g = h;
      }
      f.push(">");
      f = f.join("");
    }
    f = Ab(d, f);
    g &&
      ("string" === typeof g
        ? (f.className = g)
        : Array.isArray(g)
        ? (f.className = g.join(" "))
        : yb(f, g));
    2 < e.length && zb(d, f, e, 2);
    return f;
  };
  n.createElement = function (a) {
    return Ab(this.C, a);
  };
  n.createTextNode = function (a) {
    return this.C.createTextNode(String(a));
  };
  n.appendChild = function (a, b) {
    za(
      null != a && null != b,
      "goog.dom.appendChild expects non-null arguments"
    );
    a.appendChild(b);
  };
  n.append = function (a, b) {
    zb(Bb(a), a, arguments, 1);
  };
  n.canHaveChildren = function (a) {
    if (1 != a.nodeType) return !1;
    switch (a.tagName) {
      case "APPLET":
      case "AREA":
      case "BASE":
      case "BR":
      case "COL":
      case "COMMAND":
      case "EMBED":
      case "FRAME":
      case "HR":
      case "IMG":
      case "INPUT":
      case "IFRAME":
      case "ISINDEX":
      case "KEYGEN":
      case "LINK":
      case "NOFRAMES":
      case "NOSCRIPT":
      case "META":
      case "OBJECT":
      case "PARAM":
      case "SCRIPT":
      case "SOURCE":
      case "STYLE":
      case "TRACK":
      case "WBR":
        return !1;
    }
    return !0;
  };
  n.removeNode = function (a) {
    return a && a.parentNode ? a.parentNode.removeChild(a) : null;
  };
  n.contains = function (a, b) {
    if (!a || !b) return !1;
    if (a.contains && 1 == b.nodeType) return a == b || a.contains(b);
    if ("undefined" != typeof a.compareDocumentPosition)
      return a == b || !!(a.compareDocumentPosition(b) & 16);
    for (; b && a != b; ) b = b.parentNode;
    return b == a;
  };
  var B = window,
    C = document,
    Db = B.location,
    Eb = function () {},
    Fb = /\[native code\]/,
    D = function (a, b, c) {
      return (a[b] = a[b] || c);
    },
    Gb = function (a) {
      for (var b = 0; b < this.length; b++) if (this[b] === a) return b;
      return -1;
    },
    Hb = function (a) {
      a = a.sort();
      for (var b = [], c = void 0, d = 0; d < a.length; d++) {
        var e = a[d];
        e != c && b.push(e);
        c = e;
      }
      return b;
    },
    Ib = /&/g,
    Jb = /</g,
    Kb = />/g,
    Lb = /"/g,
    Mb = /'/g,
    Nb = function (a) {
      return String(a)
        .replace(Ib, "&amp;")
        .replace(Jb, "&lt;")
        .replace(Kb, "&gt;")
        .replace(Lb, "&quot;")
        .replace(Mb, "&#39;");
    },
    E = function () {
      var a;
      if ((a = Object.create) && Fb.test(a)) a = a(null);
      else {
        a = {};
        for (var b in a) a[b] = void 0;
      }
      return a;
    },
    F = function (a, b) {
      return Object.prototype.hasOwnProperty.call(a, b);
    },
    Ob = function (a) {
      if (Fb.test(Object.keys)) return Object.keys(a);
      var b = [],
        c;
      for (c in a) F(a, c) && b.push(c);
      return b;
    },
    G = function (a, b) {
      a = a || {};
      for (var c in a) F(a, c) && (b[c] = a[c]);
    },
    Pb = function (a) {
      return function () {
        B.setTimeout(a, 0);
      };
    },
    H = function (a, b) {
      if (!a) throw Error(b || "");
    },
    I = D(B, "gapi", {});
  var J = function (a, b, c) {
      var d = new RegExp("([#].*&|[#])" + b + "=([^&#]*)", "g");
      b = new RegExp("([?#].*&|[?#])" + b + "=([^&#]*)", "g");
      if ((a = a && (d.exec(a) || b.exec(a))))
        try {
          c = decodeURIComponent(a[2]);
        } catch (e) {}
      return c;
    },
    Qb = new RegExp(
      /^/.source +
        /([a-zA-Z][-+.a-zA-Z0-9]*:)?/.source +
        /(\/\/[^\/?#]*)?/.source +
        /([^?#]*)?/.source +
        /(\?([^#]*))?/.source +
        /(#((#|[^#])*))?/.source +
        /$/.source
    ),
    Rb = /[\ud800-\udbff][\udc00-\udfff]|[^!-~]/g,
    Sb = new RegExp(
      /(%([^0-9a-fA-F%]|[0-9a-fA-F]([^0-9a-fA-F%])?)?)*/.source +
        /%($|[^0-9a-fA-F]|[0-9a-fA-F]($|[^0-9a-fA-F]))/.source,
      "g"
    ),
    Tb = /%([a-f]|[0-9a-fA-F][a-f])/g,
    Ub = /^(https?|ftp|file|chrome-extension):$/i,
    Vb = function (a) {
      a = String(a);
      a = a
        .replace(Rb, function (e) {
          try {
            return encodeURIComponent(e);
          } catch (f) {
            return encodeURIComponent(e.replace(/^[^%]+$/g, "�"));
          }
        })
        .replace(Sb, function (e) {
          return e.replace(/%/g, "%25");
        })
        .replace(Tb, function (e) {
          return e.toUpperCase();
        });
      a = a.match(Qb) || [];
      var b = E(),
        c = function (e) {
          return e
            .replace(/\\/g, "%5C")
            .replace(/\^/g, "%5E")
            .replace(/`/g, "%60")
            .replace(/\{/g, "%7B")
            .replace(/\|/g, "%7C")
            .replace(/\}/g, "%7D");
        },
        d = !!(a[1] || "").match(Ub);
      b.B = c((a[1] || "") + (a[2] || "") + (a[3] || (a[2] && d ? "/" : "")));
      d = function (e) {
        return c(e.replace(/\?/g, "%3F").replace(/#/g, "%23"));
      };
      b.query = a[5] ? [d(a[5])] : [];
      b.j = a[7] ? [d(a[7])] : [];
      return b;
    },
    Wb = function (a) {
      return (
        a.B +
        (0 < a.query.length ? "?" + a.query.join("&") : "") +
        (0 < a.j.length ? "#" + a.j.join("&") : "")
      );
    },
    Xb = function (a, b) {
      var c = [];
      if (a)
        for (var d in a)
          if (F(a, d) && null != a[d]) {
            var e = b ? b(a[d]) : a[d];
            c.push(encodeURIComponent(d) + "=" + encodeURIComponent(e));
          }
      return c;
    },
    Yb = function (a, b, c, d) {
      a = Vb(a);
      a.query.push.apply(a.query, Xb(b, d));
      a.j.push.apply(a.j, Xb(c, d));
      return Wb(a);
    },
    Zb = new RegExp(
      /\/?\??#?/.source +
        "(" +
        /[\/?#]/i.source +
        "|" +
        /[\uD800-\uDBFF]/i.source +
        "|" +
        /%[c-f][0-9a-f](%[89ab][0-9a-f]){0,2}(%[89ab]?)?/i.source +
        "|" +
        /%[0-9a-f]?/i.source +
        ")$",
      "i"
    ),
    $b = function (a, b) {
      var c = Vb(b);
      b = c.B;
      c.query.length && (b += "?" + c.query.join(""));
      c.j.length && (b += "#" + c.j.join(""));
      var d = "";
      2e3 < b.length &&
        ((d = b),
        (b = b.substr(0, 2e3)),
        (b = b.replace(Zb, "")),
        (d = d.substr(b.length)));
      var e = a.createElement("div");
      a = a.createElement("a");
      c = Vb(b);
      b = c.B;
      c.query.length && (b += "?" + c.query.join(""));
      c.j.length && (b += "#" + c.j.join(""));
      b = new x(b, Ta);
      cb(a, "HTMLAnchorElement");
      b = b instanceof x ? b : Wa(b);
      a.href = Ua(b);
      e.appendChild(a);
      b = e.innerHTML;
      c = new r(Ja, "Assignment to self.");
      Ba(La(c), "must provide justification");
      za(!/^[\s\xa0]*$/.test(La(c)), "must provide non-empty justification");
      void 0 === Ia && (Ia = ua("gapi#html"));
      b = (c = Ia) ? c.createHTML(b) : b;
      b = new A(b, null, $a);
      if (e.tagName && db[e.tagName.toUpperCase()])
        throw Error(
          "goog.dom.safe.setInnerHtml cannot be used to set content of " +
            e.tagName +
            "."
        );
      if (eb()) for (; e.lastChild; ) e.removeChild(e.lastChild);
      e.innerHTML = ab(b);
      b = String(e.firstChild.href);
      e.parentNode && e.parentNode.removeChild(e);
      c = Vb(b + d);
      d = c.B;
      c.query.length && (d += "?" + c.query.join(""));
      c.j.length && (d += "#" + c.j.join(""));
      return d;
    },
    ac = /^https?:\/\/[^\/%\\?#\s]+\/[^\s]*$/i;
  var bc;
  var cc = function (a, b, c, d) {
      if (B[c + "EventListener"]) B[c + "EventListener"](a, b, !1);
      else if (B[d + "tachEvent"]) B[d + "tachEvent"]("on" + a, b);
    },
    dc = function () {
      var a = C.readyState;
      return (
        "complete" === a ||
        ("interactive" === a && -1 == navigator.userAgent.indexOf("MSIE"))
      );
    },
    gc = function (a) {
      var b = ec;
      if (!dc())
        try {
          b();
        } catch (c) {}
      fc(a);
    },
    fc = function (a) {
      if (dc()) a();
      else {
        var b = !1,
          c = function () {
            if (!b) return (b = !0), a.apply(this, arguments);
          };
        B.addEventListener
          ? (B.addEventListener("load", c, !1),
            B.addEventListener("DOMContentLoaded", c, !1))
          : B.attachEvent &&
            (B.attachEvent("onreadystatechange", function () {
              dc() && c.apply(this, arguments);
            }),
            B.attachEvent("onload", c));
      }
    },
    hc = function (a) {
      for (; a.firstChild; ) a.removeChild(a.firstChild);
    },
    ic = {
      button: !0,
      div: !0,
      span: !0,
    };
  var L;
  L = D(B, "___jsl", E());
  D(L, "I", 0);
  D(L, "hel", 10);
  var jc = function (a) {
      return L.dpo ? L.h : J(a, "jsh", L.h);
    },
    kc = function (a) {
      var b = D(L, "sws", []);
      b.push.apply(b, a);
    },
    lc = function (a) {
      return D(L, "watt", E())[a];
    },
    mc = function (a) {
      var b = D(L, "PQ", []);
      L.PQ = [];
      var c = b.length;
      if (0 === c) a();
      else
        for (
          var d = 0,
            e = function () {
              ++d === c && a();
            },
            f = 0;
          f < c;
          f++
        )
          b[f](e);
    },
    nc = function (a) {
      return D(D(L, "H", E()), a, E());
    };
  var oc = D(L, "perf", E()),
    pc = D(oc, "g", E()),
    qc = D(oc, "i", E());
  D(oc, "r", []);
  E();
  E();
  var rc = function (a, b, c) {
      var d = oc.r;
      "function" === typeof d ? d(a, b, c) : d.push([a, b, c]);
    },
    N = function (a, b, c) {
      pc[a] = (!b && pc[a]) || c || new Date().getTime();
      rc(a);
    },
    tc = function (a, b, c) {
      b &&
        0 < b.length &&
        ((b = sc(b)),
        c && 0 < c.length && (b += "___" + sc(c)),
        28 < b.length && (b = b.substr(0, 28) + (b.length - 28)),
        (c = b),
        (b = D(qc, "_p", E())),
        (D(b, c, E())[a] = new Date().getTime()),
        rc(a, "_p", c));
    },
    sc = function (a) {
      return a
        .join("__")
        .replace(/\./g, "_")
        .replace(/\-/g, "_")
        .replace(/,/g, "_");
    };
  var uc = E(),
    vc = [],
    O = function (a) {
      throw Error("Bad hint" + (a ? ": " + a : ""));
    };
  vc.push([
    "jsl",
    function (a) {
      for (var b in a)
        if (F(a, b)) {
          var c = a[b];
          "object" == typeof c ? (L[b] = D(L, b, []).concat(c)) : D(L, b, c);
        }
      if ((b = a.u))
        (a = D(L, "us", [])),
          a.push(b),
          (b = /^https:(.*)$/.exec(b)) && a.push("http:" + b[1]);
    },
  ]);
  var wc = /^(\/[a-zA-Z0-9_\-]+)+$/,
    xc = [/\/amp\//, /\/amp$/, /^\/amp$/],
    yc = /^[a-zA-Z0-9\-_\.,!]+$/,
    zc = /^gapi\.loaded_[0-9]+$/,
    Ac = /^[a-zA-Z0-9,._-]+$/,
    Ec = function (a, b, c, d, e) {
      var f = a.split(";"),
        g = f.shift(),
        h = uc[g],
        k = null;
      h ? (k = h(f, b, c, d)) : O("no hint processor for: " + g);
      k || O("failed to generate load url");
      b = k;
      c = b.match(Bc);
      ((d = b.match(Cc)) &&
        1 === d.length &&
        Dc.test(b) &&
        c &&
        1 === c.length) ||
        O("failed sanity: " + a);
      try {
        if (e && 0 < e.length) {
          b = a = 0;
          for (c = {}; b < e.length; ) {
            var l = e[b++];
            d = void 0;
            d = ma(l)
              ? "o" +
                ((Object.prototype.hasOwnProperty.call(l, na) && l[na]) ||
                  (l[na] = ++oa))
              : (typeof l).charAt(0) + l;
            Object.prototype.hasOwnProperty.call(c, d) ||
              ((c[d] = !0), (e[a++] = l));
          }
          e.length = a;
          k = k + "?le=" + e.join(",");
        }
      } catch (m) {}
      return k;
    },
    Hc = function (a, b, c, d) {
      a = Fc(a);
      zc.test(c) || O("invalid_callback");
      b = Gc(b);
      d = d && d.length ? Gc(d) : null;
      var e = function (f) {
        return encodeURIComponent(f).replace(/%2C/g, ",");
      };
      return [
        encodeURIComponent(a.pathPrefix)
          .replace(/%2C/g, ",")
          .replace(/%2F/g, "/"),
        "/k=",
        e(a.version),
        "/m=",
        e(b),
        d ? "/exm=" + e(d) : "",
        "/rt=j/sv=1/d=1/ed=1",
        a.U ? "/am=" + e(a.U) : "",
        a.$ ? "/rs=" + e(a.$) : "",
        a.ba ? "/t=" + e(a.ba) : "",
        "/cb=",
        e(c),
      ].join("");
    },
    Fc = function (a) {
      "/" !== a.charAt(0) && O("relative path");
      for (var b = a.substring(1).split("/"), c = []; b.length; ) {
        a = b.shift();
        if (!a.length || 0 == a.indexOf(".")) O("empty/relative directory");
        else if (0 < a.indexOf("=")) {
          b.unshift(a);
          break;
        }
        c.push(a);
      }
      a = {};
      for (var d = 0, e = b.length; d < e; ++d) {
        var f = b[d].split("="),
          g = decodeURIComponent(f[0]),
          h = decodeURIComponent(f[1]);
        2 == f.length && g && h && (a[g] = a[g] || h);
      }
      b = "/" + c.join("/");
      wc.test(b) || O("invalid_prefix");
      c = 0;
      for (d = xc.length; c < d; ++c) xc[c].test(b) && O("invalid_prefix");
      c = Ic(a, "k", !0);
      d = Ic(a, "am");
      e = Ic(a, "rs");
      a = Ic(a, "t");
      return {
        pathPrefix: b,
        version: c,
        U: d,
        $: e,
        ba: a,
      };
    },
    Gc = function (a) {
      for (var b = [], c = 0, d = a.length; c < d; ++c) {
        var e = a[c].replace(/\./g, "_").replace(/-/g, "_");
        Ac.test(e) && b.push(e);
      }
      return b.join(",");
    },
    Ic = function (a, b, c) {
      a = a[b];
      !a && c && O("missing: " + b);
      if (a) {
        if (yc.test(a)) return a;
        O("invalid: " + b);
      }
      return null;
    },
    Dc =
      /^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,
    Cc = /\/cb=/g,
    Bc = /\/\//g,
    Jc = function () {
      var a = jc(Db.href);
      if (!a) throw Error("Bad hint");
      return a;
    };
  uc.m = function (a, b, c, d) {
    (a = a[0]) || O("missing_hint");
    return "https://apis.google.com" + Hc(a, b, c, d);
  };
  var Kc = decodeURI("%73cript"),
    Lc = /^[-+_0-9\/A-Za-z]+={0,2}$/,
    Mc = function (a, b) {
      for (var c = [], d = 0; d < a.length; ++d) {
        var e = a[d];
        e && 0 > Gb.call(b, e) && c.push(e);
      }
      return c;
    },
    Nc = function () {
      var a = L.nonce;
      return void 0 !== a
        ? a && a === String(a) && a.match(Lc)
          ? a
          : (L.nonce = null)
        : C.querySelector
        ? (a = C.querySelector("script[nonce]"))
          ? ((a = a.nonce || a.getAttribute("nonce") || ""),
            a && a === String(a) && a.match(Lc)
              ? (L.nonce = a)
              : (L.nonce = null))
          : null
        : null;
    },
    Qc = function (a) {
      if ("loading" != C.readyState) Oc(a);
      else {
        var b = Nc(),
          c = "";
        null !== b && (c = ' nonce="' + b + '"');
        a = "<" + Kc + ' src="' + encodeURI(a) + '"' + c + "></" + Kc + ">";
        C.write(Pc ? Pc.createHTML(a) : a);
      }
    },
    Oc = function (a) {
      var b = C.createElement(Kc);
      b.setAttribute("src", Pc ? Pc.createScriptURL(a) : a);
      a = Nc();
      null !== a && b.setAttribute("nonce", a);
      b.async = "true";
      (a = C.getElementsByTagName(Kc)[0])
        ? a.parentNode.insertBefore(b, a)
        : (C.head || C.body || C.documentElement).appendChild(b);
    },
    Rc = function (a, b) {
      var c = b && b._c;
      if (c)
        for (var d = 0; d < vc.length; d++) {
          var e = vc[d][0],
            f = vc[d][1];
          f && F(c, e) && f(c[e], a, b);
        }
    },
    Tc = function (a, b, c) {
      Sc(function () {
        var d = b === jc(Db.href) ? D(I, "_", E()) : E();
        d = D(nc(b), "_", d);
        a(d);
      }, c);
    },
    Vc = function (a, b) {
      var c = b || {};
      "function" == typeof b && ((c = {}), (c.callback = b));
      Rc(a, c);
      b = [];
      a ? (b = a.split(":")) : c.features && (b = c.features);
      var d = c.h || Jc(),
        e = D(L, "ah", E());
      if (e["::"] && b.length) {
        a = [];
        for (var f = null; (f = b.shift()); ) {
          var g = f.split(".");
          g = e[f] || e[(g[1] && "ns:" + g[0]) || ""] || d;
          var h = (a.length && a[a.length - 1]) || null,
            k = h;
          (h && h.hint == g) ||
            ((k = {
              hint: g,
              features: [],
            }),
            a.push(k));
          k.features.push(f);
        }
        var l = a.length;
        if (1 < l) {
          var m = c.callback;
          m &&
            (c.callback = function () {
              0 == --l && m();
            });
        }
        for (; (b = a.shift()); ) Uc(b.features, c, b.hint);
      } else Uc(b || [], c, d);
    },
    Uc = function (a, b, c) {
      a = Hb(a) || [];
      var d = b.callback,
        e = b.config,
        f = b.timeout,
        g = b.ontimeout,
        h = b.onerror,
        k = void 0;
      "function" == typeof h && (k = h);
      var l = null,
        m = !1;
      if ((f && !g) || (!f && g))
        throw "Timeout requires both the timeout parameter and ontimeout parameter to be set";
      h = D(nc(c), "r", []).sort();
      var t = D(nc(c), "L", []).sort(),
        u = L.le,
        p = [].concat(h),
        K = function (Q, ha) {
          if (m) return 0;
          B.clearTimeout(l);
          t.push.apply(t, y);
          var ia = ((I || {}).config || {}).update;
          ia ? ia(e) : e && D(L, "cu", []).push(e);
          if (ha) {
            tc("me0", Q, p);
            try {
              Tc(ha, c, k);
            } finally {
              tc("me1", Q, p);
            }
          }
          return 1;
        };
      0 < f &&
        (l = B.setTimeout(function () {
          m = !0;
          g();
        }, f));
      var y = Mc(a, t);
      if (y.length) {
        y = Mc(a, h);
        var v = D(L, "CP", []),
          M = v.length;
        v[M] = function (Q) {
          if (!Q) return 0;
          tc("ml1", y, p);
          var ha = function (Fa) {
              v[M] = null;
              K(y, Q) &&
                mc(function () {
                  d && d();
                  Fa();
                });
            },
            ia = function () {
              var Fa = v[M + 1];
              Fa && Fa();
            };
          0 < M && v[M - 1]
            ? (v[M] = function () {
                ha(ia);
              })
            : ha(ia);
        };
        if (y.length) {
          var ib = "loaded_" + L.I++;
          I[ib] = function (Q) {
            v[M](Q);
            I[ib] = null;
          };
          a = Ec(c, y, "gapi." + ib, h, u);
          h.push.apply(h, y);
          tc("ml0", y, p);
          b.sync || B.___gapisync ? Qc(a) : Oc(a);
        } else v[M](Eb);
      } else K(y) && d && d();
    },
    Pc = ua("gapi#gapi");
  var Sc = function (a, b) {
    if (L.hee && 0 < L.hel)
      try {
        return a();
      } catch (c) {
        b && b(c),
          L.hel--,
          Vc("debug_error", function () {
            try {
              window.___jsl.hefn(c);
            } catch (d) {
              throw c;
            }
          });
      }
    else
      try {
        return a();
      } catch (c) {
        throw (b && b(c), c);
      }
  };
  I.load = function (a, b) {
    return Sc(function () {
      return Vc(a, b);
    });
  };
  var Wc = function (a) {
      var b = (window.___jsl = window.___jsl || {});
      b[a] = b[a] || [];
      return b[a];
    },
    Xc = function (a) {
      var b = (window.___jsl = window.___jsl || {});
      b.cfg = (!a && b.cfg) || {};
      return b.cfg;
    },
    Yc = function (a) {
      return "object" === typeof a && /\[native code\]/.test(a.push);
    },
    P = function (a, b, c) {
      if (b && "object" === typeof b)
        for (var d in b)
          !Object.prototype.hasOwnProperty.call(b, d) ||
            (c && "___goc" === d && "undefined" === typeof b[d]) ||
            (a[d] &&
            b[d] &&
            "object" === typeof a[d] &&
            "object" === typeof b[d] &&
            !Yc(a[d]) &&
            !Yc(b[d])
              ? P(a[d], b[d])
              : b[d] && "object" === typeof b[d]
              ? ((a[d] = Yc(b[d]) ? [] : {}), P(a[d], b[d]))
              : (a[d] = b[d]));
    },
    Zc = function (a) {
      if (a && !/^\s+$/.test(a)) {
        for (; 0 == a.charCodeAt(a.length - 1); )
          a = a.substring(0, a.length - 1);
        try {
          var b = window.JSON.parse(a);
        } catch (c) {}
        if ("object" === typeof b) return b;
        try {
          b = new Function("return (" + a + "\n)")();
        } catch (c) {}
        if ("object" === typeof b) return b;
        try {
          b = new Function("return ({" + a + "\n})")();
        } catch (c) {}
        return "object" === typeof b ? b : {};
      }
    },
    $c = function (a, b) {
      var c = {
        ___goc: void 0,
      };
      a.length &&
        a[a.length - 1] &&
        Object.hasOwnProperty.call(a[a.length - 1], "___goc") &&
        "undefined" === typeof a[a.length - 1].___goc &&
        (c = a.pop());
      P(c, b);
      a.push(c);
    },
    ad = function (a) {
      Xc(!0);
      var b = window.___gcfg,
        c = Wc("cu"),
        d = window.___gu;
      b && b !== d && ($c(c, b), (window.___gu = b));
      b = Wc("cu");
      var e = document.scripts || document.getElementsByTagName("script") || [];
      d = [];
      var f = [];
      f.push.apply(f, Wc("us"));
      for (var g = 0; g < e.length; ++g)
        for (var h = e[g], k = 0; k < f.length; ++k)
          h.src && 0 == h.src.indexOf(f[k]) && d.push(h);
      0 == d.length &&
        0 < e.length &&
        e[e.length - 1].src &&
        d.push(e[e.length - 1]);
      for (e = 0; e < d.length; ++e)
        d[e].getAttribute("gapi_processed") ||
          (d[e].setAttribute("gapi_processed", !0),
          (f = d[e])
            ? ((g = f.nodeType),
              (f = 3 == g || 4 == g ? f.nodeValue : f.textContent || ""))
            : (f = void 0),
          (f = Zc(f)) && b.push(f));
      a && $c(c, a);
      d = Wc("cd");
      a = 0;
      for (b = d.length; a < b; ++a) P(Xc(), d[a], !0);
      d = Wc("ci");
      a = 0;
      for (b = d.length; a < b; ++a) P(Xc(), d[a], !0);
      a = 0;
      for (b = c.length; a < b; ++a) P(Xc(), c[a], !0);
    },
    R = function (a) {
      var b = Xc();
      if (!a) return b;
      a = a.split("/");
      for (var c = 0, d = a.length; b && "object" === typeof b && c < d; ++c)
        b = b[a[c]];
      return c === a.length && void 0 !== b ? b : void 0;
    },
    bd = function (a, b) {
      var c;
      if ("string" === typeof a) {
        var d = (c = {});
        a = a.split("/");
        for (var e = 0, f = a.length; e < f - 1; ++e) {
          var g = {};
          d = d[a[e]] = g;
        }
        d[a[e]] = b;
      } else c = a;
      ad(c);
    };
  var cd = function () {
    var a = window.__GOOGLEAPIS;
    a &&
      (a.googleapis &&
        !a["googleapis.config"] &&
        (a["googleapis.config"] = a.googleapis),
      D(L, "ci", []).push(a),
      (window.__GOOGLEAPIS = void 0));
  };
  var dd = {
      callback: 1,
      clientid: 1,
      cookiepolicy: 1,
      openidrealm: -1,
      includegrantedscopes: -1,
      requestvisibleactions: 1,
      scope: 1,
    },
    ed = !1,
    fd = E(),
    gd = function () {
      if (!ed) {
        for (
          var a = document.getElementsByTagName("meta"), b = 0;
          b < a.length;
          ++b
        ) {
          var c = a[b].name.toLowerCase();
          if (0 == c.lastIndexOf("google-signin-", 0)) {
            c = c.substring(14);
            var d = a[b].content;
            dd[c] && d && (fd[c] = d);
          }
        }
        if (window.self !== window.top) {
          a = document.location.toString();
          for (var e in dd) 0 < dd[e] && (b = J(a, e, "")) && (fd[e] = b);
        }
        ed = !0;
      }
      e = E();
      G(fd, e);
      return e;
    },
    hd = function (a) {
      return !!(a.clientid && a.scope && a.callback);
    };
  var id = function () {
    this.i = window.console;
  };
  id.prototype.log = function (a) {
    this.i && this.i.log && this.i.log(a);
  };
  id.prototype.error = function (a) {
    this.i && (this.i.error ? this.i.error(a) : this.i.log && this.i.log(a));
  };
  id.prototype.warn = function (a) {
    this.i && (this.i.warn ? this.i.warn(a) : this.i.log && this.i.log(a));
  };
  id.prototype.debug = function () {};
  var jd = new id();
  var kd = function () {
      return !!L.oa;
    },
    ld = function () {};
  var S = D(L, "rw", E()),
    md = function (a) {
      for (var b in S) a(S[b]);
    },
    nd = function (a, b) {
      (a = S[a]) && a.state < b && (a.state = b);
    };
  var T = function (a) {
    var b = (window.___jsl = window.___jsl || {});
    b.cfg = b.cfg || {};
    b = b.cfg;
    if (!a) return b;
    a = a.split("/");
    for (var c = 0, d = a.length; b && "object" === typeof b && c < d; ++c)
      b = b[a[c]];
    return c === a.length && void 0 !== b ? b : void 0;
  };
  var od =
      /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/u\/(\d)\//,
    pd =
      /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/b\/(\d{10,21})\//,
    qd = function (a) {
      var b = T("googleapis.config/sessionIndex");
      "string" === typeof b && 254 < b.length && (b = null);
      null == b && (b = window.__X_GOOG_AUTHUSER);
      "string" === typeof b && 254 < b.length && (b = null);
      if (null == b) {
        var c = window.google;
        c && (b = c.authuser);
      }
      "string" === typeof b && 254 < b.length && (b = null);
      null == b &&
        ((a = a || window.location.href),
        (b = J(a, "authuser") || null),
        null == b && (b = (b = a.match(od)) ? b[1] : null));
      if (null == b) return null;
      b = String(b);
      254 < b.length && (b = null);
      return b;
    },
    rd = function (a) {
      var b = T("googleapis.config/sessionDelegate");
      "string" === typeof b && 21 < b.length && (b = null);
      null == b &&
        (b = (a = (a || window.location.href).match(pd)) ? a[1] : null);
      if (null == b) return null;
      b = String(b);
      21 < b.length && (b = null);
      return b;
    };
  var sd,
    U,
    V = void 0,
    W = function (a) {
      try {
        return q.JSON.parse.call(q.JSON, a);
      } catch (b) {
        return !1;
      }
    },
    X = function (a) {
      return Object.prototype.toString.call(a);
    },
    td = X(0),
    ud = X(new Date(0)),
    vd = X(!0),
    wd = X(""),
    xd = X({}),
    yd = X([]),
    Y = function (a, b) {
      if (b)
        for (var c = 0, d = b.length; c < d; ++c)
          if (a === b[c])
            throw new TypeError("Converting circular structure to JSON");
      d = typeof a;
      if ("undefined" !== d) {
        c = Array.prototype.slice.call(b || [], 0);
        c[c.length] = a;
        b = [];
        var e = X(a);
        if (
          null != a &&
          "function" === typeof a.toJSON &&
          (Object.prototype.hasOwnProperty.call(a, "toJSON") ||
            ((e !== yd ||
              (a.constructor !== Array && a.constructor !== Object)) &&
              (e !== xd ||
                (a.constructor !== Array && a.constructor !== Object)) &&
              e !== wd &&
              e !== td &&
              e !== vd &&
              e !== ud))
        )
          return Y(a.toJSON.call(a), c);
        if (null == a) b[b.length] = "null";
        else if (e === td)
          (a = Number(a)),
            isNaN(a) || isNaN(a - a)
              ? (a = "null")
              : -0 === a && 0 > 1 / a && (a = "-0"),
            (b[b.length] = String(a));
        else if (e === vd) b[b.length] = String(!!Number(a));
        else {
          if (e === ud) return Y(a.toISOString.call(a), c);
          if (e === yd && X(a.length) === td) {
            b[b.length] = "[";
            var f = 0;
            for (d = Number(a.length) >> 0; f < d; ++f)
              f && (b[b.length] = ","), (b[b.length] = Y(a[f], c) || "null");
            b[b.length] = "]";
          } else if (e == wd && X(a.length) === td) {
            b[b.length] = '"';
            f = 0;
            for (c = Number(a.length) >> 0; f < c; ++f)
              (d = String.prototype.charAt.call(a, f)),
                (e = String.prototype.charCodeAt.call(a, f)),
                (b[b.length] =
                  "\b" === d
                    ? "\\b"
                    : "\f" === d
                    ? "\\f"
                    : "\n" === d
                    ? "\\n"
                    : "\r" === d
                    ? "\\r"
                    : "\t" === d
                    ? "\\t"
                    : "\\" === d || '"' === d
                    ? "\\" + d
                    : 31 >= e
                    ? "\\u" + (e + 65536).toString(16).substr(1)
                    : 32 <= e && 65535 >= e
                    ? d
                    : "�");
            b[b.length] = '"';
          } else if ("object" === d) {
            b[b.length] = "{";
            d = 0;
            for (f in a)
              Object.prototype.hasOwnProperty.call(a, f) &&
                ((e = Y(a[f], c)),
                void 0 !== e &&
                  (d++ && (b[b.length] = ","),
                  (b[b.length] = Y(f)),
                  (b[b.length] = ":"),
                  (b[b.length] = e)));
            b[b.length] = "}";
          } else return;
        }
        return b.join("");
      }
    },
    zd = /[\0-\x07\x0b\x0e-\x1f]/,
    Ad = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*[\0-\x1f]/,
    Bd = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\[^\\\/"bfnrtu]/,
    Cd =
      /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\u([0-9a-fA-F]{0,3}[^0-9a-fA-F])/,
    Dd = /"([^\0-\x1f\\"]|\\[\\\/"bfnrt]|\\u[0-9a-fA-F]{4})*"/g,
    Ed = /-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/g,
    Fd = /[ \t\n\r]+/g,
    Gd = /[^"]:/,
    Hd = /""/g,
    Id = /true|false|null/g,
    Jd = /00/,
    Kd = /[\{]([^0\}]|0[^:])/,
    Ld = /(^|\[)[,:]|[,:](\]|\}|[,:]|$)/,
    Md = /[^\[,:][\[\{]/,
    Nd = /^(\{|\}|\[|\]|,|:|0)+/,
    Od = /\u2028/g,
    Pd = /\u2029/g,
    Qd = function (a) {
      a = String(a);
      if (zd.test(a) || Ad.test(a) || Bd.test(a) || Cd.test(a)) return !1;
      var b = a.replace(Dd, '""');
      b = b.replace(Ed, "0");
      b = b.replace(Fd, "");
      if (Gd.test(b)) return !1;
      b = b.replace(Hd, "0");
      b = b.replace(Id, "0");
      if (
        Jd.test(b) ||
        Kd.test(b) ||
        Ld.test(b) ||
        Md.test(b) ||
        !b ||
        (b = b.replace(Nd, ""))
      )
        return !1;
      a = a.replace(Od, "\\u2028").replace(Pd, "\\u2029");
      b = void 0;
      try {
        b = V
          ? [W(a)]
          : eval(
              "(function (var_args) {\n  return Array.prototype.slice.call(arguments, 0);\n})(\n" +
                a +
                "\n)"
            );
      } catch (c) {
        return !1;
      }
      return b && 1 === b.length ? b[0] : !1;
    },
    Rd = function () {
      var a = ((q.document || {}).scripts || []).length;
      if ((void 0 === sd || void 0 === V || U !== a) && -1 !== U) {
        sd = V = !1;
        U = -1;
        try {
          try {
            V =
              !!q.JSON &&
              '{"a":[3,true,"1970-01-01T00:00:00.000Z"]}' ===
                q.JSON.stringify.call(q.JSON, {
                  a: [3, !0, new Date(0)],
                  c: function () {},
                }) &&
              !0 === W("true") &&
              3 === W('[{"a":3}]')[0].a;
          } catch (b) {}
          sd = V && !W("[00]") && !W('"\u0007"') && !W('"\\0"') && !W('"\\v"');
        } finally {
          U = a;
        }
      }
    },
    Sd = function (a) {
      if (-1 === U) return !1;
      Rd();
      return (sd ? W : Qd)(a);
    },
    Td = function (a) {
      if (-1 !== U) return Rd(), V ? q.JSON.stringify.call(q.JSON, a) : Y(a);
    },
    Ud =
      !Date.prototype.toISOString ||
      "function" !== typeof Date.prototype.toISOString ||
      "1970-01-01T00:00:00.000Z" !== new Date(0).toISOString(),
    Vd = function () {
      var a = Date.prototype.getUTCFullYear.call(this);
      return [
        0 > a
          ? "-" + String(1e6 - a).substr(1)
          : 9999 >= a
          ? String(1e4 + a).substr(1)
          : "+" + String(1e6 + a).substr(1),
        "-",
        String(101 + Date.prototype.getUTCMonth.call(this)).substr(1),
        "-",
        String(100 + Date.prototype.getUTCDate.call(this)).substr(1),
        "T",
        String(100 + Date.prototype.getUTCHours.call(this)).substr(1),
        ":",
        String(100 + Date.prototype.getUTCMinutes.call(this)).substr(1),
        ":",
        String(100 + Date.prototype.getUTCSeconds.call(this)).substr(1),
        ".",
        String(1e3 + Date.prototype.getUTCMilliseconds.call(this)).substr(1),
        "Z",
      ].join("");
    };
  Date.prototype.toISOString = Ud ? Vd : Date.prototype.toISOString;
  var Wd = function () {
    this.blockSize = -1;
  };
  var Xd = function () {
    this.blockSize = -1;
    this.blockSize = 64;
    this.g = [];
    this.L = [];
    this.ea = [];
    this.H = [];
    this.H[0] = 128;
    for (var a = 1; a < this.blockSize; ++a) this.H[a] = 0;
    this.J = this.v = 0;
    this.reset();
  };
  sa(Xd, Wd);
  Xd.prototype.reset = function () {
    this.g[0] = 1732584193;
    this.g[1] = 4023233417;
    this.g[2] = 2562383102;
    this.g[3] = 271733878;
    this.g[4] = 3285377520;
    this.J = this.v = 0;
  };
  var Yd = function (a, b, c) {
    c || (c = 0);
    var d = a.ea;
    if ("string" === typeof b)
      for (var e = 0; 16 > e; e++)
        (d[e] =
          (b.charCodeAt(c) << 24) |
          (b.charCodeAt(c + 1) << 16) |
          (b.charCodeAt(c + 2) << 8) |
          b.charCodeAt(c + 3)),
          (c += 4);
    else
      for (e = 0; 16 > e; e++)
        (d[e] = (b[c] << 24) | (b[c + 1] << 16) | (b[c + 2] << 8) | b[c + 3]),
          (c += 4);
    for (e = 16; 80 > e; e++) {
      var f = d[e - 3] ^ d[e - 8] ^ d[e - 14] ^ d[e - 16];
      d[e] = ((f << 1) | (f >>> 31)) & 4294967295;
    }
    b = a.g[0];
    c = a.g[1];
    var g = a.g[2],
      h = a.g[3],
      k = a.g[4];
    for (e = 0; 80 > e; e++) {
      if (40 > e)
        if (20 > e) {
          f = h ^ (c & (g ^ h));
          var l = 1518500249;
        } else (f = c ^ g ^ h), (l = 1859775393);
      else
        60 > e
          ? ((f = (c & g) | (h & (c | g))), (l = 2400959708))
          : ((f = c ^ g ^ h), (l = 3395469782));
      f = (((b << 5) | (b >>> 27)) + f + k + l + d[e]) & 4294967295;
      k = h;
      h = g;
      g = ((c << 30) | (c >>> 2)) & 4294967295;
      c = b;
      b = f;
    }
    a.g[0] = (a.g[0] + b) & 4294967295;
    a.g[1] = (a.g[1] + c) & 4294967295;
    a.g[2] = (a.g[2] + g) & 4294967295;
    a.g[3] = (a.g[3] + h) & 4294967295;
    a.g[4] = (a.g[4] + k) & 4294967295;
  };
  Xd.prototype.update = function (a, b) {
    if (null != a) {
      void 0 === b && (b = a.length);
      for (var c = b - this.blockSize, d = 0, e = this.L, f = this.v; d < b; ) {
        if (0 == f) for (; d <= c; ) Yd(this, a, d), (d += this.blockSize);
        if ("string" === typeof a)
          for (; d < b; ) {
            if (((e[f] = a.charCodeAt(d)), ++f, ++d, f == this.blockSize)) {
              Yd(this, e);
              f = 0;
              break;
            }
          }
        else
          for (; d < b; )
            if (((e[f] = a[d]), ++f, ++d, f == this.blockSize)) {
              Yd(this, e);
              f = 0;
              break;
            }
      }
      this.v = f;
      this.J += b;
    }
  };
  Xd.prototype.digest = function () {
    var a = [],
      b = 8 * this.J;
    56 > this.v
      ? this.update(this.H, 56 - this.v)
      : this.update(this.H, this.blockSize - (this.v - 56));
    for (var c = this.blockSize - 1; 56 <= c; c--)
      (this.L[c] = b & 255), (b /= 256);
    Yd(this, this.L);
    for (c = b = 0; 5 > c; c++)
      for (var d = 24; 0 <= d; d -= 8) (a[b] = (this.g[c] >> d) & 255), ++b;
    return a;
  };
  var Zd = function () {
    this.R = new Xd();
  };
  Zd.prototype.reset = function () {
    this.R.reset();
  };
  var $d = B.crypto,
    ae = !1,
    be = 0,
    ce = 0,
    de = 1,
    ee = 0,
    fe = "",
    ge = function (a) {
      a = a || B.event;
      var b = (a.screenX + a.clientX) << 16;
      b += a.screenY + a.clientY;
      b *= new Date().getTime() % 1e6;
      de = (de * b) % ee;
      0 < be && ++ce == be && cc("mousemove", ge, "remove", "de");
    },
    he = function (a) {
      var b = new Zd();
      a = unescape(encodeURIComponent(a));
      for (var c = [], d = 0, e = a.length; d < e; ++d) c.push(a.charCodeAt(d));
      b.R.update(c);
      b = b.R.digest();
      a = "";
      for (c = 0; c < b.length; c++)
        a +=
          "0123456789ABCDEF".charAt(Math.floor(b[c] / 16)) +
          "0123456789ABCDEF".charAt(b[c] % 16);
      return a;
    };
  ae = !!$d && "function" == typeof $d.getRandomValues;
  ae ||
    ((ee = 1e6 * (screen.width * screen.width + screen.height)),
    (fe = he(
      C.cookie +
        "|" +
        C.location +
        "|" +
        new Date().getTime() +
        "|" +
        Math.random()
    )),
    (be = T("random/maxObserveMousemove") || 0),
    0 != be && cc("mousemove", ge, "add", "at"));
  var ie = function () {
      var a = L.onl;
      if (!a) {
        a = E();
        L.onl = a;
        var b = E();
        a.e = function (c) {
          var d = b[c];
          d && (delete b[c], d());
        };
        a.a = function (c, d) {
          b[c] = d;
        };
        a.r = function (c) {
          delete b[c];
        };
      }
      return a;
    },
    je = function (a, b) {
      b = b.onload;
      return "function" === typeof b ? (ie().a(a, b), b) : null;
    },
    ke = function (a) {
      H(/^\w+$/.test(a), "Unsupported id - " + a);
      return 'onload="window.___jsl.onl.e(&#34;' + a + '&#34;)"';
    },
    le = function (a) {
      ie().r(a);
    };
  var me = {
      allowtransparency: "true",
      frameborder: "0",
      hspace: "0",
      marginheight: "0",
      marginwidth: "0",
      scrolling: "no",
      style: "",
      tabindex: "0",
      vspace: "0",
      width: "100%",
    },
    ne = {
      allowtransparency: !0,
      onload: !0,
    },
    oe = 0,
    pe = function (a) {
      H(!a || ac.test(a), "Illegal url for new iframe - " + a);
    },
    qe = function (a, b, c, d, e) {
      pe(c.src);
      var f,
        g = je(d, c),
        h = g ? ke(d) : "";
      try {
        document.all &&
          (f = a.createElement(
            '<iframe frameborder="' +
              Nb(String(c.frameborder)) +
              '" scrolling="' +
              Nb(String(c.scrolling)) +
              '" ' +
              h +
              ' name="' +
              Nb(String(c.name)) +
              '"/>'
          ));
      } catch (l) {
      } finally {
        f ||
          ((f = (a ? new Cb(Bb(a)) : wa || (wa = new Cb())).ga("IFRAME")),
          g &&
            ((f.onload = function () {
              f.onload = null;
              g.call(this);
            }),
            le(d)));
      }
      f.setAttribute("ng-non-bindable", "");
      for (var k in c)
        (a = c[k]),
          "style" === k && "object" === typeof a
            ? G(a, f.style)
            : ne[k] || f.setAttribute(k, String(a));
      (k = (e && e.beforeNode) || null) || (e && e.dontclear) || hc(b);
      b.insertBefore(f, k);
      f = k ? k.previousSibling : b.lastChild;
      c.allowtransparency && (f.allowTransparency = !0);
      return f;
    };
  var re = /^:[\w]+$/,
    se = /:([a-zA-Z_]+):/g,
    te = function () {
      var a = qd() || "0",
        b = rd();
      var c = qd(void 0) || a;
      var d = rd(void 0),
        e = "";
      c && (e += "u/" + encodeURIComponent(String(c)) + "/");
      d && (e += "b/" + encodeURIComponent(String(d)) + "/");
      c = e || null;
      (e = (d = !1 === T("isLoggedIn")) ? "_/im/" : "") && (c = "");
      var f = T("iframes/:socialhost:"),
        g = T("iframes/:im_socialhost:");
      return (bc = {
        socialhost: f,
        ctx_socialhost: d ? g : f,
        session_index: a,
        session_delegate: b,
        session_prefix: c,
        im_prefix: e,
      });
    },
    ue = function (a, b) {
      return te()[b] || "";
    },
    ve = function (a) {
      return function (b, c) {
        return a ? te()[c] || a[c] || "" : te()[c] || "";
      };
    };
  var we = function (a) {
      var b;
      a.match(/^https?%3A/i) && (b = decodeURIComponent(a));
      return $b(document, b ? b : a);
    },
    xe = function (a) {
      a = a || "canonical";
      for (
        var b = document.getElementsByTagName("link"), c = 0, d = b.length;
        c < d;
        c++
      ) {
        var e = b[c],
          f = e.getAttribute("rel");
        if (
          f &&
          f.toLowerCase() == a &&
          (e = e.getAttribute("href")) &&
          (e = we(e)) &&
          null != e.match(/^https?:\/\/[\w\-_\.]+/i)
        )
          return e;
      }
      return window.location.href;
    };
  var ye = {
      se: "0",
    },
    ze = {
      post: !0,
    },
    Ae = {
      style:
        "position:absolute;top:-10000px;width:450px;margin:0px;border-style:none",
    },
    Be =
      "onPlusOne _ready _close _open _resizeMe _renderstart oncircled drefresh erefresh".split(
        " "
      ),
    Ce = D(L, "WI", E()),
    De = function (a, b, c) {
      var d;
      var e = {};
      var f = (d = a);
      "plus" == a &&
        b.action &&
        ((d = a + "_" + b.action), (f = a + "/" + b.action));
      (d = R("iframes/" + d + "/url")) ||
        (d =
          ":im_socialhost:/:session_prefix::im_prefix:_/widget/render/" +
          f +
          "?usegapi=1");
      for (var g in ye) e[g] = g + "/" + (b[g] || ye[g]) + "/";
      e = $b(C, d.replace(se, ve(e)));
      g = "iframes/" + a + "/params/";
      f = {};
      G(b, f);
      (d = R("lang") || R("gwidget/lang")) && (f.hl = d);
      ze[a] ||
        (f.origin =
          window.location.origin ||
          window.location.protocol + "//" + window.location.host);
      f.exp = R(g + "exp");
      if ((g = R(g + "location")))
        for (d = 0; d < g.length; d++) {
          var h = g[d];
          f[h] = B.location[h];
        }
      switch (a) {
        case "plus":
        case "follow":
          g = f.href;
          d = b.action ? void 0 : "publisher";
          g = (g = "string" == typeof g ? g : void 0) ? we(g) : xe(d);
          f.url = g;
          delete f.href;
          break;
        case "plusone":
          g = (g = b.href) ? we(g) : xe();
          f.url = g;
          g = b.db;
          d = R();
          null == g &&
            d &&
            ((g = d.db), null == g && (g = d.gwidget && d.gwidget.db));
          f.db = g || void 0;
          g = b.ecp;
          d = R();
          null == g &&
            d &&
            ((g = d.ecp), null == g && (g = d.gwidget && d.gwidget.ecp));
          f.ecp = g || void 0;
          delete f.href;
          break;
        case "signin":
          f.url = xe();
      }
      L.ILI && (f.iloader = "1");
      delete f["data-onload"];
      delete f.rd;
      for (var k in ye) f[k] && delete f[k];
      f.gsrc = R("iframes/:source:");
      k = R("inline/css");
      "undefined" !== typeof k && 0 < c && k >= c && (f.ic = "1");
      k = /^#|^fr-/;
      c = {};
      for (var l in f)
        F(f, l) && k.test(l) && ((c[l.replace(k, "")] = f[l]), delete f[l]);
      l = "q" == R("iframes/" + a + "/params/si") ? f : c;
      k = gd();
      for (var m in k) !F(k, m) || F(f, m) || F(c, m) || (l[m] = k[m]);
      m = [].concat(Be);
      (l = R("iframes/" + a + "/methods")) &&
        "object" === typeof l &&
        Fb.test(l.push) &&
        (m = m.concat(l));
      for (var t in b)
        F(b, t) &&
          /^on/.test(t) &&
          ("plus" != a || "onconnect" != t) &&
          (m.push(t), delete f[t]);
      delete f.callback;
      c._methods = m.join(",");
      return Yb(e, f, c);
    },
    Ee = ["style", "data-gapiscan"],
    Ge = function (a) {
      for (
        var b = E(),
          c = 0 != a.nodeName.toLowerCase().indexOf("g:"),
          d = 0,
          e = a.attributes.length;
        d < e;
        d++
      ) {
        var f = a.attributes[d],
          g = f.name,
          h = f.value;
        0 <= Gb.call(Ee, g) ||
          (c && 0 != g.indexOf("data-")) ||
          "null" === h ||
          ("specified" in f && !f.specified) ||
          (c && (g = g.substr(5)), (b[g.toLowerCase()] = h));
      }
      a = a.style;
      (c = Fe(a && a.height)) && (b.height = String(c));
      (a = Fe(a && a.width)) && (b.width = String(a));
      return b;
    },
    Fe = function (a) {
      var b = void 0;
      "number" === typeof a
        ? (b = a)
        : "string" === typeof a && (b = parseInt(a, 10));
      return b;
    },
    Ie = function () {
      var a = L.drw;
      md(function (b) {
        if (a !== b.id && 4 != b.state && "share" != b.type) {
          var c = b.id,
            d = b.type,
            e = b.url;
          b = b.userParams;
          var f = C.getElementById(c);
          if (f) {
            var g = De(d, b, 0);
            g
              ? ((f = f.parentNode),
                e.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") !==
                  g.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") &&
                  ((b.dontclear = !0),
                  (b.rd = !0),
                  (b.ri = !0),
                  (b.type = d),
                  He(f, b),
                  (d = S[f.lastChild.id]) && (d.oid = c),
                  nd(c, 4)))
              : delete S[c];
          } else delete S[c];
        }
      });
    };
  var Je,
    Ke,
    Le,
    Me,
    Ne,
    Oe = /(?:^|\s)g-((\S)*)(?:$|\s)/,
    Pe = {
      plusone: !0,
      autocomplete: !0,
      profile: !0,
      signin: !0,
      signin2: !0,
    };
  Je = D(L, "SW", E());
  Ke = D(L, "SA", E());
  Le = D(L, "SM", E());
  Me = D(L, "FW", []);
  Ne = null;
  var Re = function (a, b) {
      Qe(void 0, !1, a, b);
    },
    Qe = function (a, b, c, d) {
      N("ps0", !0);
      c = ("string" === typeof c ? document.getElementById(c) : c) || C;
      var e = C.documentMode;
      if (c.querySelectorAll && (!e || 8 < e)) {
        e = d ? [d] : Ob(Je).concat(Ob(Ke)).concat(Ob(Le));
        for (var f = [], g = 0; g < e.length; g++) {
          var h = e[g];
          f.push(".g-" + h, "g\\:" + h);
        }
        e = c.querySelectorAll(f.join(","));
      } else e = c.getElementsByTagName("*");
      c = E();
      for (f = 0; f < e.length; f++) {
        g = e[f];
        var k = g;
        h = d;
        var l = k.nodeName.toLowerCase(),
          m = void 0;
        if (k.getAttribute("data-gapiscan")) h = null;
        else {
          var t = l.indexOf("g:");
          0 == t
            ? (m = l.substr(2))
            : (t =
                (t = String(k.className || k.getAttribute("class"))) &&
                Oe.exec(t)) && (m = t[1]);
          h = !m || !(Je[m] || Ke[m] || Le[m]) || (h && m !== h) ? null : m;
        }
        h &&
          (Pe[h] ||
            0 == g.nodeName.toLowerCase().indexOf("g:") ||
            0 != Ob(Ge(g)).length) &&
          (g.setAttribute("data-gapiscan", !0), D(c, h, []).push(g));
      }
      if (b)
        for (var u in c)
          for (b = c[u], d = 0; d < b.length; d++)
            b[d].setAttribute("data-onload", !0);
      for (var p in c) Me.push(p);
      N("ps1", !0);
      if ((u = Me.join(":")) || a)
        try {
          I.load(u, a);
        } catch (y) {
          jd.log(y);
          return;
        }
      if (Se(Ne || {}))
        for (var K in c) {
          a = c[K];
          p = 0;
          for (b = a.length; p < b; p++) a[p].removeAttribute("data-gapiscan");
          Te(K);
        }
      else {
        d = [];
        for (K in c)
          for (a = c[K], p = 0, b = a.length; p < b; p++)
            (e = a[p]), Ue(K, e, Ge(e), d, b);
        Ve(u, d);
      }
    },
    We = function (a) {
      var b = D(I, a, {});
      b.go ||
        ((b.go = function (c) {
          return Re(c, a);
        }),
        (b.render = function (c, d) {
          d = d || {};
          d.type = a;
          return He(c, d);
        }));
    },
    Xe = function (a) {
      Je[a] = !0;
    },
    Ye = function (a) {
      Ke[a] = !0;
    },
    Ze = function (a) {
      Le[a] = !0;
    };
  var Te = function (a, b) {
      var c = lc(a);
      b && c
        ? (c(b), (c = b.iframeNode) && c.setAttribute("data-gapiattached", !0))
        : I.load(a, function () {
            var d = lc(a),
              e = b && b.iframeNode,
              f = b && b.userParams;
            e && d
              ? (d(b), e.setAttribute("data-gapiattached", !0))
              : ((d = I[a].go),
                "signin2" == a ? d(e, f) : d(e && e.parentNode, f));
          });
    },
    Se = function () {
      return !1;
    },
    Ve = function () {},
    Ue = function (a, b, c, d, e, f, g) {
      switch ($e(b, a, f)) {
        case 0:
          a = Le[a] ? a + "_annotation" : a;
          d = {};
          d.iframeNode = b;
          d.userParams = c;
          Te(a, d);
          break;
        case 1:
          if (b.parentNode) {
            for (var h in c) {
              if ((f = F(c, h)))
                (f = c[h]),
                  (f =
                    !!f &&
                    "object" === typeof f &&
                    (!f.toString ||
                      f.toString === Object.prototype.toString ||
                      f.toString === Array.prototype.toString));
              if (f)
                try {
                  c[h] = Td(c[h]);
                } catch (M) {
                  delete c[h];
                }
            }
            f = !0;
            c.dontclear && (f = !1);
            delete c.dontclear;
            ld();
            h = De(a, c, e);
            e = g || {};
            e.allowPost = 1;
            e.attributes = Ae;
            e.dontclear = !f;
            g = {};
            g.userParams = c;
            g.url = h;
            g.type = a;
            if (c.rd) var k = b;
            else
              (k = document.createElement("div")),
                b.setAttribute("data-gapistub", !0),
                (k.style.cssText =
                  "position:absolute;width:450px;left:-10000px;"),
                b.parentNode.insertBefore(k, b);
            g.siteElement = k;
            k.id ||
              ((b = k),
              D(Ce, a, 0),
              (f = "___" + a + "_" + Ce[a]++),
              (b.id = f));
            b = E();
            b[">type"] = a;
            G(c, b);
            f = h;
            c = k;
            h = e || {};
            b = h.attributes || {};
            H(
              !(h.allowPost || h.forcePost) || !b.onload,
              "onload is not supported by post iframe (allowPost or forcePost)"
            );
            e = b = f;
            re.test(b) &&
              ((e = T("iframes/" + e.substring(1) + "/url")),
              H(!!e, "Unknown iframe url config for - " + b));
            f = $b(C, e.replace(se, ue));
            b = c.ownerDocument || C;
            e = h;
            var l = 0;
            do k = e.id || ["I", oe++, "_", new Date().getTime()].join("");
            while (b.getElementById(k) && 5 > ++l);
            H(5 > l, "Error creating iframe id");
            e = k;
            k = h;
            l = {};
            var m = {};
            b.documentMode &&
              9 > b.documentMode &&
              (l.hostiemode = b.documentMode);
            G(k.queryParams || {}, l);
            G(k.fragmentParams || {}, m);
            var t = k.pfname;
            var u = E();
            T("iframes/dropLegacyIdParam") || (u.id = e);
            u._gfid = e;
            u.parent = b.location.protocol + "//" + b.location.host;
            var p = J(b.location.href, "parent");
            t = t || "";
            !t &&
              p &&
              ((p =
                J(b.location.href, "_gfid", "") ||
                J(b.location.href, "id", "")),
              (t = J(b.location.href, "pfname", "")),
              (t = p ? t + "/" + p : ""));
            t ||
              ((p = Sd(J(b.location.href, "jcp", ""))) &&
                "object" == typeof p &&
                (t = (t = p.id) ? p.pfname + "/" + t : ""));
            u.pfname = t;
            k.connectWithJsonParam && ((p = {}), (p.jcp = Td(u)), (u = p));
            p = J(f, "rpctoken") || l.rpctoken || m.rpctoken;
            if (!p) {
              if (!(p = k.rpctoken)) {
                p = String;
                t = Math;
                var K = t.round;
                if (ae) {
                  var y = new B.Uint32Array(1);
                  $d.getRandomValues(y);
                  y = Number("0." + y[0]);
                } else
                  (y = de),
                    (y += parseInt(fe.substr(0, 20), 16)),
                    (fe = he(fe)),
                    (y /= ee + Math.pow(16, 20));
                p = p(K.call(t, 1e8 * y));
              }
              u.rpctoken = p;
            }
            k.rpctoken = p;
            G(u, k.connectWithQueryParams ? l : m);
            p = b.location.href;
            u = E();
            (t = J(p, "_bsh", L.bsh)) && (u._bsh = t);
            (p = jc(p)) && (u.jsh = p);
            k.hintInFragment ? G(u, m) : G(u, l);
            l = Yb(f, l, m, k.paramsSerializer);
            f = h;
            m = E();
            G(me, m);
            G(f.attributes, m);
            m.name = m.id = e;
            m.src = l;
            h.eurl = l;
            h = (k = h) || {};
            f = !!h.allowPost;
            if (h.forcePost || (f && 2e3 < l.length)) {
              f = Vb(l);
              m.src = "";
              k.dropDataPostorigin || (m["data-postorigin"] = l);
              h = qe(b, c, m, e);
              if (-1 != navigator.userAgent.indexOf("WebKit")) {
                var v = h.contentWindow.document;
                v.open();
                l = v.createElement("div");
                m = {};
                u = e + "_inner";
                m.name = u;
                m.src = "";
                m.style = "display:none";
                qe(b, l, m, u, k);
              }
              l = (k = f.query[0]) ? k.split("&") : [];
              k = [];
              for (m = 0; m < l.length; m++)
                (u = l[m].split("=", 2)),
                  k.push([decodeURIComponent(u[0]), decodeURIComponent(u[1])]);
              f.query = [];
              l = Wb(f);
              H(ac.test(l), "Invalid URL: " + l);
              f = b.createElement("form");
              f.method = "POST";
              f.target = e;
              f.style.display = "none";
              e = l instanceof x ? l : Wa(l);
              cb(f, "HTMLFormElement").action = Ua(e);
              for (e = 0; e < k.length; e++)
                (l = b.createElement("input")),
                  (l.type = "hidden"),
                  (l.name = k[e][0]),
                  (l.value = k[e][1]),
                  f.appendChild(l);
              c.appendChild(f);
              f.submit();
              f.parentNode.removeChild(f);
              v && v.close();
              v = h;
            } else v = qe(b, c, m, e, k);
            g.iframeNode = v;
            g.id = v.getAttribute("id");
            v = g.id;
            c = E();
            c.id = v;
            c.userParams = g.userParams;
            c.url = g.url;
            c.type = g.type;
            c.state = 1;
            S[v] = c;
            v = g;
          } else v = null;
          v && ((g = v.id) && d.push(g), Te(a, v));
      }
    },
    $e = function (a, b, c) {
      if (a && 1 === a.nodeType && b) {
        if (c) return 1;
        if (Le[b]) {
          if (ic[a.nodeName.toLowerCase()])
            return (a = a.innerHTML) && a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
              ? 0
              : 1;
        } else {
          if (Ke[b]) return 0;
          if (Je[b]) return 1;
        }
      }
      return null;
    },
    He = function (a, b) {
      var c = b.type;
      delete b.type;
      var d =
        ("string" === typeof a ? document.getElementById(a) : a) || void 0;
      if (d) {
        a = {};
        for (var e in b) F(b, e) && (a[e.toLowerCase()] = b[e]);
        a.rd = 1;
        (b = !!a.ri) && delete a.ri;
        e = [];
        Ue(c, d, a, e, 0, b, void 0);
        Ve(c, e);
      } else
        jd.log(
          "string" === "gapi." + c + ".render: missing element " + typeof a
            ? a
            : ""
        );
    };
  D(I, "platform", {}).go = Re;
  Se = function (a) {
    for (var b = ["_c", "jsl", "h"], c = 0; c < b.length && a; c++) a = a[b[c]];
    b = jc(Db.href);
    return !a || (0 != a.indexOf("n;") && 0 != b.indexOf("n;") && a !== b);
  };
  Ve = function (a, b) {
    af(a, b);
  };
  var ec = function (a) {
      Qe(a, !0);
    },
    bf = function (a, b) {
      b = b || [];
      for (var c = 0; c < b.length; ++c) a(b[c]);
      for (a = 0; a < b.length; a++) We(b[a]);
    };
  vc.push([
    "platform",
    function (a, b, c) {
      Ne = c;
      b && Me.push(b);
      bf(Xe, a);
      bf(Ye, c._c.annotation);
      bf(Ze, c._c.bimodal);
      cd();
      ad();
      if ("explicit" != R("parsetags")) {
        kc(a);
        hd(gd()) && !R("disableRealtimeCallback") && ld();
        if (c && (a = c.callback)) {
          var d = Pb(a);
          delete c.callback;
        }
        gc(function () {
          ec(d);
        });
      }
    },
  ]);
  I._pl = !0;
  var cf = function (a) {
    a = (a = S[a]) ? a.oid : void 0;
    if (a) {
      var b = C.getElementById(a);
      b && b.parentNode.removeChild(b);
      delete S[a];
      cf(a);
    }
  };
  var df = /^\{h:'/,
    ef = /^!_/,
    ff = "",
    af = function (a, b) {
      function c() {
        cc("message", d, "remove", "de");
      }

      function d(f) {
        var g = f.data,
          h = f.origin;
        if (gf(g, b)) {
          var k = e;
          e = !1;
          k && N("rqe");
          hf(a, function () {
            k && N("rqd");
            c();
            for (var l = D(L, "RPMQ", []), m = 0; m < l.length; m++)
              l[m]({
                data: g,
                origin: h,
              });
          });
        }
      }
      if (0 !== b.length) {
        ff = J(Db.href, "pfname", "");
        var e = !0;
        cc("message", d, "add", "at");
        Vc(a, c);
      }
    },
    gf = function (a, b) {
      a = String(a);
      if (df.test(a)) return !0;
      var c = !1;
      ef.test(a) && ((c = !0), (a = a.substr(2)));
      if (!/^\{/.test(a)) return !1;
      var d = Sd(a);
      if (!d) return !1;
      a = d.f;
      if (d.s && a && -1 != Gb.call(b, a)) {
        if ("_renderstart" === d.s || d.s === ff + "/" + a + "::_renderstart")
          if (
            ((d = d.a && d.a[c ? 0 : 1]),
            (b = C.getElementById(a)),
            nd(a, 2),
            d && b && d.width && d.height)
          ) {
            a: {
              c = b.parentNode;
              a = d || {};
              if (kd()) {
                var e = b.id;
                if (e) {
                  d = (d = S[e]) ? d.state : void 0;
                  if (1 === d || 4 === d) break a;
                  cf(e);
                }
              }
              (d = c.nextSibling) &&
                d.getAttribute &&
                d.getAttribute("data-gapistub") &&
                (c.parentNode.removeChild(d), (c.style.cssText = ""));
              d = a.width;
              var f = a.height,
                g = c.style;
              g.textIndent = "0";
              g.margin = "0";
              g.padding = "0";
              g.background = "transparent";
              g.borderStyle = "none";
              g.cssFloat = "none";
              g.styleFloat = "none";
              g.lineHeight = "normal";
              g.fontSize = "1px";
              g.verticalAlign = "baseline";
              c = c.style;
              c.display = "inline-block";
              g = b.style;
              g.position = "static";
              g.left = "0";
              g.top = "0";
              g.visibility = "visible";
              d && (c.width = g.width = d + "px");
              f && (c.height = g.height = f + "px");
              a.verticalAlign && (c.verticalAlign = a.verticalAlign);
              e && nd(e, 3);
            }
            b["data-csi-wdt"] = new Date().getTime();
          }
        return !0;
      }
      return !1;
    },
    hf = function (a, b) {
      Vc(a, b);
    };
  var jf = function (a, b) {
    this.N = a;
    a = b || {};
    this.ha = Number(a.maxAge) || 0;
    this.W = a.domain;
    this.Y = a.path;
    this.ia = !!a.secure;
  };
  jf.prototype.read = function () {
    for (
      var a = this.N + "=", b = document.cookie.split(/;\s*/), c = 0;
      c < b.length;
      ++c
    ) {
      var d = b[c];
      if (0 == d.indexOf(a)) return d.substr(a.length);
    }
  };
  jf.prototype.write = function (a, b) {
    if (!kf.test(this.N)) throw "Invalid cookie name";
    if (!lf.test(a)) throw "Invalid cookie value";
    a = this.N + "=" + a;
    this.W && (a += ";domain=" + this.W);
    this.Y && (a += ";path=" + this.Y);
    b = "number" === typeof b ? b : this.ha;
    if (0 <= b) {
      var c = new Date();
      c.setSeconds(c.getSeconds() + b);
      a += ";expires=" + c.toUTCString();
    }
    this.ia && (a += ";secure");
    document.cookie = a;
    return !0;
  };
  jf.prototype.clear = function () {
    this.write("", 0);
  };
  var lf = /^[-+/_=.:|%&a-zA-Z0-9@]*$/,
    kf = /^[A-Z_][A-Z0-9_]{0,63}$/;
  jf.iterate = function (a) {
    for (var b = document.cookie.split(/;\s*/), c = 0; c < b.length; ++c) {
      var d = b[c].split("="),
        e = d.shift();
      a(e, d.join("="));
    }
  };
  var mf = function (a) {
    this.G = a;
  };
  mf.prototype.read = function () {
    if (Z.hasOwnProperty(this.G)) return Z[this.G];
  };
  mf.prototype.write = function (a) {
    Z[this.G] = a;
    return !0;
  };
  mf.prototype.clear = function () {
    delete Z[this.G];
  };
  var Z = {};
  mf.iterate = function (a) {
    for (var b in Z) Z.hasOwnProperty(b) && a(b, Z[b]);
  };
  var nf = "https:" === window.location.protocol,
    of = nf || "http:" === window.location.protocol ? jf : mf,
    pf = function (a) {
      var b = a.substr(1),
        c = "",
        d = window.location.hostname;
      if ("" !== b) {
        c = parseInt(b, 10);
        if (isNaN(c)) return null;
        b = d.split(".");
        if (b.length < c - 1) return null;
        b.length == c - 1 && (d = "." + d);
      } else d = "";
      return {
        l: "S" == a.charAt(0),
        domain: d,
        o: c,
      };
    },
    qf = function () {
      var a,
        b = null;
      of.iterate(function (c, d) {
        0 === c.indexOf("G_AUTHUSER_") &&
          ((c = pf(c.substring(11))),
          !a || (c.l && !a.l) || (c.l == a.l && c.o > a.o)) &&
          ((a = c), (b = d));
      });
      return {
        fa: a,
        K: b,
      };
    };

  function rf(a) {
    if (0 !== a.indexOf("GCSC")) return null;
    var b = {
      X: !1,
    };
    a = a.substr(4);
    if (!a) return b;
    var c = a.charAt(0);
    a = a.substr(1);
    var d = a.lastIndexOf("_");
    if (-1 == d) return b;
    var e = pf(a.substr(d + 1));
    if (null == e) return b;
    a = a.substring(0, d);
    if ("_" !== a.charAt(0)) return b;
    d = "E" === c && e.l;
    return (!d && ("U" !== c || e.l)) || (d && !nf)
      ? b
      : {
          X: !0,
          l: d,
          la: a.substr(1),
          domain: e.domain,
          o: e.o,
        };
  }
  var sf = function (a) {
      if (!a) return [];
      a = a.split("=");
      return a[1] ? a[1].split("|") : [];
    },
    tf = function (a) {
      a = a.split(":");
      return {
        clientId: a[0].split("=")[1],
        ka: sf(a[1]),
        na: sf(a[2]),
        ma: sf(a[3]),
      };
    },
    uf = function () {
      var a = qf(),
        b = a.fa;
      a = a.K;
      if (null !== a) {
        var c;
        of.iterate(function (f, g) {
          (f = rf(f)) && f.X && f.l == b.l && f.o == b.o && (c = g);
        });
        if (c) {
          var d = tf(c),
            e = d && d.ka[Number(a)];
          d = d && d.clientId;
          if (e)
            return {
              K: a,
              ja: e,
              clientId: d,
            };
        }
      }
      return null;
    };
  var wf = function () {
    this.V = vf;
  };
  n = wf.prototype;
  n.aa = function () {
    this.M || ((this.A = 0), (this.M = !0), this.Z());
  };
  n.Z = function () {
    this.M &&
      (this.V()
        ? (this.A = this.T)
        : (this.A = Math.min(2 * (this.A || this.T), 120)),
      window.setTimeout(ra(this.Z, this), 1e3 * this.A));
  };
  n.A = 0;
  n.T = 2;
  n.V = null;
  n.M = !1;
  for (var xf = 0; 64 > xf; ++xf);
  var yf = null;
  kd = function () {
    return (L.oa = !0);
  };
  ld = function () {
    L.oa = !0;
    var a = uf();
    (a = a && a.K) && bd("googleapis.config/sessionIndex", a);
    yf || (yf = D(L, "ss", new wf()));
    a = yf;
    a.aa && a.aa();
  };
  var vf = function () {
    var a = uf(),
      b = (a && a.ja) || null,
      c = a && a.clientId;
    Vc("auth", {
      callback: function () {
        var d = B.gapi.auth,
          e = {
            client_id: c,
            session_state: b,
          };
        d.checkSessionState(e, function (f) {
          var g = e.session_state,
            h = !!R("isLoggedIn");
          f = R("debug/forceIm") ? !1 : (g && f) || (!g && !f);
          if ((h = h !== f))
            bd("isLoggedIn", f),
              ld(),
              Ie(),
              f || ((f = d.signOut) ? f() : (f = d.setToken) && f(null));
          f = gd();
          var k = R("savedUserState");
          g = d._guss(f.cookiepolicy);
          k = k != g && "undefined" != typeof k;
          bd("savedUserState", g);
          (h || k) && hd(f) && !R("disableRealtimeCallback") && d._pimf(f, !0);
        });
      },
    });
    return !0;
  };
  N("bs0", !0, window.gapi._bs);
  N("bs1", !0);
  delete window.gapi._bs;
}.call(this));
gapi.load("", {
  callback: window["gapi_onload"],
  _c: {
    jsl: {
      ci: {
        deviceType: "desktop",
        "oauth-flow": {
          authUrl: "https://accounts.google.com/o/oauth2/auth",
          proxyUrl: "https://accounts.google.com/o/oauth2/postmessageRelay",
          disableOpt: true,
          idpIframeUrl: "https://accounts.google.com/o/oauth2/iframe",
          usegapi: false,
        },
        debug: {
          reportExceptionRate: 0.05,
          forceIm: false,
          rethrowException: false,
          host: "https://apis.google.com",
        },
        enableMultilogin: true,
        "googleapis.config": {
          auth: {
            useFirstPartyAuthV2: true,
          },
        },
        inline: {
          css: 1,
        },
        disableRealtimeCallback: false,
        drive_share: {
          skipInitCommand: true,
        },
        csi: {
          rate: 0.01,
        },
        client: {
          cors: false,
        },
        signInDeprecation: {
          rate: 0.0,
        },
        include_granted_scopes: true,
        llang: "en",
        iframes: {
          youtube: {
            params: {
              location: ["search", "hash"],
            },
            url: ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi=1",
            methods: ["scroll", "openwindow"],
          },
          ytsubscribe: {
            url: "https://www.youtube.com/subscribe_embed?usegapi=1",
          },
          plus_circle: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi=1",
          },
          plus_share: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare=true&usegapi=1",
          },
          rbr_s: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller",
          },
          ":source:": "3p",
          playemm: {
            url: "https://play.google.com/work/embedded/search?usegapi=1&usegapi=1",
          },
          savetoandroidpay: {
            url: "https://pay.google.com/gp/v/widget/save",
          },
          blogger: {
            params: {
              location: ["search", "hash"],
            },
            url: ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi=1",
            methods: ["scroll", "openwindow"],
          },
          evwidget: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix:_/events/widget?usegapi=1",
          },
          partnersbadge: {
            url: "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi=1",
          },
          dataconnector: {
            url: "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi=1",
          },
          surveyoptin: {
            url: "https://www.google.com/shopping/customerreviews/optin?usegapi=1",
          },
          ":socialhost:": "https://apis.google.com",
          shortlists: {
            url: "",
          },
          hangout: {
            url: "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget",
          },
          plus_followers: {
            params: {
              url: "",
            },
            url: ":socialhost:/_/im/_/widget/render/plus/followers?usegapi=1",
          },
          post: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi=1",
          },
          ":gplus_url:": "https://plus.google.com",
          signin: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix:_/widget/render/signin?usegapi=1",
            methods: ["onauth"],
          },
          rbr_i: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation",
          },
          share: {
            url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi=1",
          },
          plusone: {
            params: {
              count: "",
              size: "",
              url: "",
            },
            url: ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi=1",
          },
          comments: {
            params: {
              location: ["search", "hash"],
            },
            url: ":socialhost:/:session_prefix:_/widget/render/comments?usegapi=1",
            methods: ["scroll", "openwindow"],
          },
          ":im_socialhost:": "https://plus.googleapis.com",
          backdrop: {
            url: "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi=1",
          },
          visibility: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi=1",
          },
          autocomplete: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix:_/widget/render/autocomplete",
          },
          additnow: {
            url: "https://apis.google.com/marketplace/button?usegapi=1",
            methods: ["launchurl"],
          },
          ":signuphost:": "https://plus.google.com",
          ratingbadge: {
            url: "https://www.google.com/shopping/customerreviews/badge?usegapi=1",
          },
          appcirclepicker: {
            url: ":socialhost:/:session_prefix:_/widget/render/appcirclepicker",
          },
          follow: {
            url: ":socialhost:/:session_prefix:_/widget/render/follow?usegapi=1",
          },
          community: {
            url: ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi=1",
          },
          sharetoclassroom: {
            url: "https://classroom.google.com/sharewidget?usegapi=1",
          },
          ytshare: {
            params: {
              url: "",
            },
            url: ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi=1",
          },
          plus: {
            url: ":socialhost:/:session_prefix:_/widget/render/badge?usegapi=1",
          },
          family_creation: {
            params: {
              url: "",
            },
            url: "https://families.google.com/webcreation?usegapi=1&usegapi=1",
          },
          commentcount: {
            url: ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi=1",
          },
          configurator: {
            url: ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi=1",
          },
          zoomableimage: {
            url: "https://ssl.gstatic.com/microscope/embed/",
          },
          appfinder: {
            url: "https://workspace.google.com/:session_prefix:marketplace/appfinder?usegapi=1",
          },
          savetowallet: {
            url: "https://pay.google.com/gp/v/widget/save",
          },
          person: {
            url: ":socialhost:/:session_prefix:_/widget/render/person?usegapi=1",
          },
          savetodrive: {
            url: "https://drive.google.com/savetodrivebutton?usegapi=1",
            methods: ["save"],
          },
          page: {
            url: ":socialhost:/:session_prefix:_/widget/render/page?usegapi=1",
          },
          card: {
            url: ":socialhost:/:session_prefix:_/hovercard/card",
          },
        },
      },
      h: "m;/_/scs/apps-static/_/js/k=oz.gapi.en.OxsXq8UvEOs.O/am=AQ/d=1/rs=AGLTcCN7FQWUE2nltJhOBLbHOeQiriRsIg/m=__features__",
      u: "https://apis.google.com/js/platform.js",
      hee: true,
      dpo: false,
      le: [],
    },
    platform: [
      "additnow",
      "backdrop",
      "blogger",
      "comments",
      "commentcount",
      "community",
      "donation",
      "family_creation",
      "follow",
      "hangout",
      "health",
      "page",
      "partnersbadge",
      "person",
      "playemm",
      "playreview",
      "plus",
      "plusone",
      "post",
      "ratingbadge",
      "savetoandroidpay",
      "savetodrive",
      "savetowallet",
      "sharetoclassroom",
      "shortlists",
      "signin2",
      "surveyoptin",
      "visibility",
      "youtube",
      "ytsubscribe",
      "zoomableimage",
    ],
    annotation: [
      "interactivepost",
      "recobar",
      "signin2",
      "autocomplete",
      "profile",
    ],
  },
});
