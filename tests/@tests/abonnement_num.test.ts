import { UnAbonnement } from "../../src/modele/data_abonnement.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter abon_num avec numéro valide", () => {
    const abonnement = new UnAbonnement();
    abonnement.abon_num = "123";
    assertEquals(abonnement.abon_num, "123");
});

Deno.test("Setter abon_num avec zéro lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.abon_num = "0";
        },
        Error,
        "Le numéro d'abonnement doit être un entier supérieur à 0."
    );
});

Deno.test("Setter abon_num avec numéro négatif lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.abon_num = "-5";
        },
        Error,
        "Le numéro d'abonnement doit être un entier supérieur à 0."
    );
});

Deno.test("Setter abon_num avec chaîne non numérique lève une erreur", () => {
    const abonnement = new UnAbonnement();
    assertThrows(
        () => {
            abonnement.abon_num = "abc";
        },
        Error,
        "Le numéro d'abonnement doit être un entier supérieur à 0."
    );
});
