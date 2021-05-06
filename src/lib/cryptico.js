var dbits, canary = 244837814094590, j_lm = (canary & 16777215) == 15715070;

function BigInteger(a, b, c) {
    a != null && ("number" == typeof a ? this.fromNumber(a, b, c) : b == null && "string" != typeof a ? this.fromString(a, 256) : this.fromString(a, b))
}

function nbi() {
    return new BigInteger(null)
}

function am1(a, b, c, d, e, g) {
    for (; --g >= 0;) {
        var h = b * this[a++] + c[d] + e, e = Math.floor(h / 67108864);
        c[d++] = h & 67108863
    }
    return e
}

function am2(a, b, c, d, e, g) {
    var h = b & 32767;
    for (b >>= 15; --g >= 0;) {
        var f = this[a] & 32767, o = this[a++] >> 15, p = b * f + o * h,
            f = h * f + ((p & 32767) << 15) + c[d] + (e & 1073741823), e = (f >>> 30) + (p >>> 15) + b * o + (e >>> 30);
        c[d++] = f & 1073741823
    }
    return e
}

function am3(a, b, c, d, e, g) {
    var h = b & 16383;
    for (b >>= 14; --g >= 0;) {
        var f = this[a] & 16383, o = this[a++] >> 14, p = b * f + o * h, f = h * f + ((p & 16383) << 14) + c[d] + e,
            e = (f >> 28) + (p >> 14) + b * o;
        c[d++] = f & 268435455
    }
    return e
}

j_lm && navigator.appName == "Microsoft Internet Explorer" ? (BigInteger.prototype.am = am2, dbits = 30) : j_lm && navigator.appName != "Netscape" ? (BigInteger.prototype.am = am1, dbits = 26) : (BigInteger.prototype.am = am3, dbits = 28);
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = (1 << dbits) - 1;
BigInteger.prototype.DV = 1 << dbits;
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz", BI_RC = [], rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(a) {
    return BI_RM.charAt(a)
}

function intAt(a, b) {
    var c = BI_RC[a.charCodeAt(b)];
    return c == null ? -1 : c
}

function bnpCopyTo(a) {
    for (var b = this.t - 1; b >= 0; --b) a[b] = this[b];
    a.t = this.t;
    a.s = this.s
}

function bnpFromInt(a) {
    this.t = 1;
    this.s = a < 0 ? -1 : 0;
    a > 0 ? this[0] = a : a < -1 ? this[0] = a + DV : this.t = 0
}

function nbv(a) {
    var b = nbi();
    b.fromInt(a);
    return b
}

function bnpFromString(a, b) {
    var c;
    if (b == 16) c = 4; else if (b == 8) c = 3; else if (b == 256) c = 8; else if (b == 2) c = 1; else if (b == 32) c = 5; else if (b == 4) c = 2; else {
        this.fromRadix(a, b);
        return
    }
    this.s = this.t = 0;
    for (var d = a.length, e = !1, g = 0; --d >= 0;) {
        var h = c == 8 ? a[d] & 255 : intAt(a, d);
        h < 0 ? a.charAt(d) == "-" && (e = !0) : (e = !1, g == 0 ? this[this.t++] = h : g + c > this.DB ? (this[this.t - 1] |= (h & (1 << this.DB - g) - 1) << g, this[this.t++] = h >> this.DB - g) : this[this.t - 1] |= h << g, g += c, g >= this.DB && (g -= this.DB))
    }
    if (c == 8 && (a[0] & 128) != 0) this.s = -1, g > 0 && (this[this.t - 1] |= (1 <<
        this.DB - g) - 1 << g);
    this.clamp();
    e && BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
    for (var a = this.s & this.DM; this.t > 0 && this[this.t - 1] == a;) --this.t
}

function bnToString(a) {
    if (this.s < 0) return "-" + this.negate().toString(a);
    if (a == 16) a = 4; else if (a == 8) a = 3; else if (a == 2) a = 1; else if (a == 32) a = 5; else if (a == 64) a = 6; else if (a == 4) a = 2; else return this.toRadix(a);
    var b = (1 << a) - 1, c, d = !1, e = "", g = this.t, h = this.DB - g * this.DB % a;
    if (g-- > 0) {
        if (h < this.DB && (c = this[g] >> h) > 0) d = !0, e = int2char(c);
        for (; g >= 0;) h < a ? (c = (this[g] & (1 << h) - 1) << a - h, c |= this[--g] >> (h += this.DB - a)) : (c = this[g] >> (h -= a) & b, h <= 0 && (h += this.DB, --g)), c > 0 && (d = !0), d && (e += int2char(c))
    }
    return d ? e : "0"
}

function bnNegate() {
    var a = nbi();
    BigInteger.ZERO.subTo(this, a);
    return a
}

function bnAbs() {
    return this.s < 0 ? this.negate() : this
}

function bnCompareTo(a) {
    var b = this.s - a.s;
    if (b != 0) return b;
    var c = this.t, b = c - a.t;
    if (b != 0) return b;
    for (; --c >= 0;) if ((b = this[c] - a[c]) != 0) return b;
    return 0
}

function nbits(a) {
    var b = 1, c;
    if ((c = a >>> 16) != 0) a = c, b += 16;
    if ((c = a >> 8) != 0) a = c, b += 8;
    if ((c = a >> 4) != 0) a = c, b += 4;
    if ((c = a >> 2) != 0) a = c, b += 2;
    a >> 1 != 0 && (b += 1);
    return b
}

function bnBitLength() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
}

function bnpDLShiftTo(a, b) {
    var c;
    for (c = this.t - 1; c >= 0; --c) b[c + a] = this[c];
    for (c = a - 1; c >= 0; --c) b[c] = 0;
    b.t = this.t + a;
    b.s = this.s
}

function bnpDRShiftTo(a, b) {
    for (var c = a; c < this.t; ++c) b[c - a] = this[c];
    b.t = Math.max(this.t - a, 0);
    b.s = this.s
}

function bnpLShiftTo(a, b) {
    var c = a % this.DB, d = this.DB - c, e = (1 << d) - 1, g = Math.floor(a / this.DB), h = this.s << c & this.DM, f;
    for (f = this.t - 1; f >= 0; --f) b[f + g + 1] = this[f] >> d | h, h = (this[f] & e) << c;
    for (f = g - 1; f >= 0; --f) b[f] = 0;
    b[g] = h;
    b.t = this.t + g + 1;
    b.s = this.s;
    b.clamp()
}

function bnpRShiftTo(a, b) {
    b.s = this.s;
    var c = Math.floor(a / this.DB);
    if (c >= this.t) b.t = 0; else {
        var d = a % this.DB, e = this.DB - d, g = (1 << d) - 1;
        b[0] = this[c] >> d;
        for (var h = c + 1; h < this.t; ++h) b[h - c - 1] |= (this[h] & g) << e, b[h - c] = this[h] >> d;
        d > 0 && (b[this.t - c - 1] |= (this.s & g) << e);
        b.t = this.t - c;
        b.clamp()
    }
}

function bnpSubTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] - a[c], b[c++] = d & this.DM, d >>= this.DB;
    if (a.t < this.t) {
        for (d -= a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d -= a[c], b[c++] = d & this.DM, d >>= this.DB;
        d -= a.s
    }
    b.s = d < 0 ? -1 : 0;
    d < -1 ? b[c++] = this.DV + d : d > 0 && (b[c++] = d);
    b.t = c;
    b.clamp()
}

function bnpMultiplyTo(a, b) {
    var c = this.abs(), d = a.abs(), e = c.t;
    for (b.t = e + d.t; --e >= 0;) b[e] = 0;
    for (e = 0; e < d.t; ++e) b[e + c.t] = c.am(0, d[e], b, e, 0, c.t);
    b.s = 0;
    b.clamp();
    this.s != a.s && BigInteger.ZERO.subTo(b, b)
}

function bnpSquareTo(a) {
    for (var b = this.abs(), c = a.t = 2 * b.t; --c >= 0;) a[c] = 0;
    for (c = 0; c < b.t - 1; ++c) {
        var d = b.am(c, b[c], a, 2 * c, 0, 1);
        if ((a[c + b.t] += b.am(c + 1, 2 * b[c], a, 2 * c + 1, d, b.t - c - 1)) >= b.DV) a[c + b.t] -= b.DV, a[c + b.t + 1] = 1
    }
    a.t > 0 && (a[a.t - 1] += b.am(c, b[c], a, 2 * c, 0, 1));
    a.s = 0;
    a.clamp()
}

function bnpDivRemTo(a, b, c) {
    var d = a.abs();
    if (!(d.t <= 0)) {
        var e = this.abs();
        if (e.t < d.t) b != null && b.fromInt(0), c != null && this.copyTo(c); else {
            c == null && (c = nbi());
            var g = nbi(), h = this.s, a = a.s, f = this.DB - nbits(d[d.t - 1]);
            f > 0 ? (d.lShiftTo(f, g), e.lShiftTo(f, c)) : (d.copyTo(g), e.copyTo(c));
            d = g.t;
            e = g[d - 1];
            if (e != 0) {
                var o = e * (1 << this.F1) + (d > 1 ? g[d - 2] >> this.F2 : 0), p = this.FV / o, o = (1 << this.F1) / o,
                    q = 1 << this.F2, n = c.t, k = n - d, j = b == null ? nbi() : b;
                g.dlShiftTo(k, j);
                c.compareTo(j) >= 0 && (c[c.t++] = 1, c.subTo(j, c));
                BigInteger.ONE.dlShiftTo(d,
                    j);
                for (j.subTo(g, g); g.t < d;) g[g.t++] = 0;
                for (; --k >= 0;) {
                    var l = c[--n] == e ? this.DM : Math.floor(c[n] * p + (c[n - 1] + q) * o);
                    if ((c[n] += g.am(0, l, c, k, 0, d)) < l) {
                        g.dlShiftTo(k, j);
                        for (c.subTo(j, c); c[n] < --l;) c.subTo(j, c)
                    }
                }
                b != null && (c.drShiftTo(d, b), h != a && BigInteger.ZERO.subTo(b, b));
                c.t = d;
                c.clamp();
                f > 0 && c.rShiftTo(f, c);
                h < 0 && BigInteger.ZERO.subTo(c, c)
            }
        }
    }
}

function bnMod(a) {
    var b = nbi();
    this.abs().divRemTo(a, null, b);
    this.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && a.subTo(b, b);
    return b
}

function Classic(a) {
    this.m = a
}

function cConvert(a) {
    return a.s < 0 || a.compareTo(this.m) >= 0 ? a.mod(this.m) : a
}

function cRevert(a) {
    return a
}

function cReduce(a) {
    a.divRemTo(this.m, null, a)
}

function cMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}

function cSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
    if (this.t < 1) return 0;
    var a = this[0];
    if ((a & 1) == 0) return 0;
    var b = a & 3, b = b * (2 - (a & 15) * b) & 15, b = b * (2 - (a & 255) * b) & 255,
        b = b * (2 - ((a & 65535) * b & 65535)) & 65535, b = b * (2 - a * b % this.DV) % this.DV;
    return b > 0 ? this.DV - b : -b
}

function Montgomery(a) {
    this.m = a;
    this.mp = a.invDigit();
    this.mpl = this.mp & 32767;
    this.mph = this.mp >> 15;
    this.um = (1 << a.DB - 15) - 1;
    this.mt2 = 2 * a.t
}

function montConvert(a) {
    var b = nbi();
    a.abs().dlShiftTo(this.m.t, b);
    b.divRemTo(this.m, null, b);
    a.s < 0 && b.compareTo(BigInteger.ZERO) > 0 && this.m.subTo(b, b);
    return b
}

function montRevert(a) {
    var b = nbi();
    a.copyTo(b);
    this.reduce(b);
    return b
}

function montReduce(a) {
    for (; a.t <= this.mt2;) a[a.t++] = 0;
    for (var b = 0; b < this.m.t; ++b) {
        var c = a[b] & 32767, d = c * this.mpl + ((c * this.mph + (a[b] >> 15) * this.mpl & this.um) << 15) & a.DM,
            c = b + this.m.t;
        for (a[c] += this.m.am(0, d, a, b, 0, this.m.t); a[c] >= a.DV;) a[c] -= a.DV, a[++c]++
    }
    a.clamp();
    a.drShiftTo(this.m.t, a);
    a.compareTo(this.m) >= 0 && a.subTo(this.m, a)
}

function montSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}

function montMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0
}

function bnpExp(a, b) {
    if (a > 4294967295 || a < 1) return BigInteger.ONE;
    var c = nbi(), d = nbi(), e = b.convert(this), g = nbits(a) - 1;
    for (e.copyTo(c); --g >= 0;) if (b.sqrTo(c, d), (a & 1 << g) > 0) b.mulTo(d, e, c); else var h = c, c = d, d = h;
    return b.revert(c)
}

function bnModPowInt(a, b) {
    var c;
    c = a < 256 || b.isEven() ? new Classic(b) : new Montgomery(b);
    return this.exp(a, c)
}

BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
    var a = nbi();
    this.copyTo(a);
    return a
}

function bnIntValue() {
    if (this.s < 0) if (this.t == 1) return this[0] - this.DV; else {
        if (this.t == 0) return -1
    } else if (this.t == 1) return this[0]; else if (this.t == 0) return 0;
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
}

function bnByteValue() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24
}

function bnShortValue() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16
}

function bnpChunkSize(a) {
    return Math.floor(Math.LN2 * this.DB / Math.log(a))
}

function bnSigNum() {
    return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this[0] <= 0 ? 0 : 1
}

function bnpToRadix(a) {
    a == null && (a = 10);
    if (this.signum() == 0 || a < 2 || a > 36) return "0";
    var b = this.chunkSize(a), b = Math.pow(a, b), c = nbv(b), d = nbi(), e = nbi(), g = "";
    for (this.divRemTo(c, d, e); d.signum() > 0;) g = (b + e.intValue()).toString(a).substr(1) + g, d.divRemTo(c, d, e);
    return e.intValue().toString(a) + g
}

function bnpFromRadix(a, b) {
    this.fromInt(0);
    b == null && (b = 10);
    for (var c = this.chunkSize(b), d = Math.pow(b, c), e = !1, g = 0, h = 0, f = 0; f < a.length; ++f) {
        var o = intAt(a, f);
        o < 0 ? a.charAt(f) == "-" && this.signum() == 0 && (e = !0) : (h = b * h + o, ++g >= c && (this.dMultiply(d), this.dAddOffset(h, 0), h = g = 0))
    }
    g > 0 && (this.dMultiply(Math.pow(b, g)), this.dAddOffset(h, 0));
    e && BigInteger.ZERO.subTo(this, this)
}

function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) if (a < 2) this.fromInt(1); else {
        this.fromNumber(a, c);
        this.testBit(a - 1) || this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        for (this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(b);) this.dAddOffset(2, 0), this.bitLength() > a && this.subTo(BigInteger.ONE.shiftLeft(a - 1), this)
    } else {
        var c = [], d = a & 7;
        c.length = (a >> 3) + 1;
        b.nextBytes(c);
        d > 0 ? c[0] &= (1 << d) - 1 : c[0] = 0;
        this.fromString(c, 256)
    }
}

function bnToByteArray() {
    var a = this.t, b = [];
    b[0] = this.s;
    var c = this.DB - a * this.DB % 8, d, e = 0;
    if (a-- > 0) {
        if (c < this.DB && (d = this[a] >> c) != (this.s & this.DM) >> c) b[e++] = d | this.s << this.DB - c;
        for (; a >= 0;) if (c < 8 ? (d = (this[a] & (1 << c) - 1) << 8 - c, d |= this[--a] >> (c += this.DB - 8)) : (d = this[a] >> (c -= 8) & 255, c <= 0 && (c += this.DB, --a)), (d & 128) != 0 && (d |= -256), e == 0 && (this.s & 128) != (d & 128) && ++e, e > 0 || d != this.s) b[e++] = d
    }
    return b
}

function bnEquals(a) {
    return this.compareTo(a) == 0
}

function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a
}

function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a
}

function bnpBitwiseTo(a, b, c) {
    var d, e, g = Math.min(a.t, this.t);
    for (d = 0; d < g; ++d) c[d] = b(this[d], a[d]);
    if (a.t < this.t) {
        e = a.s & this.DM;
        for (d = g; d < this.t; ++d) c[d] = b(this[d], e);
        c.t = this.t
    } else {
        e = this.s & this.DM;
        for (d = g; d < a.t; ++d) c[d] = b(e, a[d]);
        c.t = a.t
    }
    c.s = b(this.s, a.s);
    c.clamp()
}

function op_and(a, b) {
    return a & b
}

function bnAnd(a) {
    var b = nbi();
    this.bitwiseTo(a, op_and, b);
    return b
}

function op_or(a, b) {
    return a | b
}

function bnOr(a) {
    var b = nbi();
    this.bitwiseTo(a, op_or, b);
    return b
}

function op_xor(a, b) {
    return a ^ b
}

function bnXor(a) {
    var b = nbi();
    this.bitwiseTo(a, op_xor, b);
    return b
}

function op_andnot(a, b) {
    return a & ~b
}

function bnAndNot(a) {
    var b = nbi();
    this.bitwiseTo(a, op_andnot, b);
    return b
}

function bnNot() {
    for (var a = nbi(), b = 0; b < this.t; ++b) a[b] = this.DM & ~this[b];
    a.t = this.t;
    a.s = ~this.s;
    return a
}

function bnShiftLeft(a) {
    var b = nbi();
    a < 0 ? this.rShiftTo(-a, b) : this.lShiftTo(a, b);
    return b
}

function bnShiftRight(a) {
    var b = nbi();
    a < 0 ? this.lShiftTo(-a, b) : this.rShiftTo(a, b);
    return b
}

function lbit(a) {
    if (a == 0) return -1;
    var b = 0;
    (a & 65535) == 0 && (a >>= 16, b += 16);
    (a & 255) == 0 && (a >>= 8, b += 8);
    (a & 15) == 0 && (a >>= 4, b += 4);
    (a & 3) == 0 && (a >>= 2, b += 2);
    (a & 1) == 0 && ++b;
    return b
}

function bnGetLowestSetBit() {
    for (var a = 0; a < this.t; ++a) if (this[a] != 0) return a * this.DB + lbit(this[a]);
    return this.s < 0 ? this.t * this.DB : -1
}

function cbit(a) {
    for (var b = 0; a != 0;) a &= a - 1, ++b;
    return b
}

function bnBitCount() {
    for (var a = 0, b = this.s & this.DM, c = 0; c < this.t; ++c) a += cbit(this[c] ^ b);
    return a
}

function bnTestBit(a) {
    var b = Math.floor(a / this.DB);
    return b >= this.t ? this.s != 0 : (this[b] & 1 << a % this.DB) != 0
}

function bnpChangeBit(a, b) {
    var c = BigInteger.ONE.shiftLeft(a);
    this.bitwiseTo(c, b, c);
    return c
}

function bnSetBit(a) {
    return this.changeBit(a, op_or)
}

function bnClearBit(a) {
    return this.changeBit(a, op_andnot)
}

function bnFlipBit(a) {
    return this.changeBit(a, op_xor)
}

function bnpAddTo(a, b) {
    for (var c = 0, d = 0, e = Math.min(a.t, this.t); c < e;) d += this[c] + a[c], b[c++] = d & this.DM, d >>= this.DB;
    if (a.t < this.t) {
        for (d += a.s; c < this.t;) d += this[c], b[c++] = d & this.DM, d >>= this.DB;
        d += this.s
    } else {
        for (d += this.s; c < a.t;) d += a[c], b[c++] = d & this.DM, d >>= this.DB;
        d += a.s
    }
    b.s = d < 0 ? -1 : 0;
    d > 0 ? b[c++] = d : d < -1 && (b[c++] = this.DV + d);
    b.t = c;
    b.clamp()
}

function bnAdd(a) {
    var b = nbi();
    this.addTo(a, b);
    return b
}

function bnSubtract(a) {
    var b = nbi();
    this.subTo(a, b);
    return b
}

function bnMultiply(a) {
    var b = nbi();
    this.multiplyTo(a, b);
    return b
}

function bnSquare() {
    var a = nbi();
    this.squareTo(a);
    return a
}

function bnDivide(a) {
    var b = nbi();
    this.divRemTo(a, b, null);
    return b
}

function bnRemainder(a) {
    var b = nbi();
    this.divRemTo(a, null, b);
    return b
}

function bnDivideAndRemainder(a) {
    var b = nbi(), c = nbi();
    this.divRemTo(a, b, c);
    return [b, c]
}

function bnpDMultiply(a) {
    this[this.t] = this.am(0, a - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}

function bnpDAddOffset(a, b) {
    if (a != 0) {
        for (; this.t <= b;) this[this.t++] = 0;
        for (this[b] += a; this[b] >= this.DV;) this[b] -= this.DV, ++b >= this.t && (this[this.t++] = 0), ++this[b]
    }
}

function NullExp() {
}

function nNop(a) {
    return a
}

function nMulTo(a, b, c) {
    a.multiplyTo(b, c)
}

function nSqrTo(a, b) {
    a.squareTo(b)
}

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(a) {
    return this.exp(a, new NullExp)
}

function bnpMultiplyLowerTo(a, b, c) {
    var d = Math.min(this.t + a.t, b);
    c.s = 0;
    for (c.t = d; d > 0;) c[--d] = 0;
    var e;
    for (e = c.t - this.t; d < e; ++d) c[d + this.t] = this.am(0, a[d], c, d, 0, this.t);
    for (e = Math.min(a.t, b); d < e; ++d) this.am(0, a[d], c, d, 0, b - d);
    c.clamp()
}

function bnpMultiplyUpperTo(a, b, c) {
    --b;
    var d = c.t = this.t + a.t - b;
    for (c.s = 0; --d >= 0;) c[d] = 0;
    for (d = Math.max(b - this.t, 0); d < a.t; ++d) c[this.t + d - b] = this.am(b - d, a[d], c, 0, 0, this.t + d - b);
    c.clamp();
    c.drShiftTo(1, c)
}

function Barrett(a) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * a.t, this.r2);
    this.mu = this.r2.divide(a);
    this.m = a
}

function barrettConvert(a) {
    if (a.s < 0 || a.t > 2 * this.m.t) return a.mod(this.m); else if (a.compareTo(this.m) < 0) return a; else {
        var b = nbi();
        a.copyTo(b);
        this.reduce(b);
        return b
    }
}

function barrettRevert(a) {
    return a
}

function barrettReduce(a) {
    a.drShiftTo(this.m.t - 1, this.r2);
    if (a.t > this.m.t + 1) a.t = this.m.t + 1, a.clamp();
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    for (this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); a.compareTo(this.r2) < 0;) a.dAddOffset(1, this.m.t + 1);
    for (a.subTo(this.r2, a); a.compareTo(this.m) >= 0;) a.subTo(this.m, a)
}

function barrettSqrTo(a, b) {
    a.squareTo(b);
    this.reduce(b)
}

function barrettMulTo(a, b, c) {
    a.multiplyTo(b, c);
    this.reduce(c)
}

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(a, b) {
    var c = a.bitLength(), d, e = nbv(1), g;
    if (c <= 0) return e; else d = c < 18 ? 1 : c < 48 ? 3 : c < 144 ? 4 : c < 768 ? 5 : 6;
    g = c < 8 ? new Classic(b) : b.isEven() ? new Barrett(b) : new Montgomery(b);
    var h = [], f = 3, o = d - 1, p = (1 << d) - 1;
    h[1] = g.convert(this);
    if (d > 1) {
        c = nbi();
        for (g.sqrTo(h[1], c); f <= p;) h[f] = nbi(), g.mulTo(c, h[f - 2], h[f]), f += 2
    }
    for (var q = a.t - 1, n, k = !0, j = nbi(), c = nbits(a[q]) - 1; q >= 0;) {
        c >= o ? n = a[q] >> c - o & p : (n = (a[q] & (1 << c + 1) - 1) << o - c, q > 0 && (n |= a[q - 1] >> this.DB + c - o));
        for (f = d; (n & 1) == 0;) n >>= 1, --f;
        if ((c -= f) < 0) c += this.DB, --q;
        if (k) h[n].copyTo(e),
            k = !1; else {
            for (; f > 1;) g.sqrTo(e, j), g.sqrTo(j, e), f -= 2;
            f > 0 ? g.sqrTo(e, j) : (f = e, e = j, j = f);
            g.mulTo(j, h[n], e)
        }
        for (; q >= 0 && (a[q] & 1 << c) == 0;) g.sqrTo(e, j), f = e, e = j, j = f, --c < 0 && (c = this.DB - 1, --q)
    }
    return g.revert(e)
}

function bnGCD(a) {
    var b = this.s < 0 ? this.negate() : this.clone(), a = a.s < 0 ? a.negate() : a.clone();
    if (b.compareTo(a) < 0) var c = b, b = a, a = c;
    var c = b.getLowestSetBit(), d = a.getLowestSetBit();
    if (d < 0) return b;
    c < d && (d = c);
    d > 0 && (b.rShiftTo(d, b), a.rShiftTo(d, a));
    for (; b.signum() > 0;) (c = b.getLowestSetBit()) > 0 && b.rShiftTo(c, b), (c = a.getLowestSetBit()) > 0 && a.rShiftTo(c, a), b.compareTo(a) >= 0 ? (b.subTo(a, b), b.rShiftTo(1, b)) : (a.subTo(b, a), a.rShiftTo(1, a));
    d > 0 && a.lShiftTo(d, a);
    return a
}

function bnpModInt(a) {
    if (a <= 0) return 0;
    var b = this.DV % a, c = this.s < 0 ? a - 1 : 0;
    if (this.t > 0) if (b == 0) c = this[0] % a; else for (var d = this.t - 1; d >= 0; --d) c = (b * c + this[d]) % a;
    return c
}

function bnModInverse(a) {
    var b = a.isEven();
    if (this.isEven() && b || a.signum() == 0) return BigInteger.ZERO;
    for (var c = a.clone(), d = this.clone(), e = nbv(1), g = nbv(0), h = nbv(0), f = nbv(1); c.signum() != 0;) {
        for (; c.isEven();) {
            c.rShiftTo(1, c);
            if (b) {
                if (!e.isEven() || !g.isEven()) e.addTo(this, e), g.subTo(a, g);
                e.rShiftTo(1, e)
            } else g.isEven() || g.subTo(a, g);
            g.rShiftTo(1, g)
        }
        for (; d.isEven();) {
            d.rShiftTo(1, d);
            if (b) {
                if (!h.isEven() || !f.isEven()) h.addTo(this, h), f.subTo(a, f);
                h.rShiftTo(1, h)
            } else f.isEven() || f.subTo(a, f);
            f.rShiftTo(1,
                f)
        }
        c.compareTo(d) >= 0 ? (c.subTo(d, c), b && e.subTo(h, e), g.subTo(f, g)) : (d.subTo(c, d), b && h.subTo(e, h), f.subTo(g, f))
    }
    if (d.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (f.compareTo(a) >= 0) return f.subtract(a);
    if (f.signum() < 0) f.addTo(a, f); else return f;
    return f.signum() < 0 ? f.add(a) : f
}

var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727,
        733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997],
    lplim = 67108864 / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(a) {
    var b, c = this.abs();
    if (c.t == 1 && c[0] <= lowprimes[lowprimes.length - 1]) {
        for (b = 0; b < lowprimes.length; ++b) if (c[0] == lowprimes[b]) return !0;
        return !1
    }
    if (c.isEven()) return !1;
    for (b = 1; b < lowprimes.length;) {
        for (var d = lowprimes[b], e = b + 1; e < lowprimes.length && d < lplim;) d *= lowprimes[e++];
        for (d = c.modInt(d); b < e;) if (d % lowprimes[b++] == 0) return !1
    }
    return c.millerRabin(a)
}

function bnpMillerRabin(a) {
    var b = this.subtract(BigInteger.ONE), c = b.getLowestSetBit();
    if (c <= 0) return !1;
    var d = b.shiftRight(c), a = a + 1 >> 1;
    if (a > lowprimes.length) a = lowprimes.length;
    for (var e = nbi(), g = 0; g < a; ++g) {
        e.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
        var h = e.modPow(d, this);
        if (h.compareTo(BigInteger.ONE) != 0 && h.compareTo(b) != 0) {
            for (var f = 1; f++ < c && h.compareTo(b) != 0;) if (h = h.modPowInt(2, this), h.compareTo(BigInteger.ONE) == 0) return !1;
            if (h.compareTo(b) != 0) return !1
        }
    }
    return !0
}

BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
(function (a, b, c, d, e, g, h) {
    function f(a) {
        var b, d, e = this, g = a.length, f = 0, h = e.i = e.j = e.m = 0;
        e.S = [];
        e.c = [];
        for (g || (a = [g++]); f < c;) e.S[f] = f++;
        for (f = 0; f < c; f++) b = e.S[f], h = h + b + a[f % g] & c - 1, d = e.S[h], e.S[f] = d, e.S[h] = b;
        e.g = function (a) {
            var b = e.S, d = e.i + 1 & c - 1, g = b[d], f = e.j + g & c - 1, h = b[f];
            b[d] = h;
            b[f] = g;
            for (var k = b[g + h & c - 1]; --a;) d = d + 1 & c - 1, g = b[d], f = f + g & c - 1, h = b[f], b[d] = h, b[f] = g, k = k * c + b[g + h & c - 1];
            e.i = d;
            e.j = f;
            return k
        };
        e.g(c)
    }

    function o(a, b, c, d, e) {
        c = [];
        e = typeof a;
        if (b && e == "object") for (d in a) if (d.indexOf("S") < 5) try {
            c.push(o(a[d],
                b - 1))
        } catch (g) {
        }
        return c.length ? c : a + (e != "string" ? "\x00" : "")
    }

    function p(a, b, d, e) {
        a += "";
        for (e = d = 0; e < a.length; e++) {
            var g = b, f = e & c - 1, h = (d ^= b[e & c - 1] * 19) + a.charCodeAt(e);
            g[f] = h & c - 1
        }
        a = "";
        for (e in b) a += String.fromCharCode(b[e]);
        return a
    }

    b.seedrandom = function (q, n) {
        var k = [], j, q = p(o(n ? [q, a] : arguments.length ? q : [(new Date).getTime(), a, window], 3), k);
        j = new f(k);
        p(j.S, a);
        b.random = function () {
            for (var a = j.g(d), b = h, f = 0; a < e;) a = (a + f) * c, b *= c, f = j.g(1);
            for (; a >= g;) a /= 2, b /= 2, f >>>= 1;
            return (a + f) / b
        };
        return q
    };
    h = b.pow(c, d);
    e = b.pow(2,
        e);
    g = e * 2;
    p(b.random(), a)
})([], Math, 256, 6, 52);

function SeededRandom() {
}

function SRnextBytes(a) {
    var b;
    for (b = 0; b < a.length; b++) a[b] = Math.floor(Math.random() * 256)
}

SeededRandom.prototype.nextBytes = SRnextBytes;

function Arcfour() {
    this.j = this.i = 0;
    this.S = []
}

function ARC4init(a) {
    var b, c, d;
    for (b = 0; b < 256; ++b) this.S[b] = b;
    for (b = c = 0; b < 256; ++b) c = c + this.S[b] + a[b % a.length] & 255, d = this.S[b], this.S[b] = this.S[c], this.S[c] = d;
    this.j = this.i = 0
}

function ARC4next() {
    var a;
    this.i = this.i + 1 & 255;
    this.j = this.j + this.S[this.i] & 255;
    a = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = a;
    return this.S[a + this.S[this.i] & 255]
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
    return new Arcfour
}

var rng_psize = 256, rng_state, rng_pool, rng_pptr;

function rng_seed_int(a) {
    rng_pool[rng_pptr++] ^= a & 255;
    rng_pool[rng_pptr++] ^= a >> 8 & 255;
    rng_pool[rng_pptr++] ^= a >> 16 & 255;
    rng_pool[rng_pptr++] ^= a >> 24 & 255;
    rng_pptr >= rng_psize && (rng_pptr -= rng_psize)
}

function rng_seed_time() {
    rng_seed_int((new Date).getTime())
}

if (rng_pool == null) {
    rng_pool = [];
    rng_pptr = 0;
    var t;
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
    }
    for (; rng_pptr < rng_psize;) t = Math.floor(65536 * Math.random()), rng_pool[rng_pptr++] = t >>> 8, rng_pool[rng_pptr++] = t & 255;
    rng_pptr = 0;
    rng_seed_time()
}

function rng_get_byte() {
    if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) rng_pool[rng_pptr] = 0;
        rng_pptr = 0
    }
    return rng_state.next()
}

function rng_get_bytes(a) {
    var b;
    for (b = 0; b < a.length; ++b) a[b] = rng_get_byte()
}

function SecureRandom() {
}

SecureRandom.prototype.nextBytes = rng_get_bytes;

function SHA256(a) {
    function b(a, b) {
        var c = (a & 65535) + (b & 65535);
        return (a >> 16) + (b >> 16) + (c >> 16) << 16 | c & 65535
    }

    function c(a, b) {
        return a >>> b | a << 32 - b
    }

    a = function (a) {
        for (var a = a.replace(/\r\n/g, "\n"), b = "", c = 0; c < a.length; c++) {
            var h = a.charCodeAt(c);
            h < 128 ? b += String.fromCharCode(h) : (h > 127 && h < 2048 ? b += String.fromCharCode(h >> 6 | 192) : (b += String.fromCharCode(h >> 12 | 224), b += String.fromCharCode(h >> 6 & 63 | 128)), b += String.fromCharCode(h & 63 | 128))
        }
        return b
    }(a);
    return function (a) {
        for (var b = "", c = 0; c < a.length * 4; c++) b += "0123456789abcdef".charAt(a[c >>
        2] >> (3 - c % 4) * 8 + 4 & 15) + "0123456789abcdef".charAt(a[c >> 2] >> (3 - c % 4) * 8 & 15);
        return b
    }(function (a, e) {
        var g = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051,
                2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
            h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
            f = Array(64), o, p, q, n, k, j, l, m, s, r, u, w;
        a[e >> 5] |= 128 << 24 - e % 32;
        a[(e + 64 >> 9 << 4) + 15] = e;
        for (s = 0; s < a.length; s += 16) {
            o = h[0];
            p = h[1];
            q = h[2];
            n = h[3];
            k = h[4];
            j = h[5];
            l = h[6];
            m = h[7];
            for (r = 0; r < 64; r++) f[r] = r < 16 ? a[r + s] : b(b(b(c(f[r - 2], 17) ^ c(f[r - 2], 19) ^ f[r - 2] >>> 10, f[r - 7]), c(f[r - 15], 7) ^ c(f[r - 15], 18) ^ f[r - 15] >>> 3), f[r - 16]), u = b(b(b(b(m, c(k, 6) ^ c(k, 11) ^ c(k, 25)), k & j ^ ~k & l), g[r]), f[r]), w = b(c(o, 2) ^ c(o, 13) ^ c(o, 22), o & p ^ o & q ^ p & q), m = l, l = j, j = k, k = b(n, u), n = q, q = p, p = o, o = b(u, w);
            h[0] = b(o, h[0]);
            h[1] = b(p, h[1]);
            h[2] = b(q, h[2]);
            h[3] = b(n, h[3]);
            h[4] = b(k, h[4]);
            h[5] = b(j, h[5]);
            h[6] = b(l, h[6]);
            h[7] = b(m, h[7])
        }
        return h
    }(function (a) {
        for (var b = [], c = 0; c < a.length * 8; c += 8) b[c >> 5] |= (a.charCodeAt(c /
            8) & 255) << 24 - c % 32;
        return b
    }(a), a.length * 8))
}

var sha256 = {
    hex: function (a) {
        return SHA256(a)
    }
};

function SHA1(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }

    function c(a) {
        var b = "", c, d;
        for (c = 7; c >= 0; c--) d = a >>> c * 4 & 15, b += d.toString(16);
        return b
    }

    var d, e, g = Array(80), h = 1732584193, f = 4023233417, o = 2562383102, p = 271733878, q = 3285377520, n, k, j, l,
        m, a = function (a) {
            for (var a = a.replace(/\r\n/g, "\n"), b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                d < 128 ? b += String.fromCharCode(d) : (d > 127 && d < 2048 ? b += String.fromCharCode(d >> 6 | 192) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128)), b += String.fromCharCode(d &
                    63 | 128))
            }
            return b
        }(a);
    n = a.length;
    var s = [];
    for (d = 0; d < n - 3; d += 4) e = a.charCodeAt(d) << 24 | a.charCodeAt(d + 1) << 16 | a.charCodeAt(d + 2) << 8 | a.charCodeAt(d + 3), s.push(e);
    switch (n % 4) {
        case 0:
            d = 2147483648;
            break;
        case 1:
            d = a.charCodeAt(n - 1) << 24 | 8388608;
            break;
        case 2:
            d = a.charCodeAt(n - 2) << 24 | a.charCodeAt(n - 1) << 16 | 32768;
            break;
        case 3:
            d = a.charCodeAt(n - 3) << 24 | a.charCodeAt(n - 2) << 16 | a.charCodeAt(n - 1) << 8 | 128
    }
    for (s.push(d); s.length % 16 != 14;) s.push(0);
    s.push(n >>> 29);
    s.push(n << 3 & 4294967295);
    for (a = 0; a < s.length; a += 16) {
        for (d = 0; d < 16; d++) g[d] =
            s[a + d];
        for (d = 16; d <= 79; d++) g[d] = b(g[d - 3] ^ g[d - 8] ^ g[d - 14] ^ g[d - 16], 1);
        e = h;
        n = f;
        k = o;
        j = p;
        l = q;
        for (d = 0; d <= 19; d++) m = b(e, 5) + (n & k | ~n & j) + l + g[d] + 1518500249 & 4294967295, l = j, j = k, k = b(n, 30), n = e, e = m;
        for (d = 20; d <= 39; d++) m = b(e, 5) + (n ^ k ^ j) + l + g[d] + 1859775393 & 4294967295, l = j, j = k, k = b(n, 30), n = e, e = m;
        for (d = 40; d <= 59; d++) m = b(e, 5) + (n & k | n & j | k & j) + l + g[d] + 2400959708 & 4294967295, l = j, j = k, k = b(n, 30), n = e, e = m;
        for (d = 60; d <= 79; d++) m = b(e, 5) + (n ^ k ^ j) + l + g[d] + 3395469782 & 4294967295, l = j, j = k, k = b(n, 30), n = e, e = m;
        h = h + e & 4294967295;
        f = f + n & 4294967295;
        o = o + k & 4294967295;
        p = p + j & 4294967295;
        q = q + l & 4294967295
    }
    m = c(h) + c(f) + c(o) + c(p) + c(q);
    return m.toLowerCase()
}

var sha1 = {
    hex: function (a) {
        return SHA1(a)
    }
}, MD5 = function (a) {
    function b(a, b) {
        var c, d, e, f, g;
        e = a & 2147483648;
        f = b & 2147483648;
        c = a & 1073741824;
        d = b & 1073741824;
        g = (a & 1073741823) + (b & 1073741823);
        return c & d ? g ^ 2147483648 ^ e ^ f : c | d ? g & 1073741824 ? g ^ 3221225472 ^ e ^ f : g ^ 1073741824 ^ e ^ f : g ^ e ^ f
    }

    function c(a, c, d, e, f, g, h) {
        a = b(a, b(b(c & d | ~c & e, f), h));
        return b(a << g | a >>> 32 - g, c)
    }

    function d(a, c, d, e, f, g, h) {
        a = b(a, b(b(c & e | d & ~e, f), h));
        return b(a << g | a >>> 32 - g, c)
    }

    function e(a, c, d, e, f, g, h) {
        a = b(a, b(b(c ^ d ^ e, f), h));
        return b(a << g | a >>> 32 - g, c)
    }

    function g(a,
               c, d, e, f, g, h) {
        a = b(a, b(b(d ^ (c | ~e), f), h));
        return b(a << g | a >>> 32 - g, c)
    }

    function h(a) {
        var b = "", c = "", d;
        for (d = 0; d <= 3; d++) c = a >>> d * 8 & 255, c = "0" + c.toString(16), b += c.substr(c.length - 2, 2);
        return b
    }

    var f = [], o, p, q, n, k, j, l, m, a = function (a) {
            for (var a = a.replace(/\r\n/g, "\n"), b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                d < 128 ? b += String.fromCharCode(d) : (d > 127 && d < 2048 ? b += String.fromCharCode(d >> 6 | 192) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128)), b += String.fromCharCode(d & 63 | 128))
            }
            return b
        }(a),
        f = function (a) {
            var b, c = a.length;
            b = c + 8;
            for (var d = ((b - b % 64) / 64 + 1) * 16, e = Array(d - 1), f = 0, g = 0; g < c;) b = (g - g % 4) / 4, f = g % 4 * 8, e[b] |= a.charCodeAt(g) << f, g++;
            e[(g - g % 4) / 4] |= 128 << g % 4 * 8;
            e[d - 2] = c << 3;
            e[d - 1] = c >>> 29;
            return e
        }(a);
    k = 1732584193;
    j = 4023233417;
    l = 2562383102;
    m = 271733878;
    for (a = 0; a < f.length; a += 16) o = k, p = j, q = l, n = m, k = c(k, j, l, m, f[a + 0], 7, 3614090360), m = c(m, k, j, l, f[a + 1], 12, 3905402710), l = c(l, m, k, j, f[a + 2], 17, 606105819), j = c(j, l, m, k, f[a + 3], 22, 3250441966), k = c(k, j, l, m, f[a + 4], 7, 4118548399), m = c(m, k, j, l, f[a + 5], 12, 1200080426), l = c(l,
        m, k, j, f[a + 6], 17, 2821735955), j = c(j, l, m, k, f[a + 7], 22, 4249261313), k = c(k, j, l, m, f[a + 8], 7, 1770035416), m = c(m, k, j, l, f[a + 9], 12, 2336552879), l = c(l, m, k, j, f[a + 10], 17, 4294925233), j = c(j, l, m, k, f[a + 11], 22, 2304563134), k = c(k, j, l, m, f[a + 12], 7, 1804603682), m = c(m, k, j, l, f[a + 13], 12, 4254626195), l = c(l, m, k, j, f[a + 14], 17, 2792965006), j = c(j, l, m, k, f[a + 15], 22, 1236535329), k = d(k, j, l, m, f[a + 1], 5, 4129170786), m = d(m, k, j, l, f[a + 6], 9, 3225465664), l = d(l, m, k, j, f[a + 11], 14, 643717713), j = d(j, l, m, k, f[a + 0], 20, 3921069994), k = d(k, j, l, m, f[a + 5], 5, 3593408605),
        m = d(m, k, j, l, f[a + 10], 9, 38016083), l = d(l, m, k, j, f[a + 15], 14, 3634488961), j = d(j, l, m, k, f[a + 4], 20, 3889429448), k = d(k, j, l, m, f[a + 9], 5, 568446438), m = d(m, k, j, l, f[a + 14], 9, 3275163606), l = d(l, m, k, j, f[a + 3], 14, 4107603335), j = d(j, l, m, k, f[a + 8], 20, 1163531501), k = d(k, j, l, m, f[a + 13], 5, 2850285829), m = d(m, k, j, l, f[a + 2], 9, 4243563512), l = d(l, m, k, j, f[a + 7], 14, 1735328473), j = d(j, l, m, k, f[a + 12], 20, 2368359562), k = e(k, j, l, m, f[a + 5], 4, 4294588738), m = e(m, k, j, l, f[a + 8], 11, 2272392833), l = e(l, m, k, j, f[a + 11], 16, 1839030562), j = e(j, l, m, k, f[a + 14], 23, 4259657740),
        k = e(k, j, l, m, f[a + 1], 4, 2763975236), m = e(m, k, j, l, f[a + 4], 11, 1272893353), l = e(l, m, k, j, f[a + 7], 16, 4139469664), j = e(j, l, m, k, f[a + 10], 23, 3200236656), k = e(k, j, l, m, f[a + 13], 4, 681279174), m = e(m, k, j, l, f[a + 0], 11, 3936430074), l = e(l, m, k, j, f[a + 3], 16, 3572445317), j = e(j, l, m, k, f[a + 6], 23, 76029189), k = e(k, j, l, m, f[a + 9], 4, 3654602809), m = e(m, k, j, l, f[a + 12], 11, 3873151461), l = e(l, m, k, j, f[a + 15], 16, 530742520), j = e(j, l, m, k, f[a + 2], 23, 3299628645), k = g(k, j, l, m, f[a + 0], 6, 4096336452), m = g(m, k, j, l, f[a + 7], 10, 1126891415), l = g(l, m, k, j, f[a + 14], 15, 2878612391),
        j = g(j, l, m, k, f[a + 5], 21, 4237533241), k = g(k, j, l, m, f[a + 12], 6, 1700485571), m = g(m, k, j, l, f[a + 3], 10, 2399980690), l = g(l, m, k, j, f[a + 10], 15, 4293915773), j = g(j, l, m, k, f[a + 1], 21, 2240044497), k = g(k, j, l, m, f[a + 8], 6, 1873313359), m = g(m, k, j, l, f[a + 15], 10, 4264355552), l = g(l, m, k, j, f[a + 6], 15, 2734768916), j = g(j, l, m, k, f[a + 13], 21, 1309151649), k = g(k, j, l, m, f[a + 4], 6, 4149444226), m = g(m, k, j, l, f[a + 11], 10, 3174756917), l = g(l, m, k, j, f[a + 2], 15, 718787259), j = g(j, l, m, k, f[a + 9], 21, 3951481745), k = b(k, o), j = b(j, p), l = b(l, q), m = b(m, n);
    return (h(k) + h(j) + h(l) +
        h(m)).toLowerCase()
};

function parseBigInt(a, b) {
    return new BigInteger(a, b)
}

function linebrk(a, b) {
    for (var c = "", d = 0; d + b < a.length;) c += a.substring(d, d + b) + "\n", d += b;
    return c + a.substring(d, a.length)
}

function byte2Hex(a) {
    return a < 16 ? "0" + a.toString(16) : a.toString(16)
}

function pkcs1pad2(a, b) {
    if (b < a.length + 11) throw"Message too long for RSA (n=" + b + ", l=" + a.length + ")";
    for (var c = [], d = a.length - 1; d >= 0 && b > 0;) {
        var e = a.charCodeAt(d--);
        e < 128 ? c[--b] = e : e > 127 && e < 2048 ? (c[--b] = e & 63 | 128, c[--b] = e >> 6 | 192) : (c[--b] = e & 63 | 128, c[--b] = e >> 6 & 63 | 128, c[--b] = e >> 12 | 224)
    }
    c[--b] = 0;
    d = new SecureRandom;
    for (e = []; b > 2;) {
        for (e[0] = 0; e[0] == 0;) d.nextBytes(e);
        c[--b] = e[0]
    }
    c[--b] = 2;
    c[--b] = 0;
    return new BigInteger(c)
}

function RSAKey() {
    this.n = null;
    this.e = 0;
    this.coeff = this.dmq1 = this.dmp1 = this.q = this.p = this.d = null
}

function RSASetPublic(a, b) {
    a != null && b != null && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, 16), this.e = parseInt(b, 16)) : alert("Invalid RSA public key")
}

function RSADoPublic(a) {
    return a.modPowInt(this.e, this.n)
}

function RSAEncrypt(a) {
    a = pkcs1pad2(a, this.n.bitLength() + 7 >> 3);
    if (a == null) return null;
    a = this.doPublic(a);
    if (a == null) return null;
    a = a.toString(16);
    return (a.length & 1) == 0 ? a : "0" + a
}

RSAKey.prototype.doPublic = RSADoPublic;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.encrypt = RSAEncrypt;

function pkcs1unpad2(a, b) {
    for (var c = a.toByteArray(), d = 0; d < c.length && c[d] == 0;) ++d;
    if (c.length - d != b - 1 || c[d] != 2) return null;
    for (++d; c[d] != 0;) if (++d >= c.length) return null;
    for (var e = ""; ++d < c.length;) {
        var g = c[d] & 255;
        g < 128 ? e += String.fromCharCode(g) : g > 191 && g < 224 ? (e += String.fromCharCode((g & 31) << 6 | c[d + 1] & 63), ++d) : (e += String.fromCharCode((g & 15) << 12 | (c[d + 1] & 63) << 6 | c[d + 2] & 63), d += 2)
    }
    return e
}

function RSASetPrivate(a, b, c) {
    a != null && b != null && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, 16), this.e = parseInt(b, 16), this.d = parseBigInt(c, 16)) : alert("Invalid RSA private key")
}

function RSASetPrivateEx(a, b, c, d, e, g, h, f) {
    a != null && b != null && a.length > 0 && b.length > 0 ? (this.n = parseBigInt(a, 16), this.e = parseInt(b, 16), this.d = parseBigInt(c, 16), this.p = parseBigInt(d, 16), this.q = parseBigInt(e, 16), this.dmp1 = parseBigInt(g, 16), this.dmq1 = parseBigInt(h, 16), this.coeff = parseBigInt(f, 16)) : alert("Invalid RSA private key")
}

function RSAGenerate(a, b) {
    var c = new SeededRandom, d = a >> 1;
    this.e = parseInt(b, 16);
    for (var e = new BigInteger(b, 16); ;) {
        for (; ;) if (this.p = new BigInteger(a - d, 1, c), this.p.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
        for (; ;) if (this.q = new BigInteger(d, 1, c), this.q.subtract(BigInteger.ONE).gcd(e).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
        if (this.p.compareTo(this.q) <= 0) {
            var g = this.p;
            this.p = this.q;
            this.q = g
        }
        var g = this.p.subtract(BigInteger.ONE),
            h = this.q.subtract(BigInteger.ONE), f = g.multiply(h);
        if (f.gcd(e).compareTo(BigInteger.ONE) == 0) {
            this.n = this.p.multiply(this.q);
            this.d = e.modInverse(f);
            this.dmp1 = this.d.mod(g);
            this.dmq1 = this.d.mod(h);
            this.coeff = this.q.modInverse(this.p);
            break
        }
    }
}

function RSADoPrivate(a) {
    if (this.p == null || this.q == null) return a.modPow(this.d, this.n);
    for (var b = a.mod(this.p).modPow(this.dmp1, this.p), a = a.mod(this.q).modPow(this.dmq1, this.q); b.compareTo(a) < 0;) b = b.add(this.p);
    return b.subtract(a).multiply(this.coeff).mod(this.p).multiply(this.q).add(a)
}

function RSADecrypt(a) {
    a = this.doPrivate(parseBigInt(a, 16));
    return a == null ? null : pkcs1unpad2(a, this.n.bitLength() + 7 >> 3)
}

RSAKey.prototype.doPrivate = RSADoPrivate;
RSAKey.prototype.setPrivate = RSASetPrivate;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.generate = RSAGenerate;
RSAKey.prototype.decrypt = RSADecrypt;
var _RSASIGN_DIHEAD = [];
_RSASIGN_DIHEAD.sha1 = "3021300906052b0e03021a05000414";
_RSASIGN_DIHEAD.sha256 = "3031300d060960864801650304020105000420";
var _RSASIGN_HASHHEXFUNC = [];
_RSASIGN_HASHHEXFUNC.sha1 = sha1.hex;
_RSASIGN_HASHHEXFUNC.sha256 = sha256.hex;

function _rsasign_getHexPaddedDigestInfoForString(a, b, c) {
    b /= 4;
    for (var a = (0, _RSASIGN_HASHHEXFUNC[c])(a), c = "00" + _RSASIGN_DIHEAD[c] + a, a = "", b = b - 4 - c.length, d = 0; d < b; d += 2) a += "ff";
    return sPaddedMessageHex = "0001" + a + c
}

function _rsasign_signString(a, b) {
    var c = _rsasign_getHexPaddedDigestInfoForString(a, this.n.bitLength(), b);
    return this.doPrivate(parseBigInt(c, 16)).toString(16)
}

function _rsasign_signStringWithSHA1(a) {
    a = _rsasign_getHexPaddedDigestInfoForString(a, this.n.bitLength(), "sha1");
    return this.doPrivate(parseBigInt(a, 16)).toString(16)
}

function _rsasign_signStringWithSHA256(a) {
    a = _rsasign_getHexPaddedDigestInfoForString(a, this.n.bitLength(), "sha256");
    return this.doPrivate(parseBigInt(a, 16)).toString(16)
}

function _rsasign_getDecryptSignatureBI(a, b, c) {
    var d = new RSAKey;
    d.setPublic(b, c);
    return d.doPublic(a)
}

function _rsasign_getHexDigestInfoFromSig(a, b, c) {
    return _rsasign_getDecryptSignatureBI(a, b, c).toString(16).replace(/^1f+00/, "")
}

function _rsasign_getAlgNameAndHashFromHexDisgestInfo(a) {
    for (var b in _RSASIGN_DIHEAD) {
        var c = _RSASIGN_DIHEAD[b], d = c.length;
        if (a.substring(0, d) == c) return [b, a.substring(d)]
    }
    return []
}

function _rsasign_verifySignatureWithArgs(a, b, c, d) {
    b = _rsasign_getHexDigestInfoFromSig(b, c, d);
    c = _rsasign_getAlgNameAndHashFromHexDisgestInfo(b);
    if (c.length == 0) return !1;
    b = c[1];
    a = (0, _RSASIGN_HASHHEXFUNC[c[0]])(a);
    return b == a
}

function _rsasign_verifyHexSignatureForMessage(a, b) {
    var c = parseBigInt(a, 16);
    return _rsasign_verifySignatureWithArgs(b, c, this.n.toString(16), this.e.toString(16))
}

function _rsasign_verifyString(a, b) {
    var b = b.replace(/[ \n]+/g, ""), c = this.doPublic(parseBigInt(b, 16)).toString(16).replace(/^1f+00/, ""),
        d = _rsasign_getAlgNameAndHashFromHexDisgestInfo(c);
    if (d.length == 0) return !1;
    c = d[1];
    d = (0, _RSASIGN_HASHHEXFUNC[d[0]])(a);
    return c == d
}

RSAKey.prototype.signString = _rsasign_signString;
RSAKey.prototype.signStringWithSHA1 = _rsasign_signStringWithSHA1;
RSAKey.prototype.signStringWithSHA256 = _rsasign_signStringWithSHA256;
RSAKey.prototype.verifyString = _rsasign_verifyString;
RSAKey.prototype.verifyHexSignatureForMessage = _rsasign_verifyHexSignatureForMessage;
var aes = function () {
    var a = {
        Sbox: [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236,
            95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
        ShiftRowTab: [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11]
    };
    a.Init =
        function () {
            a.Sbox_Inv = Array(256);
            for (var b = 0; b < 256; b++) a.Sbox_Inv[a.Sbox[b]] = b;
            a.ShiftRowTab_Inv = Array(16);
            for (b = 0; b < 16; b++) a.ShiftRowTab_Inv[a.ShiftRowTab[b]] = b;
            a.xtime = Array(256);
            for (b = 0; b < 128; b++) a.xtime[b] = b << 1, a.xtime[128 + b] = b << 1 ^ 27
        };
    a.Done = function () {
        delete a.Sbox_Inv;
        delete a.ShiftRowTab_Inv;
        delete a.xtime
    };
    a.ExpandKey = function (b) {
        var c = b.length, d, e = 1;
        switch (c) {
            case 16:
                d = 176;
                break;
            case 24:
                d = 208;
                break;
            case 32:
                d = 240;
                break;
            default:
                alert("my.ExpandKey: Only key lengths of 16, 24 or 32 bytes allowed!")
        }
        for (var g =
            c; g < d; g += 4) {
            var h = b.slice(g - 4, g);
            if (g % c == 0) {
                if (h = [a.Sbox[h[1]] ^ e, a.Sbox[h[2]], a.Sbox[h[3]], a.Sbox[h[0]]], (e <<= 1) >= 256) e ^= 283
            } else c > 24 && g % c == 16 && (h = [a.Sbox[h[0]], a.Sbox[h[1]], a.Sbox[h[2]], a.Sbox[h[3]]]);
            for (var f = 0; f < 4; f++) b[g + f] = b[g + f - c] ^ h[f]
        }
    };
    a.Encrypt = function (b, c) {
        var d = c.length;
        a.AddRoundKey(b, c.slice(0, 16));
        for (var e = 16; e < d - 16; e += 16) a.SubBytes(b, a.Sbox), a.ShiftRows(b, a.ShiftRowTab), a.MixColumns(b), a.AddRoundKey(b, c.slice(e, e + 16));
        a.SubBytes(b, a.Sbox);
        a.ShiftRows(b, a.ShiftRowTab);
        a.AddRoundKey(b,
            c.slice(e, d))
    };
    a.Decrypt = function (b, c) {
        var d = c.length;
        a.AddRoundKey(b, c.slice(d - 16, d));
        a.ShiftRows(b, a.ShiftRowTab_Inv);
        a.SubBytes(b, a.Sbox_Inv);
        for (d -= 32; d >= 16; d -= 16) a.AddRoundKey(b, c.slice(d, d + 16)), a.MixColumns_Inv(b), a.ShiftRows(b, a.ShiftRowTab_Inv), a.SubBytes(b, a.Sbox_Inv);
        a.AddRoundKey(b, c.slice(0, 16))
    };
    a.SubBytes = function (a, c) {
        for (var d = 0; d < 16; d++) a[d] = c[a[d]]
    };
    a.AddRoundKey = function (a, c) {
        for (var d = 0; d < 16; d++) a[d] ^= c[d]
    };
    a.ShiftRows = function (a, c) {
        for (var d = [].concat(a), e = 0; e < 16; e++) a[e] = d[c[e]]
    };
    a.MixColumns = function (b) {
        for (var c = 0; c < 16; c += 4) {
            var d = b[c + 0], e = b[c + 1], g = b[c + 2], h = b[c + 3], f = d ^ e ^ g ^ h;
            b[c + 0] ^= f ^ a.xtime[d ^ e];
            b[c + 1] ^= f ^ a.xtime[e ^ g];
            b[c + 2] ^= f ^ a.xtime[g ^ h];
            b[c + 3] ^= f ^ a.xtime[h ^ d]
        }
    };
    a.MixColumns_Inv = function (b) {
        for (var c = 0; c < 16; c += 4) {
            var d = b[c + 0], e = b[c + 1], g = b[c + 2], h = b[c + 3], f = d ^ e ^ g ^ h, o = a.xtime[f],
                p = a.xtime[a.xtime[o ^ d ^ g]] ^ f;
            f ^= a.xtime[a.xtime[o ^ e ^ h]];
            b[c + 0] ^= p ^ a.xtime[d ^ e];
            b[c + 1] ^= f ^ a.xtime[e ^ g];
            b[c + 2] ^= p ^ a.xtime[g ^ h];
            b[c + 3] ^= f ^ a.xtime[h ^ d]
        }
    };
    return a
}(), cryptico = function () {
    var a = {};
    aes.Init();
    a.b256to64 = function (a) {
        var c, d, e, g = "", h = 0, f = 0, o = a.length;
        for (e = 0; e < o; e++) d = a.charCodeAt(e), f == 0 ? (g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >> 2 & 63), c = (d & 3) << 4) : f == 1 ? (g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c | d >> 4 & 15), c = (d & 15) << 2) : f == 2 && (g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c | d >> 6 & 3), h += 1, g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d & 63)), h += 1, f += 1, f == 3 &&
        (f = 0);
        f > 0 && (g += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c), g += "=");
        f == 1 && (g += "=");
        return g
    };
    a.b64to256 = function (a) {
        var c, d, e = "", g = 0, h = 0, f = a.length;
        for (d = 0; d < f; d++) c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d)), c >= 0 && (g && (e += String.fromCharCode(h | c >> 6 - g & 255)), g = g + 2 & 7, h = c << g & 255);
        return e
    };
    a.b16to64 = function (a) {
        var c, d, e = "";
        a.length % 2 == 1 && (a = "0" + a);
        for (c = 0; c + 3 <= a.length; c += 3) d = parseInt(a.substring(c, c + 3), 16), e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >>
            6) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d & 63);
        c + 1 == a.length ? (d = parseInt(a.substring(c, c + 1), 16), e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d << 2)) : c + 2 == a.length && (d = parseInt(a.substring(c, c + 2), 16), e += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d >> 2) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((d & 3) << 4));
        for (; (e.length & 3) > 0;) e += "=";
        return e
    };
    a.b64to16 = function (a) {
        var c = "",
            d, e = 0, g;
        for (d = 0; d < a.length; ++d) {
            if (a.charAt(d) == "=") break;
            v = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(a.charAt(d));
            v < 0 || (e == 0 ? (c += int2char(v >> 2), g = v & 3, e = 1) : e == 1 ? (c += int2char(g << 2 | v >> 4), g = v & 15, e = 2) : e == 2 ? (c += int2char(g), c += int2char(v >> 2), g = v & 3, e = 3) : (c += int2char(g << 2 | v >> 4), c += int2char(v & 15), e = 0))
        }
        e == 1 && (c += int2char(g << 2));
        return c
    };
    a.string2bytes = function (a) {
        for (var c = [], d = 0; d < a.length; d++) c.push(a.charCodeAt(d));
        return c
    };
    a.bytes2string = function (a) {
        for (var c = "", d = 0; d <
        a.length; d++) c += String.fromCharCode(a[d]);
        return c
    };
    a.blockXOR = function (a, c) {
        for (var d = Array(16), e = 0; e < 16; e++) d[e] = a[e] ^ c[e];
        return d
    };
    a.blockIV = function () {
        var a = new SecureRandom, c = Array(16);
        a.nextBytes(c);
        return c
    };
    a.pad16 = function (a) {
        var c = a.slice(0), d = (16 - a.length % 16) % 16;
        for (i = a.length; i < a.length + d; i++) c.push(0);
        return c
    };
    a.depad = function (a) {
        for (a = a.slice(0); a[a.length - 1] == 0;) a = a.slice(0, a.length - 1);
        return a
    };
    a.encryptAESCBC = function (b, c) {
        var d = c.slice(0);
        aes.ExpandKey(d);
        for (var e = a.string2bytes(b),
                 e = a.pad16(e), g = a.blockIV(), h = 0; h < e.length / 16; h++) {
            var f = e.slice(h * 16, h * 16 + 16), o = g.slice(h * 16, h * 16 + 16), f = a.blockXOR(o, f);
            aes.Encrypt(f, d);
            g = g.concat(f)
        }
        d = a.bytes2string(g);
        return a.b256to64(d)
    };
    a.decryptAESCBC = function (b, c) {
        var d = c.slice(0);
        aes.ExpandKey(d);
        for (var b = a.b64to256(b), e = a.string2bytes(b), g = [], h = 1; h < e.length / 16; h++) {
            var f = e.slice(h * 16, h * 16 + 16), o = e.slice((h - 1) * 16, (h - 1) * 16 + 16);
            aes.Decrypt(f, d);
            f = a.blockXOR(o, f);
            g = g.concat(f)
        }
        g = a.depad(g);
        return a.bytes2string(g)
    };
    a.wrap60 = function (a) {
        for (var c =
            "", d = 0; d < a.length; d++) d % 60 == 0 && d != 0 && (c += "\n"), c += a[d];
        return c
    };
    a.generateAESKey = function () {
        var a = Array(32);
        (new SecureRandom).nextBytes(a);
        return a
    };
    a.generateRSAKey = function (a, c) {
        Math.seedrandom(sha256.hex(a));
        var d = new RSAKey;
        d.generate(c, "03");
        return d
    };
    a.publicKeyString = function (b) {
        return pubkey = a.b16to64(b.n.toString(16))
    };
    a.publicKeyID = function (a) {
        return MD5(a)
    };
    a.publicKeyFromString = function (b) {
        var b = a.b64to16(b.split("|")[0]), c = new RSAKey;
        c.setPublic(b, "03");
        return c
    };
    a.encrypt = function (b,
                          c, d) {
        var e = "", g = a.generateAESKey();
        try {
            var h = a.publicKeyFromString(c);
            e += a.b16to64(h.encrypt(a.bytes2string(g))) + "?"
        } catch (f) {
            return {status: "Invalid public key"}
        }
        d && (signString = cryptico.b16to64(d.signString(b, "sha256")), b += "::52cee64bb3a38f6403386519a39ac91c::", b += cryptico.publicKeyString(d), b += "::52cee64bb3a38f6403386519a39ac91c::", b += signString);
        e += a.encryptAESCBC(b, g);
        return {status: "success", cipher: e}
    };
    a.decrypt = function (b, c) {
        var d = b.split("?"), e = c.decrypt(a.b64to16(d[0]));
        if (e == null) return {status: "failure"};
        e = a.string2bytes(e);
        d = a.decryptAESCBC(d[1], e).split("::52cee64bb3a38f6403386519a39ac91c::");
        if (d.length == 3) {
            var e = a.publicKeyFromString(d[1]), g = a.b64to16(d[2]);
            return e.verifyString(d[0], g) ? {
                status: "success",
                plaintext: d[0],
                signature: "verified",
                publicKeyString: a.publicKeyString(e)
            } : {status: "success", plaintext: d[0], signature: "forged", publicKeyString: a.publicKeyString(e)}
        } else return {status: "success", plaintext: d[0], signature: "unsigned"}
    };
    return a
}();