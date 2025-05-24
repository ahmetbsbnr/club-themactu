import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_num avec numéro valide", () => {
    const adherent = new UnAdherent();
    adherent.adh_num = "1";
    assertEquals(adherent.adh_num, "1");
});

Deno.test("Setter adh_num avec zéro lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_num = "0";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});

Deno.test("Setter adh_num avec numéro négatif lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_num = "-1";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});

Deno.test("Setter adh_num avec chaîne non numérique lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_num = "abc";
        },
        Error,
        "Le numéro d'adhérent doit être un entier supérieur à 0."
    );
});
