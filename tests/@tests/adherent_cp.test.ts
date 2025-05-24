import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_cp avec numéro valide", () => {
    const adherent = new UnAdherent();
    adherent.adh_cp = "75001";
    assertEquals(adherent.adh_cp, "75001");
});

Deno.test("Setter adh_cp avec chaîne vide", () => {
    const adherent = new UnAdherent();
    adherent.adh_cp = "";
    assertEquals(adherent.adh_cp, "");
});

Deno.test("Setter adh_cp avec moins de 5 chiffres", () => {
    const adherent = new UnAdherent();
    adherent.adh_cp = "123";
    assertEquals(adherent.adh_cp, "123");
});

Deno.test("Setter adh_cp avec plus de 5 caractères lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_cp = "123456";
        },
        Error,
        "Le code postal ne doit pas dépasser 5 caractères."
    );
});

Deno.test("Setter adh_cp avec caractères non numériques lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_cp = "abcde";
        },
        Error,
        "Le code postal ne doit contenir que des chiffres."
    );
});

Deno.test("Setter adh_cp avec caractères mixtes lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_cp = "123ab";
        },
        Error,
        "Le code postal ne doit contenir que des chiffres."
    );
});
