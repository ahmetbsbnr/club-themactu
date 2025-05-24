import { UnAbonnement } from "../../src/modele/data_abonnement.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_num avec numéro valide", () => {
    const abonnement = new UnAbonnement();
    abonnement.adh_num = "456";
    assertEquals(abonnement.adh_num, "456");
});

Deno.test("Setter adh_num avec zéro lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.adh_num = "0";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});

Deno.test("Setter adh_num avec numéro négatif lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.adh_num = "-10";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});

Deno.test("Setter adh_num avec chaîne non numérique lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.adh_num = "xyz";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});
