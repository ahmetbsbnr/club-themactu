import { UnAbonnement, LesAbonnements } from "../modele/data_abonnement.js";
import { UnAdherent, LesAdherents } from "../modele/data_adherent.js";
import { LesCsps } from "../modele/data_csp.js";
import { LesThemes, LesThemesByAbonnement, UnThemeByAbonnement } from "../modele/data_theme.js";
class VueAbonnementEdit {
    constructor() {
        this._themeEditId = ''; // ID du thème en cours d'édition
        this._allThemes = {}; // Stocker tous les thèmes
        // Ces méthodes semblent ne plus être utilisées dans la version actuelle du code.
        // Le code de la méthode init gère déjà l'affichage selon le mode.
        /*
        async afficher(): Promise<void> {
             // Récupérer les références aux éléments du formulaire
             const idAbon = this.form.edtNum;
     ...
             if (btnRetour) btnRetour.style.display = "inline-block";
         }
     
        async modifier(): Promise<void> {
             // Afficher la section des thèmes
             const themesSection = document.getElementById("themesSection");
     ...
             this.chargerThemes();
         }
     
        async ajouter(): Promise<void> {
             // Afficher la section des thèmes
             const themesSection = document.getElementById("themesSection");
     ...
             }
         }
     
        async chargerThemes(): Promise<void> {
             // Récupérer les thèmes associés à cet abonnement
             const lesThemesByAbonnement = new LesThemesByAbonnement();
             // byNumAbonnement est asynchrone
             this._themes = await lesThemesByAbonnement.byNumAbonnement(this._unAbonnement.abon_num);
             await this.affiGrilleTheme(); // affiGrilleTheme est asynchrone
         }
        */
    }
    get form() { return this._form; }
    get params() { return this._params; }
    get themes() { return this._themes; }
    get erreur() { return this._erreur; }
    get unAbonnement() { return this._unAbonnement; }
    get allThemes() { return this._allThemes; }
    initMsgErreur() {
        this._erreur = {
            edtNum: { statut: 'vide', msg: { correct: "", vide: "Le numéro d'abonnement doit être renseigné.", inconnu: "Le numéro ne peut contenir que des chiffres.", doublon: "Le numéro d'abonnement est déjà attribué." } },
            edtDate: { statut: 'vide', msg: { correct: "", vide: "La date doit être renseignée.", inconnu: "", doublon: "" } },
            edtAdherentNum: { statut: 'vide', msg: { correct: "", vide: "L'adhérent doit être renseigné.", inconnu: "Adhérent inconnu.", doublon: "" } },
            theme: { statut: 'vide', msg: { correct: "", vide: "L'abonnement doit contenir au moins un thème.", inconnu: "", doublon: "" } },
            listeTheme: { statut: 'vide', msg: { correct: "", vide: "Aucun thème choisi", inconnu: "", doublon: "" } },
            // Messages d'erreur pour le formulaire nouvel adhérent
            edtAdherentCiv: { statut: 'correct', msg: { correct: "", vide: "La civilité doit être renseignée.", inconnu: "", doublon: "" } },
            edtAdherentNom: { statut: 'vide', msg: { correct: "", vide: "Le nom doit être renseigné.", inconnu: "", doublon: "" } },
            edtAdherentPrenom: { statut: 'vide', msg: { correct: "", vide: "Le prénom doit être renseigné.", inconnu: "", doublon: "" } },
            edtAdherentAdr: { statut: 'correct', msg: { correct: "", vide: "L'adresse doit être renseignée.", inconnu: "", doublon: "" } },
            edtAdherentCp: { statut: 'correct', msg: { correct: "", vide: "Le code postal doit être renseigné.", inconnu: "", doublon: "" } },
            edtAdherentVille: { statut: 'correct', msg: { correct: "", vide: "La ville doit être renseignée.", inconnu: "", doublon: "" } },
            edtAdherentMel: { statut: 'correct', msg: { correct: "", vide: "L'email doit être renseigné.", inconnu: "Format email invalide.", doublon: "" } },
            selectAdherentCsp: { statut: 'vide', msg: { correct: "", vide: "La CSP doit être sélectionnée.", inconnu: "", doublon: "" } }
        };
    }
    async init(form) {
        this._form = form;
        this._params = location.search.substring(1).split('&');
        // params[0] : mode affi, modif, suppr, ajout
        // params[1] : id en mode affi, modif, suppr
        this._themes = {};
        this.initMsgErreur();
        // Définir le titre selon le mode
        let titre;
        switch (this.params[0]) {
            case 'suppr':
                titre = "Suppression d'un abonnement";
                break;
            case 'ajout':
                titre = "Nouvel abonnement";
                break;
            case 'modif':
                titre = "Modification d'un abonnement";
                break;
            default: titre = "Détail d'un abonnement";
        }
        this.form.divTitre.textContent = titre;
        const lesAbonnements = new LesAbonnements();
        const lesThemes = new LesThemes(); // Instancier LesThemes
        const affi = this.params[0] === 'affi';
        // Pré-charger tous les thèmes disponibles (asynchrone)
        this._allThemes = await lesThemes.all();
        if (this.params[0] !== 'ajout') {
            // affi ou modif ou suppr
            const abonnement = await lesAbonnements.byNumAbonnement(this.params[1]);
            this._unAbonnement = abonnement; // Stocker l'abonnement
            this.form.edtNum.value = abonnement.abon_num;
            // Formater la date pour l'input type date (YYYY-MM-DD)
            let dateValue = abonnement.abon_date;
            if (dateValue.includes('/')) {
                const dateParts = dateValue.split('/');
                dateValue = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
            }
            this.form.edtDate.value = dateValue;
            this.form.edtComment.value = abonnement.abon_comment || '';
            this.form.edtAdherentNum.value = abonnement.adh_num;
            this.form.edtNum.readOnly = true; // Le numéro n'est jamais modifiable
            // La date n'est modifiable qu'en mode ajout
            this.form.edtDate.readOnly = this.params[0] !== 'ajout';
            this.form.edtComment.readOnly = affi;
            this.form.edtAdherentNum.readOnly = true;
            this.form.btnChoisirAdherent.hidden = true;
            this.form.btnNouvelAdherent.hidden = true;
            this.erreur.edtNum.statut = "correct";
            await this.detailAdherent(abonnement.adh_num);
            // Appliquer la classe blurred aux champs non modifiables
            this.form.edtNum.classList.add('blurred');
            if (this.form.edtDate.readOnly) {
                this.form.edtDate.classList.add('blurred');
            }
            else {
                this.form.edtDate.classList.remove('blurred');
            }
            if (this.form.edtComment.readOnly) {
                this.form.edtComment.classList.add('blurred');
            }
            else {
                this.form.edtComment.classList.remove('blurred');
            }
            this.form.edtAdherentNum.classList.add('blurred');
        }
        else {
            // En mode ajout, générer un nouveau numéro (maintenant asynchrone)
            this.form.edtNum.value = await lesAbonnements.getNextNumero();
            this.form.edtNum.readOnly = true;
            // Date par défaut = aujourd'hui
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            this.form.edtDate.value = `${year}-${month}-${day}`;
            // En mode ajout, désactiver les boutons initialement (Ajouter Thème et Valider principal)
            this.form.btnAjouterTheme.disabled = true;
            this.form.btnValider.disabled = true;
        }
        // Ne charger les thèmes que si on n'est pas en mode ajout
        if (this.params[0] !== 'ajout') {
            await this.affiTheme();
        }
        // Cacher les contrôles d'ajout/édition de thèmes en mode affichage
        if (affi) {
            const themeEditControls = this.form.divAbonnementTheme.querySelector('.theme-edit-controls');
            ;
            if (themeEditControls) {
                themeEditControls.hidden = true;
            }
        }
        if (this.params[0] === 'suppr') {
            // temporisation 1 seconde pour afficher les données avant confirmation de suppression
            // Suppression doit aussi être asynchrone
            setTimeout(async () => { await this.supprimer(this.params[1]); }, 1000);
        }
        this.form.btnRetour.hidden = !affi;
        this.form.btnValider.hidden = affi;
        this.form.btnAnnuler.hidden = affi;
        this.form.btnAjouterTheme.hidden = affi;
        // Définition des événements
        this.form.edtAdherentNum.onchange = async () => await this.detailAdherent(this.form.edtAdherentNum.value);
        this.form.btnRetour.onclick = () => this.retourClick();
        this.form.btnAnnuler.onclick = () => this.retourClick();
        this.form.btnValider.onclick = async () => await this.validerClick();
        this.form.btnAjouterTheme.onclick = async () => await this.ajouterThemeClick(this._allThemes);
        this.form.btnThemeValider.onclick = async () => await this.validerThemeClick();
        this.form.btnThemeAnnuler.onclick = () => this.annulerThemeClick();
        this.form.btnChoisirAdherent.onclick = async () => await this.afficherListeAdherents();
        this.form.btnNouvelAdherent.onclick = async () => await this.afficherNouvelAdherentForm();
        this.form.btnAnnulerNouvelAdherent.onclick = () => this.annulerNouvelAdherentClick();
        console.log("Gestionnaire d'événement pour le bouton Annuler Nouvel Adhérent attaché.", this.form.btnAnnulerNouvelAdherent); // Debug log
        this.form.btnValiderNouvelAdherent.onclick = async () => await this.ajouterNouvelAdherentClick();
        console.log("Gestionnaire d'événement pour le bouton Valider Nouvel Adhérent attaché.", this.form.btnValiderNouvelAdherent); // Debug log
    }
    async detailAdherent(valeur) {
        const err = this.erreur.edtAdherentNum;
        const lesAdherents = new LesAdherents();
        const lesCsps = new LesCsps();
        const detail = this.form.lblDetailAdherent;
        detail.textContent = "";
        err.statut = "correct";
        const chaine = String(valeur).trim();
        if (chaine.length > 0) {
            const adherent = await lesAdherents.byNumAdherent(chaine);
            if (adherent.adh_num !== "") { // adhérent trouvé
                let texte = `${adherent.adh_civ || ''} ${adherent.adh_nom} ${adherent.adh_prenom || ''}`;
                if (adherent.adh_adr) {
                    texte += `\r\n${adherent.adh_adr}`;
                }
                if (adherent.adh_cp || adherent.adh_ville) {
                    texte += `\r\n${adherent.adh_cp || ''} ${adherent.adh_ville || ''}`;
                }
                if (adherent.adh_mel) {
                    texte += `\r\nEmail: ${adherent.adh_mel}`;
                }
                // Ajouter la CSP si disponible
                if (adherent.csp_num) {
                    const csp = await lesCsps.byCspNum(adherent.csp_num);
                    if (csp && csp.csp_lib) {
                        texte += `\r\nCSP: ${csp.csp_lib}`;
                    }
                }
                detail.textContent = texte;
                // Activer le bouton Ajouter Thème si un adhérent valide est trouvé
                if (this.params[0] === 'ajout') {
                    this.form.btnAjouterTheme.disabled = false;
                    this.form.btnValider.disabled = false;
                }
            }
            else {
                err.statut = 'inconnu';
                detail.textContent = err.msg.inconnu;
                // Désactiver le bouton Ajouter Thème si l'adhérent est inconnu
                if (this.params[0] === 'ajout') {
                    this.form.btnAjouterTheme.disabled = true;
                    this.form.btnValider.disabled = true;
                }
            }
        }
        else {
            err.statut = 'vide';
            // Désactiver le bouton Ajouter Thème si le champ adhérent est vide
            if (this.params[0] === 'ajout') {
                this.form.btnAjouterTheme.disabled = true;
                this.form.btnValider.disabled = true;
            }
        }
    }
    async affiTheme() {
        const lesThemesByAbonnement = new LesThemesByAbonnement();
        if (this.params[1]) {
            // NOTE: byNumAbonnement est asynchrone, il faut l'attendre.
            // De plus, cette méthode appelle load qui a une dépendance synchrone à LesThemes.
            // Idéalement, les thèmes devraient être préchargés une seule fois.
            this._themes = await lesThemesByAbonnement.byNumAbonnement(this.params[1], this._allThemes);
        }
        else {
            this._themes = {}; // Nouvel abonnement = pas de thèmes
        }
        await this.affiGrilleTheme(); // affiGrilleTheme appelle calculerTotal, qui est synchrone, mais la source des données vient d'une opération asynchrone.
    }
    async affiGrilleTheme() {
        // Vider le tableau existant (sauf l'en-tête)
        while (this.form.tableTheme.rows.length > 1) {
            this.form.tableTheme.rows[1].remove();
        }
        // Vider l'en-tête existant
        const thead = this.form.tableTheme.querySelector('thead');
        if (thead) {
            thead.innerHTML = '';
            const trHead = thead.insertRow();
            // Ajouter les th communs
            trHead.insertCell().textContent = 'Libellé';
            trHead.insertCell().textContent = 'Tarif de base';
            trHead.insertCell().textContent = 'Version Papier';
            trHead.insertCell().textContent = 'Montant';
            // Ajouter les th pour les actions seulement si le mode n'est pas affichage
            const affi = this.params[0] === 'affi';
            if (!affi) {
                trHead.insertCell(); // th vide pour le bouton modifier
                trHead.insertCell(); // th vide pour le bouton supprimer
            }
        }
        let total = 0;
        let nbThemes = 0;
        for (let id in this._themes) {
            nbThemes++;
            const unThemeByAbonnement = this.themes[id];
            const tr = this.form.tableTheme.insertRow();
            // Calculer le tarif avec ou sans majoration papier
            // Le tarif est basé sur unTheme.theme_tarif qui est une string.
            // Si les thèmes ne sont pas complètement chargés dans load, cela pourrait être vide.
            let tarif = parseFloat(unThemeByAbonnement.unTheme.theme_tarif || '0');
            let tarifFinal = tarif;
            if (unThemeByAbonnement.envoi_papier === 1) {
                tarifFinal = tarif * 1.2; // Majoration de 20% pour version papier
            }
            total += tarifFinal;
            // Afficher les données du thème
            // unThemeByAbonnement.unTheme.theme_lib pourrait être vide si les thèmes ne sont pas complètement chargés
            tr.insertCell().textContent = unThemeByAbonnement.unTheme.theme_lib || 'Libellé inconnu';
            tr.insertCell().textContent = tarif.toFixed(2) + " €";
            tr.insertCell().textContent = unThemeByAbonnement.envoi_papier === 1 ? "Oui" : "Non";
            tr.insertCell().textContent = tarifFinal.toFixed(2) + " €";
            const affi = this.params[0] === 'affi';
            if (!affi) {
                let balisea;
                // Bouton modifier
                balisea = document.createElement("a");
                // Ajouter la classe CSS pour l'icône modifier (l'image est définie en CSS)
                balisea.classList.add('img_modification');
                balisea.onclick = () => this.modifierThemeClick(id);
                tr.insertCell().appendChild(balisea);
                // Bouton supprimer
                balisea = document.createElement("a");
                // Ajouter la classe CSS pour l'icône supprimer (l'image est définie en CSS)
                balisea.classList.add('img_corbeille');
                balisea.onclick = () => this.supprimerThemeClick(id);
                tr.insertCell().appendChild(balisea);
            }
        }
        // Mettre à jour le total et le statut d'erreur des thèmes
        this.form.lblTotal.textContent = total.toFixed(2) + " €";
        if (nbThemes === 0) {
            this.erreur.theme.statut = 'vide';
            // Ajouter une ligne "Aucun thème" si vide
            const tr = this.form.tableTheme.insertRow();
            const td = tr.insertCell();
            td.colSpan = this.params[0] === 'affi' ? 4 : 6;
            td.textContent = "Aucun thème souscrit";
            td.style.fontStyle = "italic";
            td.style.textAlign = "center";
        }
        else {
            this.erreur.theme.statut = "correct";
        }
    }
    async supprimer(numAbonnement) {
        if (confirm("Confirmez-vous la suppression de l'abonnement " + numAbonnement)) {
            const lesThemesByAbonnement = new LesThemesByAbonnement();
            const lesAbonnements = new LesAbonnements();
            // Les opérations de suppression sont maintenant asynchrones
            await lesThemesByAbonnement.delete(numAbonnement); // suppression dans la base des thèmes de l'abonnement
            await lesAbonnements.delete(numAbonnement); // suppression dans la base de l'abonnement
            // Redirection après suppression
            this.retourClick();
        }
        else {
            this.retourClick();
        }
    }
    async verifNum(valeur) {
        const lesAbonnements = new LesAbonnements();
        const err = this.erreur.edtNum;
        err.statut = "correct";
        const chaine = valeur.trim();
        if (chaine.length > 0) {
            if (!/^[0-9]+$/.test(chaine)) {
                // Vérifier si c'est un nombre
                this.erreur.edtNum.statut = 'inconnu';
            }
            else if ((this.params[0] === 'ajout')) {
                // Vérifier doublon seulement en mode ajout (opération asynchrone)
                const abonnementExistant = await lesAbonnements.byNumAbonnement(chaine);
                if (abonnementExistant.abon_num !== "") {
                    this.erreur.edtNum.statut = 'doublon';
                }
            }
        }
        else {
            err.statut = 'vide';
        }
    }
    verifDate(valeur) {
        const err = this.erreur.edtDate;
        err.statut = "correct";
        const chaine = valeur.trim();
        if (chaine.length === 0) {
            err.statut = 'vide';
        }
    }
    traiteErreur(uneErreur, zone) {
        let correct = true;
        zone.textContent = "";
        if (uneErreur.statut !== "correct") { // non correct ==> erreur
            if (uneErreur.msg[uneErreur.statut] !== '') { // erreur
                zone.textContent = uneErreur.msg[uneErreur.statut];
                correct = false;
            }
        }
        return correct;
    }
    async validerClick() {
        let correct = true;
        await this.verifNum(this._form.edtNum.value); // verifNum est maintenant asynchrone
        this.verifDate(this._form.edtDate.value);
        // Vérifier qu'il y a au moins un thème si ce n'est pas une suppression
        if (this.params[0] !== 'suppr') {
            if (Object.keys(this._themes).length === 0) {
                this.erreur.theme.statut = 'vide';
            }
            else {
                this.erreur.theme.statut = 'correct';
            }
        }
        correct = this.traiteErreur(this._erreur.edtNum, this.form.lblNumErreur) && correct;
        correct = this.traiteErreur(this._erreur.edtDate, this.form.lblDateErreur) && correct;
        correct = this.traiteErreur(this._erreur.edtAdherentNum, this.form.lblAdherentErreur) && correct; // detailAdherent est asynchrone, mais traiteErreur vérifie l'état après l'appel.
        correct = this.traiteErreur(this._erreur.theme, this.form.lblThemeErreur) && correct;
        if (correct) {
            const lesAbonnements = new LesAbonnements();
            const abonnement = new UnAbonnement();
            abonnement.abon_num = this.form.edtNum.value;
            // Convertir la date pour le stockage
            let dateValue = this.form.edtDate.value;
            // La valeur de l'input date est déjà au format YYYY-MM-DD, pas besoin de conversion
            // Supprime la logique de conversion incorrecte qui changeait YYYY-MM-DD en DD/MM/YYYY
            abonnement.abon_date = dateValue;
            abonnement.abon_comment = this.form.edtComment.value;
            abonnement.adh_num = this.form.edtAdherentNum.value;
            if (this._params[0] === 'ajout') {
                // Les opérations d'insertion et de mise à jour sont maintenant asynchrones
                const insertSuccess = await lesAbonnements.insert(abonnement);
                if (!insertSuccess) {
                    alert("Erreur lors de l'ajout de l'abonnement.");
                    return; // Arrêter l'exécution si l'insertion a échoué
                }
            }
            else {
                const updateSuccess = await lesAbonnements.update(abonnement);
                if (!updateSuccess) {
                    alert("Erreur lors de la mise à jour de l'abonnement.");
                    return; // Arrêter l'exécution si la mise à jour a échoué
                }
            }
            // Mise à jour des thèmes associés (opérations asynchrones)
            const lesThemesByAbonnement = new LesThemesByAbonnement();
            await lesThemesByAbonnement.delete(abonnement.abon_num);
            await lesThemesByAbonnement.insert(abonnement.abon_num, this._themes);
            this.retourClick();
        }
    }
    retourClick() {
        location.href = "abonnement_liste.html";
    }
    // Gestion des thèmes de l'abonnement
    async ajouterThemeClick(allThemes) {
        this._themeEditId = '';
        // Afficher la section d'édition de thèmes si elle est cachée
        const themeEditControls = this.form.divAbonnementTheme.querySelector('.theme-edit-controls');
        if (themeEditControls && themeEditControls.style.display === 'none') {
            themeEditControls.style.display = 'flex'; // Ou le style d'affichage approprié
        }
        // Réinitialiser la liste des thèmes à choisir
        if (!this.form.listeTheme) { // Ajout d'une vérification
            return;
        }
        this.form.listeTheme.innerHTML = '';
        const idThemes = [];
        // Collecter les IDs des thèmes déjà associés
        for (let id in this._themes) {
            idThemes.push(this._themes[id].unTheme.theme_num);
        }
        // Ajouter les thèmes non encore associés à la liste en utilisant les thèmes pré-chargés
        for (let id in allThemes) {
            const theme = allThemes[id];
            if (idThemes.indexOf(theme.theme_num) === -1) {
                const tarif = parseFloat(theme.theme_tarif);
                this.form.listeTheme.options.add(new Option(`${theme.theme_lib} (${tarif.toFixed(2)} €)`, theme.theme_num));
            }
        }
        // Par défaut, option papier décochée
        if (this.form.checkPapier) { // Ajout d'une vérification
            this.form.checkPapier.checked = false;
        }
    }
    async modifierThemeClick(id) {
        this._themeEditId = id;
        // Récupérer et afficher le thème à modifier
        const unThemeByAbonnement = this._themes[id];
        if (!this.form.listeTheme)
            return;
        this.form.listeTheme.innerHTML = '';
        // Créer une seule option avec le thème actuel (non modifiable)
        // NOTE: unThemeByAbonnement.unTheme.theme_lib peut être vide si le thème n'a pas été complètement chargé dans affiTheme.
        // Pour une solution complète, il faudrait charger les détails du thème ici ou en amont.
        const libelle = `${unThemeByAbonnement.unTheme.theme_lib || 'Thème inconnu'} (${parseFloat(unThemeByAbonnement.unTheme.theme_tarif || '0').toFixed(2)} €)`;
        this._form.listeTheme.options.add(new Option(libelle, id));
        this.form.listeTheme.selectedIndex = 0;
        this.form.listeTheme.disabled = true;
        // Définir l'état du checkbox selon l'option papier
        if (this.form.checkPapier) {
            this.form.checkPapier.checked = unThemeByAbonnement.envoi_papier === 1;
        }
    }
    async supprimerThemeClick(id) {
        if (confirm("Confirmez-vous le retrait du thème de l'abonnement ?")) {
            // La suppression se fait uniquement dans le tableau _themes en local pour l'instant.
            // La mise à jour de la base de données se fera lors du validerClick.
            delete (this._themes[id]);
            await this.affiGrilleTheme(); // Mettre à jour l'affichage (asynchrone)
        }
    }
    verifListeTheme() {
        const err = this._erreur.listeTheme;
        err.statut = "correct";
        const cible = this._form.listeTheme;
        if (!cible.value) {
            err.statut = 'vide';
        }
    }
    async validerThemeClick() {
        this.verifListeTheme(); // Synchrone
        if (!this.form.lblSelectThemeErreur)
            return;
        let correct = this.traiteErreur(this._erreur.listeTheme, this.form.lblSelectThemeErreur); // Synchrone
        if (correct) {
            const lesThemes = new LesThemes();
            // Récupérer l'ID du thème (soit de la liste, soit celui en édition)
            const themeId = this._themeEditId || this.form.listeTheme.value;
            // Récupérer le thème et créer l'association
            // LesThemes.byThemeNum est maintenant asynchrone
            const unTheme = await lesThemes.byThemeNum(themeId);
            const unThemeByAbonnement = new UnThemeByAbonnement(unTheme, this.form.checkPapier.checked ? 1 : 0);
            // Ajouter à la collection
            this._themes[themeId] = unThemeByAbonnement;
            // Mettre à jour l'affichage
            await this.affiGrilleTheme(); // Mettre à jour l'affichage (asynchrone)
            // Réinitialiser le formulaire d'édition de thème (synchrone)
            this.annulerThemeClick();
        }
    }
    annulerThemeClick() {
        // Réinitialiser le formulaire d'édition de thème
        this._themeEditId = '';
        this.form.listeTheme.disabled = false;
        this.form.listeTheme.innerHTML = '';
        this.form.checkPapier.checked = false;
        this.form.lblSelectThemeErreur.textContent = '';
    }
    // Nouvelle méthode pour afficher la liste des adhérents
    async afficherListeAdherents() {
        console.log("Méthode afficherListeAdherents appelée."); // Debug log
        // Cacher le formulaire de nouvel adhérent si affiché
        this.form.divNouvelAdherent.style.display = 'none';
        const lesAdherents = new LesAdherents();
        const adherents = await lesAdherents.all();
        // Vider le tableau existant (sauf l'en-tête)
        while (this.form.tableListeAdherents.rows.length > 1) {
            this.form.tableListeAdherents.rows[1].remove();
        }
        // Remplir le tableau avec les adhérents
        for (const num in adherents) {
            const adherent = adherents[num];
            const tr = this.form.tableListeAdherents.insertRow();
            tr.insertCell().textContent = adherent.adh_num;
            tr.insertCell().textContent = adherent.adh_nom;
            tr.insertCell().textContent = adherent.adh_prenom;
            tr.insertCell().textContent = adherent.adh_ville;
            // Ajouter le bouton Sélectionner
            const selectCell = tr.insertCell();
            const selectButton = document.createElement("button");
            selectButton.textContent = "Sélectionner";
            selectButton.onclick = async () => {
                this.form.edtAdherentNum.value = adherent.adh_num;
                await this.detailAdherent(adherent.adh_num); // Afficher les détails de l'adhérent sélectionné
                this.form.divListeAdherents.style.display = 'none'; // Cacher la liste après sélection
            };
            selectCell.appendChild(selectButton);
        }
        // Afficher la div contenant la liste des adhérents
        this.form.divListeAdherents.style.display = 'block';
    }
    // Nouvelle méthode pour charger et afficher les options de CSP
    async chargerCsps() {
        const lesCsps = new LesCsps();
        const csps = await lesCsps.all();
        const selectCsp = this.form.selectAdherentCsp;
        // Vider le select existant
        selectCsp.innerHTML = '';
        // Ajouter une option par défaut
        selectCsp.options.add(new Option("Sélectionner une CSP", ""));
        // Remplir le select avec les CSPs
        for (const num in csps) {
            const csp = csps[num];
            selectCsp.options.add(new Option(csp.csp_lib, csp.csp_num));
        }
    }
    // Nouvelle méthode pour afficher le formulaire de nouvel adhérent
    async afficherNouvelAdherentForm() {
        console.log("Méthode afficherNouvelAdherentForm appelée."); // Debug log
        // Cacher la liste des adhérents si affichée
        this.form.divListeAdherents.style.display = 'none';
        // Réinitialiser les champs du formulaire
        this.form.edtAdherentCiv.value = ''; // Sélectionne l'option avec la valeur vide si elle existe
        this.form.edtAdherentNom.value = '';
        this.form.edtAdherentPrenom.value = '';
        this.form.edtAdherentAdr.value = '';
        this.form.edtAdherentCp.value = '';
        this.form.edtAdherentVille.value = '';
        this.form.edtAdherentMel.value = '';
        // Charger les options de CSP
        await this.chargerCsps();
        // Sélectionner l'option par défaut
        this.form.selectAdherentCsp.value = '';
        // Afficher le formulaire de nouvel adhérent
        this.form.divNouvelAdherent.style.display = 'block';
    }
    // Nouvelle méthode pour gérer la validation et l'ajout du nouvel adhérent
    async ajouterNouvelAdherentClick() {
        console.log("Méthode ajouterNouvelAdherentClick appelée."); // Debug log
        let isValid = true;
        // Réinitialiser les messages d'erreur précédents
        this.form.lblErreurAdherentCiv.textContent = '';
        this.form.lblErreurAdherentNom.textContent = '';
        this.form.lblErreurAdherentPrenom.textContent = '';
        this.form.lblErreurAdherentAdr.textContent = '';
        this.form.lblErreurAdherentCp.textContent = '';
        this.form.lblErreurAdherentVille.textContent = '';
        this.form.lblErreurAdherentMel.textContent = '';
        this.form.lblErreurAdherentCsp.textContent = '';
        // Validation Nom (requis)
        const nom = this.form.edtAdherentNom.value.trim();
        const erreurNom = this.erreur.edtAdherentNom;
        if (nom === "") {
            erreurNom.statut = 'vide';
            isValid = false;
        }
        else {
            erreurNom.statut = 'correct';
        }
        this.traiteErreur(erreurNom, this.form.lblErreurAdherentNom);
        // Validation Prénom (requis)
        const prenom = this.form.edtAdherentPrenom.value.trim();
        const erreurPrenom = this.erreur.edtAdherentPrenom;
        if (prenom === "") {
            erreurPrenom.statut = 'vide';
            isValid = false;
        }
        else {
            erreurPrenom.statut = 'correct';
        }
        this.traiteErreur(erreurPrenom, this.form.lblErreurAdherentPrenom);
        // Validation CSP (requise)
        const cspValue = this.form.selectAdherentCsp.value;
        const erreurCsp = this.erreur.selectAdherentCsp;
        if (cspValue === "") {
            erreurCsp.statut = 'vide';
            isValid = false;
        }
        else {
            erreurCsp.statut = 'correct';
        }
        this.traiteErreur(erreurCsp, this.form.lblErreurAdherentCsp);
        // Validation Email (optionnel mais vérifier le format si rempli)
        const mel = this.form.edtAdherentMel.value.trim();
        const erreurMel = this.erreur.edtAdherentMel;
        if (mel !== "") {
            // Simple vérification de format (peut être améliorée)
            const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
            if (!emailRegex.test(mel)) {
                erreurMel.statut = 'inconnu'; // Utiliser inconnu pour le format invalide
                isValid = false;
            }
            else {
                erreurMel.statut = 'correct';
            }
        }
        else {
            erreurMel.statut = 'correct'; // Champ vide est considéré comme correct si optionnel
        }
        this.traiteErreur(erreurMel, this.form.lblErreurAdherentMel);
        // Validation Civilité (optionnel)
        const civ = this.form.edtAdherentCiv.value.trim();
        const erreurCiv = this.erreur.edtAdherentCiv;
        erreurCiv.statut = 'correct'; // Toujours correct car optionnel (choix par défaut inclus)
        this.traiteErreur(erreurCiv, this.form.lblErreurAdherentCiv);
        // Validation Adresse (optionnel)
        const adr = this.form.edtAdherentAdr.value.trim();
        const erreurAdr = this.erreur.edtAdherentAdr;
        erreurAdr.statut = 'correct'; // Toujours correct car optionnel
        this.traiteErreur(erreurAdr, this.form.lblErreurAdherentAdr);
        // Validation Code Postal (optionnel)
        const cp = this.form.edtAdherentCp.value.trim();
        const erreurCp = this.erreur.edtAdherentCp;
        erreurCp.statut = 'correct'; // Toujours correct car optionnel
        this.traiteErreur(erreurCp, this.form.lblErreurAdherentCp);
        // Validation Ville (optionnel)
        const ville = this.form.edtAdherentVille.value.trim();
        const erreurVille = this.erreur.edtAdherentVille;
        erreurVille.statut = 'correct'; // Toujours correct car optionnel
        this.traiteErreur(erreurVille, this.form.lblErreurAdherentVille);
        if (!isValid) {
            // Afficher un message générique si la validation a échoué
            // alert("Veuillez corriger les erreurs avant de continuer."); // Optionnel, les messages spécifiques sont affichés sous les champs
            return;
        }
        // Si la validation passe, procéder à  l'ajout
        const nouvelAdherent = new UnAdherent();
        // Le numéro sera généré par la base de données (AUTO_INCREMENT)
        let civPourBDD = civ;
        if (civ === 'Homme') {
            civPourBDD = 'M.';
        }
        else if (civ === 'Femme') {
            civPourBDD = 'Mme';
        }
        nouvelAdherent.adh_civ = civPourBDD;
        nouvelAdherent.adh_nom = nom;
        nouvelAdherent.adh_prenom = prenom;
        nouvelAdherent.adh_adr = adr;
        nouvelAdherent.adh_cp = cp;
        nouvelAdherent.adh_ville = ville;
        nouvelAdherent.adh_mel = mel;
        nouvelAdherent.csp_num = cspValue;
        const lesAdherents = new LesAdherents();
        // Insertion du nouvel adhérent en base (asynchrone)
        // Récupérer le numéro de l'adhérent inséré si l'opération réussit
        const numAdherent = await lesAdherents.insert(nouvelAdherent);
        // Vérifier si l'insertion a réussi et si un numéro d'adhérent a été retourné
        if (numAdherent !== false && numAdherent !== "") {
            alert("Nouvel adhérent ajouté avec succès !");
            // Sélectionner automatiquement ce nouvel adhérent pour l'abonnement
            this.form.edtAdherentNum.value = numAdherent; // Utiliser le numéro retourné
            await this.detailAdherent(numAdherent); // Afficher les détails du nouvel adhérent (asynchrone)
            // Cacher le formulaire de nouvel adhérent
            this.form.divNouvelAdherent.style.display = 'none';
            // Effacer les messages d'erreur précédents du formulaire adhérent principal
            this.form.lblAdherentErreur.textContent = '';
        }
        else {
            // Gérer l'échec de l'insertion ou de la récupération de l'ID
            alert("Erreur lors de l'ajout du nouvel adhérent.");
            // Optionnel : Afficher un message d'erreur spécifique à  l'utilisateur
        }
    }
    // Nouvelle méthode pour gérer l'annulation de l'ajout d'adhérent
    annulerNouvelAdherentClick() {
        // Cacher le formulaire de nouvel adhérent
        this.form.divNouvelAdherent.style.display = 'none';
        // Optionnel: Réafficher la liste des adhérents ou juste effacer le champ numéro principal
        this.form.edtAdherentNum.value = ''; // Effacer le champ numéro adhérent principal
        this.form.lblDetailAdherent.textContent = ''; // Effacer les détails de l'adhérent précédent
    }
}
let vueAbonnementEdit = new VueAbonnementEdit();
// Appeler la fonction init de manière asynchrone au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await vueAbonnementEdit.init({
        divDetail: document.querySelector('[id=div_abonnement_detail]'),
        divTitre: document.querySelector('[id=div_abonnement_titre]'),
        edtNum: document.querySelector('[id=edt_abonnement_num]'),
        edtDate: document.querySelector('[id=edt_abonnement_date]'),
        edtComment: document.querySelector('[id=edt_abonnement_comment]'),
        edtAdherentNum: document.querySelector('[id=edt_abonnement_adherent]'),
        btnRetour: document.querySelector('[id=btn_abonnement_retour]'),
        btnValider: document.querySelector('[id=btn_abonnement_valider]'),
        btnAnnuler: document.querySelector('[id=btn_abonnement_annuler]'),
        lblDetailAdherent: document.querySelector('[id=lbl_abonnement_detail_adherent]'),
        lblNumErreur: document.querySelector('[id=lbl_erreur_num]'),
        lblDateErreur: document.querySelector('[id=lbl_erreur_date]'),
        lblAdherentErreur: document.querySelector('[id=lbl_erreur_adherent]'),
        lblThemeErreur: document.querySelector('[id=lbl_erreur_theme]'),
        divAbonnementTheme: document.querySelector('[id=div_abonnement_theme]'),
        btnAjouterTheme: document.querySelector('[id=btn_ajouter_theme]'),
        lblTotal: document.querySelector('[id=lbl_theme_total]'),
        tableTheme: document.querySelector('[id=table_theme]'),
        listeTheme: document.querySelector('[id=liste_theme]'),
        checkPapier: document.querySelector('[id=check_theme_papier]'),
        btnThemeValider: document.querySelector('[id=btn_theme_valider]'),
        btnThemeAnnuler: document.querySelector('[id=btn_theme_annuler]'),
        lblSelectThemeErreur: document.querySelector('[id=lbl_erreur_select_theme]'),
        btnChoisirAdherent: document.querySelector('[id=btn_choisir_adherent]'),
        divListeAdherents: document.querySelector('[id=div_liste_adherents]'),
        tableListeAdherents: document.querySelector('[id=table_liste_adherents]'),
        edtAdherentCiv: document.querySelector('[id=edt_adherent_civ]'),
        edtAdherentNom: document.querySelector('[id=edt_adherent_nom]'),
        edtAdherentPrenom: document.querySelector('[id=edt_adherent_prenom]'),
        edtAdherentAdr: document.querySelector('[id=edt_adherent_adr]'),
        edtAdherentCp: document.querySelector('[id=edt_adherent_cp]'),
        edtAdherentVille: document.querySelector('[id=edt_adherent_ville]'),
        edtAdherentMel: document.querySelector('[id=edt_adherent_mel]'),
        selectAdherentCsp: document.querySelector('[id=select_adherent_csp]'),
        btnValiderNouvelAdherent: document.querySelector('[id=btn_valider_nouvel_adherent]'),
        btnAnnulerNouvelAdherent: document.querySelector('[id=btn_annuler_nouvel_adherent]'),
        divNouvelAdherent: document.querySelector('[id=div_nouvel_adherent]'),
        btnNouvelAdherent: document.querySelector('[id=btn_nouvel_adherent]'),
        lblErreurAdherentCiv: document.querySelector('[id=lbl_erreur_adherent_civ]'),
        lblErreurAdherentNom: document.querySelector('[id=lbl_erreur_adherent_nom]'),
        lblErreurAdherentPrenom: document.querySelector('[id=lbl_erreur_adherent_prenom]'),
        lblErreurAdherentAdr: document.querySelector('[id=lbl_erreur_adherent_adr]'),
        lblErreurAdherentCp: document.querySelector('[id=lbl_erreur_adherent_cp]'),
        lblErreurAdherentVille: document.querySelector('[id=lbl_erreur_adherent_ville]'),
        lblErreurAdherentMel: document.querySelector('[id=lbl_erreur_adherent_mel]'),
        lblErreurAdherentCsp: document.querySelector('[id=lbl_erreur_adherent_csp]')
    });
});
export { vueAbonnementEdit };
//# sourceMappingURL=class_abonnement_edit.js.map