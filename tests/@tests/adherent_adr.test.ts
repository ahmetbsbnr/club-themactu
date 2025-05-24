import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_adr avec longueur valide", () => {
    const adherent = new UnAdherent();
    const validAdr = "123 Rue de la Paix";
    adherent.adh_adr = validAdr;
    assertEquals(adherent.adh_adr, validAdr);
});

Deno.test("Setter adh_adr avec chaîne vide", () => {
    const adherent = new UnAdherent();
    adherent.adh_adr = "";
    assertEquals(adherent.adh_adr, "");
});

Deno.test("Setter adh_adr avec longueur maximale", () => {
    const adherent = new UnAdherent();
    const maxLenAdr = "a".repeat(50);
    adherent.adh_adr = maxLenAdr;
    assertEquals(adherent.adh_adr, maxLenAdr);
});

Deno.test("Setter adh_adr avec longueur supérieure à la limite lève une erreur", () => {
    const adherent = new UnAdherent();
    const longAdr = "a".repeat(51);
    assertThrows(
        () => {
            adherent.adh_adr = longAdr;
        },
        Error,
        "L'adresse ne doit pas dépasser 50 caractères."
    );
});
