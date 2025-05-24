// Page d'accueil pour la gestion des abonnements

class VueGestionAbonnement {
    init(): void {
        location.href = "abonnement_liste.html";
    }
}

let vueGestionAbonnement = new VueGestionAbonnement();

vueGestionAbonnement.init();
