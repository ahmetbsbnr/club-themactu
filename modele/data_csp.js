import { connexion, APIsql } from "./connexion.js";
class UnCsp {
    constructor(csp_num = "", csp_lib = "") {
        this._csp_num = csp_num;
        this._csp_lib = csp_lib;
    }
    get csp_num() { return this._csp_num; }
    get csp_lib() { return this._csp_lib; }
    set csp_num(v) { this._csp_num = v; }
    set csp_lib(v) { this._csp_lib = v; }
    toArray() {
        return {
            'csp_num': this.csp_num,
            'csp_lib': this.csp_lib,
        };
    }
}
class LesCsps {
    constructor() { }
    async load(result) {
        const csps = {};
        for (const item of result) {
            const csp = new UnCsp(item["csp_num"], item["csp_lib"]);
            csps[csp.csp_num] = csp;
        }
        return csps;
    }
    prepare(where) {
        let sql = "SELECT csp_num, csp_lib FROM csp";
        if (where.trim() !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY csp_lib";
        return sql;
    }
    async all() {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }
    async byCspNum(csp_num) {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("csp_num = ?"), [csp_num]);
        const csps = await this.load(result);
        const cles = Object.keys(csps);
        return cles.length > 0 ? csps[cles[0]] : new UnCsp();
    }
    toArray(csps) {
        const tab = [];
        for (const key in csps) {
            tab.push(csps[key].toArray());
        }
        return tab;
    }
}
export { UnCsp, LesCsps, connexion };
//# sourceMappingURL=data_csp.js.map