import { UnAbonnement } from "../../src/modele/data_abonnement.ts";
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";

Deno.test("Setter abon_comment avec commentaire valide", () => {
    const abonnement = new UnAbonnement();
    const validComment = "Ceci est un commentaire valide.";
    abonnement.abon_comment = validComment;
    assertEquals(abonnement.abon_comment, validComment);
});

Deno.test("Setter abon_comment avec commentaire vide", () => {
    const abonnement = new UnAbonnement();
    abonnement.abon_comment = "";
    assertEquals(abonnement.abon_comment, "");
});

Deno.test("Setter abon_comment avec commentaire long lève une erreur", () => {
    const abonnement = new UnAbonnement();
    const longComment = "a".repeat(401);
    assertThrows(
        () => {
            abonnement.abon_comment = longComment;
        },
        Error,
        "Le commentaire d'abonnement ne doit pas dépasser 400 caractères."
    );
});
