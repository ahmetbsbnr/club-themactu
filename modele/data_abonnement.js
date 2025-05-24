import { APIsql } from "./connexion.js";
class UnAbonnement {
    constructor(abon_num = "", abon_date = "", abon_comment = "", adh_num = "") {
        this._abon_num = abon_num;
        this._abon_date = abon_date;
        this._abon_comment = abon_comment;
        this._adh_num = adh_num;
    }
    get abon_num() { return this._abon_num; }
    set abon_num(v) {
        const num = parseInt(v);
        if (isNaN(num) || num <= 0) {
            throw new Error("Le numéro d'abonnement doit être un entier supérieur à 0.");
        }
        this._abon_num = v;
    }
    get abon_date() { return this._abon_date; }
    set abon_date(v) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare just dates
        const inputDate = new Date(v);
        inputDate.setHours(0, 0, 0, 0); // Reset time to compare just dates
        if (isNaN(inputDate.getTime()) || inputDate > today) {
            throw new Error("La date d'abonnement doit être inférieure ou égale à la date du jour.");
        }
        this._abon_date = v;
    }
    get abon_comment() { return this._abon_comment; }
    set abon_comment(v) {
        if (v !== null && v !== undefined && v.length > 400) {
            throw new Error("Le commentaire d'abonnement ne doit pas dépasser 400 caractères.");
        }
        this._abon_comment = v;
    }
    get adh_num() { return this._adh_num; }
    set adh_num(v) {
        const num = parseInt(v);
        if (isNaN(num) || num <= 0) {
            throw new Error("Le numéro d'adhérent doit être un entier supérieur à 0.");
        }
        this._adh_num = v;
    }
    toArray() {
        return {
            "abon_num": this._abon_num,
            "abon_date": this._abon_date,
            "abon_comment": this._abon_comment,
            "adh_num": this._adh_num,
        };
    }
}
class LesAbonnements {
    constructor() { }
    async load(result) {
        let abonnements = {};
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const abonnement = new UnAbonnement(item["abon_num"], item["abon_date"], item["abon_comment"], item["adh_num"]);
            abonnements[abonnement.abon_num] = abonnement;
        }
        return abonnements;
    }
    prepare(where) {
        let sql = "SELECT abon_num, abon_date, abon_comment, adh_num FROM abonnement";
        if (where.trim() !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY abon_num";
        return sql;
    }
    async all() {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }
    async byNumAbonnement(abon_num) {
        let abonnement = new UnAbonnement();
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("abon_num = ?"), [abon_num]);
        const abonnements = await this.load(result);
        const lesCles = Object.keys(abonnements);
        if (lesCles.length > 0) {
            abonnement = abonnements[lesCles[0]];
        }
        return abonnement;
    }
    async insert(unAbonnement) {
        const sql = "INSERT INTO abonnement (abon_num, abon_date, abon_comment, adh_num) VALUES (?, ?, ?, ?)";
        return APIsql.sqlWeb.SQLexec(sql, [
            unAbonnement.abon_num,
            unAbonnement.abon_date,
            unAbonnement.abon_comment,
            unAbonnement.adh_num
        ]);
    }
    async update(unAbonnement) {
        const sql = "UPDATE abonnement SET abon_date = ?, abon_comment = ?, adh_num = ? WHERE abon_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [
            unAbonnement.abon_date,
            unAbonnement.abon_comment,
            unAbonnement.adh_num,
            unAbonnement.abon_num
        ]);
    }
    async delete(abon_num) {
        const sql = "DELETE FROM abonnement WHERE abon_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [abon_num]);
    }
    async getNextNumero() {
        let sql = "SELECT MAX(abon_num) AS max_num FROM abonnement";
        const result = await APIsql.sqlWeb.SQLloadData(sql, []);
        if (result.length > 0 && result[0]["max_num"]) {
            const maxNum = parseInt(result[0]["max_num"]);
            return (isNaN(maxNum) ? 0 : maxNum + 1).toString();
        }
        return "1";
    }
}
export { UnAbonnement, LesAbonnements };
//# sourceMappingURL=data_abonnement.js.map