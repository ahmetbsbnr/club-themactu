import { UnAdherent } from "../../src/modele/data_adherent.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter adh_nom avec longueur valide", () => {
    const adherent = new UnAdherent();
    adherent.adh_nom = "Dupont";
    assertEquals(adherent.adh_nom, "Dupont");
});

Deno.test("Setter adh_nom avec longueur minimale", () => {
    const adherent = new UnAdherent();
    adherent.adh_nom = "Du";
    assertEquals(adherent.adh_nom, "Du");
});

Deno.test("Setter adh_nom avec longueur maximale", () => {
    const adherent = new UnAdherent();
    adherent.adh_nom = "A".repeat(20);
    assertEquals(adherent.adh_nom, "A".repeat(20));
});

Deno.test("Setter adh_nom avec longueur inférieure à la limite lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_nom = "D";
        },
        Error,
        "Le nom doit avoir entre 2 et 20 caractères."
    );
});

Deno.test("Setter adh_nom avec longueur supérieure à la limite lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_nom = "A".repeat(21);
        },
        Error,
        "Le nom doit avoir entre 2 et 20 caractères."
    );
});

Deno.test("Setter adh_prenom avec longueur valide", () => {
    const adherent = new UnAdherent();
    adherent.adh_prenom = "Jean";
    assertEquals(adherent.adh_prenom, "Jean");
});

Deno.test("Setter adh_prenom avec longueur minimale", () => {
    const adherent = new UnAdherent();
    adherent.adh_prenom = "Je";
    assertEquals(adherent.adh_prenom, "Je");
});

Deno.test("Setter adh_prenom avec longueur maximale", () => {
    const adherent = new UnAdherent();
    adherent.adh_prenom = "A".repeat(20);
    assertEquals(adherent.adh_prenom, "A".repeat(20));
});

Deno.test("Setter adh_prenom avec longueur inférieure à la limite lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_prenom = "J";
        },
        Error,
        "Le prénom doit avoir entre 2 et 20 caractères."
    );
});

Deno.test("Setter adh_prenom avec longueur supérieure à la limite lève une erreur", () => {
    const adherent = new UnAdherent();
    assertThrows(
        () => {
            adherent.adh_prenom = "A".repeat(21);
        },
        Error,
        "Le prénom doit avoir entre 2 et 20 caractères."
    );
});
