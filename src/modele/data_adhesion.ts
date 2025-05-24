import { APIsql, connexion } from "../modele/connexion.js";
import { UnTheme, TThemes } from "./data_theme.js";

class UneAdhesion {
    private _abon_num: string;
    private _theme_num: string;
    private _envoi_papier: string;
    private _theme: UnTheme | null;

    constructor(abon_num = "", theme_num = "", envoi_papier = "0", theme: UnTheme | null = null) {
        this._abon_num = abon_num;
        this._theme_num = theme_num;
        this._envoi_papier = envoi_papier;
        this._theme = theme;
    }

    get abon_num(): string { return this._abon_num; }
    set abon_num(v: string) { this._abon_num = v; }
    get theme_num(): string { return this._theme_num; }
    set theme_num(v: string) { this._theme_num = v; }
    get envoi_papier(): string { return this._envoi_papier; }
    set envoi_papier(v: string) { this._envoi_papier = v; }
    get theme(): UnTheme | null { return this._theme; }
    set theme(v: UnTheme | null) { this._theme = v; }

    toArray(): APIsql.TtabAsso {
        let tableau: APIsql.TtabAsso = {
            "abon_num": this.abon_num,
            "theme_num": this.theme_num,
            "envoi_papier": this.envoi_papier
        };

        // Ajouter les informations du thème si disponible
        if (this._theme !== null) {
            tableau["theme_lib"] = this._theme.theme_lib;
            tableau["theme_tarif"] = this._theme.theme_tarif;
        }

        return tableau;
    }

    // Calcule le tarif avec majoration pour envoi papier si nécessaire
    calculerTarif(): number {
        if (this._theme === null) return 0;

        const tarif = parseFloat(this._theme.theme_tarif);
        return this._envoi_papier === "1" ? tarif * 1.2 : tarif;
    }
}

type TAdhesions = { [key: string]: UneAdhesion };

class LesAdhesions {
    constructor() {}

    private async load(result: APIsql.TdataSet, allThemes: TThemes): Promise<TAdhesions> {
        const adhesions: TAdhesions = {};

        for (let i = 0; i < result.length; i++) {
            const item: APIsql.TtabAsso = result[i];

            // Trouver le thème complet à partir de la liste pré-chargée
            const theme = allThemes[item["theme_num"]] || new UnTheme(item["theme_num"], 'Thème Inconnu', '0'); // Fournir un thème par défaut si non trouvé

            const adhesion = new UneAdhesion(
                item["abon_num"],
                item["theme_num"],
                item["envoi_papier"],
                theme // Utiliser l'objet UnTheme complet
            );

            // Utiliser une clé composée pour identifier l'adhésion
            const key = `${adhesion.abon_num}_${adhesion.theme_num}`;
            adhesions[key] = adhesion;
        }

        return adhesions;
    }

    private prepare(where: string): string {
        let sql = "SELECT abon_num, theme_num, envoi_papier FROM adhesion";
        if (where.trim() !== "") {
            sql += " WHERE " + where;
        }
        return sql;
    }

    async all(allThemes: TThemes): Promise<TAdhesions> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result, allThemes);
    }

    async byAbonnement(abon_num: string, allThemes: TThemes): Promise<TAdhesions> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("abon_num = ?"), [abon_num]);
        return this.load(result, allThemes);
    }

    async byAbonnementEtTheme(abon_num: string, theme_num: string, allThemes: TThemes): Promise<UneAdhesion> {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("abon_num = ? AND theme_num = ?"), [abon_num, theme_num]);
        const adhesions = await this.load(result, allThemes);

        const lesCles = Object.keys(adhesions);
        if (lesCles.length > 0) {
            return adhesions[lesCles[0]];
        }

        return new UneAdhesion();
    }

    toArray(adhesions: TAdhesions): APIsql.TdataSet {
        let T: APIsql.TdataSet = [];
        for (let id in adhesions) {
            T.push(adhesions[id].toArray());
        }
        return T;
    }

    // Calcule le total des tarifs pour un abonnement
    calculerTotal(adhesions: TAdhesions): number {
        let total = 0;
        for (let key in adhesions) {
            total += adhesions[key].calculerTarif();
        }
        return total;
    }

    // Supprime toutes les adhésions d'un abonnement
    async supprimerParAbonnement(abon_num: string): Promise<boolean> {
        const sql = "DELETE FROM adhesion WHERE abon_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [abon_num]);
    }

    // Supprime une adhésion spécifique
    async supprimer(abon_num: string, theme_num: string): Promise<boolean> {
        const sql = "DELETE FROM adhesion WHERE abon_num = ? AND theme_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [abon_num, theme_num]);
    }

    // Ajoute une nouvelle adhésion
    async ajouter(adhesion: UneAdhesion): Promise<boolean> {
        const sql = "INSERT INTO adhesion (abon_num, theme_num, envoi_papier) VALUES (?, ?, ?)";
        return APIsql.sqlWeb.SQLexec(sql, [
            adhesion.abon_num,
            adhesion.theme_num,
            adhesion.envoi_papier
        ]);
    }

    // Met à jour une adhésion existante
    async mettreAJour(adhesion: UneAdhesion): Promise<boolean> {
        const sql = "UPDATE adhesion SET envoi_papier = ? WHERE abon_num = ? AND theme_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [
            adhesion.envoi_papier,
            adhesion.abon_num,
            adhesion.theme_num
        ]);
    }
}

export { UneAdhesion, LesAdhesions, TAdhesions, connexion };
