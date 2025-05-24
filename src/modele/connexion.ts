import * as APIsql from "../modele/sqlWeb.js"

// Configuration locale (ex. XAMPP) : projet copié dans htdocs/club-themactu/
// et base importée depuis src/modele/bdclub.sql.
// Adapter les chemins et identifiants à votre environnement.
APIsql.sqlWeb.init("http://localhost/club-themactu/vue/", "http://localhost/club-themactu/IHM_API/")

class Connexion {
    constructor() {
        this.init();
    }
    init():void {
        APIsql.sqlWeb.bdOpen('localhost','3306','bdclub', 'root','', 'utf8');
    }
}
const connexion = new Connexion;

export {connexion, APIsql}
