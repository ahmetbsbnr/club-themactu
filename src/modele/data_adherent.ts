import { APIsql, connexion } from "../modele/connexion.js";

class UnAdherent {
    private _adh_num: string;
    private _adh_civ: string;
    private _adh_nom: string;
    private _adh_prenom: string;
    private _adh_adr: string;
    private _adh_cp: string;
    private _adh_ville: string;
    private _adh_mel: string;
    private _csp_num: string;

    constructor(
        adh_num = "",
        adh_civ = "",
        adh_nom = "",
        adh_prenom = "",
        adh_adr = "",
        adh_cp = "",
        adh_ville = "",
        adh_mel = "",
        csp_num = "",
    ) {
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

    get adh_num(): string { return this._adh_num; }
    set adh_num(v: string) { this._adh_num = v; }
    get adh_civ(): string { return this._adh_civ; }
    set adh_civ(v: string) { this._adh_civ = v; }
    get adh_nom(): string { return this._adh_nom; }
    set adh_nom(v: string) { this._adh_nom = v; }
    get adh_prenom(): string { return this._adh_prenom; }
    set adh_prenom(v: string) { this._adh_prenom = v; }
    get adh_adr(): string { return this._adh_adr; }
    set adh_adr(v: string) { this._adh_adr = v; }
    get adh_cp(): string { return this._adh_cp; }
    set adh_cp(v: string) { this._adh_cp = v; }
    get adh_ville(): string { return this._adh_ville; }
    set adh_ville(v: string) { this._adh_ville = v; }
    get adh_mel(): string { return this._adh_mel; }
    set adh_mel(v: string) { this._adh_mel = v; }
    get csp_num(): string { return this._csp_num; }
    set csp_num(v: string) { this._csp_num = v; }

    toArray(): APIsql.TtabAsso {
        const tableau: APIsql.TtabAsso = {
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

type TAdherents = { [key: string]: UnAdherent };

class LesAdherents {
    constructor() {}

    private async load(result: APIsql.TdataSet): Promise<TAdherents> {
        const adherents: TAdherents = {};
        for (let i = 0; i < result.length; i++) {
            const item: APIsql.TtabAsso = result[i];
            const adherent = new UnAdherent(
                item["adh_num"],
                item["adh_civ"],
                item["adh_nom"],
                item["adh_prenom"],
                item["adh_adr"],
                item["adh_cp"],
                item["adh_ville"],
                item["adh_mel"],
                item["csp_num"],
            );
            adherents[adherent.adh_num] = adherent;
        }
        return adherents;
    }

    private prepare(where: string): string {
        let sql: string;
        sql = "SELECT adh_num, adh_civ, adh_nom, adh_prenom, adh_adr, adh_cp, adh_ville, adh_mel, csp_num FROM adherent";
        if (where !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY adh_nom, adh_prenom";
        return sql;
    }

    async all(): Promise<TAdherents> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }

    async byNumAdherent(adh_num: string): Promise<UnAdherent> {
        let adherent = new UnAdherent();
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("adh_num = ?"), [adh_num]);
        const adherents: TAdherents = await this.load(result);
        const lesCles: string[] = Object.keys(adherents);
        if (lesCles.length > 0) {
            adherent = adherents[lesCles[0]];
        }
        return adherent;
    }

    toArray(adherents: TAdherents): APIsql.TdataSet {
        let T: APIsql.TdataSet = [];
        for (let id in adherents) {
            T.push(adherents[id].toArray());
        }
        return T;
    }

    // Nouvelle méthode pour insérer un nouvel adhérent
    // Modifié pour retourner le numéro de l'adhérent inséré en cas de succès (ou false en cas d'échec)
    async insert(unAdherent: UnAdherent): Promise<string | false> {
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
        } else {
            // En cas de succès de l'INSERT mais échec de la récupération de l'adhérent
            console.error("Erreur : L'adhérent a été inséré, mais impossible de retrouver son ID.");
            return false;
        }
    }

    async update(unAdherent: UnAdherent): Promise<boolean> {
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
export { TAdherents };
