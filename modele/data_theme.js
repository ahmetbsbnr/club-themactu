import { APIsql, connexion } from "./connexion.js";
class UnTheme {
    constructor(theme_num = "", theme_lib = "", theme_tarif = "") {
        this._theme_num = theme_num;
        this._theme_lib = theme_lib;
        this._theme_tarif = theme_tarif;
    }
    get theme_num() { return this._theme_num; }
    set theme_num(v) { this._theme_num = v; }
    get theme_lib() { return this._theme_lib; }
    set theme_lib(v) { this._theme_lib = v; }
    get theme_tarif() { return this._theme_tarif; }
    set theme_tarif(v) { this._theme_tarif = v; }
    toArray() {
        return {
            "theme_num": this._theme_num,
            "theme_lib": this._theme_lib,
            "theme_tarif": this._theme_tarif,
        };
    }
}
class LesThemes {
    constructor() { }
    async load(result) {
        let themes = {};
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const theme = new UnTheme(item["theme_num"], item["theme_lib"], item["theme_tarif"]);
            themes[theme.theme_num] = theme;
        }
        return themes;
    }
    prepare(where) {
        let sql = "SELECT theme_num, theme_lib, theme_tarif FROM theme";
        if (where.trim() !== "") {
            sql += " WHERE " + where;
        }
        sql += " ORDER BY theme_lib ASC";
        return sql;
    }
    async all() {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare(""), []);
        return this.load(result);
    }
    async byThemeNum(theme_num) {
        let theme = new UnTheme();
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("theme_num = ?"), [theme_num]);
        const themes = await this.load(result);
        const lesCles = Object.keys(themes);
        if (lesCles.length > 0) {
            theme = themes[lesCles[0]];
        }
        return theme;
    }
    toArray(themes) {
        let T = [];
        for (let id in themes) {
            T.push(themes[id].toArray());
        }
        return T;
    }
}
// Classe pour représenter une association entre un abonnement et un thème
class UnThemeByAbonnement {
    constructor(unTheme = new UnTheme(), envoi_papier = 0) {
        this._unTheme = unTheme;
        this._envoi_papier = envoi_papier;
    }
    get unTheme() { return this._unTheme; }
    set unTheme(v) { this._unTheme = v; }
    get envoi_papier() { return this._envoi_papier; }
    set envoi_papier(v) { this._envoi_papier = v; }
    // Calculer le tarif avec majoration papier si nécessaire
    calculerTarif() {
        const tarifBase = parseFloat(this._unTheme.theme_tarif);
        return this._envoi_papier === 1 ? tarifBase * 1.2 : tarifBase;
    }
    toArray() {
        const themeArray = this._unTheme.toArray();
        themeArray["envoi_papier"] = this._envoi_papier.toString();
        return themeArray;
    }
}
class LesThemesByAbonnement {
    constructor() { }
    async load(result, allThemes) {
        let themesByAbonnement = {};
        for (let i = 0; i < result.length; i++) {
            const item = result[i];
            // Trouver le thème complet à partir de la liste pré-chargée
            const theme = allThemes[item["theme_num"]] || new UnTheme(item["theme_num"], 'Thème Inconnu', '0'); // Fournir un thème par défaut si non trouvé
            const envoi_papier = parseInt(item["envoi_papier"]) || 0;
            const themeByAbonnement = new UnThemeByAbonnement(theme, envoi_papier);
            themesByAbonnement[theme.theme_num] = themeByAbonnement;
        }
        return themesByAbonnement;
    }
    prepare(where) {
        let sql = "SELECT a.abon_num, a.theme_num, a.envoi_papier ";
        sql += "FROM adhesion a ";
        if (where.trim() !== "") {
            sql += "WHERE " + where + " ";
        }
        sql += "ORDER BY a.theme_num";
        return sql;
    }
    async byNumAbonnement(abon_num, allThemes) {
        const result = await APIsql.sqlWeb.SQLloadData(this.prepare("a.abon_num = ?"), [abon_num]);
        return this.load(result, allThemes);
    }
    async delete(abon_num) {
        const sql = "DELETE FROM adhesion WHERE abon_num = ?";
        return APIsql.sqlWeb.SQLexec(sql, [abon_num]);
    }
    async insert(abon_num, themes) {
        let success = true;
        for (let theme_num in themes) {
            const themeByAbonnement = themes[theme_num];
            const sql = "INSERT INTO adhesion (abon_num, theme_num, envoi_papier) VALUES (?, ?, ?)";
            const result = await APIsql.sqlWeb.SQLexec(sql, [
                abon_num,
                theme_num,
                themeByAbonnement.envoi_papier.toString()
            ]);
            if (!result) {
                success = false;
            }
        }
        return success;
    }
    calculerTotal(themes) {
        let total = 0;
        for (let key in themes) {
            total += themes[key].calculerTarif();
        }
        return total;
    }
    toArray(themes) {
        let T = [];
        for (let id in themes) {
            T.push(themes[id].toArray());
        }
        return T;
    }
}
export { UnTheme, LesThemes, UnThemeByAbonnement, LesThemesByAbonnement, connexion };
//# sourceMappingURL=data_theme.js.map