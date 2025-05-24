import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_ville avec longueur valide", () => {
    const adherent = new UnAdherent();
    const validVille = "Metz";
    adherent.adh_ville = validVille;
    assertEquals(adherent.adh_ville, validVille);
});

Deno.test("Setter adh_ville avec chaîne vide", () => {
    const adherent = new UnAdherent();
    adherent.adh_ville = "";
    assertEquals(adherent.adh_ville, "");
});

Deno.test("Setter adh_ville avec longueur maximale", () => {
    const adherent = new UnAdherent();
    const maxLenVille = "a".repeat(30);
    adherent.adh_ville = maxLenVille;
    assertEquals(adherent.adh_ville, maxLenVille);
});

Deno.test("Setter adh_ville with more than maximum length throws error", () => {
    const adherent = new UnAdherent();
    const longVille = "a".repeat(31);
    assertThrows(
        () => {
            adherent.adh_ville = longVille;
        },
        Error,
        "La ville ne doit pas dépasser 30 caractères."
    );
});
