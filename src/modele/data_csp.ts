import { connexion, APIsql } from "./connexion.js";

class UnCsp {
    private _csp_num: string;
    private _csp_lib: string;

    constructor(csp_num = "", csp_lib = "") {
        this._csp_num = csp_num;
        this._csp_lib = csp_lib;
    }

    get csp_num(): string { return this._csp_num; }
    get csp_lib(): string { return this._csp_lib; }

    set csp_num(v: string) { this._csp_num = v; }
    set csp_lib(v: string) { this._csp_lib = v; }

    toArray(): APIsql.TtabAsso {
        return {
            'csp_num': this.csp_num,
            'csp_lib': this.csp_lib,
        };
    }
}

type TCsps = { [key: string]: UnCsp };

class LesCsps {
    constructor() {}

    private async load(result: APIsql.TdataSet): Promise<TCsps> {
        const csps: TCsps = {};
        for (const item of result) {
            const csp = new UnCsp(
                item["csp_num"],
                item["csp_lib"]
            );
            csps[csp.csp_num] = csp;
        }
        return csps;
    }

    private prepare(where: string): string {
        let sql = "SELECT csp_num, csp_lib FROM csp";
        if (where.trim() !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY csp_lib";
        return sql;
    }

    async all(): Promise<TCsps> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }

    async byCspNum(csp_num: string): Promise<UnCsp> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("csp_num = ?"), [csp_num]);
        const csps = await this.load(result);
        const cles = Object.keys(csps);
        return cles.length > 0 ? csps[cles[0]] : new UnCsp();
    }

    toArray(csps: TCsps): APIsql.TdataSet {
        const tab: APIsql.TdataSet = [];
        for (const key in csps) {
            tab.push(csps[key].toArray());
        }
        return tab;
    }
}

export { UnCsp, LesCsps, TCsps, connexion };
