import { LesAbonnements } from "../modele/data_abonnement.js";
import { LesAdherents } from "../modele/data_adherent.js";
import { LesCsps } from "../modele/data_csp.js";
import { LesThemes, LesThemesByAbonnement } from "../modele/data_theme.js";
class VueAbonnementListe {
    constructor() {
        this._idSelect = '';
        this._noLigne = -1;
    }
    get form() { return this._form; }
    get idSelect() { return this._idSelect; }
    get noLigne() { return this._noLigne; }
    async init(form) {
        this._form = form;
        // Instancier les modèles nécessaires
        const lesAbonnements = new LesAbonnements();
        const lesAdherents = new LesAdherents();
        const lesCsps = new LesCsps();
        const lesThemesByAbonnement = new LesThemesByAbonnement();
        const lesThemes = new LesThemes();
        // Récupérer tous les abonnements (maintenant asynchrone)
        const data = await lesAbonnements.all();
        // Pré-charger tous les thèmes disponibles (asynchrone)
        const allThemes = await lesThemes.all();
        // Construction du titre
        this.form.divTitre.textContent = 'Liste des abonnements';
        // Désactiver les boutons qui nécessitent une sélection
        this.form.btnAfficher.disabled = true;
        this.form.btnModifier.disabled = true;
        this.form.btnSupprimer.disabled = true;
        // Vider le tableau existant (sauf l'en-tête)
        const tableau = this.form.tableAbonnement;
        while (tableau.rows.length > 1) {
            tableau.deleteRow(1);
        }
        // Pour chaque abonnement, créer une ligne dans le tableau
        for (let num in data) {
            const unAbonnement = data[num];
            // Créer une nouvelle ligne
            const tr = tableau.insertRow();
            // Formater la date pour affichage
            let dateAffichage = unAbonnement.abon_date;
            if (dateAffichage.includes('-')) {
                const dateParts = dateAffichage.split('-');
                dateAffichage = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
            // Récupérer l'adhérent associé (maintenant asynchrone)
            const adherent = await lesAdherents.byNumAdherent(unAbonnement.adh_num);
            let nomAdherent = unAbonnement.adh_num;
            let cspInfo = '';
            if (adherent && adherent.adh_nom) {
                nomAdherent = `${adherent.adh_nom} ${adherent.adh_prenom || ''}`;
                // Récupérer la CSP si disponible (maintenant asynchrone)
                if (adherent.csp_num) {
                    const csp = await lesCsps.byCspNum(adherent.csp_num);
                    if (csp && csp.csp_lib) {
                        cspInfo = csp.csp_lib;
                    }
                }
            }
            // Récupérer le nombre de thèmes (maintenant asynchrone) et passer les thèmes pré-chargés
            const themes = await lesThemesByAbonnement.byNumAbonnement(unAbonnement.abon_num, allThemes);
            const nbThemes = Object.keys(themes).length;
            // Calculer le montant total
            const montantTotal = lesThemesByAbonnement.calculerTotal(themes);
            // Insérer les données dans la ligne
            tr.insertCell().textContent = unAbonnement.abon_num;
            tr.insertCell().textContent = dateAffichage;
            tr.insertCell().textContent = unAbonnement.abon_comment || '';
            tr.insertCell().textContent = nomAdherent;
            tr.insertCell().textContent = cspInfo;
            tr.insertCell().textContent = nbThemes.toString();
            tr.insertCell().textContent = montantTotal.toFixed(2) + " €";
            // Ajouter l'événement onclick pour la sélection de ligne
            tr.onclick = () => this.selectionLigne(tr.rowIndex, unAbonnement.abon_num);
        }
        // Définition des événements onclick sur les boutons
        this.form.btnAjouter.onclick = () => this.ajouterAbonnementClick();
        this.form.btnAfficher.onclick = async () => {
            if (this._idSelect)
                await this.afficherAbonnementClick(this._idSelect);
        };
        this.form.btnModifier.onclick = async () => {
            if (this._idSelect)
                await this.modifierAbonnementClick(this._idSelect);
        };
        this.form.btnSupprimer.onclick = async () => {
            if (this._idSelect)
                await this.supprimerAbonnementClick(this._idSelect);
        };
    }
    // Gestion de la sélection d'une ligne
    selectionLigne(noLigne, id) {
        if (this._idSelect) {
            // Désélectionner la ligne précédente
            this.form.tableAbonnement.rows[this._noLigne].style.backgroundColor = '#ffffff';
        }
        this._idSelect = id;
        this._noLigne = noLigne;
        // Mettre en évidence la ligne sélectionnée
        this.form.tableAbonnement.rows[noLigne].style.backgroundColor = '#78c8ff';
        // Activer les boutons
        this.form.btnAfficher.disabled = false;
        this.form.btnModifier.disabled = false;
        this.form.btnSupprimer.disabled = false;
    }
    // Actions des boutons
    afficherAbonnementClick(num) {
        location.href = "abonnement_edit.html?affi&" + encodeURIComponent(num);
    }
    modifierAbonnementClick(num) {
        location.href = "abonnement_edit.html?modif&" + encodeURIComponent(num);
    }
    async supprimerAbonnementClick(num) {
        // L'action de suppression est gérée dans abonnement_edit.ts, qui sera la prochaine étape de refactoring.
        // On redirige simplement vers la page de suppression.
        location.href = "abonnement_edit.html?suppr&" + encodeURIComponent(num);
    }
    ajouterAbonnementClick() {
        location.href = "abonnement_edit.html?ajout";
    }
}
let vueAbonnementListe = new VueAbonnementListe();
async function initListeAbonnement() {
    await vueAbonnementListe.init({
        divTitre: document.querySelector('[id=div_abonnement_titre]'),
        btnAfficher: document.querySelector('[id=btn_abonnement_afficher]'),
        btnAjouter: document.querySelector('[id=btn_abonnement_ajouter]'),
        btnModifier: document.querySelector('[id=btn_abonnement_modifier]'),
        btnSupprimer: document.querySelector('[id=btn_abonnement_supprimer]'),
        tableAbonnement: document.querySelector('[id=table_abonnement]')
    });
}
initListeAbonnement();
export { vueAbonnementListe };
//# sourceMappingURL=class_abonnement_liste.js.map