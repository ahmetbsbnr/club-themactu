class SQLWeb {
    init(cheminHTML, http) {
        this.spExec = http + 'spExec.php';
        this.cheminHTML = cheminHTML;
        this.http = http;
    }
    // Utilise fetch pour les requêtes asynchrones
    async SQLloadData(sp, params, req = 'interrogation') {
        const url = this.spExec;
        const body = new URLSearchParams();
        body.append('sp', sp);
        body.append('bd', JSON.stringify(this.bd));
        body.append('params', JSON.stringify(params));
        body.append('req', req);
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && data['resultat']) {
                return data['resultat'];
            }
            else {
                // Gérer le cas où 'resultat' n'est pas présent ou est vide
                console.warn("La réponse ne contient pas de 'resultat' ou il est vide.", data);
                return [];
            }
        }
        catch (error) {
            console.error('Erreur SQLloadData:', error);
            // Dépend de comment vous voulez gérer les erreurs - ici, on lance l'erreur pour qu'elle soit gérée plus haut
            throw error;
        }
    }
    async SQLexec(sp, params) {
        // Pour SQLexec, on appelle SQLloadData avec req='manipulation'
        // et on suppose que si la promesse est résolue sans erreur, l'exécution a réussi.
        // Une API plus sophistiquée pourrait retourner un statut spécifique.
        try {
            await this.SQLloadData(sp, params, 'manipulation');
            return true; // Succès si pas d'erreur lancée
        }
        catch (error) {
            console.error('Erreur SQLexec:', error);
            // Dépend de votre API, mais on suppose l'échec en cas d'erreur
            return false;
        }
    }
    bdOpen(host, port, bdname, user, pwd, charset = 'utf8', driver = 'mysql') {
        this.bd = { host: host, port: port, bdname: bdname, user: user, pwd: pwd, charset: charset, driver: driver };
        // L'appel initial était synchrone et probablement juste pour tester la connexion.
        // En asynchrone, cet appel n'est pas nécessaire ici. La connexion sera établie lors du premier appel SQL.
        // Si une vérification de connexion au démarrage est nécessaire, elle devrait être gérée par une promesse.
    }
}
let sqlWeb = new SQLWeb();
export { sqlWeb };
//# sourceMappingURL=sqlWeb.js.map