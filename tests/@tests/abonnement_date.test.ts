import { UnAbonnement } from "../../src/modele/data_abonnement.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter abon_date avec date valide", () => {
    const abonnement = new UnAbonnement();
    const validDate = new Date(); // Date du jour
    // Formatage de la date au format AAAA-MM-JJ pour correspondre au type string de la classe
    const year = validDate.getFullYear();
    const month = (validDate.getMonth() + 1).toString().padStart(2, '0'); // Mois est basé sur 0
    const day = validDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    abonnement.abon_date = dateString;
    assertEquals(abonnement.abon_date, dateString);
});

Deno.test("Setter abon_date avec date passée", () => {
    const abonnement = new UnAbonnement();
    const pastDate = new Date("2024-01-01");
    const year = pastDate.getFullYear();
    const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
    const day = pastDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    abonnement.abon_date = dateString;
    assertEquals(abonnement.abon_date, dateString);
});

Deno.test("Setter abon_date avec date future lève une erreur", () => {
    const abonnement = new UnAbonnement();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // Date du jour + 2 jours
    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
    const day = futureDate.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    assertThrows(
        () => {
            abonnement.abon_date = dateString;
        },
        Error,
        "La date d'abonnement doit être inférieure ou égale à la date du jour."
    );
});
