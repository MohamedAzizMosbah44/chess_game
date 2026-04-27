class Piece:
    def __init__(self, couleur):
        self.couleur = couleur
        self.a_bouge = False  # Ajouter cet attribut à la classe de base

    def mouvements_valides(self, x, y, plateau):
        pass

    def __str__(self):
        return self.symbole

class Pion(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 1
        self.symbole = "♙" if couleur == "blanc" else "♟"

    def mouvements_valides(self, x, y, plateau):
        direction = -1 if self.couleur == "blanc" else 1
        mouvements = []

        if 0 <= x + direction < 8 and (x + direction, y) not in plateau:
            mouvements.append((x + direction, y))

            if ((self.couleur == "blanc" and x == 6) or (self.couleur == "noir" and x == 1)) and (x + 2 * direction, y) not in plateau:
                mouvements.append((x + 2 * direction, y))

        for dy in [-1, 1]:
            if 0 <= x + direction < 8 and 0 <= y + dy < 8 and (x + direction, y + dy) in plateau:
                if plateau[(x + direction, y + dy)].couleur != self.couleur:
                    mouvements.append((x + direction, y + dy))

        return mouvements

class Tour(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 5
        self.symbole = "♖" if couleur == "blanc" else "♜"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Cavalier(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 3
        self.symbole = "♘" if couleur == "blanc" else "♞"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        deplacements = [(2, 1), (1, 2), (-1, 2), (-2, 1), (-2, -1), (-1, -2), (1, -2), (2, -1)]

        for dx, dy in deplacements:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 8 and 0 <= ny < 8 and ((nx, ny) not in plateau or plateau[(nx, ny)].couleur != self.couleur):
                mouvements.append((nx, ny))

        return mouvements

class Fou(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 3
        self.symbole = "♗" if couleur == "blanc" else "♝"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Dame(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = 9
        self.symbole = "♕" if couleur == "blanc" else "♛"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            for i in range(1, 8):
                nx, ny = x + i * dx, y + i * dy
                if 0 <= nx < 8 and 0 <= ny < 8:
                    if (nx, ny) not in plateau:
                        mouvements.append((nx, ny))
                    else:
                        if plateau[(nx, ny)].couleur != self.couleur:
                            mouvements.append((nx, ny))
                        break
                else:
                    break

        return mouvements

class Roi(Piece):
    def __init__(self, couleur):
        super().__init__(couleur)
        self.score = float('inf')
        self.symbole = "♔" if couleur == "blanc" else "♚"

    def mouvements_valides(self, x, y, plateau):
        mouvements = []
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)]

        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if 0 <= nx < 8 and 0 <= ny < 8 and ((nx, ny) not in plateau or plateau[(nx, ny)].couleur != self.couleur):
                mouvements.append((nx, ny))

        return mouvements
class MouvementsSpeciaux:
    def __init__(self, jeu):
        self.jeu = jeu

    def verifier_roque_possible(self):
        roques_possibles = []
        couleur = self.jeu.joueur_actuel
        adversaire = "noir" if couleur == "blanc" else "blanc"

    # Vérifier le grand roque
        if couleur == "blanc" and not self.jeu.est_en_echec(couleur):
            if not self.jeu.plateau[(7, 3)].a_bouge and not self.jeu.plateau[(7, 7)].a_bouge:
                if not self.jeu.plateau.get((7, 5)) and not self.jeu.plateau.get((7, 6)):
                    if (not self.est_case_menacee((7, 4), adversaire) and
                        not self.est_case_menacee((7, 5), adversaire) and
                        not self.est_case_menacee((7, 6), adversaire)):
                        roques_possibles.append("grand")

    # Vérifier le petit roque
        if couleur == "blanc" and not self.jeu.est_en_echec(couleur):
            if not self.jeu.plateau[(7, 3)].a_bouge and not self.jeu.plateau[(7, 0)].a_bouge:
                if not self.jeu.plateau.get((7, 1)) and not self.jeu.plateau.get((7, 2)) and not self.jeu.plateau.get((7, 3)):
                    if (not self.est_case_menacee((7, 3), adversaire) and
                        not self.est_case_menacee((7, 2), adversaire) and
                        not self.est_case_menacee((7, 1), adversaire)):
                        roques_possibles.append("petit")

    # Vérifier le grand roque pour les noirs
        if couleur == "noir" and not self.jeu.est_en_echec(couleur):
            if not self.jeu.plateau[(0, 3)].a_bouge and not self.jeu.plateau[(0, 7)].a_bouge:
                if not self.jeu.plateau.get((0, 5)) and not self.jeu.plateau.get((0, 6)):
                    if (not self.est_case_menacee((0, 4), adversaire) and
                        not self.est_case_menacee((0, 5), adversaire) and
                        not self.est_case_menacee((0, 6), adversaire)):
                        roques_possibles.append("grand")

    # Vérifier le grand roque pour les noirs
        if couleur == "noir" and not self.jeu.est_en_echec(couleur):
            if not self.jeu.plateau[(0, 3)].a_bouge and not self.jeu.plateau[(0, 0)].a_bouge:
                if not self.jeu.plateau.get((0, 1)) and not self.jeu.plateau.get((0, 2)) and not self.jeu.plateau.get((0, 3)):
                    if (not self.est_case_menacee((0, 3), adversaire) and
                        not self.est_case_menacee((0, 2), adversaire) and
                        not self.est_case_menacee((0, 1), adversaire)):
                        roques_possibles.append("petit")

        return roques_possibles


    def est_case_menacee(self, position):
        x, y = position
        for pos, piece in self.jeu.plateau.items():
            if piece.couleur != self.jeu.joueur_actuel:
                if position in piece.mouvements_valides(pos[0], pos[1], self.jeu.plateau):
                    return True
        return False

    def verifier_promotion_possible(self, arrivee):
        # Vérifier si un pion atteint la dernière rangée
        if isinstance(self.jeu.plateau.get(arrivee), Pion):
            if (self.jeu.joueur_actuel == "blanc" and arrivee[0] == 0) or (self.jeu.joueur_actuel == "noir" and arrivee[0] == 7):
                return True
        return False

    def effectuer_roque(self, type_roque):
        if type_roque == "petit":
            x_roi, y_roi = (7, 4) if self.jeu.joueur_actuel == "blanc" else (0, 4)
            x_tour, y_tour = (7, 7) if self.jeu.joueur_actuel == "blanc" else (0, 7)
            y_roi_final = 6
        elif type_roque == "grand":
            x_roi, y_roi = (7, 4) if self.jeu.joueur_actuel == "blanc" else (0, 4)
            x_tour, y_tour = (7, 0) if self.jeu.joueur_actuel == "blanc" else (0, 0)
            y_roi_final = 2

        roi = self.jeu.plateau[(x_roi, y_roi)]
        tour = self.jeu.plateau[(x_tour, y_tour)]

        self.jeu.plateau[(x_roi, y_roi_final)] = roi
        self.jeu.plateau[(x_roi, y_roi_final - 1 if type_roque == "petit" else y_roi_final + 1)] = tour
        del self.jeu.plateau[(x_roi, y_roi)]
        del self.jeu.plateau[(x_tour, y_tour)]

        roi.a_bouge = True
        tour.a_bouge = True

    def effectuer_promotion(self, arrivee, type_piece):
        couleur = self.jeu.joueur_actuel
        pieces = {
            "dame": Dame(couleur),
            "tour": Tour(couleur),
            "fou": Fou(couleur),
            "cavalier": Cavalier(couleur)
        }
        self.jeu.plateau[arrivee] = pieces[type_piece]

class JeuEchecs:
    def __init__(self):
        self.plateau = self.initialiser_plateau()
        self.joueur_actuel = "blanc"
        self.mouvements_speciaux = MouvementsSpeciaux(self)

    def initialiser_plateau(self):
        plateau = {}
        for i in range(8):
            plateau[(1, i)] = Pion("noir")
            plateau[(6, i)] = Pion("blanc")

        plateau[(0, 0)], plateau[(0, 7)] = Tour("noir"), Tour("noir")
        plateau[(0, 1)], plateau[(0, 6)] = Cavalier("noir"), Cavalier("noir")
        plateau[(0, 2)], plateau[(0, 5)] = Fou("noir"), Fou("noir")
        plateau[(0, 3)], plateau[(0, 4)] = Roi("noir"), Dame("noir")

        plateau[(7, 0)], plateau[(7, 7)] = Tour("blanc"), Tour("blanc")
        plateau[(7, 1)], plateau[(7, 6)] = Cavalier("blanc"), Cavalier("blanc")
        plateau[(7, 2)], plateau[(7, 5)] = Fou("blanc"), Fou("blanc")
        plateau[(7, 3)], plateau[(7, 4)] = Roi("blanc"), Dame("blanc")

        return plateau

    def afficher_plateau(self):
        print("    0       1       2        3        4        5        6       7")
        for x in range(7, -1, -1):
            ligne = [f"{x} "]
            for y in range(8):
                piece = self.plateau.get((x, y), ' .       ')
                ligne.append(f"{str(piece): <8}")
            print("".join(ligne))
        print()

    def deplacer_piece(self, depart, arrivee):
        piece = self.plateau.get(depart)
        if piece is None:
            print("Il n'y a pas de pièce à cet emplacement.")
            return False

        if piece.couleur != self.joueur_actuel:
            print("Ce n'est pas votre pièce.")
            return False

    # Vérifier si le mouvement est valide
        if arrivee not in piece.mouvements_valides(*depart, self.plateau):
            print("Mouvement invalide.")
            return False

    # Simuler le mouvement pour vérifier s'il laisse le roi en échec
        plateau_simule = self.simuler_mouvement(depart, arrivee)
        if self.est_en_echec_simule(self.joueur_actuel, plateau_simule):
            print("Ce mouvement laisse ou met votre roi en échec.")
            return False

    # Si tout est valide, effectuer le mouvement
        self.plateau[arrivee] = piece
        del self.plateau[depart]
        self.changer_joueur()
        return True
   
    def simuler_mouvement(self, depart, arrivee):
        plateau_simule = self.plateau.copy()
        piece = plateau_simule.pop(depart)
        plateau_simule[arrivee] = piece
        return plateau_simule

    def est_en_echec_simule(self, couleur, plateau_simule):
        roi_position = None
        for position, piece in plateau_simule.items():
            if isinstance(piece, Roi) and piece.couleur == couleur:
                roi_position = position
                break

        if not roi_position:
            return False

        for position, piece in plateau_simule.items():
            if piece.couleur != couleur:
                if roi_position in piece.mouvements_valides(position[0], position[1], plateau_simule):
                    return True

        return False

    def changer_joueur(self):
        self.joueur_actuel = "noir" if self.joueur_actuel == "blanc" else "blanc"
    def est_en_echec(self, couleur):
        # Trouver la position du roi
        roi_position = None
        for position, piece in self.plateau.items():
            if isinstance(piece, Roi) and piece.couleur == couleur:
                roi_position = position
                break

        if not roi_position:
            return False

        # Vérifier si une pièce adverse peut attaquer le roi
        for position, piece in self.plateau.items():
            if piece.couleur != couleur:
                if roi_position in piece.mouvements_valides(position[0], position[1], self.plateau):
                    return True

        return False
    def est_echec_et_mat(self, couleur):
        if not self.est_en_echec(couleur):
            return False

        # Vérifier tous les mouvements possibles pour voir s'il y a un moyen de sortir de l'échec
        for depart, piece in self.plateau.items():
            if piece.couleur == couleur:
                for arrivee in piece.mouvements_valides(*depart, self.plateau):
                    # Simuler le mouvement
                    plateau_simule = self.simuler_mouvement(depart, arrivee)

                    # Vérifier si le roi est toujours en échec après le mouvement
                    if not self.est_en_echec_simule(couleur, plateau_simule):
                        return False

        return True


    def jouer(self):
        print("Bienvenue au jeu d'échecs !")
        while True:
           self.afficher_plateau()
           print(f"Tour du joueur {self.joueur_actuel}")
           roques_possibles = self.mouvements_speciaux.verifier_roque_possible()
           if roques_possibles:
               print("Roque possible :", ", ".join(roques_possibles))
               action = input("Voulez-vous roquer ? (petit/grand/non) : ")
               if action in roques_possibles:
                      self.mouvements_speciaux.effectuer_roque(action)
                      self.changer_joueur()
                      continue
           try:
               x_dep, y_dep = map(int, input("Entrez les coordonnées de départ (x y) : ").split())
               x_arr, y_arr = map(int, input("Entrez les coordonnées d'arrivée (x y) : ").split())

               depart = (x_dep, y_dep)
               arrivee = (x_arr, y_arr)

               if self.deplacer_piece(depart, arrivee):
                   if self.mouvements_speciaux.verifier_promotion_possible(arrivee):
                       type_piece = input("Promotion ! Choisissez une pièce (dame/tour/fou/cavalier) : ")
                       self.mouvements_speciaux.effectuer_promotion(arrivee, type_piece)

           except ValueError:
               print("Veuillez entrer des coordonnées valides.")


jeu = JeuEchecs()
jeu.jouer()
