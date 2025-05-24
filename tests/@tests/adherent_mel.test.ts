import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_mel avec email valide", () => {
    const adherent = new UnAdherent();
    const validEmail = "test@example.com";
    adherent.adh_mel = validEmail;
    assertEquals(adherent.adh_mel, validEmail);
});

Deno.test("Setter adh_mel avec email invalide lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_mel = "invalid-email";
        },
        Error,
        "L'adresse email n'est pas valide ou est vide."
    );
});

Deno.test("Setter adh_mel avec chaîne vide lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_mel = "";
        },
        Error,
        "L'adresse email n'est pas valide ou est vide."
    );
});
