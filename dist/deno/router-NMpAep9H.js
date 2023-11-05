import { l as l$1, y as y$1, k as k$1 } from './preact-iMASf8S1.js';

class BodyError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class BodyTypeError extends Error {
    expected;
    constructor(options) {
        super("Invalid body type", options);
        this.expected = options.expected;
    }
}
class BodyValidationError extends Error {
    cause;
    constructor(options) {
        super("Invalid body", options);
        this.cause = options.cause;
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/** Flattens {@link AsMiddleware} to {@link Middleware} */
function asMiddleware(middleware) {
    if ("middleware" in middleware) {
        return middleware.middleware();
    }
    else {
        return middleware;
    }
}
/** Throws an error inside a middleware so it can potentially catch it */
function throwInMiddleware(middleware, input, error) {
    return middleware(input, () => Promise.reject(error));
}

class Chain {
    #middleware;
    constructor(middleware) {
        this.#middleware = asMiddleware(middleware);
    }
    middleware() {
        return this.#middleware;
    }
    use(middleware) {
        const current = this.#middleware;
        const m = asMiddleware(middleware);
        return new Chain(async (input, next) => current(input, (middlewareInput) => m(middlewareInput, next)));
    }
    catch(errorHandler) {
        const current = this.#middleware;
        return new Chain((input, next) => current(input, async (errorHandlerInput) => {
            try {
                return await next(errorHandlerInput);
            }
            catch (error) {
                return await errorHandler(error, errorHandlerInput);
            }
        }));
    }
}

var o=/[\s\n\\/='"\0<>]/,a=/^(xlink|xmlns|xml)([A-Z])/,n=/^accessK|^auto[A-Z]|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|readO|rowS|spellC|src[A-Z]|tabI|item[A-Z]/,i=/^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/,l=/["&<]/;function s(e){if(0===e.length||!1===l.test(e))return e;for(var t=0,r=0,o="",a="";r<e.length;r++){switch(e.charCodeAt(r)){case 34:a="&quot;";break;case 38:a="&amp;";break;case 60:a="&lt;";break;default:continue}r!==t&&(o+=e.slice(t,r)),o+=a,t=r+1;}return r!==t&&(o+=e.slice(t,r)),o}var c={},p=new Set(["animation-iteration-count","border-image-outset","border-image-slice","border-image-width","box-flex","box-flex-group","box-ordinal-group","column-count","fill-opacity","flex","flex-grow","flex-negative","flex-order","flex-positive","flex-shrink","flood-opacity","font-weight","grid-column","grid-row","line-clamp","line-height","opacity","order","orphans","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","widows","z-index","zoom"]),u=/[A-Z]/g;function _(e){var t="";for(var r in e){var o=e[r];if(null!=o&&""!==o){var a="-"==r[0]?r:c[r]||(c[r]=r.replace(u,"-$&").toLowerCase()),n=";";"number"!=typeof o||a.startsWith("--")||p.has(a)||(n="px;"),t=t+a+":"+o+n;}}return t||void 0}var d,f,h,m,v=[],g=Array.isArray,y=Object.assign;function b(o,a){var n=l$1.__s;l$1.__s=!0,d=l$1.__b,f=l$1.diffed,h=l$1.__r,m=l$1.unmount;var i=y$1(k$1,null);i.__k=[o];try{return C(o,a||x,!1,void 0,i)}finally{l$1.__c&&l$1.__c(o,v),l$1.__s=n,v.length=0;}}function k(){this.__d=!0;}var x={};function w(e,t){var r,o=e.type,a=!0;return e.__c?(a=!1,(r=e.__c).state=r.__s):r=new o(e.props,t),e.__c=r,r.__v=e,r.props=e.props,r.context=t,r.__d=!0,null==r.state&&(r.state=x),null==r.__s&&(r.__s=r.state),o.getDerivedStateFromProps?r.state=y({},r.state,o.getDerivedStateFromProps(r.props,r.state)):a&&r.componentWillMount?(r.componentWillMount(),r.state=r.__s!==r.state?r.__s:r.state):!a&&r.componentWillUpdate&&r.componentWillUpdate(),h&&h(e),r.render(r.props,r.state,t)}function C(t,l,c,p,u){if(null==t||!0===t||!1===t||""===t)return "";if("object"!=typeof t)return "function"==typeof t?"":s(t+"");if(g(t)){var v="";u.__k=t;for(var b=0;b<t.length;b++){var x=t[b];null!=x&&"boolean"!=typeof x&&(v+=C(x,l,c,p,u));}return v}if(void 0!==t.constructor)return "";t.__=u,d&&d(t);var A,L,D,E=t.type,T=t.props,Z=l;if("function"==typeof E){if(E===k$1){if(T.UNSTABLE_comment)return "\x3c!--"+s(T.UNSTABLE_comment||"")+"--\x3e";L=T.children;}else {if(null!=(A=E.contextType)){var F=l[A.__c];Z=F?F.props.value:A.__;}if(E.prototype&&"function"==typeof E.prototype.render)L=w(t,Z),D=t.__c;else {t.__c=D={__v:t,props:T,context:Z,setState:k,forceUpdate:k,__d:!0,__h:[]};for(var U=0;D.__d&&U++<25;)D.__d=!1,h&&h(t),L=E.call(D,T,Z);D.__d=!0;}if(null!=D.getChildContext&&(l=y({},l,D.getChildContext())),(E.getDerivedStateFromError||D.componentDidCatch)&&l$1.errorBoundaries){var W="";L=null!=L&&L.type===k$1&&null==L.key?L.props.children:L;try{return W=C(L,l,c,p,t)}catch(e){return E.getDerivedStateFromError&&(D.__s=E.getDerivedStateFromError(e)),D.componentDidCatch&&D.componentDidCatch(e,{}),D.__d&&(L=w(t,l),null!=(D=t.__c).getChildContext&&(l=y({},l,D.getChildContext())),W=C(L=null!=L&&L.type===k$1&&null==L.key?L.props.children:L,l,c,p,t)),W}finally{f&&f(t),t.__=void 0,m&&m(t);}}}var $=C(L=null!=L&&L.type===k$1&&null==L.key?L.props.children:L,l,c,p,t);return f&&f(t),t.__=void 0,m&&m(t),$}var M,j="<"+E,z="";for(var H in T){var q=T[H];switch(H){case"children":M=q;continue;case"key":case"ref":case"__self":case"__source":continue;case"htmlFor":if("for"in T)continue;H="for";break;case"className":if("class"in T)continue;H="class";break;case"defaultChecked":H="checked";break;case"defaultSelected":H="selected";break;case"defaultValue":case"value":switch(H="value",E){case"textarea":M=q;continue;case"select":p=q;continue;case"option":p!=q||"selected"in T||(j+=" selected");}break;case"dangerouslySetInnerHTML":z=q&&q.__html;continue;case"style":"object"==typeof q&&(q=_(q));break;case"acceptCharset":H="accept-charset";break;case"httpEquiv":H="http-equiv";break;default:if(a.test(H))H=H.replace(a,"$1:$2").toLowerCase();else {if(o.test(H))continue;"-"!==H[4]&&"draggable"!==H||null==q?c?i.test(H)&&(H="panose1"===H?"panose-1":H.replace(/([A-Z])/g,"-$1").toLowerCase()):n.test(H)&&(H=H.toLowerCase()):q+="";}}null!=q&&!1!==q&&"function"!=typeof q&&(j=!0===q||""===q?j+" "+H:j+" "+H+'="'+s(q+"")+'"');}if(o.test(E))throw new Error(E+" is not a valid HTML tag name in "+j+">");return z||("string"==typeof M?z=s(M):null!=M&&!1!==M&&!0!==M&&(z=C(M,l,"svg"===E||"foreignObject"!==E&&c,p,t))),f&&f(t),t.__=void 0,m&&m(t),!z&&S.has(E)?j+"/>":j+">"+z+"</"+E+">"}var S=new Set(["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"]);

var require$$0 = {
	"100": "Continue",
	"101": "Switching Protocols",
	"102": "Processing",
	"103": "Early Hints",
	"200": "OK",
	"201": "Created",
	"202": "Accepted",
	"203": "Non-Authoritative Information",
	"204": "No Content",
	"205": "Reset Content",
	"206": "Partial Content",
	"207": "Multi-Status",
	"208": "Already Reported",
	"226": "IM Used",
	"300": "Multiple Choices",
	"301": "Moved Permanently",
	"302": "Found",
	"303": "See Other",
	"304": "Not Modified",
	"305": "Use Proxy",
	"307": "Temporary Redirect",
	"308": "Permanent Redirect",
	"400": "Bad Request",
	"401": "Unauthorized",
	"402": "Payment Required",
	"403": "Forbidden",
	"404": "Not Found",
	"405": "Method Not Allowed",
	"406": "Not Acceptable",
	"407": "Proxy Authentication Required",
	"408": "Request Timeout",
	"409": "Conflict",
	"410": "Gone",
	"411": "Length Required",
	"412": "Precondition Failed",
	"413": "Payload Too Large",
	"414": "URI Too Long",
	"415": "Unsupported Media Type",
	"416": "Range Not Satisfiable",
	"417": "Expectation Failed",
	"418": "I'm a Teapot",
	"421": "Misdirected Request",
	"422": "Unprocessable Entity",
	"423": "Locked",
	"424": "Failed Dependency",
	"425": "Too Early",
	"426": "Upgrade Required",
	"428": "Precondition Required",
	"429": "Too Many Requests",
	"431": "Request Header Fields Too Large",
	"451": "Unavailable For Legal Reasons",
	"500": "Internal Server Error",
	"501": "Not Implemented",
	"502": "Bad Gateway",
	"503": "Service Unavailable",
	"504": "Gateway Timeout",
	"505": "HTTP Version Not Supported",
	"506": "Variant Also Negotiates",
	"507": "Insufficient Storage",
	"508": "Loop Detected",
	"509": "Bandwidth Limit Exceeded",
	"510": "Not Extended",
	"511": "Network Authentication Required"
};

/*!
 * statuses
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2016 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

var codes = require$$0;

/**
 * Module exports.
 * @public
 */

var statuses = status$1;

// status code to message map
status$1.message = codes;

// status message (lower-case) to code map
status$1.code = createMessageToStatusCodeMap(codes);

// array of status codes
status$1.codes = createStatusCodeList(codes);

// status codes for redirects
status$1.redirect = {
  300: true,
  301: true,
  302: true,
  303: true,
  305: true,
  307: true,
  308: true
};

// status codes for empty bodies
status$1.empty = {
  204: true,
  205: true,
  304: true
};

// status codes for when you should retry the request
status$1.retry = {
  502: true,
  503: true,
  504: true
};

/**
 * Create a map of message to status code.
 * @private
 */

function createMessageToStatusCodeMap (codes) {
  var map = {};

  Object.keys(codes).forEach(function forEachCode (code) {
    var message = codes[code];
    var status = Number(code);

    // populate map
    map[message.toLowerCase()] = status;
  });

  return map
}

/**
 * Create a list of all status codes.
 * @private
 */

function createStatusCodeList (codes) {
  return Object.keys(codes).map(function mapCode (code) {
    return Number(code)
  })
}

/**
 * Get the status code for given message.
 * @private
 */

function getStatusCode (message) {
  var msg = message.toLowerCase();

  if (!Object.prototype.hasOwnProperty.call(status$1.code, msg)) {
    throw new Error('invalid status message: "' + message + '"')
  }

  return status$1.code[msg]
}

/**
 * Get the status message for given code.
 * @private
 */

function getStatusMessage (code) {
  if (!Object.prototype.hasOwnProperty.call(status$1.message, code)) {
    throw new Error('invalid status code: ' + code)
  }

  return status$1.message[code]
}

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */

function status$1 (code) {
  if (typeof code === 'number') {
    return getStatusMessage(code)
  }

  if (typeof code !== 'string') {
    throw new TypeError('code must be a number or string')
  }

  // '403'
  var n = parseInt(code, 10);
  if (!isNaN(n)) {
    return getStatusMessage(n)
  }

  return getStatusCode(code)
}

var statuses$1 = /*@__PURE__*/getDefaultExportFromCjs(statuses);

function text(data, options) {
    return new Response(data, options);
}
function json(data, options) {
    return Response.json(data, options);
}
function redirect(url, status = 301) {
    return Response.redirect(url, status);
}
function status(code, options) {
    return new Response(statuses$1(code), { ...options, status: code });
}
function html(data, options) {
    if (typeof data !== "string") {
        data = b(data);
    }
    return new Response(data, {
        ...options,
        headers: { "Content-Type": "text/html; charset=utf-8", ...options?.headers },
    });
}

var response = /*#__PURE__*/Object.freeze({
    __proto__: null,
    html: html,
    json: json,
    redirect: redirect,
    status: status,
    text: text
});

class UrlError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class QueryValidationError extends Error {
    cause;
    constructor(options) {
        super("Invalid query string", options);
        this.cause = options.cause;
    }
}

class RouterError extends Error {
    method;
    path;
    constructor(info, message, options) {
        super(message, options);
        this.method = info.method;
        this.path = info.path;
        this.name = this.constructor.name;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
class NotFoundError extends RouterError {
    constructor(info) {
        super(info, "Not found");
    }
}
class MethodNotAllowedError extends RouterError {
    route;
    allowed;
    constructor(info) {
        super(info, "Method not allowed");
        this.route = info.route;
        this.allowed = info.allowed;
    }
}
function formatValidationError(err) {
    const format = (err, depth) => {
        const indent = " ".repeat(depth * 2);
        const errors = err._errors.map((s) => `${indent}- ${s}`);
        const recursive = Object.entries(err).filter(([key]) => key !== "_errors");
        // flatten single element tuples
        if (recursive.length === 1 && recursive[0][0] === "0") {
            errors.push(...format(recursive[0][1], depth));
        }
        else {
            for (const [key, value] of recursive) {
                errors.push(`${indent}${key}:`);
                errors.push(...format(value, depth + 1));
            }
        }
        return errors;
    };
    return format(err.format(), 0);
}
function defaultErrorHandler(error) {
    if (error instanceof NotFoundError) {
        return status(404);
    }
    else if (error instanceof MethodNotAllowedError) {
        return status(405, { headers: { allow: error.allowed.join(", ") } });
    }
    else if (error instanceof BodyTypeError) {
        return status(415);
    }
    else if (error instanceof BodyValidationError ||
        error instanceof QueryValidationError) {
        const errors = formatValidationError(error.cause);
        const body = [error.message, "", ...errors].join("\n");
        return text(body, { status: 400 });
    }
    else {
        throw error;
    }
}

/** Case-insensitive dictionary of valid path segment characters */
const DICTIONARY = [
    "/",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "%",
    ".",
    "-",
    "_",
    "@",
    "~",
    "+",
    "=",
    "$",
    "&",
    ",",
    ";",
    "!",
    "'",
    "(",
    ")",
];
/** Empty literal segment map for copying */
const EMPTY_DICTIONARY = DICTIONARY.map(() => undefined);
/** Lookup dictionnary for the slot of every ASCII character */
const LOOKUP_DICTIONARY = [...Array(128).keys()].map((c) => {
    const idx = DICTIONARY.indexOf(String.fromCharCode(c).toLowerCase());
    return idx >= 0 ? idx : DICTIONARY.length;
});
const SLASH = "/".charCodeAt(0);
const COLON = ":".charCodeAt(0);
const STAR = "*".charCodeAt(0);
/**
 * Returns the slot of the given character codepoint in the dictionary,
 * assuming it is a valid path segment character.
 *
 * @param code - ASCII codepoint
 * @returns Slot of the given character in the dictionary
 */
function slot(code) {
    return LOOKUP_DICTIONARY[code];
}
/** Normalises a path before operating on it */
function normalise(path) {
    if (path.length > 1 && path.charCodeAt(path.length - 1) === SLASH)
        path = path.slice(0, -1);
    return path;
}
/** Checks if a path segment starts with a prefix case-insensitively */
function startsWith(prefix, s) {
    for (let i = 0; i < prefix.length; i++) {
        if (slot(prefix.charCodeAt(i)) !== slot(s.charCodeAt(i)))
            return false;
    }
    return true;
}
/** Returns the path contents until the first forwards slash */
function nonSlash(path) {
    let i = 0;
    while (i < path.length && path.charCodeAt(i) !== SLASH)
        i++;
    return path.slice(0, i);
}
/** Returns the path contents until the first colon or star */
function nonSpecial(path) {
    let i = 0;
    for (; i < path.length; i++) {
        const c = path.charCodeAt(i);
        if (c === COLON || c === STAR)
            break;
    }
    return path.slice(0, i);
}
/** Returns the shared case-insensitive prefix of two string excluding colons and stars */
function nonSpecialLcs(l, r) {
    let i = 0;
    for (; i < l.length && i < r.length; i++) {
        const lc = l.charCodeAt(i);
        if (lc === COLON || lc === STAR)
            break;
        const rc = r.charCodeAt(i);
        if (slot(lc) !== slot(rc))
            break;
    }
    return l.slice(0, i);
}
/** Returns a matcher function for the given literal */
function literalMatcher(literal) {
    return (path) => (startsWith(literal, path) ? literal.length : 0);
}
function match(path, node, matched, backtrack = []) {
    const b = () => {
        while (backtrack.length !== 0) {
            const { path, node, matched } = backtrack.pop();
            const value = match(path, node, matched, []);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    };
    const consumed = node.matcher(path, matched);
    path = path.slice(consumed);
    if (path.length === 0 && node.value !== undefined)
        return node.value(matched);
    // didn't match or matched everything but no associated value
    if (consumed === 0 || path.length === 0)
        return b();
    if (node.one)
        backtrack.push({ path, node: node.one, matched: { ...matched } });
    if (node.any)
        backtrack.push({ path, node: node.any, matched: { ...matched } });
    const next = node.literal?.[slot(path.charCodeAt(0))];
    if (!next)
        return b();
    return match(path, next, matched, backtrack);
}
function update(path, node, f, prefix) {
    prefix ??= nonSpecialLcs(path, node.verbatim);
    path = path.slice(prefix.length);
    // we only matched part of the current node so we need to split it
    if (prefix.length !== 0 && prefix.length !== node.verbatim.length) {
        const newVerbatim = node.verbatim.slice(prefix.length);
        const newNode = {
            ...node,
            matcher: literalMatcher(newVerbatim),
            verbatim: newVerbatim,
        };
        node.literal = [...EMPTY_DICTIONARY];
        node.literal[slot(newVerbatim.charCodeAt(0))] = newNode;
        node.value = undefined;
        node.matcher = literalMatcher(prefix);
        node.verbatim = prefix;
        node.one = undefined;
        node.any = undefined;
    }
    // we matched the entire path so we update the current node
    if (path.length === 0)
        return f(node);
    let next = undefined;
    let nextPrefix = undefined;
    const c = path.charCodeAt(0);
    // capture one segment
    if (c === COLON) {
        const verbatim = nonSlash(path);
        if (node.one && node.one.verbatim !== verbatim)
            throw new Error("TODO");
        else if (!node.one) {
            const name = verbatim.slice(1);
            node.one = {
                value: undefined,
                matcher: (path, matched) => {
                    const segment = nonSlash(path);
                    matched[name] = decodeURIComponent(segment);
                    return segment.length;
                },
                verbatim,
                literal: [...EMPTY_DICTIONARY],
            };
        }
        next = node.one;
        nextPrefix = verbatim;
    }
    // capture any segments
    else if (c === STAR) {
        if (node.any && node.any.verbatim !== path)
            throw new Error("TODO");
        else if (!node.any) {
            const name = path.slice(1);
            node.any = {
                value: undefined,
                matcher: (path, matched) => {
                    matched[name] = decodeURIComponent(path);
                    return path.length;
                },
                verbatim: path,
            };
        }
        return f(node.any);
    }
    // literal
    else {
        const s = slot(c);
        next = node.literal[s];
        // next literal node needs to be created
        if (!next) {
            const verbatim = nonSpecial(path);
            next = {
                value: undefined,
                matcher: literalMatcher(verbatim),
                verbatim,
                literal: [...EMPTY_DICTIONARY],
            };
            nextPrefix = verbatim;
            node.literal[s] = next;
        }
    }
    return update(path, next, f, nextPrefix);
}
class Trie {
    #root = {
        value: undefined,
        verbatim: "/",
        matcher: () => 1,
        literal: [...EMPTY_DICTIONARY],
    };
    match(path) {
        return match(normalise(path), this.#root, {}, []);
    }
    insert(route, value) {
        // TODO: validate
        update(normalise(route), this.#root, (node) => {
            if (node.value !== undefined)
                throw new Error("TODO");
            node.value = value;
        }, this.#root.verbatim);
    }
    summary() {
        const s = (node) => {
            const summary = {};
            const leaf = Symbol.for("leaf");
            const children = node.literal ?? [];
            if (node.one)
                children.push(node.one);
            if (node.any)
                children.push(node.any);
            for (const child of children) {
                if (!child)
                    continue;
                const childSummary = s(child);
                summary[child.verbatim] = childSummary;
            }
            if (node.value !== undefined && Object.keys(summary).length === 0) {
                return leaf;
            }
            else if (node.value === undefined) {
                return summary;
            }
            else {
                return [leaf, summary];
            }
        };
        return s(this.#root);
    }
}

/** @module chene/router */
/**
 * A router is a middleware that routes requests to other middlewares based on their method and path
 *
 * @remarks
 *
 * Routes can contain named parameters which instead of matching part of the path verbatim will
 * capture one or many path segments and make them available by name to the route handler.
 * The provided path parameters is a properly typed object with the same keys as the named parameters.
 *
 * `:name` will capture a single path segment up to the next `/` or end of the path
 * while `*name` will capture any number of path segments until the end of the path.
 *
 * The router provides facilities to chain middleware both to the entire router through the {@link use} method
 * and to individual routes through a {@link Transform} parameter.
 *
 * This router is based on a prefix tree which means the order in which routes are registered
 * does not influence the matching process and the number of routes does not impact performance.
 *
 * Priority is given to verbatim segments over single named parameters (`:name`)
 * over multiple named parameters (`*name`). This means that `/hello/there` would be matched
 * before `/hello/:name` which would be matched before `/hello/*name`.
 *
 * @example Simple route handler
 * ```ts
 * const app = router()
 * app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name}!`))
 * ```
 *
 * @example Chaining middleware to a route handler
 * ```ts
 * const app = router()
 * app.post(
 *   "/search/:term",
 *   (ctx) => ctx.use(middleware),
 *
 *   (ctx) => {
 *     // ctx.path.term is the string captured by the :term parameter
 *     // ctx will also contain any value the middleware might have added
 *     // and will by typed accordingly
 *   }
 * )
 * ```
 *
 * @typeParam I - Input type of route handlers and chained middleware
 * @typeParam O - Output type of route handlers and chained middleware
 */
class Router {
    #routes;
    #chain;
    /** @internal */
    constructor(routes, chain) {
        this.#routes = routes;
        this.#chain = chain;
    }
    #method(method, route, ...args) {
        if (route.at(-1) === "/")
            route = route.slice(0, -1);
        const methods = this.#routes.get(route) ?? {
            GET: undefined,
            POST: undefined,
            PUT: undefined,
            PATCH: undefined,
            DELETE: undefined,
        };
        const chain = this.#chain;
        if (args.length === 2) {
            const [transform, handler] = args;
            methods[method] = (path) => async (routerInput, next) => next(await transform(chain.use((routeInput, next) => next({ ...routeInput, path }))).middleware()(routerInput, async (transformedInput) => await handler(transformedInput)));
        }
        else {
            const [handler] = args;
            methods[method] = (path) => async (routerInput, next) => next(await chain.middleware()(routerInput, async (routeInput) => await handler({ ...routeInput, path })));
        }
        this.#routes.set(route, methods);
        return this;
    }
    middleware() {
        const trie = new Trie();
        for (const [route, handlers] of this.#routes) {
            trie.insert(route, (path) => (input, next) => {
                const method = input.request.method;
                const stored = handlers[method];
                if (!stored) {
                    return throwInMiddleware(this.#chain.middleware(), { ...input, route }, new MethodNotAllowedError({
                        method: input.request.method,
                        path: input.url.pathname,
                        route,
                        allowed: Object.entries(handlers)
                            .filter(([, handler]) => handler)
                            .map(([method]) => method),
                    }));
                }
                return stored(path)(input, next);
            });
        }
        return (input, next) => {
            const middleware = trie.match(input.url.pathname);
            if (!middleware) {
                return throwInMiddleware(this.#chain.middleware(), input, new NotFoundError({ method: input.request.method, path: input.url.pathname }));
            }
            return middleware(input, next);
        };
    }
    /**
     * Chains a middleware to the router
     *
     * @group Chaining
     *
     * @remarks
     *
     * Note that this method returns a new router. The new router shares the same routes
     * as the original one, but the middleware will not apply to the previously registered routes,
     * only the ones registered on the new router.
     *
     * Since the routes are shared, this method can be called two times on the same router and
     * routes can be registered on the two resulting routers, and all three routers will share
     * all the registered routes.
     *
     * @example Sharing routes
     * ```ts
     * const app = router()
     * const app1 = app1.use(middleware1)
     * const app2 = app2.use(middleware2)
     *
     * app.get("/foo", () => response.text("foo"))
     * app1.get("/bar", () => response.text("bar"))
     * app2.get("/baz", () => response.text("baz"))
     *
     * // /foo, /bar and /baz are all available
     * serve(app, { port: 8080 })
     * ```
     *
     * @see {@link Chain.use}
     *
     * @typeParam II - Input type of the `next` function of the middleware
     * @typeParam OO - Output type of the `next` function of the middleware
     *
     * @param middleware - Middeware to chain
     * @returns A new router with the given middleware chained and the existing routes
     */
    use(middleware) {
        return new Router(this.#routes, this.#chain.use(middleware));
    }
    /**
     * Chains an error handler to the router
     *
     * @group Chaining
     *
     * @remarks
     *
     * Note that this method behaves the same as {@link use} and returns a new router with shared routes.
     * It will only catch errors thrown by the routes registered on the new router and
     * by middleware chained after it.
     *
     * The error handler returns the same type as route handlers and chained middleware, since its goal is
     * to gracefully handle errors and return an appropriate response. It is good practice to re-throw errors
     * that the error handler doesn't know how to produce a response for so that upstream error handlers can
     * do it instead.
     *
     * @example Catching errors
     * ```ts
     * let app = router()
     *
     * // errors thrown from this middleware won't be caught
     * app = app.use(middelware1)
     * // errors thrown from this route won't be caught
     * app.get("/foo", () => {
     *   throw new Error("foo")
     * })
     *
     * app = app.catch((error, input) => {
     *   console.error(error)
     *   return response.status(500)
     * })
     *
     * // errors thrown from this middleware will be caught
     * app = app.use(middleware2)
     * // errors thrown from this route will be caught
     * app.get("/bar", () => {
     *  throw new Error("bar")
     * })
     * ```
     *
     * @see {@link Chain.catch}
     *
     * @param errorHandler - Error handler to chain
     * @returns A new router with the given error handler chained and the existing routes
     */
    catch(errorHandler) {
        return new Router(this.#routes, this.#chain.catch(errorHandler));
    }
    get(route, ...args) {
        return this.#method("GET", route, ...args);
    }
    post(route, ...args) {
        return this.#method("POST", route, ...args);
    }
    patch(route, ...args) {
        return this.#method("PATCH", route, ...args);
    }
    put(route, ...args) {
        return this.#method("PUT", route, ...args);
    }
    delete(route, ...args) {
        return this.#method("DELETE", route, ...args);
    }
}
/**
 * Creates a new router
 *
 * @param middleware - Root middleware which is chained before anything else, including the router's builtin error handler
 */
function router(middleware = (input, next) => next(input)) {
    return new Router(new Map(), new Chain(asMiddleware(middleware)).catch(defaultErrorHandler));
}

export { BodyTypeError as B, Chain as C, MethodNotAllowedError as M, NotFoundError as N, QueryValidationError as Q, Router as R, UrlError as U, BodyValidationError as a, BodyError as b, router as c, asMiddleware as d, RouterError as e, defaultErrorHandler as f, response as r, throwInMiddleware as t };
