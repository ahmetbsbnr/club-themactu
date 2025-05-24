import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_civ avec valeur valide M.", () => {
    const adherent = new UnAdherent();
    adherent.adh_civ = "M.";
    assertEquals(adherent.adh_civ, "M.");
});

Deno.test("Setter adh_civ avec valeur valide Mme", () => {
    const adherent = new UnAdherent();
    adherent.adh_civ = "Mme";
    assertEquals(adherent.adh_civ, "Mme");
});

Deno.test("Setter adh_civ avec valeur invalide lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_civ = "Mr"; // Valeur invalide
        },
        Error,
        "La civilité doit être \"M.\" ou \"Mme\"."
    );
});

Deno.test("Setter adh_civ avec chaîne vide lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_civ = ""; // Valeur invalide (vide)
        },
        Error,
        "La civilité doit être \"M.\" ou \"Mme\"."
    );
});
