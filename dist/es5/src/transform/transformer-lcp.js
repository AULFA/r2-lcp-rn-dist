"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecryptedSizeStream = exports.transformStream = exports.supports = void 0;
var tslib_1 = require("tslib");
var crypto = require("crypto");
var debug_ = require("debug");
var zlib = require("zlib");
var BufferUtils_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/BufferUtils");
var RangeStream_1 = require("r2-utils-rn/dist/es5/src/_utils/stream/RangeStream");
var debug = debug_("r2:lcp#transform/transformer-lcp");
var IS_DEV = (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev");
var AES_BLOCK_SIZE = 16;
var readStream = function (s, n) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                var onReadable = function () {
                    var b = s.read(n);
                    s.removeListener("readable", onReadable);
                    s.removeListener("error", reject);
                    resolve(b);
                };
                s.on("readable", onReadable);
                s.on("error", reject);
            })];
    });
}); };
function supports(lcp, _linkHref, linkPropertiesEncrypted) {
    if (!lcp) {
        return false;
    }
    if (!lcp.isReady()) {
        debug("LCP not ready!");
        return false;
    }
    var check = (linkPropertiesEncrypted.Scheme === "http://readium.org/2014/01/lcp"
        && (linkPropertiesEncrypted.Profile === "http://readium.org/lcp/basic-profile" ||
            linkPropertiesEncrypted.Profile === "http://readium.org/lcp/profile-1.0")
        && linkPropertiesEncrypted.Algorithm === "http://www.w3.org/2001/04/xmlenc#aes256-cbc")
        ||
            (linkPropertiesEncrypted.Algorithm === "http://www.w3.org/2001/04/xmlenc#aes256-cbc" &&
                (lcp.Encryption.Profile === "http://readium.org/lcp/basic-profile" ||
                    lcp.Encryption.Profile === "http://readium.org/lcp/profile-1.0"));
    if (!check) {
        return false;
    }
    return true;
}
exports.supports = supports;
function transformStream(lcp, linkHref, linkPropertiesEncrypted, stream, isPartialByteRangeRequest, partialByteBegin, partialByteEnd) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var isCompressionNone, isCompressionDeflate, plainTextSize, nativelyDecryptedStream, nativelyInflated, fullEncryptedBuffer, err_1, res, err_2, nativelyDecryptedBuffer, cryptoInfo, cypherBlockPadding, err_3, err_4, destStream, rawDecryptStream, ivBuffer, cypherRangeStream, err_5, decryptStream, cypherUnpaddedStream, inflateStream, fullDeflatedBuffer, err_6, l, rangeStream, sal;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isCompressionNone = linkPropertiesEncrypted.Compression === "none";
                    isCompressionDeflate = linkPropertiesEncrypted.Compression === "deflate";
                    plainTextSize = -1;
                    nativelyInflated = false;
                    if (!lcp.isNativeNodePlugin()) return [3, 9];
                    if (IS_DEV) {
                        debug("LCP DECRYPT NATIVE: " + linkHref);
                    }
                    fullEncryptedBuffer = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4, BufferUtils_1.streamToBufferPromise(stream.stream)];
                case 2:
                    fullEncryptedBuffer = _a.sent();
                    return [3, 4];
                case 3:
                    err_1 = _a.sent();
                    debug(err_1);
                    return [2, Promise.reject("OUCH!")];
                case 4:
                    res = void 0;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4, lcp.decrypt(fullEncryptedBuffer, linkHref, isCompressionDeflate)];
                case 6:
                    res = _a.sent();
                    return [3, 8];
                case 7:
                    err_2 = _a.sent();
                    debug(err_2);
                    return [2, Promise.reject("OUCH!")];
                case 8:
                    nativelyDecryptedBuffer = res.buffer;
                    nativelyInflated = res.inflated;
                    plainTextSize = nativelyDecryptedBuffer.length;
                    linkPropertiesEncrypted.DecryptedLengthBeforeInflate = plainTextSize;
                    if (!nativelyInflated &&
                        linkPropertiesEncrypted.OriginalLength &&
                        isCompressionNone &&
                        linkPropertiesEncrypted.OriginalLength !== plainTextSize) {
                        debug("############### " +
                            "LCP transformStream() LENGTH NOT MATCH " +
                            "linkPropertiesEncrypted.OriginalLength !== plainTextSize: " +
                            (linkPropertiesEncrypted.OriginalLength + " !== " + plainTextSize));
                    }
                    nativelyDecryptedStream = BufferUtils_1.bufferToStream(nativelyDecryptedBuffer);
                    return [3, 18];
                case 9:
                    cryptoInfo = void 0;
                    cypherBlockPadding = -1;
                    if (!(linkPropertiesEncrypted.DecryptedLengthBeforeInflate > 0)) return [3, 10];
                    plainTextSize = linkPropertiesEncrypted.DecryptedLengthBeforeInflate;
                    cypherBlockPadding = linkPropertiesEncrypted.CypherBlockPadding;
                    return [3, 18];
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4, getDecryptedSizeStream(lcp, stream)];
                case 11:
                    cryptoInfo = _a.sent();
                    return [3, 13];
                case 12:
                    err_3 = _a.sent();
                    debug(err_3);
                    return [2, Promise.reject(err_3)];
                case 13:
                    plainTextSize = cryptoInfo.length;
                    cypherBlockPadding = cryptoInfo.padding;
                    linkPropertiesEncrypted.DecryptedLengthBeforeInflate = plainTextSize;
                    linkPropertiesEncrypted.CypherBlockPadding = cypherBlockPadding;
                    _a.label = 14;
                case 14:
                    _a.trys.push([14, 16, , 17]);
                    return [4, stream.reset()];
                case 15:
                    stream = _a.sent();
                    return [3, 17];
                case 16:
                    err_4 = _a.sent();
                    debug(err_4);
                    return [2, Promise.reject(err_4)];
                case 17:
                    if (linkPropertiesEncrypted.OriginalLength &&
                        isCompressionNone &&
                        linkPropertiesEncrypted.OriginalLength !== plainTextSize) {
                        debug("############### " +
                            "LCP transformStream() LENGTH NOT MATCH " +
                            "linkPropertiesEncrypted.OriginalLength !== plainTextSize: " +
                            (linkPropertiesEncrypted.OriginalLength + " !== " + plainTextSize));
                    }
                    _a.label = 18;
                case 18:
                    if (!nativelyDecryptedStream) return [3, 19];
                    destStream = nativelyDecryptedStream;
                    return [3, 25];
                case 19:
                    rawDecryptStream = void 0;
                    ivBuffer = void 0;
                    if (!linkPropertiesEncrypted.CypherBlockIV) return [3, 20];
                    ivBuffer = Buffer.from(linkPropertiesEncrypted.CypherBlockIV, "binary");
                    cypherRangeStream = new RangeStream_1.RangeStream(AES_BLOCK_SIZE, stream.length - 1, stream.length);
                    stream.stream.pipe(cypherRangeStream);
                    rawDecryptStream = cypherRangeStream;
                    return [3, 24];
                case 20:
                    _a.trys.push([20, 22, , 23]);
                    return [4, readStream(stream.stream, AES_BLOCK_SIZE)];
                case 21:
                    ivBuffer = _a.sent();
                    return [3, 23];
                case 22:
                    err_5 = _a.sent();
                    debug(err_5);
                    return [2, Promise.reject(err_5)];
                case 23:
                    linkPropertiesEncrypted.CypherBlockIV = ivBuffer.toString("binary");
                    stream.stream.resume();
                    rawDecryptStream = stream.stream;
                    _a.label = 24;
                case 24:
                    decryptStream = crypto.createDecipheriv("aes-256-cbc", lcp.ContentKey, ivBuffer);
                    decryptStream.setAutoPadding(false);
                    rawDecryptStream.pipe(decryptStream);
                    destStream = decryptStream;
                    if (linkPropertiesEncrypted.CypherBlockPadding) {
                        cypherUnpaddedStream = new RangeStream_1.RangeStream(0, plainTextSize - 1, plainTextSize);
                        destStream.pipe(cypherUnpaddedStream);
                        destStream = cypherUnpaddedStream;
                    }
                    _a.label = 25;
                case 25:
                    if (!(!nativelyInflated && isCompressionDeflate)) return [3, 29];
                    inflateStream = zlib.createInflateRaw();
                    destStream.pipe(inflateStream);
                    destStream = inflateStream;
                    if (!!linkPropertiesEncrypted.OriginalLength) return [3, 29];
                    debug("############### RESOURCE ENCRYPTED OVER DEFLATE, BUT NO OriginalLength!");
                    fullDeflatedBuffer = void 0;
                    _a.label = 26;
                case 26:
                    _a.trys.push([26, 28, , 29]);
                    return [4, BufferUtils_1.streamToBufferPromise(destStream)];
                case 27:
                    fullDeflatedBuffer = _a.sent();
                    linkPropertiesEncrypted.OriginalLength = fullDeflatedBuffer.length;
                    destStream = BufferUtils_1.bufferToStream(fullDeflatedBuffer);
                    return [3, 29];
                case 28:
                    err_6 = _a.sent();
                    debug(err_6);
                    return [3, 29];
                case 29:
                    if (partialByteBegin < 0) {
                        partialByteBegin = 0;
                    }
                    if (partialByteEnd < 0) {
                        partialByteEnd = plainTextSize - 1;
                        if (linkPropertiesEncrypted.OriginalLength) {
                            partialByteEnd = linkPropertiesEncrypted.OriginalLength - 1;
                        }
                    }
                    l = (!nativelyInflated && linkPropertiesEncrypted.OriginalLength) ?
                        linkPropertiesEncrypted.OriginalLength : plainTextSize;
                    if (isPartialByteRangeRequest) {
                        rangeStream = new RangeStream_1.RangeStream(partialByteBegin, partialByteEnd, l);
                        destStream.pipe(rangeStream);
                        destStream = rangeStream;
                    }
                    sal = {
                        length: l,
                        reset: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var resetedStream, err_7;
                            return tslib_1.__generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4, stream.reset()];
                                    case 1:
                                        resetedStream = _a.sent();
                                        return [3, 3];
                                    case 2:
                                        err_7 = _a.sent();
                                        debug(err_7);
                                        return [2, Promise.reject(err_7)];
                                    case 3: return [2, transformStream(lcp, linkHref, linkPropertiesEncrypted, resetedStream, isPartialByteRangeRequest, partialByteBegin, partialByteEnd)];
                                }
                            });
                        }); },
                        stream: destStream,
                    };
                    return [2, Promise.resolve(sal)];
            }
        });
    });
}
exports.transformStream = transformStream;
function getDecryptedSizeStream(lcp, stream) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                    var TWO_AES_BLOCK_SIZE, readPos, cypherRangeStream, decrypteds, handle, finished, finish, buf, err_8;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                TWO_AES_BLOCK_SIZE = 2 * AES_BLOCK_SIZE;
                                if (stream.length < TWO_AES_BLOCK_SIZE) {
                                    reject("crypto err");
                                    return [2];
                                }
                                readPos = stream.length - TWO_AES_BLOCK_SIZE;
                                cypherRangeStream = new RangeStream_1.RangeStream(readPos, readPos + TWO_AES_BLOCK_SIZE - 1, stream.length);
                                stream.stream.pipe(cypherRangeStream);
                                decrypteds = [];
                                handle = function (ivBuffer, encrypted) {
                                    var decryptStream = crypto.createDecipheriv("aes-256-cbc", lcp.ContentKey, ivBuffer);
                                    decryptStream.setAutoPadding(false);
                                    var buff1 = decryptStream.update(encrypted);
                                    if (buff1) {
                                        decrypteds.push(buff1);
                                    }
                                    var buff2 = decryptStream.final();
                                    if (buff2) {
                                        decrypteds.push(buff2);
                                    }
                                    finish();
                                };
                                finished = false;
                                finish = function () {
                                    if (finished) {
                                        return;
                                    }
                                    finished = true;
                                    var decrypted = Buffer.concat(decrypteds);
                                    if (decrypted.length !== AES_BLOCK_SIZE) {
                                        reject("decrypted.length !== AES_BLOCK_SIZE");
                                        return;
                                    }
                                    var nPaddingBytes = decrypted[AES_BLOCK_SIZE - 1];
                                    var size = stream.length - AES_BLOCK_SIZE - nPaddingBytes;
                                    var res = {
                                        length: size,
                                        padding: nPaddingBytes,
                                    };
                                    resolve(res);
                                };
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, readStream(cypherRangeStream, TWO_AES_BLOCK_SIZE)];
                            case 2:
                                buf = _a.sent();
                                if (!buf) {
                                    reject("!buf (end?)");
                                    return [2];
                                }
                                if (buf.length !== TWO_AES_BLOCK_SIZE) {
                                    reject("buf.length !== TWO_AES_BLOCK_SIZE");
                                    return [2];
                                }
                                handle(buf.slice(0, AES_BLOCK_SIZE), buf.slice(AES_BLOCK_SIZE));
                                return [3, 4];
                            case 3:
                                err_8 = _a.sent();
                                debug(err_8);
                                reject(err_8);
                                return [2];
                            case 4: return [2];
                        }
                    });
                }); })];
        });
    });
}
exports.getDecryptedSizeStream = getDecryptedSizeStream;
//# sourceMappingURL=transformer-lcp.js.map