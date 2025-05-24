import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_csp avec numéro valide", () => {
    const adherent = new UnAdherent();
    adherent.csp_num = "1";
    assertEquals(adherent.csp_num, "1");
});

Deno.test("Setter adh_csp avec chaîne vide", () => {
    const adherent = new UnAdherent();
    adherent.csp_num = "";
    assertEquals(adherent.csp_num, "");
});

Deno.test("Setter adh_csp avec zéro lève une erreur s'il n'est pas vide", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.csp_num = "0";
        },
        Error,
        "Le numéro de CSP doit être un entier supérieur à 0 s'il est renseigné."
    );
});

Deno.test("Setter adh_csp avec numéro négatif lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.csp_num = "-1";
        },
        Error,
        "Le numéro de CSP doit être un entier supérieur à 0 s'il est renseigné."
    );
});

Deno.test("Setter adh_csp avec chaîne non numérique lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.csp_num = "abc";
        },
        Error,
        "Le numéro de CSP doit être un entier supérieur à 0 s'il est renseigné."
    );
});
