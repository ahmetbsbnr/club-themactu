import { APIsql, connexion } from "../modele/connexion.js";
class UnAdherent {
    constructor(adh_num = "", adh_civ = "", adh_nom = "", adh_prenom = "", adh_adr = "", adh_cp = "", adh_ville = "", adh_mel = "", csp_num = "") {
        this._adh_num = adh_num;
        this._adh_civ = adh_civ;
        this._adh_nom = adh_nom;
        this._adh_prenom = adh_prenom;
        this._adh_adr = adh_adr;
        this._adh_cp = adh_cp;
        this._adh_ville = adh_ville;
        this._adh_mel = adh_mel;
        this._csp_num = csp_num;
    }
    get adh_num() { return this._adh_num; }
    set adh_num(v) { this._adh_num = v; }
    get adh_civ() { return this._adh_civ; }
    set adh_civ(v) { this._adh_civ = v; }
    get adh_nom() { return this._adh_nom; }
    set adh_nom(v) { this._adh_nom = v; }
    get adh_prenom() { return this._adh_prenom; }
    set adh_prenom(v) { this._adh_prenom = v; }
    get adh_adr() { return this._adh_adr; }
    set adh_adr(v) { this._adh_adr = v; }
    get adh_cp() { return this._adh_cp; }
    set adh_cp(v) { this._adh_cp = v; }
    get adh_ville() { return this._adh_ville; }
    set adh_ville(v) { this._adh_ville = v; }
    get adh_mel() { return this._adh_mel; }
    set adh_mel(v) { this._adh_mel = v; }
    get csp_num() { return this._csp_num; }
    set csp_num(v) { this._csp_num = v; }
    toArray() {
        const tableau = {
            "adh_num": this._adh_num,
            "adh_civ": this._adh_civ,
            "adh_nom": this._adh_nom,
            "adh_prenom": this._adh_prenom,
            "adh_adr": this._adh_adr,
            "adh_cp": this._adh_cp,
            "adh_ville": this._adh_ville,
            "adh_mel": this._adh_mel,
            "csp_num": this._csp_num,
        };
        return tableau;
    }
}
class LesAdherents {
    constructor() { }
    async load(result) {
        const adherents = {};
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const adherent = new UnAdherent(item["adh_num"], item["adh_civ"], item["adh_nom"], item["adh_prenom"], item["adh_adr"], item["adh_cp"], item["adh_ville"], item["adh_mel"], item["csp_num"]);
            adherents[adherent.adh_num] = adherent;
        }
        return adherents;
    }
    prepare(where) {
        let sql;
        sql = "SELECT adh_num, adh_civ, adh_nom, adh_prenom, adh_adr, adh_cp, adh_ville, adh_mel, csp_num FROM adherent";
        if (where !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY adh_nom, adh_prenom";
        return sql;
    }
    async all() {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }
    async byNumAdherent(adh_num) {
        let adherent = new UnAdherent();
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("adh_num = ?"), [adh_num]);
        const adherents = await this.load(result);
        const lesCles = Object.keys(adherents);
        if (lesCles.length > 0) {
            adherent = adherents[lesCles[0]];
        }
        return adherent;
    }
    toArray(adherents) {
        let T = [];
        for (let id in adherents) {
            T.push(adherents[id].toArray());
        }
        return T;
    }
    // Nouvelle méthode pour insérer un nouvel adhérent
    // Modifié pour retourner le numéro de l'adhérent inséré en cas de succès (ou false en cas d'échec)
    async insert(unAdherent) {
        const sqlInsert = "INSERT INTO adherent (adh_civ, adh_nom, adh_prenom, adh_adr, adh_cp, adh_ville, adh_mel, csp_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const success = await APIsql.sqlWeb.SQLexec(sqlInsert, [
            unAdherent.adh_civ,
            unAdherent.adh_nom,
            unAdherent.adh_prenom,
            unAdherent.adh_adr,
            unAdherent.adh_cp,
            unAdherent.adh_ville,
            unAdherent.adh_mel,
            unAdherent.csp_num
        ]);
        if (!success) {
            // Si l'INSERT a échoué, retourner false immédiatement
            return false;
        }
        // Si l'INSERT a réussi, essayer de récupérer le dernier adhérent inséré
        // NOTE : Cette approche par recherche nom/prénom n'est pas idéale si plusieurs adhérents
        // ont le même nom/prénom. L'idéal serait que l'API backend retourne l'ID inséré.
        // C'est une solution de contournement en attendant.
        const sqlSearch = "SELECT adh_num, adh_civ, adh_nom, adh_prenom, adh_adr, adh_cp, adh_ville, adh_mel, csp_num FROM adherent WHERE adh_nom = ? AND adh_prenom = ? ORDER BY adh_num DESC LIMIT 1";
        const resultSearch = await APIsql.sqlWeb.SQLloadData(sqlSearch, [unAdherent.adh_nom, unAdherent.adh_prenom]);
        if (resultSearch.length > 0 && resultSearch[0]['adh_num']) {
            // Retourne l'ID du premier résultat (le plus récent si ORDER BY DESC)
            return resultSearch[0]['adh_num'].toString();
        }
        else {
            // En cas de succès de l'INSERT mais échec de la récupération de l'adhérent
            console.error("Erreur : L'adhérent a été inséré, mais impossible de retrouver son ID.");
            return false;
        }
    }
    async update(unAdherent) {
        const sql = "UPDATE adherent SET adh_civ = ?, adh_nom = ?, adh_prenom = ?, adh_adr = ?, adh_cp = ?, adh_ville = ?, adh_mel = ?, csp_num = ? WHERE adh_num = ?";
        const params = [
            unAdherent.adh_civ,
            unAdherent.adh_nom,
            unAdherent.adh_prenom,
            unAdherent.adh_adr,
            unAdherent.adh_cp,
            unAdherent.adh_ville,
            unAdherent.adh_mel,
            unAdherent.csp_num,
            unAdherent.adh_num
        ];
        return APIsql.sqlWeb.SQLexec(sql, params);
    }
}
export { connexion };
export { UnAdherent };
export { LesAdherents };
//# sourceMappingURL=data_adherent.js.map